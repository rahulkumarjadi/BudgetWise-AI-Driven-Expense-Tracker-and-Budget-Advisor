import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import Sidebar, { useDarkMode } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Budget() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useDarkMode();

  const [activeTab, setActiveTab] = useState("SET");
  const [form, setForm] = useState({
    budgetId: null,
    category: "",
    limitAmount: "",
    budgetMonth: "",
    budgetYear: new Date().getFullYear().toString()
  });

  const [analysis, setAnalysis] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Dynamic Theme Palette
  const colors = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "#1e293b" : "#ffffff",
    input: isDark ? "#334155" : "#f1f5f9",
    text: isDark ? "#f8fafc" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    accent: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    shadow: isDark ? "rgba(0,0,0,0.4)" : "rgba(99, 102, 241, 0.1)"
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enableEdit = () => {
    setIsEditing(true);
    setActiveTab("SET");
    setMessage(null);
    setError(null);
  };

  const submitBudget = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      if (isEditing && form.budgetId) {
        await api.put(`/budget/${form.budgetId}`, null, {
          params: { limitAmount: Number(form.limitAmount) }
        });
        setMessage("✨ Update successful!");
        setIsEditing(false);
      } else {
        await api.post("/budget", {
          userId: user.id,
          category: form.category,
          limitAmount: Number(form.limitAmount),
          budgetMonth: Number(form.budgetMonth),
          budgetYear: Number(form.budgetYear)
        });
        setMessage("🎯 Budget target locked in!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save budget");
    }
  };

  const analyzeBudget = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!form.category || !form.budgetMonth || !form.budgetYear) {
      setError("Please select category, month and year");
      return;
    }
    try {
      const res = await api.get("/budget/analysis", {
        params: {
          userId: user.id,
          category: form.category,
          month: Number(form.budgetMonth),
          year: Number(form.budgetYear)
        }
      });
      setAnalysis(res.data);
      setForm(prev => ({ ...prev, budgetId: res.data.budgetId, limitAmount: res.data.limitAmount }));
      setIsEditing(false);
    } catch (err) {
      setAnalysis(null);
      setError(err.response?.data?.message || "No budget data found for this period");
    }
  };

  return (
    <div style={{ ...styles.layout, background: colors.bg }}>
      <Sidebar />
      <main style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={{ ...styles.pageTitle, color: colors.text }}>
              Budgeting <span style={{ color: '#6366f1' }}>Intelligence</span>
            </h1>
            <p style={{ ...styles.subText, color: colors.subText }}>Strategic allocation for your financial future.</p>
          </div>
          <button style={{ ...styles.navGoalBtn, background: colors.accent }} onClick={() => navigate("/savings")}>
            🎯 Savings Goals
          </button>
        </div>

        <div style={styles.centeredContainer}>
          <div style={{ ...styles.modernCard, background: colors.card, borderColor: colors.border, boxShadow: `0 20px 40px ${colors.shadow}` }}>

            {/* Tab Swiper UI */}
            <div style={{ ...styles.tabTrack, background: colors.input }}>
              <div style={{
                ...styles.tabSlider,
                left: activeTab === "SET" ? "4px" : "50%",
                background: colors.accent
              }} />
              <button
                onClick={() => { setActiveTab("SET"); setMessage(null); setError(null); }}
                style={{ ...styles.tabLink, color: activeTab === "SET" ? "#fff" : colors.subText }}
              >Set Limits</button>
              <button
                onClick={() => { setActiveTab("ANALYZE"); setMessage(null); setError(null); }}
                style={{ ...styles.tabLink, color: activeTab === "ANALYZE" ? "#fff" : colors.subText }}
              >Analyze Spend</button>
            </div>

            {activeTab === "SET" && (
              <div style={styles.fadeIn}>
                <h2 style={{ ...styles.sectionTitle, color: colors.text }}>
                   {isEditing ? "Modify Allocation" : "New Budget Target"}
                </h2>
                <form onSubmit={submitBudget} style={styles.formStack}>
                  <div style={styles.inputGroup}>
                    <label style={{ ...styles.label, color: colors.subText }}>Expense Category</label>
                    <select name="category" value={form.category} onChange={handleChange} style={{ ...styles.select, background: colors.input, color: colors.text, borderColor: colors.border }} disabled={isEditing} required>
                      <option value="">Choose category...</option>
                      <option>Food</option><option>Rent</option><option>Transport</option>
                      <option>Shopping</option><option>Entertainment</option><option>Others</option>
                    </select>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={{ ...styles.label, color: colors.subText }}>Budget Limit (₹)</label>
                    <input type="number" name="limitAmount" placeholder="e.g. 5000" value={form.limitAmount} onChange={handleChange} style={{ ...styles.inputField, background: colors.input, color: colors.text, borderColor: colors.border }} required />
                  </div>

                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                       <label style={{ ...styles.label, color: colors.subText }}>Month</label>
                       <input type="number" name="budgetMonth" placeholder="MM" value={form.budgetMonth} onChange={handleChange} style={{ ...styles.inputField, background: colors.input, color: colors.text, borderColor: colors.border }} disabled={isEditing} required />
                    </div>
                    <div style={{ flex: 1 }}>
                       <label style={{ ...styles.label, color: colors.subText }}>Year</label>
                       <input type="number" name="budgetYear" value={form.budgetYear} onChange={handleChange} style={{ ...styles.inputField, background: colors.input, color: colors.text, borderColor: colors.border }} disabled={isEditing} required />
                    </div>
                  </div>
                  <button type="submit" style={{ ...styles.primaryBtn, background: colors.accent }}>{isEditing ? "Apply Changes" : "Confirm Budget"}</button>
                </form>
              </div>
            )}

            {activeTab === "ANALYZE" && (
              <div style={styles.fadeIn}>
                <div style={styles.flexBetween}>
                    <h2 style={{ ...styles.sectionTitle, color: colors.text }}>Performance Review</h2>
                    {analysis && !isEditing && <button onClick={enableEdit} style={styles.miniEditBtn}>✏️ Edit</button>}
                </div>
                <form onSubmit={analyzeBudget} style={styles.formStack}>
                  <select name="category" value={form.category} onChange={handleChange} style={{ ...styles.select, background: colors.input, color: colors.text, borderColor: colors.border }} required>
                    <option value="">Select category</option>
                    <option>Food</option><option>Rent</option><option>Transport</option>
                    <option>Shopping</option><option>Entertainment</option><option>Others</option>
                  </select>
                  <div style={{ display: "flex", gap: 16 }}>
                    <input type="number" name="budgetMonth" placeholder="Month" value={form.budgetMonth} onChange={handleChange} style={{ ...styles.inputField, background: colors.input, color: colors.text, borderColor: colors.border }} required />
                    <input type="number" name="budgetYear" placeholder="Year" value={form.budgetYear} onChange={handleChange} style={{ ...styles.inputField, background: colors.input, color: colors.text, borderColor: colors.border }} required />
                  </div>
                  <button type="submit" style={{ ...styles.primaryBtn, background: colors.accent }}>Run Analysis</button>
                </form>

                {analysis && (
                  <div style={styles.analysisContainer}>
                    <div style={styles.gridRow}>
                      <div style={{ ...styles.dataCard, background: isDark ? "#334155" : "#f8fafc" }}>
                        <span style={styles.dataLabel}>ALLOWED</span>
                        <span style={{ ...styles.dataValue, color: colors.text }}>₹{analysis.limitAmount.toLocaleString()}</span>
                      </div>
                      <div style={{ ...styles.dataCard, background: isDark ? "#334155" : "#f8fafc" }}>
                        <span style={styles.dataLabel}>UTILIZED</span>
                        <span style={{ ...styles.dataValue, color: "#f43f5e" }}>₹{analysis.actualExpense.toLocaleString()}</span>
                      </div>
                    </div>
                    <div style={{
                        ...styles.statusBanner,
                        background: analysis.alertType === "EXCEEDED" ? "rgba(244, 63, 94, 0.1)" : analysis.alertType === "WARNING" ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
                        color: analysis.alertType === "EXCEEDED" ? "#f43f5e" : analysis.alertType === "WARNING" ? "#d97706" : "#10b981",
                        border: `1px solid ${analysis.alertType === "EXCEEDED" ? "#f43f5e30" : "#10b98130"}`
                    }}>
                      {analysis.alertMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
            {message && <div style={styles.successMsg}>{message}</div>}
            {error && <div style={styles.errorMsg}>{error}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "50px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 },
  pageTitle: { fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-1px", margin: 0 },
  subText: { fontSize: "1rem", opacity: 0.7, fontWeight: "500", marginTop: 4 },
  navGoalBtn: { padding: "14px 24px", borderRadius: 14, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", transition: '0.3s ease', boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" },
  centeredContainer: { display: "flex", justifyContent: "center" },
  modernCard: { padding: "40px", borderRadius: "32px", border: "1px solid", width: "100%", maxWidth: "580px" },

  tabTrack: { display: "flex", position: "relative", padding: "4px", borderRadius: "16px", marginBottom: "40px", height: "50px" },
  tabSlider: { position: "absolute", top: "4px", bottom: "4px", width: "calc(50% - 8px)", borderRadius: "12px", transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 1 },
  tabLink: { flex: 1, position: "relative", zIndex: 2, background: "transparent", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" },

  sectionTitle: { fontSize: "1.4rem", fontWeight: "800", marginBottom: 24, letterSpacing: "-0.5px" },
  formStack: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputField: { padding: "16px", borderRadius: "14px", border: "1px solid", fontSize: "1rem", outline: "none" },
  select: { padding: "16px", borderRadius: "14px", border: "1px solid", fontSize: "1rem", outline: "none", cursor: 'pointer', appearance: 'none' },
  primaryBtn: { padding: "18px", borderRadius: "14px", border: "none", color: "#fff", fontWeight: "800", cursor: "pointer", fontSize: "1rem", marginTop: 10 },

  flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  miniEditBtn: { padding: "8px 16px", borderRadius: "10px", border: "1px solid #6366f1", background: "transparent", color: "#6366f1", fontWeight: "700", cursor: "pointer" },

  analysisContainer: { marginTop: 35 },
  gridRow: { display: 'flex', gap: '20px', marginBottom: '20px' },
  dataCard: { flex: 1, padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  dataLabel: { fontSize: '0.7rem', color: '#64748b', fontWeight: '800', marginBottom: '8px' },
  dataValue: { fontSize: '1.5rem', fontWeight: '900' },
  statusBanner: { padding: "18px", borderRadius: "18px", fontWeight: "800", textAlign: 'center', fontSize: '0.9rem' },

  successMsg: { marginTop: 20, color: "#10b981", fontWeight: "800", textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' },
  errorMsg: { marginTop: 20, color: "#f43f5e", fontWeight: "800", textAlign: 'center', background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '12px' },
  fadeIn: { animation: 'fadeIn 0.4s ease-in' }
};