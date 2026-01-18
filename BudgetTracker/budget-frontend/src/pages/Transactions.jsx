import React, { useEffect, useState } from "react";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import Sidebar, { useDarkMode } from "../components/Sidebar";
import * as XLSX from "xlsx"; // Ensure this is installed via npm install xlsx

const CATEGORIES = ["Food", "Rent", "Salary", "Transport", "Shopping", "Entertainment", "Others"];

const ConfirmModal = ({ onConfirm, onCancel, isDark }) => (
  <div style={styles.modalOverlay}>
    <div style={{ ...styles.modalCard, background: isDark ? "#1e293b" : "#fff" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "15px" }}>⚠️</div>
      <h3 style={{ margin: "0 0 10px 0", color: isDark ? "#f8fafc" : "#0f172a", fontSize: '1.5rem' }}>Confirm Deletion</h3>
      <p style={{ color: isDark ? "#94a3b8" : "#64748b", marginBottom: "28px", lineHeight: '1.5' }}>
        Are you sure you want to remove this transaction? This action cannot be undone.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: 'center' }}>
        <button onClick={onCancel} style={{ ...styles.modalCancelBtn, color: isDark ? "#cbd5e1" : "#475569" }}>Cancel</button>
        <button onClick={onConfirm} style={styles.modalDeleteBtn}>Delete Record</button>
      </div>
    </div>
  </div>
);

