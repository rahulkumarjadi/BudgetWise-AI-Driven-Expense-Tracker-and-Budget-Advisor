
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import TransactionCard from "../components/TransactionCard";
import Sidebar, { useDarkMode } from "../components/Sidebar";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDark } = useDarkMode();

  // Vibrant Modern Palette
  const colors = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f1f5f9" : "#1e293b",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    accent: "#6366f1", // Modern Indigo
    success: "#10b981",
    danger: "#f43f5e",
    warning: "#f59e0b"
  };

  useEffect(() => {
    if (!user) return;

    Promise.all([
      api.get("/dashboard/summary"),
      api.get("/transactions")
    ])
      .then(([summaryRes, txRes]) => {
        setData(summaryRes.data);
        setTransactions(txRes.data || []);
      })
      .catch((err) => {
        console.error("Dashboard Fetch Error:", err);
        setData({ totalIncome: 0, totalExpense: 0, balance: 0 });
        setTransactions([]);
      });
  }, [user]);

  if (!data) return (
    <div style={{ ...styles.loading, color: colors.text, background: colors.bg }}>
      <div style={styles.spinner}></div>
      <span>Refreshing your finances...</span>
    </div>
  );

  const savings = transactions
    .filter(t => t.category === "Savings")
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const budgetUtilization = data.totalIncome > 0
    ? Math.round((data.totalExpense / data.totalIncome) * 100)
    : 0;

  return (
    <div style={{ ...styles.layout, background: colors.bg }}>
      <Sidebar />

      <main style={styles.page}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div>
            <h1 style={{ ...styles.pageTitle, color: colors.text }}>Overview</h1>
            <p style={{ color: colors.subText, fontSize: "1rem" }}>
              Good morning, <span style={{ color: colors.accent, fontWeight: 700 }}>{user?.name}</span>
            </p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => navigate("/transactions")}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            + New Transaction
          </button>
        </div>

        {/* SUMMARY GRID */}
        <div style={styles.summaryGrid}>
          <SummaryCard
            title="Income"
            value={data.totalIncome - savings}
            color={colors.success}
            icon="↗"
            isDark={isDark}
          />
          <SummaryCard
            title="Expenses"
            value={data.totalExpense}
            color={colors.danger}
            icon="↘"
            isDark={isDark}
          />
          <SummaryCard
            title="Saved"
            value={savings}
            color={colors.accent}
            icon="◈"
            isDark={isDark}
          />
          <SummaryCard
            title="Utilization"
            value={`${budgetUtilization}%`}
            color={colors.warning}
            icon="⚡"
            isPercent
            isDark={isDark}
          />
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div style={{ ...styles.glassCard, background: colors.card, borderColor: colors.border }}>
          <div style={styles.cardHeader}>
            <h2 style={{ ...styles.cardTitle, color: colors.text }}>Recent Transactions</h2>
            <button
              style={{ ...styles.viewAllBtn, color: colors.accent }}
              onClick={() => navigate("/transactions")}
            >
              See all history
            </button>
          </div>

          {transactions.length === 0 ? (
            <div style={{ ...styles.emptyState, background: isDark ? "#111827" : "#f1f5f9", color: colors.subText }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>📂</div>
              No transactions recorded yet.
            </div>
          ) : (
            <div style={styles.txList}>
              {transactions.slice(0, 5).map((t) => (
                <TransactionCard
                  key={t.id}
                  t={t}
                  onEdit={() => navigate(`/transactions?edit=${t.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const SummaryCard = ({ title, value, color, icon, isPercent, isDark }) => (
  <div style={{
    ...styles.summaryCard,
    background: isDark ? "#1e293b" : "#fff",
    borderTop: `3px solid ${color}`
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
            <div style={styles.summaryLabel}>{title.toUpperCase()}</div>
            <div style={{ ...styles.summaryValue, color: isDark ? "#f8fafc" : "#0f172a" }}>
                {isPercent ? value : `₹${value.toLocaleString()}`}
            </div>
        </div>
        <div style={{ ...styles.iconBox, color: color, backgroundColor: `${color}15` }}>
            {icon}
        </div>
    </div>
  </div>
);

const styles = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  page: { flex: 1, padding: "40px 60px", height: "100vh", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 },
  pageTitle: { fontSize: "2.25rem", fontWeight: 800, margin: 0, letterSpacing: "-0.03em" },
  addBtn: {
    padding: "14px 28px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 20px -5px rgba(79,70,229,0.4)",
    transition: "transform 0.2s ease"
  },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginBottom: 40 },
  summaryCard: {
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)",
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "bold"
  },
  summaryLabel: { color: "#94a3b8", fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "8px" },
  summaryValue: { fontSize: "1.5rem", fontWeight: "800" },
  glassCard: {
    padding: "32px",
    borderRadius: "28px",
    border: "1px solid",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)"
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  cardTitle: { fontSize: "1.4rem", fontWeight: "800", margin: 0 },
  viewAllBtn: { background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  txList: { display: "flex", flexDirection: "column", gap: 14 },
  emptyState: { padding: "60px", textAlign: "center", borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  loading: { height: "100vh", display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", gap: 10 },
  spinner: { width: 30, height: 30, border: "3px solid #6366f133", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }
};