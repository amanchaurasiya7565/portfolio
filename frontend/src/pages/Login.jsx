import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Reset password form state
  const [resetEmail, setResetEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      await login(cleanEmail, cleanPassword);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setError(
          "Network Error: Cannot connect to server. Please ensure your backend is running on port 5000."
        );
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match.");
        return;
      }

      const res = await api.post("/auth/reset-password", {
        email: resetEmail.trim().toLowerCase() || email.trim().toLowerCase(),
        newPassword: newPassword.trim(),
        secretKey: secretKey.trim(),
      });

      setSuccess(res.data.message || "Password reset successfully! You can now sign in.");
      setEmail(resetEmail.trim() || email.trim());
      setNewPassword("");
      setConfirmPassword("");
      setSecretKey("");
      setMode("login");
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage) {
        setError(serverMessage);
      } else if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Network Error: Cannot connect to server on port 5000.");
      } else {
        setError(err.message || "Failed to reset password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <p className="admin-eyebrow">Portfolio CMS</p>

          <h1>{mode === "login" ? "Admin Login" : "Reset Password"}</h1>

          <p>
            {mode === "login"
              ? "Sign in to manage your portfolio."
              : "Reset your admin credentials directly via the backend API."}
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-alert admin-alert-success" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
            {success}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleSubmit} className="admin-form-single">
            <div className="admin-form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="amanchaurasiya7565@gmail.com"
                required
              />
            </div>

            <div className="admin-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setResetEmail(email || "amanchaurasiya7565@gmail.com");
                    setMode("reset");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-light, #818cf8)",
                    fontSize: "12.5px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Forgot / Reset?
                </button>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ marginTop: "18px", textAlign: "center" }}>
              <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                Tip: You can also run <code>npm run reset-password</code> from the <code>server/</code> terminal.
              </span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="admin-form-single">
            <div className="admin-form-group">
              <label htmlFor="resetEmail">Admin Email</label>
              <input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="amanchaurasiya7565@gmail.com"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="secretKey">
                Master Secret Key / Current Password
              </label>
              <input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(event) => setSecretKey(event.target.value)}
                placeholder="Enter JWT_SECRET or current password"
                required
              />
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                Verify with your JWT_SECRET from server/.env or your current password.
              </span>
            </div>

            <div className="admin-form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <button
              type="submit"
              className="admin-primary-button"
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Confirm & Reset Password"}
            </button>

            <div style={{ marginTop: "14px", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("login");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}