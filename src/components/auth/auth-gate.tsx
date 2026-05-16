import { useEffect, useState } from "react";
import { Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import { useForge } from "@/lib/store";

const PUBLIC_ROUTES = ["/auth"];

export function AuthGate() {
  const { isReady, user } = useAuth();
  const { init } = useForge();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();

  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    if (isReady && user) {
      init();
    }
  }, [isReady, user, init]);

  useEffect(() => {
    if (isReady && !user && !isPublic) {
      router.navigate({ to: "/auth", replace: true }).catch((err) => {
        console.error("[AuthGate] Navigation to /auth failed:", err);
      });
    }
  }, [isReady, user, isPublic, router, pathname]);

  useEffect(() => {
    if (!isReady) {
      const interval = setInterval(() => {
        setLoadingTime((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground mb-4" />
        {loadingTime > 3 && (
          <div className="text-center text-sm text-muted-foreground max-w-md p-4">
            <p>Taking a moment to load…</p>
            <button
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isPublic) {
    return <ErrorBoundary><Outlet /></ErrorBoundary>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
