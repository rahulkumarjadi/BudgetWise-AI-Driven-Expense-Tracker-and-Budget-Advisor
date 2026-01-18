// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={page}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .login-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .login-btn:hover::before {
          left: 100%;
        }

        .login-btn:hover {
          background: #2563eb !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .signup-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .signup-btn:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
        }

        .cta-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .cta-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .cta-btn:hover::after {
          width: 300px;
          height: 300px;
        }

        .cta-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4);
        }

        .feature-card {
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
        }

        .hero-card {
          animation: float 6s ease-in-out infinite;
        }

        .gradient-bg {
          background: linear-gradient(-45deg, #2563eb, #7c3aed, #ec4899, #f59e0b);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
      `}</style>

      {/* HEADER */}
      <header style={topbar}>
        <div style={brand}>
          <div style={logo} className="gradient-bg">BT</div>
          <div style={{ marginLeft: 12 }}>
            <div style={brandTitle}>AI Budget Advisor</div>
            <div style={brandSub}>Smart financial planning powered by AI</div>
          </div>
        </div>

        <nav style={nav}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={loginBtn} className="login-btn">Login</button>
          </Link>

          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={signupBtn} className="signup-btn">Get Started</button>
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <main style={heroWrap}>
        <div style={heroCard} className="hero-card">
          <div style={badge}>🚀 AI-Powered Financial Intelligence</div>

          <h1 style={heroTitle}>
            Take Control of Your
            <span style={gradientText}> Financial Future</span>
          </h1>

          <p style={heroLead}>
            Transform your spending habits with AI-driven insights. Track expenses,
            analyze patterns, and receive personalized budgeting recommendations that
            adapt to your lifestyle.
          </p>

          {/* CTA buttons */}
          <div style={ctaRow}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button style={primaryCta} className="cta-btn">
                Start Free Trial
                <span style={{ marginLeft: 8 }}>→</span>
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={secondaryCta}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Features Grid */}
          <div style={featuresGrid}>
            <div style={featureCard} className="feature-card">
              <div style={featureIcon}>📊</div>
              <div style={featureTitle}>Smart Analytics</div>
              <div style={featureText}>
                Visualize spending patterns with interactive charts and insights
              </div>
            </div>

            <div style={featureCard} className="feature-card">
              <div style={featureIcon}>🤖</div>
              <div style={featureTitle}>AI Recommendations</div>
              <div style={featureText}>
                Get personalized saving tips based on your spending behavior
              </div>
            </div>

            <div style={featureCard} className="feature-card">
              <div style={featureIcon}>🎯</div>
              <div style={featureTitle}>Goal Tracking</div>
              <div style={featureText}>
                Set financial goals and track progress with real-time updates
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={footer}>
        <div>© {new Date().getFullYear()} BudgetTracker. All rights reserved.</div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#cbd5e1" }}>
          Built with ❤️ for smarter financial decisions
        </div>
      </footer>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
  position: "relative",
};

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 40px",
  maxWidth: 1400,
  margin: "0 auto",
  width: "100%",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  borderRadius: "0 0 20px 20px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
};

const brand = { display: "flex", alignItems: "center" };

const logo = {
  width: 56,
  height: 56,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: 900,
  fontSize: 20,
  boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
};

const brandTitle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  letterSpacing: "-0.5px"
};

const brandSub = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 2
};

const nav = { display: "flex", gap: 14, alignItems: "center" };

const loginBtn = {
  border: "2px solid #2563eb",
  color: "#2563eb",
  background: "transparent",
  padding: "10px 24px",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const signupBtn = {
  border: "2px solid transparent",
  color: "white",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  padding: "10px 24px",
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const heroWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "80px 20px",
  flex: 1,
};

const heroCard = {
  width: 1000,
  maxWidth: "96%",
  background: "rgba(255, 255, 255, 0.98)",
  borderRadius: 24,
  padding: "60px 50px",
  textAlign: "center",
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(10px)",
};

const badge = {
  display: "inline-block",
  padding: "8px 20px",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "white",
  borderRadius: 50,
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 24,
};

const heroTitle = {
  margin: 0,
  fontSize: 48,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.2,
  letterSpacing: "-1px",
};

const gradientText = {
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const heroLead = {
  marginTop: 24,
  fontSize: 18,
  color: "#475569",
  lineHeight: 1.7,
  maxWidth: 700,
  margin: "24px auto 0",
};

const ctaRow = {
  marginTop: 40,
  display: "flex",
  justifyContent: "center",
  gap: 16,
  flexWrap: "wrap",
};

const primaryCta = {
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "white",
  border: "none",
  padding: "16px 40px",
  borderRadius: 14,
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  boxShadow: "0 10px 25px rgba(102, 126, 234, 0.4)",
};

const secondaryCta = {
  background: "white",
  color: "#667eea",
  border: "2px solid #667eea",
  padding: "14px 40px",
  borderRadius: 14,
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 24,
  marginTop: 60,
};

const featureCard = {
  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
  padding: "32px 24px",
  borderRadius: 16,
  textAlign: "center",
  border: "1px solid #e2e8f0",
};

const featureIcon = {
  fontSize: 40,
  marginBottom: 16,
};

const featureTitle = {
  fontSize: 18,
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: 12,
};

const featureText = {
  fontSize: 14,
  color: "#64748b",
  lineHeight: 1.6,
};

const footer = {
  padding: "24px 20px",
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: 14,
  background: "rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
};