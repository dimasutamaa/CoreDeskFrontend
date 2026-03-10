import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "../../styles/Common.css";

const USER_NAV = [
    { label: "Overview",  to: "/dashboard" },
    { label: "My Tickets",  to: "/dashboard/tickets" },
    { label: "Create Ticket",  to: "/dashboard/tickets/create" },
];

const ADMIN_NAV = [
    { label: "Overview",  to: "/admin" },
    { label: "Tickets",  to: "/admin/tickets" },
];

// Sidebar
function Sidebar({ nav, collapsed, onCollapse }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate("/login"); };

    return (
        <aside style={{
            width: collapsed ? 64 : 260,
            minHeight: "100vh",
            background: "#fff",
            borderRight: "1px solid #e2e2de",
            display: "flex",
            flexDirection: "column",
            transition: "width .2s ease",
            overflow: "hidden",
            flexShrink: 0,
        }}>

            {/* Brand */}
            <div className="d-flex align-items-center justify-content-between" style={{
                padding: "0 20px",
                borderBottom: "1px solid #e2e2de",
                height: 72,
            }}>
                {!collapsed && <span className="wordmark" style={{ fontSize: 24 }}>CoreDesk<span className="dot">.</span></span>}
                <button
                    onClick={onCollapse}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        padding: 6, marginLeft: collapsed ? "auto" : 0,
                        color: "#8a8880", fontSize: 18, lineHeight: 1,
                    }}
                    title={collapsed ? "Expand" : "Collapse"}
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            {/* Nav links */}
            <nav className="flex-grow-1 py-3">
                {nav.map(({ label, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            padding: "13px 20px",
                            fontSize: 15,
                            color: isActive ? "#111" : "#8a8880",
                            fontWeight: isActive ? 600 : 400,
                            textDecoration: "none",
                            borderLeft: isActive ? "3px solid #d04f2a" : "3px solid transparent",
                            background: isActive ? "#f8f8f6" : "transparent",
                            whiteSpace: "nowrap",
                            transition: "color .15s, background .15s",
                        })}
                    >
                        {!collapsed && label}
                        {collapsed && (
                            <span title={label} style={{ fontSize: 13, color: "inherit" }}>
                                {label[0]}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Sign out */}
            <div style={{ padding: "20px", borderTop: "1px solid #e2e2de" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        background: "none",
                        border: "1px solid #e2e2de",
                        borderRadius: 2,
                        padding: collapsed ? "10px 0" : "10px 16px",
                        fontSize: 13,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "#8a8880",
                        cursor: "pointer",
                        transition: "border-color .15s, color .15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e2de"; e.currentTarget.style.color = "#8a8880"; }}
                    title="Sign out"
                >
                    {collapsed ? "↩" : "Sign out"}
                </button>
            </div>
        </aside>
    );
}

// Header
function Header({ title }) {
    const { user } = useAuth();

    return (
        <header style={{
            height: 72,
            borderBottom: "1px solid #e2e2de",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 36px",
            flexShrink: 0,
        }}>
            <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 20,
                letterSpacing: "-.02em",
                color: "#111",
                margin: 0,
            }}>
                {title}
            </h1>

            <div style={{ fontSize: 14, color: "#8a8880", display: "flex", alignItems: "center", gap: 10 }}>
                {user?.name ?? user?.email}
                {user?.role && (
                    <span style={{
                        fontSize: 11,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        background: "#f8f8f6",
                        border: "1px solid #e2e2de",
                        borderRadius: 2,
                        padding: "3px 8px",
                        color: "#8a8880",
                    }}>
                        {user.role}
                    </span>
                )}
            </div>
        </header>
    );
}

// Layout
export default function DashboardLayout({ role = "USER", pageTitle = "Overview" }) {
    const [collapsed, setCollapsed] = useState(false);
    const nav = role === "ADMIN" ? ADMIN_NAV : USER_NAV;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8f8f6" }}>
            <Sidebar
                nav={nav}
                collapsed={collapsed}
                onCollapse={() => setCollapsed(c => !c)}
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Header title={pageTitle} />
                <main style={{ flex: 1, padding: "40px 36px", overflowY: "auto" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}