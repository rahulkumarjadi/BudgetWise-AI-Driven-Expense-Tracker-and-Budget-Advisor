// import React, { useEffect, useState, useContext, useCallback } from "react";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
// } from "recharts";
// import api from "../api/axiosClient";
// import { AuthContext } from "../context/AuthContext";
// import Sidebar, { useDarkMode } from "../components/Sidebar";
//
// const COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
// const CATEGORIES = ["All", "Food", "Rent", "Transport", "Shopping", "Entertainment", "Others"];
//
// export default function Analytics() {
//   const { isDark } = useDarkMode();
//   const { loading: authLoading, user } = useContext(AuthContext);
//
//   const [category, setCategory] = useState("All");
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year] = useState(new Date().getFullYear());
//
//   const [incomeExpense, setIncomeExpense] = useState({ income: 0, expense: 0 });
//   const [categoryData, setCategoryData] = useState([]);
//   const [budgetData, setBudgetData] = useState([]);
//   const [overallBudget, setOverallBudget] = useState({ totalBudget: 0, totalSpent: 0 });
//   const [savingsGoals, setSavingsGoals] = useState([]);
//
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//
//   // Extract ID once to ensure consistency
//   const currentUserId = user?.id || user?.userId || user?._id;
//
//   const theme = {
//     bg: isDark ? "#0f172a" : "#f8fafc",
//     card: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)",
//     text: isDark ? "#f8fafc" : "#0f172a",
//     subText: isDark ? "#94a3b8" : "#64748b",
//     border: isDark ? "#334155" : "#e2e8f0",
//     accent: "#6366f1",
//     grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
//   };
//
//   const fetchAnalytics = useCallback(async () => {
//     // Block execution if auth is still loading or if we don't have a valid user ID yet
//     if (authLoading || !currentUserId) return;
//
//     setLoading(true);
//     setErrorMessage("");
//
//     const params = {
//       userId: currentUserId,
//       month,
//       year,
//       category: category === "All" ? null : category
//     };
//
//     try {
//       const [ieRes, catRes, budRes, overallRes, savingsRes] = await Promise.all([
//         api.get("/analytics/income-expense", { params }),
//         api.get("/analytics/category-expense", { params }),
//         api.get("/analytics/budget-vs-spent", { params }),
//         api.get("/analytics/overall-budget", { params }),
//         api.get("/analytics/savings-progress", { params: { userId: currentUserId } })
//       ]);
//
//       setIncomeExpense(ieRes.data || { income: 0, expense: 0 });
//       setCategoryData(Array.isArray(catRes.data) ? catRes.data : []);
//       setBudgetData(Array.isArray(budRes.data) ? budRes.data : []);
//       setOverallBudget(overallRes.data || { totalBudget: 0, totalSpent: 0 });
//       setSavingsGoals(Array.isArray(savingsRes.data) ? savingsRes.data : []);
//     } catch (err) {
//       console.error("Analytics Fetch Error:", err);
//       setErrorMessage("Data synchronization failed.");
//     } finally {
//       setLoading(false);
//     }
//   }, [month, year, category, currentUserId, authLoading]);
//
//   // Main Effect: Triggers when Auth finishes or User ID changes
//   useEffect(() => {
//     if (!authLoading && currentUserId) {
//       fetchAnalytics();
//     }
//   }, [currentUserId, authLoading, fetchAnalytics]);
//
//   const incomeExpenseChart = [
//     { name: "Total Revenue", value: Number(incomeExpense.income) || 0, fill: "#10b981" },
//     { name: "Total Outflow", value: Number(incomeExpense.expense) || 0, fill: "#f43f5e" }
//   ];
//
//   const remainingBudget = (Number(overallBudget.totalBudget) || 0) - (Number(overallBudget.totalSpent) || 0);
//
//   return (
//     <div style={{...styles.layout, background: theme.bg, color: theme.text}}>
//       <style>{`
//         @keyframes pulse {
//           0% { transform: scale(0.95); opacity: 0.5; }
//           50% { transform: scale(1.05); opacity: 1; }
//           100% { transform: scale(0.95); opacity: 0.5; }
//         }
//       `}</style>
//
//       <Sidebar />
//       <main style={styles.page}>
//         <div style={styles.topBar}>
//           <div>
//             <span style={{color: theme.accent, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Intelligence Dashboard</span>
//             <h1 style={styles.mainTitle}>Financial <span style={{fontWeight: 300}}>Insights</span></h1>
//           </div>
//
//           <div style={{...styles.filterCluster, background: theme.card, borderColor: theme.border}}>
//             <select value={category} onChange={(e) => setCategory(e.target.value)} style={{...styles.minimalSelect, color: theme.text}}>
//               {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//             </select>
//             <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{...styles.minimalSelect, color: theme.text}}>
//               {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
//                 <option key={i} value={i + 1}>{m}</option>
//               ))}
//             </select>
//             <button onClick={fetchAnalytics} style={styles.actionBtn}>Update View</button>
//           </div>
//         </div>
//
//         {errorMessage && <div style={styles.errorToast}>{errorMessage}</div>}
//
//         {loading ? (
//           <div style={styles.loaderWrap}><div style={styles.pulse}></div></div>
//         ) : (
//           <div style={styles.dashboardGrid}>
//             <div style={{...styles.card, background: theme.card, borderColor: theme.border, gridColumn: "span 1"}}>
//               <div style={styles.cardHead}>
//                 <h3 style={styles.cardLabel}>Cash Flow Dynamics</h3>
//                 <div style={{display:'flex', gap: '10px'}}>
//                     <div style={{fontSize: '0.7rem', color: '#10b981'}}>● Income</div>
//                     <div style={{fontSize: '0.7rem', color: '#f43f5e'}}>● Expense</div>
//                 </div>
//               </div>
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={incomeExpenseChart} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
//                   <XAxis dataKey="name" hide />
//                   <YAxis hide />
//                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', background: theme.bg, border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.2)'}} />
//                   <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={60} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//
//             <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
//               <h3 style={styles.cardLabel}>Spending by Category</h3>
//               <ResponsiveContainer width="100%" height={220}>
//                 <PieChart>
//                   <Pie data={categoryData} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={80} paddingAngle={5}>
//                     {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div style={styles.legendGrid}>
//                 {categoryData.slice(0, 3).map((item, i) => (
//                     <div key={i} style={styles.legendItem}>
//                         <div style={{...styles.dot, background: COLORS[i]}}></div>
//                         <span style={{fontSize: '0.75rem', color: theme.subText}}>{item.category}</span>
//                     </div>
//                 ))}
//               </div>
//             </div>
//
//             <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
//                 <h3 style={styles.cardLabel}>Liquidity Status</h3>
//                 <div style={styles.statusDisplay}>
//                     <div style={styles.bigStat}>
//                         <span style={{color: theme.subText, fontSize: '0.8rem'}}>Monthly Left</span>
//                         <h2 style={{fontSize: '1.8rem', margin: '5px 0'}}>₹{remainingBudget.toLocaleString()}</h2>
//                     </div>
//                     <div style={{...styles.pill, background: remainingBudget < 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', color: remainingBudget < 0 ? '#f43f5e' : '#10b981'}}>
//                         {remainingBudget < 0 ? 'Overspent' : 'Safe to spend'}
//                     </div>
//                 </div>
//                 <div style={styles.linearTrack}>
//                     <div style={{...styles.linearFill, width: `${Math.min((overallBudget.totalSpent/(overallBudget.totalBudget || 1))*100, 100)}%`, background: theme.accent}} />
//                 </div>
//                 <div style={{display:'flex', justifyContent:'space-between', marginTop: '10px', fontSize: '0.7rem', color: theme.subText}}>
//                     <span>Spent: ₹{overallBudget.totalSpent}</span>
//                     <span>Cap: ₹{overallBudget.totalBudget}</span>
//                 </div>
//             </div>
//
//             <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
//               <h3 style={styles.cardLabel}>Growth Targets</h3>
//               <div style={styles.scrollList}>
//                 {savingsGoals.length === 0 ? <p style={{color: theme.subText, fontSize: '0.8rem'}}>Zero active targets.</p> :
//                   savingsGoals.map((goal) => (
//                     <div key={goal.id} style={styles.goalRow}>
//                       <div style={styles.goalInfo}>
//                         <span style={{fontSize: '0.85rem'}}>{goal.name}</span>
//                         <span style={{color: theme.accent}}>{((goal.savedAmount/goal.targetAmount)*100).toFixed(0)}%</span>
//                       </div>
//                       <div style={styles.miniTrack}>
//                         <div style={{ ...styles.miniFill, width: `${(goal.savedAmount/goal.targetAmount)*100}%` }} />
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>
//
//             <div style={{ ...styles.card, background: theme.card, borderColor: theme.border, gridColumn: "1 / -1" }}>
//               <h3 style={styles.cardLabel}>Budget Efficiency (Allocated vs. Actual)</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={budgetData}>
//                   <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: theme.subText, fontSize: 12}} />
//                   <Tooltip contentStyle={{background: theme.bg, borderRadius: '12px'}} />
//                   <Bar dataKey="limitAmount" name="Budgeted" fill={isDark ? "#334155" : "#cbd5e1"} radius={[5, 5, 0, 0]} barSize={20} />
//                   <Bar dataKey="spentAmount" name="Utilized" fill={theme.accent} radius={[5, 5, 0, 0]} barSize={20} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
//
// const styles = {
//   layout: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
//   page: { flex: 1, padding: "40px", overflowY: "auto" },
//   topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" },
//   mainTitle: { fontSize: "2.2rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" },
//   filterCluster: { display: "flex", alignItems: "center", gap: "15px", padding: "8px 15px", borderRadius: "16px", border: "1px solid" },
//   minimalSelect: { background: "transparent", border: "none", fontSize: "0.9rem", fontWeight: "600", outline: "none", cursor: "pointer" },
//   actionBtn: { padding: "10px 20px", borderRadius: "12px", border: "none", background: "#6366f1", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)" },
//   dashboardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" },
//   card: { padding: "28px", borderRadius: "24px", border: "1px solid", backdropFilter: "blur(10px)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" },
//   cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   cardLabel: { fontSize: "0.9rem", fontWeight: "700", margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 },
//   statusDisplay: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   pill: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800' },
//   linearTrack: { height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' },
//   linearFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease-in-out' },
//   scrollList: { maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' },
//   goalRow: { marginBottom: '18px' },
//   goalInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' },
//   miniTrack: { height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' },
//   miniFill: { height: '100%', background: '#10b981', borderRadius: '4px' },
//   legendGrid: { display: 'flex', gap: '15px', marginTop: '15px', justifyContent: 'center' },
//   legendItem: { display: 'flex', alignItems: 'center', gap: '5px' },
//   dot: { width: '8px', height: '8px', borderRadius: '50%' },
//   loaderWrap: { height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
//   pulse: { width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.5s infinite ease-in-out' },
//   errorToast: { padding: '15px', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', border: '1px solid #fee2e2', marginBottom: '20px' }
// };



