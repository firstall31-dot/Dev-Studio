import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  profileImage?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface UserProfile {
  displayName: string | null;
  avatarUrl: string | null;
  location: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile;
  isReady: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refresh: () => Promise<void>;
}

const defaultProfile: UserProfile = { displayName: null, avatarUrl: null, location: null };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isReady, setIsReady] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const r = await fetch("/api/profile", { credentials: "include" });
      if (r.ok) {
        const data = await r.json();
        setProfile({
          displayName: data.displayName ?? null,
          avatarUrl: data.avatarUrl ?? null,
          location: data.location ?? null,
        });
      }
    } catch (err) {
      console.warn("[auth] Failed to fetch profile:", err);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const r = await fetch("/api/auth/user", { credentials: "include" });
      if (r.ok) {
        const u = await r.json();
        setUser({
          id: u.id,
          name: u.displayName ?? u.name ?? u.email ?? "User",
          email: u.email ?? null,
          profileImage: u.avatarUrl ?? u.profileImage ?? null,
          displayName: u.displayName ?? null,
          avatarUrl: u.avatarUrl ?? null,
        });
        await fetchProfile();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsReady(true);
    }
  }, [fetchProfile]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setProfile(defaultProfile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isReady,
      signOut,
      refreshProfile: fetchProfile,
      refresh: fetchUser,
    }}>
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
