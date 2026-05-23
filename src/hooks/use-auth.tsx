import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isReady: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isReadyRef = useRef(false);

  const markReady = () => {
    if (!isReadyRef.current) {
      isReadyRef.current = true;
      setIsReady(true);
    }
  };

  useEffect(() => {
    const failsafe = setTimeout(() => {
      console.warn("[Auth] Initialization timed out – forcing ready.");
      markReady();
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, s: Session | null) => {
        setSession(s);

        if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") {
          clearTimeout(failsafe);
          markReady();
        }

        if (event === "SIGNED_OUT") {
          import("@/lib/store").then(({ useForge }) => {
            useForge.getState().reset();
          });
        }
      },
    );

    return () => {
      clearTimeout(failsafe);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isReady,
        signOut: async () => {
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
