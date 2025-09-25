import React, { useEffect, useState } from "react";
import "../styles/components/LoginModal.css";
import { useAuth } from "../context/AuthContext.js";
import { API_BASE_URL } from "../constants";

export default function LoginModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setShowPwd(false);
      setError("");
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e){ if (e.key === "Escape") onClose?.(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e){
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Login failed");
      const data = await res.json();
      login(data);
      console.log("DATA", data)
      onSuccess?.(data);
      onClose?.();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function stop(e){ e.stopPropagation(); }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal nice" onClick={stop} role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="modal-header">
          <h3 id="login-title" style={{ color: "#FF4004" }}>Login</h3>
          <button className="close-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="label">Email</span>
            <div className="email">
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="label">Password</span>
            <div className="pwd">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="show-btn" onClick={()=>setShowPwd(s=>!s)}>
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
