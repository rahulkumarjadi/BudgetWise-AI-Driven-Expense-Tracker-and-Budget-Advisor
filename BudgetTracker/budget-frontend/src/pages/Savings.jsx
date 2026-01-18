
import React, { useEffect, useState, useContext, useCallback } from "react";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import Sidebar, { useDarkMode } from "../components/Sidebar";

// --- CUSTOM MODAL COMPONENT ---
const ConfirmationModal = ({ onConfirm, onCancel, isDark }) => (
  <div style={styles.modalOverlay}>
    <div style={{ ...styles.modalCard, background: isDark ? "#1e293b" : "#fff" }}>
      <div style={styles.warningIcon}>⚠️</div>
      <h3 style={{ margin: "10px 0", color: isDark ? "#f1f5f9" : "#1e293b", fontSize: '1.4rem' }}>Delete Goal?</h3>
      <p style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: "0.95rem", marginBottom: "28px" }}>
        Are you sure you want to remove this save goal? All recorded progress will be lost.
      </p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button style={{...styles.modalCancelBtn, background: isDark ? "#334155" : "#f1f5f9", color: isDark ? "#f1f5f9" : "#475569"}} onClick={onCancel}>
          Keep Goal
        </button>
        <button style={styles.modalDeleteBtn} onClick={onConfirm}>Delete Forever</button>
      </div>
    </div>
  </div>
);

