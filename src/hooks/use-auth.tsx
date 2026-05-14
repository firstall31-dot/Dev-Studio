import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
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

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
      });
      subscription = data.subscription;

      supabase.auth.getSession().then(({ data: { session: s } }) => {
        setSession(s);
        setIsReady(true);
      }).catch(err => {
        console.error("Auth session error:", err);
        setIsReady(true);
      });
    } catch (err) {
      console.error("Auth initialization error:", err);
      setIsReady(true);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}