// import React, { useEffect, useState, useContext, useCallback } from "react";
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
//   LineChart, Line, Legend
// } from "recharts";
// import api from "../api/axiosClient";
// import { AuthContext } from "../context/AuthContext";
// import Sidebar, { useDarkMode } from "../components/Sidebar";
//
// const COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
// const CATEGORIES = ["All", "Food", "Rent", "Transport", "Shopping", "Entertainment", "Others"];
//
// export default function Analytics() {
//   const { isDark } = useDarkMode();
//   const { loading: authLoading, user } = useContext(AuthContext);
//
//   const [category, setCategory] = useState("All");
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year] = useState(new Date().getFullYear());
//
//   const [incomeExpense, setIncomeExpense] = useState({ income: 0, expense: 0 });
//   const [categoryData, setCategoryData] = useState([]);
//   const [budgetData, setBudgetData] = useState([]);
//   const [overallBudget, setOverallBudget] = useState({ totalBudget: 0, totalSpent: 0 });
//   const [savingsGoals, setSavingsGoals] = useState([]);
//
//   // AI Insights State
//   const [showAIInsights, setShowAIInsights] = useState(false);
//   const [aiInsights, setAIInsights] = useState(null);
//   const [aiLoading, setAILoading] = useState(false);
//
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//
//   const currentUserId = user?.id || user?.userId || user?._id;
//
//   const theme = {
//     bg: isDark ? "#0f172a" : "#f8fafc",
//     card: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)",
//     text: isDark ? "#f8fafc" : "#0f172a",
//     subText: isDark ? "#94a3b8" : "#64748b",
//     border: isDark ? "#334155" : "#e2e8f0",
//     accent: "#6366f1",
//     grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
//     success: "#10b981",
//     warning: "#f59e0b",
//     danger: "#ef4444"
//   };
//
//   const fetchAnalytics = useCallback(async () => {
//     if (authLoading || !currentUserId) return;
//
//     setLoading(true);
//     setErrorMessage("");
//
//     const params = {
//       userId: currentUserId,
//       month,
//       year,
//       category: category === "All" ? null : category
//     };
//
//     try {
//       const [ieRes, catRes, budRes, overallRes, savingsRes] = await Promise.all([
//         api.get("/analytics/income-expense", { params }),
//         api.get("/analytics/category-expense", { params }),
//         api.get("/analytics/budget-vs-spent", { params }),
//         api.get("/analytics/overall-budget", { params }),
//         api.get("/analytics/savings-progress", { params: { userId: currentUserId } })
//       ]);
//
//       setIncomeExpense(ieRes.data || { income: 0, expense: 0 });
//       setCategoryData(Array.isArray(catRes.data) ? catRes.data : []);
//       setBudgetData(Array.isArray(budRes.data) ? budRes.data : []);
//       setOverallBudget(overallRes.data || { totalBudget: 0, totalSpent: 0 });
//       setSavingsGoals(Array.isArray(savingsRes.data) ? savingsRes.data : []);
//     } catch (err) {
//       console.error("Analytics Fetch Error:", err);
//       setErrorMessage("Data synchronization failed.");
//     } finally {
//       setLoading(false);
//     }
//   }, [month, year, category, currentUserId, authLoading]);
//
//   const fetchAIInsights = async () => {
//     if (!currentUserId) return;
//
//     setAILoading(true);
//     try {
//       const response = await api.get("/analytics/smart-insights", {
//         params: { userId: currentUserId, month, year }
//       });
//       setAIInsights(response.data);
//       setShowAIInsights(true);
//     } catch (err) {
//       console.error("AI Insights Error:", err);
//       setErrorMessage("Failed to load AI insights.");
//     } finally {
//       setAILoading(false);
//     }
//   };
//
//   useEffect(() => {
//     if (!authLoading && currentUserId) {
//       fetchAnalytics();
//     }
//   }, [currentUserId, authLoading, fetchAnalytics]);
//
//   const incomeExpenseChart = [
//     { name: "Total Revenue", value: Number(incomeExpense.income) || 0, fill: "#10b981" },
//     { name: "Total Outflow", value: Number(incomeExpense.expense) || 0, fill: "#f43f5e" }
//   ];
//
//   const remainingBudget = (Number(overallBudget.totalBudget) || 0) - (Number(overallBudget.totalSpent) || 0);
//
//   const getPriorityColor = (priority) => {
//     switch(priority) {
//       case "High": return theme.danger;
//       case "Medium": return theme.warning;
//       case "Low": return theme.success;
//       default: return theme.subText;
//     }
//   };
//
//   const getPatternIcon = (pattern) => {
//     switch(pattern) {
//       case "Increasing": return "📈";
//       case "Decreasing": return "📉";
//       case "Stable": return "➡️";
//       default: return "📊";
//     }
//   };
//
//   return (
//     <div style={{...styles.layout, background: theme.bg, color: theme.text}}>
//       <style>{`
//         @keyframes pulse {
//           0% { transform: scale(0.95); opacity: 0.5; }
//           50% { transform: scale(1.05); opacity: 1; }
//           100% { transform: scale(0.95); opacity: 0.5; }
//         }
//         @keyframes slideIn {
//           from { transform: translateX(100%); opacity: 0; }
//           to { transform: translateX(0); opacity: 1; }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .ai-panel {
//           animation: slideIn 0.3s ease-out;
//         }
//         .insight-card {
//           animation: fadeIn 0.5s ease-out;
//         }
//       `}</style>
//
//       <Sidebar />
//       <main style={styles.page}>
//         <div style={styles.topBar}>
//           <div>
//             <span style={{color: theme.accent, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Intelligence Dashboard</span>
//             <h1 style={styles.mainTitle}>Financial <span style={{fontWeight: 300}}>Insights</span></h1>
//           </div>
//
//           <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
//             <div style={{...styles.filterCluster, background: theme.card, borderColor: theme.border}}>
//               <select value={category} onChange={(e) => setCategory(e.target.value)} style={{...styles.minimalSelect, color: theme.text}}>
//                 {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//               </select>
//               <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{...styles.minimalSelect, color: theme.text}}>
//                 {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
//                   <option key={i} value={i + 1}>{m}</option>
//                 ))}
//               </select>
//               <button onClick={fetchAnalytics} style={styles.actionBtn}>Update View</button>
//             </div>
//
//             <button
//               onClick={fetchAIInsights}
//               disabled={aiLoading}
//               style={{
//                 ...styles.aiButton,
//                 background: showAIInsights ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                 cursor: aiLoading ? 'not-allowed' : 'pointer',
//                 opacity: aiLoading ? 0.7 : 1
//               }}
//             >
//               {aiLoading ? '🤖 Analyzing...' : showAIInsights ? '✨ Hide AI Insights' : '🧠 AI Insights'}
//             </button>
//           </div>
//         </div>
//
//         {errorMessage && <div style={styles.errorToast}>{errorMessage}</div>}
//
//         {loading ? (
//           <div style={styles.loaderWrap}><div style={styles.pulse}></div></div>
//         ) : (
//           <div style={{display: 'flex', gap: '25px'}}>
//             {/* Main Dashboard */}
//             <div style={{flex: showAIInsights ? '0 0 60%' : '1'}}>
//               <div style={styles.dashboardGrid}>
//                 <div style={{...styles.card, background: theme.card, borderColor: theme.border, gridColumn: "span 1"}}>
//                   <div style={styles.cardHead}>
//                     <h3 style={styles.cardLabel}>Cash Flow Dynamics</h3>
//                     <div style={{display:'flex', gap: '10px'}}>
//                         <div style={{fontSize: '0.7rem', color: '#10b981'}}>● Income</div>
//                         <div style={{fontSize: '0.7rem', color: '#f43f5e'}}>● Expense</div>
//                     </div>
//                   </div>
//                   <ResponsiveContainer width="100%" height={220}>
//                     <BarChart data={incomeExpenseChart} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
//                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
//                       <XAxis dataKey="name" hide />
//                       <YAxis hide />
//                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', background: theme.bg, border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.2)'}} />
//                       <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={60} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//
//                 <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
//                   <h3 style={styles.cardLabel}>Spending by Category</h3>
//                   <ResponsiveContainer width="100%" height={220}>
//                     <PieChart>
//                       <Pie data={categoryData} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={80} paddingAngle={5}>
//                         {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                   <div style={styles.legendGrid}>
//                     {categoryData.slice(0, 3).map((item, i) => (
//                         <div key={i} style={styles.legendItem}>
//                             <div style={{...styles.dot, background: COLORS[i]}}></div>
//                             <span style={{fontSize: '0.75rem', color: theme.subText}}>{item.category}</span>
//                         </div>
//                     ))}
//                   </div>
//                 </div>
//
//                 <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
//                     <h3 style={styles.cardLabel}>Liquidity Status</h3>
//                     <div style={styles.statusDisplay}>
//                         <div style={styles.bigStat}>
//                             <span style={{color: theme.subText, fontSize: '0.8rem'}}>Monthly Left</span>
//                             <h2 style={{fontSize: '1.8rem', margin: '5px 0'}}>₹{remainingBudget.toLocaleString()}</h2>
//                         </div>
//                         <div style={{...styles.pill, background: remainingBudget < 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', color: remainingBudget < 0 ? '#f43f5e' : '#10b981'}}>
//                             {remainingBudget < 0 ? 'Overspent' : 'Safe to spend'}
//                         </div>
//                     </div>
//                     <div style={styles.linearTrack}>
//                         <div style={{...styles.linearFill, width: `${Math.min((overallBudget.totalSpent/(overallBudget.totalBudget || 1))*100, 100)}%`, background: theme.accent}} />
//                     </div>
//                     <div style={{display:'flex', justifyContent:'space-between', marginTop: '10px', fontSize: '0.7rem', color: theme.subText}}>
//                         <span>Spent: ₹{overallBudget.totalSpent}</span>
//                         <span>Cap: ₹{overallBudget.totalBudget}</span>
//                     </div>
//                 </div>
//
//                 <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
//                   <h3 style={styles.cardLabel}>Growth Targets</h3>
//                   <div style={styles.scrollList}>
//                     {savingsGoals.length === 0 ? <p style={{color: theme.subText, fontSize: '0.8rem'}}>Zero active targets.</p> :
//                       savingsGoals.map((goal) => (
//                         <div key={goal.id} style={styles.goalRow}>
//                           <div style={styles.goalInfo}>
//                             <span style={{fontSize: '0.85rem'}}>{goal.name}</span>
//                             <span style={{color: theme.accent}}>{((goal.savedAmount/goal.targetAmount)*100).toFixed(0)}%</span>
//                           </div>
//                           <div style={styles.miniTrack}>
//                             <div style={{ ...styles.miniFill, width: `${(goal.savedAmount/goal.targetAmount)*100}%` }} />
//                           </div>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 </div>
//
//                 <div style={{ ...styles.card, background: theme.card, borderColor: theme.border, gridColumn: "1 / -1" }}>
//                   <h3 style={styles.cardLabel}>Budget Efficiency (Allocated vs. Actual)</h3>
//                   <ResponsiveContainer width="100%" height={250}>
//                     <BarChart data={budgetData}>
//                       <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: theme.subText, fontSize: 12}} />
//                       <Tooltip contentStyle={{background: theme.bg, borderRadius: '12px'}} />
//                       <Bar dataKey="limitAmount" name="Budgeted" fill={isDark ? "#334155" : "#cbd5e1"} radius={[5, 5, 0, 0]} barSize={20} />
//                       <Bar dataKey="spentAmount" name="Utilized" fill={theme.accent} radius={[5, 5, 0, 0]} barSize={20} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//
//             {/* AI Insights Panel */}
//             {showAIInsights && aiInsights && (
//               <div className="ai-panel" style={{...styles.aiPanel, background: theme.card, borderColor: theme.border}}>
//                 <div style={styles.aiHeader}>
//                   <div>
//                     <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: '800'}}>🤖 AI Insights</h2>
//                     <p style={{color: theme.subText, fontSize: '0.8rem', margin: '5px 0 0 0'}}>Powered by Smart Analytics</p>
//                   </div>
//                   <button onClick={() => setShowAIInsights(false)} style={styles.closeBtn}>✕</button>
//                 </div>
//
//                 <div style={styles.aiContent}>
//                   {/* Spending Pattern */}
//                   {aiInsights.spendingPattern && (
//                     <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
//                       <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
//                         <span style={{fontSize: '2rem'}}>{getPatternIcon(aiInsights.spendingPattern.pattern)}</span>
//                         <div>
//                           <h4 style={{margin: 0, fontSize: '0.9rem', color: theme.subText}}>Spending Pattern</h4>
//                           <h3 style={{margin: '5px 0 0 0', fontSize: '1.3rem'}}>{aiInsights.spendingPattern.pattern}</h3>
//                         </div>
//                       </div>
//                       <p style={{fontSize: '0.85rem', color: theme.text, lineHeight: '1.6'}}>{aiInsights.spendingPattern.insight}</p>
//                       <div style={{marginTop: '15px', padding: '12px', background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)', borderRadius: '8px'}}>
//                         <div style={{fontSize: '0.75rem', color: theme.subText, marginBottom: '5px'}}>Top Category</div>
//                         <div style={{display: 'flex', justifyContent: 'space-between'}}>
//                           <span style={{fontWeight: '700'}}>{aiInsights.spendingPattern.topCategory}</span>
//                           <span style={{color: theme.accent, fontWeight: '700'}}>₹{aiInsights.spendingPattern.topCategoryAmount.toLocaleString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//
//                   {/* Expense Forecast */}
//                   {aiInsights.expenseForecast && (
//                     <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
//                       <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>📊 Next Month Forecast</h4>
//                       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
//                         <div>
//                           <div style={{fontSize: '0.75rem', color: theme.subText}}>Predicted Expense</div>
//                           <h2 style={{fontSize: '1.8rem', margin: '5px 0', color: theme.accent}}>₹{aiInsights.expenseForecast.predictedNextMonthExpense.toLocaleString()}</h2>
//                         </div>
//                         <div style={{textAlign: 'right'}}>
//                           <div style={{fontSize: '0.75rem', color: theme.subText}}>Confidence</div>
//                           <div style={{fontSize: '1.2rem', fontWeight: '700', color: theme.success}}>{aiInsights.expenseForecast.confidenceLevel}%</div>
//                         </div>
//                       </div>
//                       <div style={{...styles.pill, background: 'rgba(99, 102, 241, 0.1)', color: theme.accent, justifyContent: 'center'}}>
//                         Trend: {aiInsights.expenseForecast.trend}
//                       </div>
//                     </div>
//                   )}
//
//                   {/* Savings Recommendations */}
//                   {aiInsights.savingsRecommendations && aiInsights.savingsRecommendations.length > 0 && (
//                     <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
//                       <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>💡 Savings Opportunities</h4>
//                       {aiInsights.savingsRecommendations.map((rec, idx) => (
//                         <div key={idx} style={{marginBottom: '15px', padding: '12px', background: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', borderLeft: `3px solid ${getPriorityColor(rec.priority)}`}}>
//                           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
//                             <span style={{fontWeight: '700', fontSize: '0.85rem'}}>{rec.category}</span>
//                             <span style={{...styles.priorityBadge, background: getPriorityColor(rec.priority), color: '#fff'}}>{rec.priority}</span>
//                           </div>
//                           <p style={{fontSize: '0.8rem', color: theme.subText, margin: '0 0 8px 0', lineHeight: '1.5'}}>{rec.recommendation}</p>
//                           <div style={{fontSize: '0.9rem', color: theme.success, fontWeight: '700'}}>Save up to ₹{rec.potentialSavings.toLocaleString()}</div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//
//                   {/* Anomalies */}
//                   {aiInsights.anomalies && aiInsights.anomalies.length > 0 && (
//                     <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
//                       <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>⚠️ Unusual Activity Detected</h4>
//                       {aiInsights.anomalies.map((anomaly, idx) => (
//                         <div key={idx} style={{marginBottom: '12px', padding: '12px', background: anomaly.type === 'Unusual Spike' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '8px'}}>
//                           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
//                             <span style={{fontWeight: '700', fontSize: '0.85rem'}}>{anomaly.category}</span>
//                             <span style={{fontSize: '0.75rem', color: anomaly.type === 'Unusual Spike' ? theme.danger : theme.success}}>{anomaly.type}</span>
//                           </div>
//                           <p style={{fontSize: '0.75rem', color: theme.subText, margin: '5px 0', lineHeight: '1.4'}}>{anomaly.description}</p>
//                           <div style={{fontSize: '0.85rem', fontWeight: '700', color: anomaly.type === 'Unusual Spike' ? theme.danger : theme.success}}>
//                             {anomaly.type === 'Unusual Spike' ? '↑' : '↓'} {anomaly.deviationPercentage.toFixed(1)}% deviation
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
//
// const styles = {
//   layout: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
//   page: { flex: 1, padding: "40px", overflowY: "auto" },
//   topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: 'wrap', gap: '20px' },
//   mainTitle: { fontSize: "2.2rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" },
//   filterCluster: { display: "flex", alignItems: "center", gap: "15px", padding: "8px 15px", borderRadius: "16px", border: "1px solid" },
//   minimalSelect: { background: "transparent", border: "none", fontSize: "0.9rem", fontWeight: "600", outline: "none", cursor: "pointer" },
//   actionBtn: { padding: "10px 20px", borderRadius: "12px", border: "none", background: "#6366f1", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)" },
//   aiButton: { padding: "12px 24px", borderRadius: "16px", border: "none", color: "#fff", fontWeight: "800", fontSize: "0.9rem", boxShadow: "0 8px 20px rgba(245, 87, 108, 0.4)", transition: 'all 0.3s ease' },
//   dashboardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" },
//   card: { padding: "28px", borderRadius: "24px", border: "1px solid", backdropFilter: "blur(10px)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" },
//   cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   cardLabel: { fontSize: "0.9rem", fontWeight: "700", margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 },
//   statusDisplay: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
//   pill: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center' },
//   linearTrack: { height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' },
//   linearFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease-in-out' },
//   scrollList: { maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' },
//   goalRow: { marginBottom: '18px' },
//   goalInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' },
//   miniTrack: { height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' },
//   miniFill: { height: '100%', background: '#10b981', borderRadius: '4px' },
//   legendGrid: { display: 'flex', gap: '15px', marginTop: '15px', justifyContent: 'center' },
//   legendItem: { display: 'flex', alignItems: 'center', gap: '5px' },
//   dot: { width: '8px', height: '8px', borderRadius: '50%' },
//   loaderWrap: { height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
//   pulse: { width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.5s infinite ease-in-out' },
//   errorToast: { padding: '15px', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', border: '1px solid #fee2e2', marginBottom: '20px' },
//
//   // AI Insights Panel Styles
//   aiPanel: {
//     flex: '0 0 38%',
//     border: '1px solid',
//     borderRadius: '24px',
//     padding: '28px',
//     maxHeight: 'calc(100vh - 140px)',
//     overflowY: 'auto',
//     boxShadow: "0 10px 40px -5px rgba(0,0,0,0.1)"
//   },
//   aiHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: '25px',
//     paddingBottom: '20px',
//     borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
//   },
//   closeBtn: {
//     background: 'rgba(239, 68, 68, 0.1)',
//     border: 'none',
//     borderRadius: '50%',
//     width: '32px',
//     height: '32px',
//     cursor: 'pointer',
//     fontSize: '1.2rem',
//     color: '#ef4444',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   aiContent: { display: 'flex', flexDirection: 'column', gap: '20px' },
//   insightCard: {
//     padding: '20px',
//     borderRadius: '16px',
//     border: '1px solid rgba(99, 102, 241, 0.1)',
//     boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//   },
//   priorityBadge: {
//     padding: '3px 10px',
//     borderRadius: '12px',
//     fontSize: '0.7rem',
//     fontWeight: '800'
//   }
// };