export default function Savings() {
  const { user } = useContext(AuthContext);
  const { isDark } = useDarkMode();

  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState("IN_PROGRESS");
  const [form, setForm] = useState({ name: "", targetAmount: "" });
  const [editingGoal, setEditingGoal] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState({});
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const colors = {
    bg: isDark ? "#0f172a" : "#f0f2f5",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#1e293b",
    sub: isDark ? "#94a3b8" : "#64748b",
    accent: "#6366f1",
    accentGradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    successGradient: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    border: isDark ? "#334155" : "#e2e8f0"
  };

  const loadGoals = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get("/savings", { params: { userId: user.id } });
      setGoals(res.data || []);
      setError(null);
    } catch { setError("Connection lost. Please try again."); }
  }, [user?.id]);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  const createGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post("/savings", { userId: user.id, name: form.name, targetAmount: Number(form.targetAmount) });
      setForm({ name: "", targetAmount: "" });
      loadGoals();
    } catch { setError("Could not create save goal."); }
  };

  const updateGoal = async (e) => {
    e.preventDefault();
    try {
      const newTarget = Number(editingGoal.targetAmount);
      await api.put(`/savings/${editingGoal.goalId}`, { name: editingGoal.name, targetAmount: newTarget });
      setEditingGoal(null);
      loadGoals();
    } catch { setError("Update failed."); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/savings/${deleteTargetId}`);
      loadGoals();
    } finally { setShowConfirm(false); setDeleteTargetId(null); }
  };

  const addSavings = async (goalId) => {
    const amount = Number(amountToAdd[goalId]);
    if (!amount || amount <= 0) return;
    try {
      await api.put(`/savings/${goalId}/add`, null, { params: { amount } });
      setAmountToAdd(prev => ({ ...prev, [goalId]: "" }));
      loadGoals();
    } catch { setError("Deposit failed."); }
  };

  const filteredGoals = goals.filter(goal =>
    (filter === "COMPLETED" ? goal.savedAmount >= goal.targetAmount : goal.savedAmount < goal.targetAmount)
  );

  return (
    <div style={{ ...styles.layout, background: colors.bg }}>
      <Sidebar />
      {showConfirm && (
        <ConfirmationModal isDark={isDark} onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
      )}

      <main style={styles.page}>
        <div style={styles.header}>
            <div style={{...styles.accentPill, background: colors.accentGradient}}>Financial Assets</div>
            <h1 style={{ ...styles.pageTitle, color: colors.text }}>Save <span style={{fontWeight: 300}}>Goals</span></h1>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={{ ...styles.inputCard, background: colors.card, borderColor: colors.border }}>
          <form onSubmit={editingGoal ? updateGoal : createGoal} style={styles.formRow}>
            <div style={styles.inputBox}>
                <label style={{...styles.label, color: colors.sub}}>Goal Name</label>
                <input
                    required
                    placeholder="e.g., Dream Car"
                    value={editingGoal ? editingGoal.name : form.name}
                    onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, name: e.target.value }) : setForm({ ...form, name: e.target.value })}
                    style={{ ...styles.mainInput, color: colors.text, borderBottomColor: colors.border }}
                />
            </div>
            <div style={styles.inputBox}>
                <label style={{...styles.label, color: colors.sub}}>Target Amount</label>
                <input
                    required
                    type="number"
                    placeholder="₹ 0.00"
                    value={editingGoal ? editingGoal.targetAmount : form.targetAmount}
                    onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, targetAmount: e.target.value }) : setForm({ ...form, targetAmount: e.target.value })}
                    style={{ ...styles.mainInput, color: colors.text, borderBottomColor: colors.border }}
                />
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" style={{...styles.submitBtn, background: colors.accentGradient}}>
                  {editingGoal ? "Save Goal" : "Create Goal"}
              </button>
              {editingGoal && (
                 <button type="button" onClick={() => setEditingGoal(null)} style={{...styles.cancelBtn, color: colors.sub}}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.navBar}>
            <button onClick={() => setFilter("IN_PROGRESS")} style={{...styles.navItem, color: filter === "IN_PROGRESS" ? colors.accent : colors.sub}}>
                ACTIVE GOALS
                {filter === "IN_PROGRESS" && <div style={{...styles.activeIndicator, background: colors.accentGradient}} />}
            </button>
            <button onClick={() => setFilter("COMPLETED")} style={{...styles.navItem, color: filter === "COMPLETED" ? colors.accent : colors.sub}}>
                MATURED GOALS
                {filter === "COMPLETED" && <div style={{...styles.activeIndicator, background: colors.accentGradient}} />}
            </button>
        </div>

        <div style={styles.grid}>
          {filteredGoals.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: colors.sub }}>
              No goals found here. Start by creating one above!
            </div>
          ) : filteredGoals.map(goal => {
            const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.goalId} style={{ ...styles.goalCard, background: colors.card }}>
                <div style={styles.goalTop}>
                   <h3 style={{ ...styles.goalTitle, color: colors.text }}>{goal.name}</h3>
                   <div style={styles.miniActions}>
                      <button onClick={() => setEditingGoal(goal)} style={styles.ghostBtn}>Modify</button>
                      <button onClick={() => { setDeleteTargetId(goal.goalId); setShowConfirm(true); }} style={styles.deleteGhostBtn}>Delete</button>
                   </div>
                </div>

                <div style={styles.statsContainer}>
                    <div style={styles.statGroup}>
                        <span style={{...styles.statLabel, color: colors.sub}}>Saved</span>
                        <span style={{...styles.statValue, color: colors.text}}>₹{goal.savedAmount.toLocaleString()}</span>
                    </div>
                    <div style={{...styles.statGroup, alignItems: 'flex-end'}}>
                        <span style={{...styles.statLabel, color: colors.sub}}>Target</span>
                        <span style={{...styles.statValue, color: colors.text}}>₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div style={{ ...styles.progressTrack, background: isDark ? "#334155" : "#f1f5f9" }}>
                  <div style={{ ...styles.progressFill, width: `${progress}%`, background: progress >= 100 ? colors.successGradient : colors.accentGradient }} />
                </div>

                <div style={styles.goalFooter}>
                  <div style={{...styles.percentagePill, background: isDark ? "#334155" : "#f8fafc", color: colors.accent}}>
                    {Math.round(progress)}%
                  </div>
                  {goal.savedAmount < goal.targetAmount ? (
                    <div style={styles.quickAdd}>
                      <input
                        type="number"
                        placeholder="Amount"
                        value={amountToAdd[goal.goalId] || ""}
                        onChange={(e) => setAmountToAdd({ ...amountToAdd, [goal.goalId]: e.target.value })}
                        style={{ ...styles.inlineInput, background: colors.bg, color: colors.text }}
                      />
                      <button onClick={() => addSavings(goal.goalId)} style={{...styles.plusBtn, background: colors.accentGradient}}>Deposit</button>
                    </div>
                  ) : (
                    <span style={styles.celebrationText}>Goal Achieved! 🏆</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "50px 60px", overflowY: "auto" },
  header: { marginBottom: "40px" },
  accentPill: { width: "fit-content", padding: "4px 12px", borderRadius: "20px", color: "#fff", fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "10px" },
  pageTitle: { fontSize: "2.5rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" },
  errorBanner: { padding: "15px", borderRadius: "12px", background: "#fee2e2", color: "#b91c1c", marginBottom: "25px", fontWeight: "600", textAlign: 'center' },
  inputCard: { padding: "30px", borderRadius: "24px", marginBottom: "50px", border: "1px solid", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" },
  formRow: { display: "flex", gap: "30px", alignItems: "flex-end", flexWrap: 'wrap' },
  inputBox: { flex: 1, minWidth: '200px', display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" },
  mainInput: { background: "none", border: "none", borderBottom: "2px solid", padding: "10px 0", fontSize: "1.1rem", outline: "none", fontWeight: "600" },
  submitBtn: { padding: "15px 35px", borderRadius: "15px", border: "none", color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "1rem", boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)" },
  cancelBtn: { padding: "15px 15px", background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' },
  navBar: { display: "flex", gap: "40px", marginBottom: "35px", borderBottom: "1px solid #e2e8f033" },
  navItem: { background: "none", border: "none", padding: "15px 5px", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer", position: "relative", letterSpacing: "1px" },
  activeIndicator: { position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", borderRadius: "4px 4px 0 0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "30px" },
  goalCard: { padding: "30px", borderRadius: "28px", boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" },
  goalTop: { display: "flex", justifyContent: "space-between", marginBottom: "25px" },
  goalTitle: { fontSize: "1.3rem", fontWeight: "800", margin: 0 },
  miniActions: { display: "flex", gap: "10px" },
  ghostBtn: { background: "none", border: "none", color: "#6366f1", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" },
  deleteGhostBtn: { background: "none", border: "none", color: "#f43f5e", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" },
  statsContainer: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  statGroup: { display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase" },
  statValue: { fontSize: "1.2rem", fontWeight: "800" },
  progressTrack: { height: "12px", borderRadius: "20px", overflow: "hidden", marginBottom: "25px" },
  progressFill: { height: "100%", transition: "width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
  goalFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" },
  percentagePill: { padding: "6px 14px", borderRadius: "12px", fontWeight: "800", fontSize: "0.9rem" },
  quickAdd: { display: "flex", gap: "10px", alignItems: "center" },
  inlineInput: { width: "80px", padding: "8px 12px", borderRadius: "10px", border: "none", fontSize: "0.85rem", fontWeight: "700" },
  plusBtn: { padding: "8px 16px", borderRadius: "10px", border: "none", color: "#fff", fontWeight: "800", cursor: "pointer" },
  celebrationText: { color: "#10b981", fontWeight: "700", fontSize: "0.9rem" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)" },
  modalCard: { padding: "40px", borderRadius: "32px", width: "400px", textAlign: "center", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" },
  warningIcon: { fontSize: "3rem", marginBottom: "10px" },
  modalCancelBtn: { flex: 1, padding: "14px", borderRadius: "14px", border: "none", fontWeight: "700", cursor: "pointer" },
  modalDeleteBtn: { flex: 1, padding: "14px", borderRadius: "14px", border: "none", background: "#f43f5e", color: "#fff", fontWeight: "700", cursor: "pointer" }
};