export default function Transactions() {
  const { isDark } = useDarkMode();
  const { refreshAlertCount } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [filters, setFilters] = useState({ category: "", fromDate: "", toDate: "" });

  const [form, setForm] = useState({
    type: "EXPENSE",
    category: "",
    amount: "",
    transactionDate: "",
    description: ""
  });

  const colors = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)",
    text: isDark ? "#f8fafc" : "#0f172a",
    sub: isDark ? "#94a3b8" : "#64748b",
    accent: "#6366f1",
    income: "#10b981",
    expense: "#f43f5e",
    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
  };

  const load = async () => {
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data || []);
      setFiltered(res.data || []);
    } catch (err) { console.error("Fetch error", err); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = [...transactions];
    if (filters.category) data = data.filter(t => t.category === filters.category);
    if (filters.fromDate) data = data.filter(t => new Date(t.transactionDate) >= new Date(filters.fromDate));
    if (filters.toDate) data = data.filter(t => new Date(t.transactionDate) <= new Date(filters.toDate));
    setFiltered(data);
  }, [filters, transactions]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return alert("No data available to export.");
    const headers = ["Date", "Type", "Category", "Amount", "Description"];
    const csvRows = filtered.map(t => [
      t.transactionDate, t.type, t.category, t.amount, `"${(t.description || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...csvRows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BudgetWise_Transactions_${today}.csv`);
    link.click();
  };

  const handleExportExcel = () => {
    if (filtered.length === 0) return alert("No data available to export.");

    // Prepare data for Excel
    const excelData = filtered.map(t => ({
      Date: t.transactionDate,
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description || ""
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `BudgetWise_Transactions_${today}.xlsx`);
  };

  const income = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + Number(t.amount), 0);
  const savings = transactions.filter(t => t.category === "Savings").reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/transactions/${editingId}`, { ...form, amount: Number(form.amount) });
      else {
        await api.post("/transactions", { ...form, amount: Number(form.amount) });
        refreshAlertCount();
      }
      resetForm(); load();
    } catch (err) { alert("Error saving transaction"); }
  };

  const resetForm = () => {
    setForm({ type: "EXPENSE", category: "", amount: "", transactionDate: "", description: "" });
    setEditingId(null);
  };

  const edit = (t) => {
    setEditingId(t.id);
    setForm({ ...t, description: t.description || "" });
  };

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) { await api.delete(`/transactions/${deleteTargetId}`); load(); }
    setShowConfirm(false);
  };

  return (
    <div style={{ ...styles.layout, background: colors.bg }}>
      <Sidebar />
      {showConfirm && <ConfirmModal isDark={isDark} onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}

      <main style={styles.page}>
        <div style={styles.header}>
          <h1 style={{ ...styles.pageTitle, color: colors.text }}>Transactions</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleExportCSV}
              style={{ ...styles.exportBtn, background: colors.card, color: colors.text, borderColor: colors.border }}
            >
              CSV
            </button>
            <button
              onClick={handleExportExcel}
              style={{ ...styles.exportBtn, background: "#1D6F42", color: "#fff", border: "none" }}
            >
              Download Excel
            </button>
          </div>
        </div>

        <div style={styles.metricsRow}>
          <MetricCard label="Total Inflow" val={income - savings} color={colors.income} isDark={isDark} />
          <MetricCard label="Total Outflow" val={expense} color={colors.expense} isDark={isDark} />
          <MetricCard label="Savings Pool" val={savings} color={colors.accent} isDark={isDark} />
        </div>

        <div style={styles.grid}>
          <div style={{ ...styles.card, background: colors.card, borderColor: colors.border }}>
            <h2 style={{ ...styles.cardTitle, color: colors.text, marginBottom: '20px' }}>
              {editingId ? "Modify Transaction" : "New Entry"}
            </h2>

            <div style={styles.tabContainer}>
              <button type="button" onClick={() => setForm({...form, type: "INCOME"})}
                style={{ ...styles.tab, ...(form.type === "INCOME" ? { background: colors.income, color: '#fff' } : { color: colors.sub }) }}>Income</button>
              <button type="button" onClick={() => setForm({...form, type: "EXPENSE"})}
                style={{ ...styles.tab, ...(form.type === "EXPENSE" ? { background: colors.expense, color: '#fff' } : { color: colors.sub }) }}>Expense</button>
            </div>

            <form onSubmit={submit} style={styles.stack}>
              <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ ...styles.input, background: isDark ? "#0f172a" : "#fff", color: colors.text, borderColor: colors.border }}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" required placeholder="Amount ₹" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={{ ...styles.input, background: isDark ? "#0f172a" : "#fff", color: colors.text, borderColor: colors.border }} />
              <input type="date" required max={today} value={form.transactionDate} onChange={e => setForm({...form, transactionDate: e.target.value})} style={{ ...styles.input, background: isDark ? "#0f172a" : "#fff", color: colors.text, borderColor: colors.border }} />
              <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...styles.input, background: isDark ? "#0f172a" : "#fff", color: colors.text, borderColor: colors.border, height: 100, resize: 'none' }} />
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="submit" style={{ ...styles.primaryBtn, background: colors.accent }}>{editingId ? "Update Transaction" : "Confirm & Save"}</button>
                {editingId && <button type="button" onClick={resetForm} style={{ ...styles.secBtn, color: colors.sub }}>Cancel</button>}
              </div>
            </form>
          </div>

          <div style={{ ...styles.card, background: colors.card, borderColor: colors.border }}>
            <div style={styles.listHeader}>
                <h2 style={{ ...styles.cardTitle, color: colors.text }}>History</h2>
                <div style={styles.filterBar}>
                    <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} style={{...styles.miniSelect, background: colors.bg, color: colors.text}}>
                        <option value="">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div style={styles.listBody}>
              {filtered.length === 0 ? <p style={{ color: colors.sub, textAlign: 'center', marginTop: 50, fontWeight: 500 }}>No records found.</p> :
                filtered.map(t => (
                  <div key={t.id} style={{ ...styles.txRow, background: isDark ? "rgba(15, 23, 42, 0.4)" : "#fff", border: `1px solid ${colors.border}` }}>
                    <div style={styles.txMain}>
                      <div style={{ ...styles.categoryBadge, color: colors.text }}>{t.category}</div>
                      <div style={{ color: colors.sub, fontSize: '0.8rem', marginTop: 4 }}>{t.transactionDate}</div>
                    </div>
                    <div style={styles.txSide}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: t.type === "INCOME" ? colors.income : colors.expense }}>
                        {t.type === "INCOME" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </div>
                      <div style={styles.txActions}>
                        <span onClick={() => edit(t)} style={{ color: colors.accent, cursor: 'pointer' }}>Edit</span>
                        <span onClick={() => requestDelete(t.id)} style={{ color: colors.expense, cursor: 'pointer' }}>Delete</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const MetricCard = ({ label, val, color, isDark }) => (
  <div style={{ ...styles.metric, borderTop: `4px solid ${color}`, background: isDark ? "rgba(30, 41, 59, 0.8)" : "#fff", boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
    <span style={styles.metricLabel}>{label}</span>
    <span style={{ ...styles.metricVal, color: isDark ? "#f8fafc" : "#1e293b" }}>₹{val.toLocaleString()}</span>
  </div>
);

const styles = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" },
  page: { flex: 1, padding: "40px 60px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 35 },
  pageTitle: { fontSize: "2.4rem", fontWeight: 900, letterSpacing: '-0.04em' },
  exportBtn: { padding: "10px 20px", borderRadius: "12px", border: "1px solid", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem", transition: '0.2s' },
  metricsRow: { display: "flex", gap: "24px", marginBottom: "40px" },
  metric: { flex: 1, padding: "24px", borderRadius: "20px", display: "flex", flexDirection: "column" },
  metricLabel: { fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#94a3b8", letterSpacing: '0.1em', marginBottom: '8px' },
  metricVal: { fontSize: "1.6rem", fontWeight: "900" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "30px" },
  card: { padding: "32px", borderRadius: "28px", border: "1px solid", backdropFilter: "blur(12px)" },
  cardTitle: { fontSize: "1.3rem", fontWeight: "800", margin: 0 },
  tabContainer: { display: 'flex', background: 'rgba(0,0,0,0.05)', padding: '5px', borderRadius: '14px', marginBottom: '28px' },
  tab: { flex: 1, border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', transition: '0.3s' },
  stack: { display: 'flex', flexDirection: 'column', gap: '18px' },
  input: { padding: '16px', borderRadius: '14px', border: '1px solid', fontSize: '0.95rem', outline: 'none', transition: '0.2s' },
  primaryBtn: { padding: '16px', borderRadius: '14px', border: 'none', color: '#fff', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' },
  secBtn: { background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  filterBar: { display: 'flex', gap: '10px' },
  miniSelect: { padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '0.85rem', outline: 'none' },
  listBody: { maxHeight: '580px', overflowY: 'auto', paddingRight: '8px' },
  txRow: { padding: '20px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  categoryBadge: { fontWeight: '800', fontSize: '1rem' },
  txSide: { textAlign: 'right' },
  txActions: { display: 'flex', gap: '16px', fontSize: '0.75rem', fontWeight: '800', marginTop: '8px', textTransform: 'uppercase' },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalCard: { padding: "45px", borderRadius: "35px", width: "420px", textAlign: "center" },
  modalDeleteBtn: { background: "#f43f5e", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "14px", fontWeight: "700", cursor: "pointer" },
  modalCancelBtn: { background: "none", border: "none", fontWeight: "700", cursor: "pointer", fontSize: '1rem' }
};