import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import api from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import Sidebar, { useDarkMode } from "../components/Sidebar";

const COLORS = ["#8B5CF6", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
const CATEGORIES = ["All", "Food", "Rent", "Transport", "Shopping", "Entertainment", "Others"];

export default function Analytics() {
  const { isDark } = useDarkMode();
  const { loading: authLoading, user } = useContext(AuthContext);

  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year] = useState(new Date().getFullYear());

  const [incomeExpense, setIncomeExpense] = useState({ income: 0, expense: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [overallBudget, setOverallBudget] = useState({ totalBudget: 0, totalSpent: 0 });
  const [savingsGoals, setSavingsGoals] = useState([]);

  // AI Insights State
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAIInsights] = useState(null);
  const [geminiInsights, setGeminiInsights] = useState(null);
  const [aiLoading, setAILoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gemini'); // 'smart' or 'gemini'

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUserId = user?.id || user?.userId || user?._id;

  const theme = {
    bg: isDark ? "#0f172a" : "#f8fafc",
    card: isDark ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.9)",
    text: isDark ? "#f8fafc" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#334155" : "#e2e8f0",
    accent: "#6366f1",
    grid: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444"
  };

  const fetchAnalytics = useCallback(async () => {
    if (authLoading || !currentUserId) return;

    setLoading(true);
    setErrorMessage("");

    const params = {
      userId: currentUserId,
      month,
      year,
      category: category === "All" ? null : category
    };

    try {
      const [ieRes, catRes, budRes, overallRes, savingsRes] = await Promise.all([
        api.get("/analytics/income-expense", { params }),
        api.get("/analytics/category-expense", { params }),
        api.get("/analytics/budget-vs-spent", { params }),
        api.get("/analytics/overall-budget", { params }),
        api.get("/analytics/savings-progress", { params: { userId: currentUserId } })
      ]);

      setIncomeExpense(ieRes.data || { income: 0, expense: 0 });
      setCategoryData(Array.isArray(catRes.data) ? catRes.data : []);
      setBudgetData(Array.isArray(budRes.data) ? budRes.data : []);
      setOverallBudget(overallRes.data || { totalBudget: 0, totalSpent: 0 });
      setSavingsGoals(Array.isArray(savingsRes.data) ? savingsRes.data : []);
    } catch (err) {
      console.error("Analytics Fetch Error:", err);
      setErrorMessage("Data synchronization failed.");
    } finally {
      setLoading(false);
    }
  }, [month, year, category, currentUserId, authLoading]);

  const fetchAIInsights = async () => {
    if (!currentUserId) return;

    setAILoading(true);
    setErrorMessage("");
    try {
      const [smartRes, geminiRes] = await Promise.all([
        api.get("/analytics/smart-insights", {
          params: { userId: currentUserId, month, year }
        }),
        api.get("/analytics/gemini-insights", {
          params: { userId: currentUserId, month, year }
        })
      ]);

      setAIInsights(smartRes.data);
      setGeminiInsights(geminiRes.data);
      setShowAIInsights(true);
    } catch (err) {
      console.error("AI Insights Error:", err);
      setErrorMessage("Failed to load AI insights. Please check your Gemini API key.");
    } finally {
      setAILoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && currentUserId) {
      fetchAnalytics();
    }
  }, [currentUserId, authLoading, fetchAnalytics]);

  const incomeExpenseChart = [
    { name: "Total Revenue", value: Number(incomeExpense.income) || 0, fill: "#10b981" },
    { name: "Total Outflow", value: Number(incomeExpense.expense) || 0, fill: "#f43f5e" }
  ];

  const remainingBudget = (Number(overallBudget.totalBudget) || 0) - (Number(overallBudget.totalSpent) || 0);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "High": return theme.danger;
      case "Medium": return theme.warning;
      case "Low": return theme.success;
      default: return theme.subText;
    }
  };

  const getPatternIcon = (pattern) => {
    switch(pattern) {
      case "Increasing": return "📈";
      case "Decreasing": return "📉";
      case "Stable": return "➡️";
      default: return "📊";
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.danger;
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  return (
    <div style={{...styles.layout, background: theme.bg, color: theme.text}}>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ai-panel {
          animation: slideIn 0.3s ease-out;
        }
        .insight-card {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <Sidebar />
      <main style={styles.page}>
        <div style={styles.topBar}>
          <div>
            <span style={{color: theme.accent, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Intelligence Dashboard</span>
            <h1 style={styles.mainTitle}>Financial <span style={{fontWeight: 300}}>Insights</span></h1>
          </div>

          <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
            <div style={{...styles.filterCluster, background: theme.card, borderColor: theme.border}}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{...styles.minimalSelect, color: theme.text}}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{...styles.minimalSelect, color: theme.text}}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
              <button onClick={fetchAnalytics} style={styles.actionBtn}>Update View</button>
            </div>

            <button
              onClick={fetchAIInsights}
              disabled={aiLoading}
              style={{
                ...styles.aiButton,
                background: showAIInsights
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                cursor: aiLoading ? 'not-allowed' : 'pointer',
                opacity: aiLoading ? 0.7 : 1
              }}
            >
              {aiLoading ? (
                <>🤖 Analyzing...</>
              ) : showAIInsights ? (
                <>✨ Hide AI Insights</>
              ) : (
                <>🧠 Gemini AI Insights</>
              )}
            </button>
          </div>
        </div>

        {errorMessage && <div style={styles.errorToast}>{errorMessage}</div>}

        {loading ? (
          <div style={styles.loaderWrap}><div style={styles.pulse}></div></div>
        ) : (
          <div style={{display: 'flex', gap: '25px'}}>
            {/* Main Dashboard */}
            <div style={{flex: showAIInsights ? '0 0 58%' : '1', transition: 'all 0.3s ease'}}>
              <div style={styles.dashboardGrid}>
                <div style={{...styles.card, background: theme.card, borderColor: theme.border, gridColumn: "span 1"}}>
                  <div style={styles.cardHead}>
                    <h3 style={styles.cardLabel}>Cash Flow Dynamics</h3>
                    <div style={{display:'flex', gap: '10px'}}>
                        <div style={{fontSize: '0.7rem', color: '#10b981'}}>● Income</div>
                        <div style={{fontSize: '0.7rem', color: '#f43f5e'}}>● Expense</div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={incomeExpenseChart} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', background: theme.bg, border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.2)'}} />
                      <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
                  <h3 style={styles.cardLabel}>Spending by Category</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={80} paddingAngle={5}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={styles.legendGrid}>
                    {categoryData.slice(0, 3).map((item, i) => (
                        <div key={i} style={styles.legendItem}>
                            <div style={{...styles.dot, background: COLORS[i]}}></div>
                            <span style={{fontSize: '0.75rem', color: theme.subText}}>{item.category}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
                    <h3 style={styles.cardLabel}>Liquidity Status</h3>
                    <div style={styles.statusDisplay}>
                        <div style={styles.bigStat}>
                            <span style={{color: theme.subText, fontSize: '0.8rem'}}>Monthly Left</span>
                            <h2 style={{fontSize: '1.8rem', margin: '5px 0'}}>₹{remainingBudget.toLocaleString()}</h2>
                        </div>
                        <div style={{...styles.pill, background: remainingBudget < 0 ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', color: remainingBudget < 0 ? '#f43f5e' : '#10b981'}}>
                            {remainingBudget < 0 ? 'Overspent' : 'Safe to spend'}
                        </div>
                    </div>
                    <div style={styles.linearTrack}>
                        <div style={{...styles.linearFill, width: `${Math.min((overallBudget.totalSpent/(overallBudget.totalBudget || 1))*100, 100)}%`, background: theme.accent}} />
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', marginTop: '10px', fontSize: '0.7rem', color: theme.subText}}>
                        <span>Spent: ₹{overallBudget.totalSpent}</span>
                        <span>Cap: ₹{overallBudget.totalBudget}</span>
                    </div>
                </div>

                <div style={{...styles.card, background: theme.card, borderColor: theme.border}}>
                  <h3 style={styles.cardLabel}>Growth Targets</h3>
                  <div style={styles.scrollList}>
                    {savingsGoals.length === 0 ? <p style={{color: theme.subText, fontSize: '0.8rem'}}>Zero active targets.</p> :
                      savingsGoals.map((goal) => (
                        <div key={goal.id} style={styles.goalRow}>
                          <div style={styles.goalInfo}>
                            <span style={{fontSize: '0.85rem'}}>{goal.name}</span>
                            <span style={{color: theme.accent}}>{((goal.savedAmount/goal.targetAmount)*100).toFixed(0)}%</span>
                          </div>
                          <div style={styles.miniTrack}>
                            <div style={{ ...styles.miniFill, width: `${(goal.savedAmount/goal.targetAmount)*100}%` }} />
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div style={{ ...styles.card, background: theme.card, borderColor: theme.border, gridColumn: "1 / -1" }}>
                  <h3 style={styles.cardLabel}>Budget Efficiency (Allocated vs. Actual)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={budgetData}>
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: theme.subText, fontSize: 12}} />
                      <Tooltip contentStyle={{background: theme.bg, borderRadius: '12px'}} />
                      <Bar dataKey="limitAmount" name="Budgeted" fill={isDark ? "#334155" : "#cbd5e1"} radius={[5, 5, 0, 0]} barSize={20} />
                      <Bar dataKey="spentAmount" name="Utilized" fill={theme.accent} radius={[5, 5, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI Insights Panel */}
            {showAIInsights && (aiInsights || geminiInsights) && (
              <div className="ai-panel" style={{...styles.aiPanel, background: theme.card, borderColor: theme.border}}>
                <div style={styles.aiHeader}>
                  <div>
                    <h2 style={{margin: 0, fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                      🤖 AI Financial Advisor
                    </h2>
                    <p style={{color: theme.subText, fontSize: '0.75rem', margin: '5px 0 0 0'}}>Powered by Gemini AI & Smart Analytics</p>
                  </div>
                  <button onClick={() => setShowAIInsights(false)} style={styles.closeBtn}>✕</button>
                </div>

                {/* Tab Switcher */}
                <div style={styles.tabContainer}>
                  <button
                    onClick={() => setActiveTab('gemini')}
                    style={{
                      ...styles.tab,
                      background: activeTab === 'gemini' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                      color: activeTab === 'gemini' ? '#fff' : theme.text
                    }}
                  >
                    ✨ Gemini AI
                  </button>
                  <button
                    onClick={() => setActiveTab('smart')}
                    style={{
                      ...styles.tab,
                      background: activeTab === 'smart' ? theme.accent : 'transparent',
                      color: activeTab === 'smart' ? '#fff' : theme.text
                    }}
                  >
                    📊 Analytics
                  </button>
                </div>

                <div style={styles.aiContent}>
                  {/* Gemini AI Insights */}
                  {activeTab === 'gemini' && geminiInsights && (
                    <>
                      {/* Financial Health Score */}
                      <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                        <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>💯 Financial Health Score</h4>
                        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                          <div style={{position: 'relative', width: '100px', height: '100px'}}>
                            <svg width="100" height="100" style={{transform: 'rotate(-90deg)'}}>
                              <circle cx="50" cy="50" r="40" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="8" fill="none" />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke={getHealthScoreColor(geminiInsights.financialHealthScore)}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${(geminiInsights.financialHealthScore / 100) * 251.2} 251.2`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                              <div style={{fontSize: '1.5rem', fontWeight: '800', color: getHealthScoreColor(geminiInsights.financialHealthScore)}}>
                                {geminiInsights.financialHealthScore}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div style={{fontSize: '1.2rem', fontWeight: '700', color: getHealthScoreColor(geminiInsights.financialHealthScore)}}>
                              {getHealthScoreLabel(geminiInsights.financialHealthScore)}
                            </div>
                            <p style={{fontSize: '0.75rem', color: theme.subText, margin: '5px 0 0 0', lineHeight: '1.5'}}>
                              {geminiInsights.healthAssessment}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      {geminiInsights.recommendations && geminiInsights.recommendations.length > 0 && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>💡 AI Recommendations</h4>
                          {geminiInsights.recommendations.map((rec, idx) => (
                            <div key={idx} style={{
                              marginBottom: '12px',
                              padding: '12px',
                              background: isDark ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                              borderRadius: '8px',
                              borderLeft: `3px solid ${theme.accent}`
                            }}>
                              <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                                <span style={{fontSize: '1.2rem', marginTop: '2px'}}>
                                  {idx === 0 ? '🎯' : idx === 1 ? '💰' : idx === 2 ? '📈' : '✅'}
                                </span>
                                <p style={{fontSize: '0.85rem', color: theme.text, margin: 0, lineHeight: '1.6'}}>{rec}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Spending Habits Analysis */}
                      {geminiInsights.spendingHabitsAnalysis && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>🔍 Spending Habits</h4>
                          <p style={{fontSize: '0.85rem', color: theme.text, lineHeight: '1.7', margin: 0}}>
                            {geminiInsights.spendingHabitsAnalysis}
                          </p>
                        </div>
                      )}

                      {/* Long-term Strategy */}
                      {geminiInsights.longTermStrategy && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>🚀 Long-term Strategy</h4>
                          <p style={{fontSize: '0.85rem', color: theme.text, lineHeight: '1.7', margin: 0}}>
                            {geminiInsights.longTermStrategy}
                          </p>
                        </div>
                      )}

                      {/* Personalized Tips */}
                      {geminiInsights.personalizedTips && geminiInsights.personalizedTips.length > 0 && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>💎 Pro Tips</h4>
                          {geminiInsights.personalizedTips.map((tip, idx) => (
                            <div key={idx} style={{
                              padding: '10px 12px',
                              background: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              fontSize: '0.8rem',
                              color: theme.text,
                              lineHeight: '1.5'
                            }}>
                              {tip}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Smart Analytics Insights */}
                  {activeTab === 'smart' && aiInsights && (
                    <>
                      {/* Spending Pattern */}
                      {aiInsights.spendingPattern && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                            <span style={{fontSize: '2rem'}}>{getPatternIcon(aiInsights.spendingPattern.pattern)}</span>
                            <div>
                              <h4 style={{margin: 0, fontSize: '0.9rem', color: theme.subText}}>Spending Pattern</h4>
                              <h3 style={{margin: '5px 0 0 0', fontSize: '1.3rem'}}>{aiInsights.spendingPattern.pattern}</h3>
                            </div>
                          </div>
                          <p style={{fontSize: '0.85rem', color: theme.text, lineHeight: '1.6'}}>{aiInsights.spendingPattern.insight}</p>
                          <div style={{marginTop: '15px', padding: '12px', background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)', borderRadius: '8px'}}>
                            <div style={{fontSize: '0.75rem', color: theme.subText, marginBottom: '5px'}}>Top Category</div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span style={{fontWeight: '700'}}>{aiInsights.spendingPattern.topCategory}</span>
                              <span style={{color: theme.accent, fontWeight: '700'}}>₹{aiInsights.spendingPattern.topCategoryAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expense Forecast */}
                      {aiInsights.expenseForecast && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>📊 Next Month Forecast</h4>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                            <div>
                              <div style={{fontSize: '0.75rem', color: theme.subText}}>Predicted Expense</div>
                              <h2 style={{fontSize: '1.8rem', margin: '5px 0', color: theme.accent}}>₹{aiInsights.expenseForecast.predictedNextMonthExpense.toLocaleString()}</h2>
                            </div>
                            <div style={{textAlign: 'right'}}>
                              <div style={{fontSize: '0.75rem', color: theme.subText}}>Confidence</div>
                              <div style={{fontSize: '1.2rem', fontWeight: '700', color: theme.success}}>{aiInsights.expenseForecast.confidenceLevel}%</div>
                            </div>
                          </div>
                          <div style={{...styles.pill, background: 'rgba(99, 102, 241, 0.1)', color: theme.accent, justifyContent: 'center'}}>
                            Trend: {aiInsights.expenseForecast.trend}
                          </div>
                        </div>
                      )}

                      {/* Savings Recommendations */}
                      {aiInsights.savingsRecommendations && aiInsights.savingsRecommendations.length > 0 && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>💡 Savings Opportunities</h4>
                          {aiInsights.savingsRecommendations.map((rec, idx) => (
                            <div key={idx} style={{marginBottom: '15px', padding: '12px', background: isDark ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', borderLeft: `3px solid ${getPriorityColor(rec.priority)}`}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                <span style={{fontWeight: '700', fontSize: '0.85rem'}}>{rec.category}</span>
                                <span style={{...styles.priorityBadge, background: getPriorityColor(rec.priority), color: '#fff'}}>{rec.priority}</span>
                              </div>
                              <p style={{fontSize: '0.8rem', color: theme.subText, margin: '0 0 8px 0', lineHeight: '1.5'}}>{rec.recommendation}</p>
                              <div style={{fontSize: '0.9rem', color: theme.success, fontWeight: '700'}}>Save up to ₹{rec.potentialSavings.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Anomalies */}
                      {aiInsights.anomalies && aiInsights.anomalies.length > 0 && (
                        <div className="insight-card" style={{...styles.insightCard, background: theme.bg}}>
                          <h4 style={{fontSize: '0.9rem', color: theme.subText, margin: '0 0 15px 0'}}>⚠️ Unusual Activity</h4>
                          {aiInsights.anomalies.map((anomaly, idx) => (
                            <div key={idx} style={{marginBottom: '12px', padding: '12px', background: anomaly.type === 'Unusual Spike' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '8px'}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                                <span style={{fontWeight: '700', fontSize: '0.85rem'}}>{anomaly.category}</span>
                                <span style={{fontSize: '0.75rem', color: anomaly.type === 'Unusual Spike' ? theme.danger : theme.success}}>{anomaly.type}</span>
                              </div>
                              <p style={{fontSize: '0.75rem', color: theme.subText, margin: '5px 0', lineHeight: '1.4'}}>{anomaly.description}</p>
                              <div style={{fontSize: '0.85rem', fontWeight: '700', color: anomaly.type === 'Unusual Spike' ? theme.danger : theme.success}}>
                                {anomaly.type === 'Unusual Spike' ? '↑' : '↓'} {anomaly.deviationPercentage.toFixed(1)}% deviation
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  page: { flex: 1, padding: "40px", overflowY: "auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: 'wrap', gap: '20px' },
  mainTitle: { fontSize: "2.2rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" },
  filterCluster: { display: "flex", alignItems: "center", gap: "15px", padding: "8px 15px", borderRadius: "16px", border: "1px solid" },
  minimalSelect: { background: "transparent", border: "none", fontSize: "0.9rem", fontWeight: "600", outline: "none", cursor: "pointer" },
  actionBtn: { padding: "10px 20px", borderRadius: "12px", border: "none", background: "#6366f1", color: "#fff", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)" },
  aiButton: { padding: "12px 24px", borderRadius: "16px", border: "none", color: "#fff", fontWeight: "800", fontSize: "0.9rem", boxShadow: "0 8px 20px rgba(245, 87, 108, 0.4)", transition: 'all 0.3s ease' },
  dashboardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" },
  card: { padding: "28px", borderRadius: "24px", border: "1px solid", backdropFilter: "blur(10px)", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cardLabel: { fontSize: "0.9rem", fontWeight: "700", margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 },
  statusDisplay: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  pill: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center' },
  linearTrack: { height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' },
  linearFill: { height: '100%', borderRadius: '10px', transition: 'width 1s ease-in-out' },
  scrollList: { maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' },
  goalRow: { marginBottom: '18px' },
  goalInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' },
  miniTrack: { height: '6px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' },
  miniFill: { height: '100%', background: '#10b981', borderRadius: '4px' },
  legendGrid: { display: 'flex', gap: '15px', marginTop: '15px', justifyContent: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  loaderWrap: { height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pulse: { width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.5s infinite ease-in-out' },
  errorToast: { padding: '15px', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', border: '1px solid #fee2e2', marginBottom: '20px' },

  aiPanel: {
    flex: '0 0 40%',
    border: '1px solid',
    borderRadius: '24px',
    padding: '28px',
    maxHeight: 'calc(100vh - 140px)',
    overflowY: 'auto',
    boxShadow: "0 10px 40px -5px rgba(0,0,0,0.1)"
  },
  aiHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
  },
  closeBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    padding: '5px',
    background: 'rgba(0,0,0,0.02)',
    borderRadius: '12px'
  },
  tab: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  aiContent: { display: 'flex', flexDirection: 'column', gap: '20px' },
  insightCard: {
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  priorityBadge: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: '800'
  }
};





