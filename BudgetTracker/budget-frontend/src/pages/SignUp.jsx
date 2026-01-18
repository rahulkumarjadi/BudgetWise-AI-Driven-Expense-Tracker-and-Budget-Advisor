// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import api from "../api/axiosClient";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
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
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .signup-card {
          animation: fadeIn 0.4s ease-out;
        }

        .progress-step {
          transition: all 0.3s ease;
        }

        .progress-step.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }
git init
        .benefit-card {
          transition: transform 0.3s ease;
        }

        .benefit-card:hover {
          transform: translateX(10px);
        }
      `}</style>

      <div style={container}>
        {/* Left Panel */}
        <div style={leftPanel}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={brandHeader}>
              <div style={logo}>BT</div>
              <div>
                <div style={brandName}>Budget Tracker</div>
                <div style={tagline}>Smart Money Management</div>
              </div>
            </div>
          </Link>

          <div style={benefitsSection}>
            <h2 style={benefitsTitle}>Join thousands of smart savers</h2>
            {[
              { icon: "🎯", title: "Set Financial Goals", desc: "Track and achieve your savings targets" },
              { icon: "📊", title: "Visualize Spending", desc: "Beautiful charts and insights" },
              { icon: "🤖", title: "AI Recommendations", desc: "Personalized budgeting advice" },
              { icon: "🔒", title: "Bank-Level Security", desc: "Your data is always protected" }
            ].map((benefit, i) => (
              <div key={i} style={benefitCard} className="benefit-card">
                <div style={benefitIcon}>{benefit.icon}</div>
                <div>
                  <div style={benefitTitle}>{benefit.title}</div>
                  <div style={benefitDesc}>{benefit.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={testimonial}>
            <div style={quoteIcon}>"</div>
            <p style={quoteText}>
              This app transformed how I manage money. I've saved 30% more since I started!
            </p>
            <div style={authorInfo}>
              <div style={avatar}>SK</div>
              <div>
                <div style={authorName}>Sarah Kim</div>
                <div style={authorRole}>Finance Professional</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={rightPanel}>
          <div style={formContainer} className="signup-card">
            <div style={formHeader}>
              <h1 style={formTitle}>Create Account</h1>
              <p style={formSubtitle}>Start your journey to financial freedom</p>
            </div>

            {/* Progress Steps */}
            <div style={progressSteps}>
              <div style={progressStep} className="progress-step active">
                <span>1</span>
              </div>
              <div style={progressLine}></div>
              <div style={progressStep}>
                <span>2</span>
              </div>
              <div style={progressLine}></div>
              <div style={progressStep}>
                <span>3</span>
              </div>
            </div>

            {errors.general && (
              <div style={errorBanner}>
                ⚠️ {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} style={form}>
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your Full Name "
                error={errors.name}
                autoComplete="off"
              />

              <Input
                label="Email Address"
                type="email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  error={errors.password}
                  autoComplete="off"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeIcon}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </div>
              </div>

              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                error={errors.confirmPassword}
                autoComplete="off"
              />

              <div style={termsRow}>
                <input type="checkbox" style={termsCheckbox} required />
                <span style={termsText}>
                  I agree to the{" "}
                  <a href="#" style={termsLink}>Terms of Service</a> and{" "}
                  <a href="#" style={termsLink}>Privacy Policy</a>
                </span>
              </div>

              <Button loading={loading} disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

{/*             <div style={divider}> */}
{/*               <span style={dividerText}>OR CONTINUE WITH</span> */}
{/*             </div> */}



            <div style={loginPrompt}>
              Already have an account?{" "}
              <Link to="/login" style={loginLink}>
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontFamily: "system-ui, sans-serif",
};

const container = {
  display: "grid",
  gridTemplateColumns: "480px 1fr",
  maxWidth: 1300,
  width: "100%",
  background: "white",
  borderRadius: 28,
  overflow: "hidden",
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
  minHeight: 700,
};

const leftPanel = {
  background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  color: "white",
};

const brandHeader = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 50,
};

const logo = {
  width: 54,
  height: 54,
  borderRadius: 14,
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(10px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  fontWeight: 900,
  border: "2px solid rgba(255, 255, 255, 0.4)",
};

const brandName = {
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: "-0.3px",
};

const tagline = {
  fontSize: 13,
  opacity: 0.9,
  marginTop: 2,
};

const benefitsSection = {
  flex: 1,
};

const benefitsTitle = {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: 30,
  lineHeight: 1.2,
};

const benefitCard = {
  display: "flex",
  gap: 16,
  padding: "16px 0",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const benefitIcon = {
  fontSize: 28,
  flexShrink: 0,
};

const benefitTitle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 4,
};

const benefitDesc = {
  fontSize: 13,
  opacity: 0.85,
  lineHeight: 1.5,
};

const testimonial = {
  marginTop: 40,
  padding: 24,
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

const quoteIcon = {
  fontSize: 48,
  lineHeight: 0.5,
  marginBottom: 12,
  opacity: 0.5,
};

const quoteText = {
  fontSize: 15,
  lineHeight: 1.7,
  marginBottom: 20,
  fontStyle: "italic",
};

const authorInfo = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const avatar = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 14,
};

const authorName = {
  fontSize: 14,
  fontWeight: 700,
};

const authorRole = {
  fontSize: 12,
  opacity: 0.8,
};

const rightPanel = {
  padding: "50px 60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
};

const formContainer = {
  width: "100%",
  maxWidth: 480,
};

const formHeader = {
  marginBottom: 32,
};

const formTitle = {
  fontSize: 34,
  fontWeight: 900,
  color: "#0f172a",
  margin: "0 0 8px 0",
  letterSpacing: "-0.5px",
};

const formSubtitle = {
  fontSize: 15,
  color: "#64748b",
};

const progressSteps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 32,
  gap: 8,
};

const progressStep = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  fontWeight: 700,
  color: "#64748b",
};

const progressLine = {
  width: 40,
  height: 2,
  background: "#e2e8f0",
};

const errorBanner = {
  padding: "14px 18px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 12,
  color: "#dc2626",
  fontSize: 14,
  marginBottom: 24,
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const eyeIcon = {
  position: "absolute",
  right: 14,
  top: 42,
  fontSize: 18,
  cursor: "pointer",
  userSelect: "none",
};

const termsRow = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  marginBottom: 24,
  marginTop: 8,
};

const termsCheckbox = {
  width: 18,
  height: 18,
  cursor: "pointer",
  marginTop: 2,
};

const termsText = {
  fontSize: 13,
  color: "#475569",
  lineHeight: 1.6,
};

const termsLink = {
  color: "#667eea",
  textDecoration: "none",
  fontWeight: 600,
};

const divider = {
  textAlign: "center",
  margin: "28px 0",
  position: "relative",
};

const dividerText = {
  background: "white",
  padding: "0 16px",
  color: "#94a3b8",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.5px",
};

const socialButtons = {
  display: "flex",
  gap: 12,
  marginBottom: 24,
};

const socialBtn = {
  flex: 1,
  padding: "12px",
  border: "2px solid #e2e8f0",
  background: "white",
  borderRadius: 10,
  fontSize: 20,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const loginPrompt = {
  textAlign: "center",
  fontSize: 14,
  color: "#64748b",
};

const loginLink = {
  color: "#667eea",
  textDecoration: "none",
  fontWeight: 700,
};