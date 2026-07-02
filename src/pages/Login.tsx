import { ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { api, setAuthToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/api/auth/send-code", { email });
      setStep("code");
      toast.success("Verification code sent! Check your email.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await api.post<{ token: string }>("/api/auth/verify-code", { email, code });
      setAuthToken(res.token);
      toast.success("Logged in successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-violet-50/50 to-transparent p-4 dark:from-violet-950/20">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold">
          <span className="gradient-text">NITAI</span> AI
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        {step === "email" ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Sign In</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your email to receive a verification code
              </p>
            </div>
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={sending}>
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {sending ? "Sending..." : "Send Code"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Check Your Email</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Verification Code</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={verifying || code.length !== 6}>
                {verifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {verifying ? "Verifying..." : "Sign In"}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Use a different email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
