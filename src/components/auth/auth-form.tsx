import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { SocialAuth } from "./social-auth";
import { useAuth } from "@/hooks/use-auth";

type Tab = "login" | "register";
type Step = "form" | "verify";

export function AuthForm() {
  const [tab, setTab] = useState<Tab>("login");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Verification states
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    fetch("/api/auth/config")
      .then((r) => r.json())
      .then((d) => setGoogleEnabled(!!d.googleEnabled))
      .catch(() => setGoogleEnabled(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "login"
        ? { email, password }
        : { email, password, displayName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.requireVerification) {
        setVerifyEmail(data.email);
        setDevCodeHint(data.devVerificationCode ?? null);
        setStep("verify");
        if (data.message) setSuccessMessage(data.message);
        if (data.error) setError(data.error);
        return;
      }

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      await refresh();
      navigate({ to: "/" });
    } catch {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setVerifyLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail, code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verification failed");
        return;
      }
      await refresh();
      navigate({ to: "/" });
    } catch {
      setError("Could not connect to the server");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verifyEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to resend verification code");
        return;
      }
      setDevCodeHint(data.devVerificationCode ?? null);
      setSuccessMessage("Verification code resent successfully!");
    } catch {
      setError("Could not connect to the server");
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
      {step === "verify" ? (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Verify your email</h3>
            <p className="text-xs text-muted-foreground">
              We sent a verification code to <span className="font-medium text-foreground">{verifyEmail}</span>.
            </p>
          </div>

          {devCodeHint && (
            <div className="p-3 bg-muted rounded-md border border-border text-xs space-y-1">
              <div className="font-semibold text-foreground flex items-center justify-between">
                <span>[Dev Mode] Verification Code:</span>
                <span className="bg-background px-2 py-0.5 rounded border font-mono text-primary font-bold">{devCodeHint}</span>
              </div>
              <p className="text-muted-foreground text-[11px]">
                In a production environment, this code would be sent via email.
              </p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Verification Code</label>
              <input
                type="text"
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-center font-mono tracking-widest"
              />
            </div>

            {successMessage && (
              <p className="text-xs text-green-600 bg-green-50 dark:bg-green-950/50 dark:text-green-400 rounded-md px-3 py-2 border border-green-200 dark:border-green-800">
                {successMessage}
              </p>
            )}
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {verifyLoading ? "Verifying…" : "Verify Email"}
            </button>
          </form>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:underline font-medium"
            >
              Resend code
            </button>
            <button
              type="button"
              onClick={() => { setStep("form"); setError(null); setSuccessMessage(null); }}
              className="text-muted-foreground hover:text-foreground"
            >
              Back to sign in
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex rounded-md bg-muted p-1 gap-1">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(null); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-colors ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={tab === "register" ? "At least 6 characters" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading
                ? tab === "login" ? "Signing in…" : "Creating account…"
                : tab === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Divider + Google — only shown when Google is enabled */}
          {googleEnabled && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <SocialAuth loading={loading} />
            </>
          )}
        </>
      )}
    </div>
  );
}
