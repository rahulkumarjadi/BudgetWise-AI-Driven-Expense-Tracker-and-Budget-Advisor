
import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosClient";
import Sidebar, { useDarkMode } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

// --- REDESIGNED MODAL: MODERN MINIMALIST ---
const ConfirmationModal = ({ title, message, onConfirm, onCancel, isDark }) => (
  <div style={styles.modalOverlay}>
    <div style={{
      ...styles.modalContent,
      background: isDark ? "#1e293b" : "#ffffff",
      border: `1px solid ${isDark ? "#334155" : "#f1f5f9"}`
    }}>
      <div style={styles.modalIcon}>⚠️</div>
      <h3 style={{ margin: "10px 0", color: isDark ? "#f8fafc" : "#0f172a" }}>{title}</h3>
      <p style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: "0.95rem", lineHeight: "1.5", marginBottom: "25px" }}>{message}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button style={styles.modalConfirmBtn} onClick={onConfirm}>Confirm</button>
        <button style={{
          ...styles.modalCancelBtn,
          background: isDark ? "transparent" : "#f8fafc",
          color: isDark ? "#94a3b8" : "#64748b",
          borderColor: isDark ? "#334155" : "#e2e8f0"
        }} onClick={onCancel}>Go Back</button>
      </div>
    </div>
  </div>
);

