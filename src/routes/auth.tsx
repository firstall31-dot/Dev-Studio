import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Authentication — Dev Studio" },
      { name: "description", content: "Sign in to your Dev Studio." },
    ],
  }),
  component: AuthPage,
});

const ERROR_MESSAGES: Record<string, string> = {
  google_not_configured: "Google login is not set up yet. Please use email and password.",
  google_failed: "Google login failed. Please try again or use email and password.",
};

function AuthPage() {
  const navigate = useNavigate();
  const { user, isReady } = useAuth();
  const { error } = useSearch({ from: "/auth" });

  useEffect(() => {
    if (isReady && user) {
      navigate({ to: "/" });
    }
  }, [isReady, user, navigate]);

  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.") : undefined;

  return (
    <AuthLayout showBackHome={false}>
      {errorMessage && (
        <p className="mb-4 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 text-center">
          {errorMessage}
        </p>
      )}
      <AuthForm />
    </AuthLayout>
  );
}
