
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, { email });
      navigate("/dashboard");
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={container}>
        {/* Left side */}
        <div style={leftSide}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={brandSection}>
              <div style={logo}>BT</div>
              <div>
                <div style={brandTitle}>Budget Tracker</div>
                <div style={brandSubtitle}>Your AI Financial Companion</div>
              </div>
            </div>
          </Link>

          <h1 style={heroHeading}>Welcome Back!</h1>
          <p style={heroSubtext}>
            Sign in to continue managing your finances with AI-powered insights.
          </p>
        </div>

        {/* Right side */}
        <div style={rightSide}>
          <div style={formCard}>
            <h2 style={formTitle}>Sign In</h2>
            <p style={formSubtitle}>
              Enter your credentials to access your account
            </p>

            {errors.general && (
              <div style={errorAlert}>⚠️ {errors.general}</div>
            )}

            {/* 🔑 FORM */}
            <form onSubmit={handleSubmit} style={form} autoComplete="off">
              {/* 🔒 DUMMY INPUTS (ANTI-AUTOFILL HACK) */}
              <input
                type="text"
                name="fake-username"
                autoComplete="username"
                style={{ display: "none" }}
              />
              <input
                type="password"
                name="fake-password"
                autoComplete="new-password"
                style={{ display: "none" }}
              />

              <Input
                label="Email Address"
                type="email"
                name="email-login-new"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                error={errors.email}
                autoComplete="off"
              />

              <div style={{ position: "relative" }}>
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password-login-new"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  error={errors.password}
                  autoComplete="new-password"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeIcon}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </div>
              </div>

              <div style={rememberRow}>
                <label style={checkboxLabel}>
                  <input type="checkbox" style={checkbox} />
                  <span style={{ marginLeft: 8 }}>Remember me</span>
                </label>
                <Link to="/forgot-password" style={forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <Button loading={loading} disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div style={footerText}>
              Don’t have an account?{" "}
              <Link to="/signup" style={signupLink}>
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#667eea,#764ba2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const container = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  maxWidth: 1200,
  width: "100%",
  background: "#fff",
  borderRadius: 24,
  overflow: "hidden",
};

const leftSide = {
  padding: 40,
  color: "#fff",
  background: "linear-gradient(135deg,#667eea,#764ba2)",
};

const brandSection = { display: "flex", gap: 16, marginBottom: 40 };
const logo = {
  width: 56,
  height: 56,
  borderRadius: 14,
  background: "rgba(255,255,255,.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

const brandTitle = { fontSize: 22, fontWeight: 800 };
const brandSubtitle = { fontSize: 14, opacity: 0.9 };

const heroHeading = { fontSize: 42, fontWeight: 900 };
const heroSubtext = { fontSize: 16, opacity: 0.95 };

const rightSide = {
  padding: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const formCard = { maxWidth: 400, width: "100%" };
const formTitle = { fontSize: 32, fontWeight: 800 };
const formSubtitle = { color: "#64748b", marginBottom: 24 };

const errorAlert = {
  padding: 12,
  background: "#fef2f2",
  color: "#dc2626",
  borderRadius: 10,
  marginBottom: 20,
};

const form = { display: "flex", flexDirection: "column", gap: 6 };

const eyeIcon = {
  position: "absolute",
  right: 14,
  top: 42,
  cursor: "pointer",
};

const rememberRow = {
  display: "flex",
  justifyContent: "space-between",
  margin: "12px 0 24px",
};

const checkboxLabel = { display: "flex", alignItems: "center" };
const checkbox = { width: 16, height: 16 };

const forgotLink = {
  color: "#667eea",
  textDecoration: "none",
  fontWeight: 600,
};

const footerText = {
  textAlign: "center",
  marginTop: 20,
  color: "#64748b",
};

const signupLink = {
  color: "#667eea",
  fontWeight: 700,
  textDecoration: "none",
};