export default function Alerts() {
  const { user } = useContext(AuthContext);
  const { isDark } = useDarkMode();
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: "", message: "", action: null });

  // Theme Variables
  const theme = {
    bg: isDark ? "#0f172a" : "#fbfcfe",
    card: isDark ? "#1e293b" : "#ffffff",
    text: isDark ? "#f8fafc" : "#1e293b",
    sub: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#eff2f5",
    accent: "#6366f1"
  };

  useEffect(() => {
    if (!user?.id) return;
    api.get("/budget/alerts", { params: { userId: user.id } }).then(res => {
      setAlerts(res.data);
      setLoading(false);
    });
  }, [user?.id]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const executeDeleteSelected = async () => {
    await api.delete("/budget/alerts/delete", { params: { userId: user.id }, data: selected });
    setAlerts(prev => prev.filter(a => !selected.includes(a.alertId)));
    setSelected([]);
    setShowConfirm(false);
  };

  const executeDeleteAll = async () => {
    await api.delete("/budget/alerts/delete/all", { params: { userId: user.id } });
    setAlerts([]);
    setSelected([]);
    setShowConfirm(false);
  };

  const openModal = (config) => {
    setConfirmConfig(config);
    setShowConfirm(true);
  };

  return (
    <div style={{ ...styles.layout, background: theme.bg }}>
      <Sidebar />

      {showConfirm && (
        <ConfirmationModal
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.action}
          onCancel={() => setShowConfirm(false)}
          isDark={isDark}
        />
      )}

      <main style={styles.page}>
        <header style={styles.header}>
          <div>
            <h1 style={{ ...styles.pageTitle, color: theme.text }}>Budget Notifications</h1>
            <p style={{ ...styles.subText, color: theme.sub }}>Monitor your spending limits and warnings</p>
          </div>

          {!loading && alerts.length > 0 && (
            <div style={{...styles.actionBar, background: theme.card, borderColor: theme.border}}>
               <button
                  style={{...styles.ghostBtn, color: theme.accent}}
                  onClick={() => selected.length === alerts.length ? setSelected([]) : setSelected(alerts.map(a => a.alertId))}
               >
                 {selected.length === alerts.length ? "Deselect All" : "Select All"}
               </button>
               <div style={styles.divider} />
               <button
                disabled={selected.length === 0}
                onClick={() => openModal({ title: "Delete Alerts", message: `Delete ${selected.length} items?`, action: executeDeleteSelected })}
                style={{...styles.actionBtn, color: "#ef4444", opacity: selected.length === 0 ? 0.4 : 1}}
               >
                 Delete
               </button>
               <button
                onClick={() => openModal({ title: "Purge All", message: "Clear entire history?", action: executeDeleteAll })}
                style={{...styles.actionBtn, color: theme.sub}}
               >
                 Clear All
               </button>
            </div>
          )}
        </header>

        {loading ? (
          <div style={styles.loaderContainer}><div style={styles.spinner} /></div>
        ) : alerts.length === 0 ? (
          <div style={{ ...styles.emptyState, background: theme.card, borderColor: theme.border }}>
             <div style={styles.emptyIcon}>✨</div>
             <h3 style={{color: theme.text, margin: "10px 0 5px"}}>All Clear!</h3>
             <p style={{color: theme.sub}}>No budget alerts at the moment. Keep it up!</p>
          </div>
        ) : (
          <div style={styles.list}>
            {alerts.map(alert => {
              const isExceeded = alert.alertType === "EXCEEDED";
              return (
                <div
                  key={alert.alertId}
                  onClick={() => toggleSelect(alert.alertId)}
                  style={{
                    ...styles.alertCard,
                    background: theme.card,
                    borderColor: selected.includes(alert.alertId) ? theme.accent : theme.border,
                    transform: selected.includes(alert.alertId) ? "translateX(5px)" : "none"
                  }}
                >
                  <div style={{...styles.statusIndicator, background: isExceeded ? "#f43f5e" : "#fbbf24"}} />

                  <div style={styles.cardContent}>
                    <div style={styles.cardTop}>
                      <span style={{
                        ...styles.typeBadge,
                        background: isExceeded ? "rgba(244,63,94,0.1)" : "rgba(251,191,36,0.1)",
                        color: isExceeded ? "#f43f5e" : "#d97706"
                      }}>
                        {alert.alertType}
                      </span>
                      <span style={{...styles.date, color: theme.sub}}>
                        {new Date(alert.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p style={{ ...styles.message, color: theme.text }}>{alert.message}</p>

                    <div style={styles.cardFooter}>
                      <div style={styles.metaGroup}>
                        <span style={{color: theme.sub}}>Category:</span>
                        <span style={{color: theme.text, fontWeight: '600'}}>{alert.category}</span>
                      </div>
                      <div style={styles.metaGroup}>
                        <span style={{color: theme.sub}}>Cycle:</span>
                        <span style={{color: theme.text, fontWeight: '600'}}>{alert.month}/{alert.year}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{...styles.customCheckbox, borderColor: selected.includes(alert.alertId) ? theme.accent : theme.border}}>
                    {selected.includes(alert.alertId) && <div style={{...styles.checkInner, background: theme.accent}} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  page: { flex: 1, padding: "50px 80px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  pageTitle: { fontSize: "2rem", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" },
  subText: { fontSize: "0.95rem", marginTop: "5px" },

  actionBar: { display: "flex", alignItems: "center", padding: "6px 15px", borderRadius: "14px", border: "1px solid", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
  divider: { width: "1px", height: "20px", background: "#e2e8f0", margin: "0 15px" },
  ghostBtn: { background: "none", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" },
  actionBtn: { background: "none", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem", padding: "8px 12px" },

  list: { display: "grid", gap: "16px", maxWidth: "850px" },
  alertCard: { display: "flex", position: "relative", padding: "24px", borderRadius: "20px", border: "1px solid", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", overflow: "hidden" },
  statusIndicator: { position: "absolute", left: 0, top: 0, bottom: 0, width: "5px" },
  cardContent: { flex: 1, paddingLeft: "10px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  typeBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" },
  date: { fontSize: "0.75rem", fontWeight: "600" },
  message: { fontSize: "1.05rem", fontWeight: "700", margin: "0 0 15px 0", lineHeight: "1.4" },
  cardFooter: { display: "flex", gap: "25px" },
  metaGroup: { display: "flex", gap: "6px", fontSize: "0.8rem" },

  customCheckbox: { width: "22px", height: "22px", borderRadius: "7px", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "20px" },
  checkInner: { width: "12px", height: "12px", borderRadius: "3px" },

  emptyState: { textAlign: "center", padding: "80px 40px", borderRadius: "30px", border: "1px solid" },
  emptyIcon: { fontSize: "3rem", marginBottom: "15px" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(8px)" },
  modalContent: { padding: "40px", borderRadius: "28px", width: "380px", textAlign: "center" },
  modalIcon: { fontSize: "2.5rem", marginBottom: "10px" },
  modalConfirmBtn: { flex: 1, padding: "14px", borderRadius: "12px", border: "none", background: "#ef4444", color: "#fff", fontWeight: "700", cursor: "pointer" },
  modalCancelBtn: { flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid", fontWeight: "700", cursor: "pointer" },

  loaderContainer: { display: "flex", justifyContent: "center", paddingTop: "100px" },
  spinner: { width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }
};