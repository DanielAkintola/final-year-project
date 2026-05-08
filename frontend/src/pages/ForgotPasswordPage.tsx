import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/Button";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Please enter your admin email.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Placeholder until backend endpoint is wired.
      await new Promise((resolve) => window.setTimeout(resolve, 450));

      setMessage(
        "If the email exists, a password reset link has been sent. Contact SUPER_ADMIN if you do not receive it.",
      );
    } catch {
      setError("Unable to process reset right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <Link className="auth-back-link" to="/auth">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>

        <div className="auth-header">
          <h1>Recover Admin Access</h1>
          <p>
            Enter your admin email and we will initiate a secure reset flow.
          </p>
        </div>

        {message ? (
          <div className="auth-success">
            <ShieldCheck size={16} />
            <span>{message}</span>
          </div>
        ) : null}

        {error ? <p className="auth-error-text">{error}</p> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="ui-field">
            <span className="ui-field-label">Admin Email</span>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                autoComplete="email"
                className="ui-input"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@domain.com"
                type="email"
                value={email}
              />
            </div>
          </label>

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Submitting..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
