
import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";

// --- DARK MODE CONTEXT ---
const DarkModeContext = createContext({ isDark: false, toggleDark: () => {} });

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? "#0a0a0c" : "#f0f2f5";
    document.body.style.color = isDark ? "#ffffff" : "#1a1a1a";
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);

export default function Sidebar() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const { alertCount, refreshAlertCount } = useAuth();
  const { isDark, toggleDark } = useDarkMode();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // Fallback Logic for User Info
 const displayName = user?.fullName || user?.name || user?.username || user?.email?.split('@')[0] || "Guest User";
 const displayEmail = user?.email || "";

  const [showLogout, setShowLogout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Persistence for Profile Picture - Tied to User ID
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user?.id) {
      const savedPic = localStorage.getItem(`profile_pic_${user.id}`);
      setPreviewImage(savedPic);
    } else {
      setPreviewImage(null);
    }
  }, [user?.id]);

  const getStyles = (baseStyles) => ({ ...baseStyles, ...(isDark && baseStyles.dark) });
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && user?.id) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setPreviewImage(base64Image);
        localStorage.setItem(`profile_pic_${user.id}`, base64Image);
        if (updateUser) updateUser({ ...user, profileImage: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoutConfirm = () => {
    setPreviewImage(null);
    logout();
    setShowLogout(false);
  };

  return (
    <>
      <div style={getStyles(styles.sidebar)}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", paddingBottom: "20px" }}>
          <div style={getStyles(styles.logo)}>
             <span style={styles.logoIcon}>BW</span> BudgetWise
          </div>

          <div style={getStyles(styles.profileCard)}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />

            <div style={styles.avatarWrapper} onClick={handleImageClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              <img
                src={previewImage || user?.profileImage || defaultAvatar}
                style={styles.profileImg}
                alt="Profile"
              />
              <div style={{ ...styles.editOverlay, opacity: isHovered ? 1 : 0 }}>Edit</div>
              <div style={styles.onlineStatus} />
            </div>

            <div style={styles.userInfo}>
              <div style={getStyles(styles.userName)}>{displayName}</div>
              <div style={getStyles(styles.userEmail)}>{displayEmail}</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <SidebarLink to="/dashboard" icon="📉" label="Dashboard" active={location.pathname === "/dashboard"} isDark={isDark} />
            <SidebarLink to="/transactions" icon="💳" label="Transactions" active={location.pathname === "/transactions"} isDark={isDark} />
            <SidebarLink to="/budget" icon="💎" label="Budget" active={location.pathname === "/budget"} isDark={isDark} />
            <SidebarLink to="/savings" icon="🛡️" label="Savings" active={location.pathname === "/savings"} isDark={isDark} />
            <SidebarLink to="/analytics" icon="⚡" label="Analytics" active={location.pathname === "/analytics"} isDark={isDark} />
            <div onClick={refreshAlertCount} style={{cursor: 'pointer'}}>
               <SidebarLink to="/alerts" icon="🔔" active={location.pathname === "/alerts"} isDark={isDark} label={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span>Alerts</span>
                  {alertCount > 0 && <span style={styles.badge}>{alertCount}</span>}
                </div>
              } />
            </div>
          </nav>
        </div>

        <div style={styles.sidebarBottom}>
          <button style={getStyles(styles.footerBtn)} onClick={() => setShowSettings(true)}>⚙️ System Settings</button>
          <button style={styles.logoutBtn} onClick={() => setShowLogout(true)}>🚪 Logout</button>
        </div>
      </div>

      {showSettings && (
        <div style={styles.overlay} onClick={() => setShowSettings(false)}>
          <div style={getStyles(styles.modal)} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Preferences</h2>
            <div style={getStyles(styles.settingRow)}>
                <span>Night Mode</span>
                <label style={styles.switch}>
                  <input type="checkbox" checked={isDark} onChange={toggleDark} style={{ display: "none" }} />
                  <span style={{ ...styles.slider, background: isDark ? "linear-gradient(45deg, #6366f1, #a855f7)" : "#e2e8f0" }}>
                    <span style={{ ...styles.sliderCircle, left: isDark ? "22px" : "2px" }} />
                  </span>
                </label>
            </div>
            <button style={styles.closeBtn} onClick={() => setShowSettings(false)}>Done</button>
          </div>
        </div>
      )}

      {showLogout && (
        <div style={styles.overlay} onClick={() => setShowLogout(false)}>
          <div style={getStyles(styles.modal)} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, marginBottom: 10 }}>Sign Out?</h2>
            <p style={{ color: '#64748b', marginBottom: 25 }}>You'll need to login again to access your dashboard.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={styles.closeBtn} onClick={() => setShowLogout(false)}>Stay</button>
              <button style={styles.confirmLogoutBtn} onClick={handleLogoutConfirm}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarLink({ to, icon, label, active, isDark }) {
  const activeStyle = {
    background: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
    boxShadow: isDark ? "0 4px 15px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.05)",
    color: "#6366f1",
    transform: "translateX(5px)"
  };

  return (
    <Link to={to} style={{
      ...styles.navItem,
      textDecoration: 'none',
      ...(active ? activeStyle : { color: isDark ? "#94a3b8" : "#64748b" })
    }}>
      <span style={{ marginRight: 12, fontSize: 18 }}>{icon}</span>
      {label}
    </Link>
  );
}

const styles = {
  sidebar: { width: 280, background: "#f8f9fc", padding: "30px 20px", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, boxSizing: "border-box", boxShadow: "4px 0 20px rgba(0,0,0,0.02)", dark: { background: "#121214", boxShadow: "4px 0 20px rgba(0,0,0,0.4)" } },
  logo: { fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginBottom: 35, display: 'flex', alignItems: 'center', gap: 12, dark: { color: "#fff" } },
  logoIcon: { background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", padding: "6px 10px", borderRadius: 10, fontSize: 14 },
  profileCard: { display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", background: "#fff", borderRadius: "24px", marginBottom: "30px", textAlign: 'center', boxShadow: "0 10px 25px rgba(0,0,0,0.03)", dark: { background: "#1c1c1f", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" } },
  avatarWrapper: { position: "relative", width: 75, height: 75, cursor: 'pointer', borderRadius: '22px', marginBottom: 12, overflow: 'hidden', border: "3px solid #6366f1" },
  profileImg: { width: "100%", height: "100%", objectFit: "cover" },
  editOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', textTransform: 'uppercase' },
  onlineStatus: { position: "absolute", bottom: 5, right: 5, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" },
  userInfo: { marginBottom: 10 },
  userName: { fontSize: "16px", fontWeight: 700, color: "#1e293b", dark: { color: "#fff" } },
  userEmail: { fontSize: "12px", color: "#94a3b8", marginTop: 4 },
  nav: { display: "flex", flexDirection: "column", gap: 6 },
  navItem: { padding: "14px 16px", borderRadius: "16px", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
  badge: { background: "#f43f5e", color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: "11px", fontWeight: "800" },
  sidebarBottom: { borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 20, display: "flex", flexDirection: "column", gap: 10, marginTop: 'auto' },
  footerBtn: { padding: "12px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: "600", background: "transparent", color: "#64748b", textAlign: 'left', fontSize: "14px", transition: "0.2s", dark: { color: "#94a3b8" } },
  logoutBtn: { width: '100%', padding: "14px", background: "rgba(244, 63, 94, 0.08)", color: "#f43f5e", border: "none", borderRadius: 14, fontWeight: "700", cursor: "pointer", textAlign: 'left', fontSize: "14px", display: 'flex', alignItems: 'center', transition: "0.2s" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  modal: { background: "#fff", padding: "32px", borderRadius: "32px", width: "360px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", dark: { background: "#1c1c1f", color: "#fff" } },
  settingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px", borderRadius: 18, background: "#f8f9fc", marginBottom: 24, dark: { background: "#2a2a2e" } },
  switch: { position: "relative", width: 48, height: 26, cursor: "pointer" },
  slider: { position: "absolute", inset: 0, borderRadius: 24, transition: "0.3s" },
  sliderCircle: { position: "absolute", top: 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" },
  closeBtn: { width: "100%", padding: "14px", borderRadius: 14, border: "1px solid #e2e8f0", background: "none", fontWeight: "700", cursor: "pointer", color: '#64748b', transition: "0.2s" },
  confirmLogoutBtn: { flex: 1, padding: "14px", background: "#f43f5e", color: "#fff", border: "none", borderRadius: 14, fontWeight: "700", cursor: "pointer", transition: "0.2s" }
};