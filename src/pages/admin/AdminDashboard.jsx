import { getTicketRecap } from "../../api/getTicketRecap";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
    const { recap, loading } = getTicketRecap("ADMIN");

    const userRecap = [
        { label: "Total Users", value: recap?.totalUsers || "0" },
        { label: "Admins", value: recap?.admins || "0" },
        { label: "Agents", value: recap?.agents || "0" }
    ];

    const ticketRecap = [
        { label: "Open", value: recap?.open || "0" },
        { label: "In Progress", value: recap?.inProgress || "0" },
        { label: "Resolved", value: recap?.resolved || "0" },
        { label: "Closed", value: recap?.closed || "0" },
    ];

    if (loading) {
        return <LoadingSpinner /> 
    }

    return (
        <div>
            <p className="text-muted mb-1" style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
                User Recap
            </p>
            {/* User recap cards */}
            <div className="row g-4 mb-4">
                {userRecap.map(({ label, value, sub }) => (
                    <div className="col-12 col-sm-4" key={label}>
                        <div
                            className="card p-4"
                            style={{ transition: "border-color .15s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#111"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e2de"}
                        >
                            <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", marginBottom: 10 }}>
                                {label}
                            </p>
                            <p style={{ fontSize: 36, fontWeight: 600, color: "#111", marginBottom: 4 }}>
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-muted mb-1" style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
                Ticket Recap
            </p>
            {/* Ticket recap cards */}
            <div className="row g-4 mb-4">
                {ticketRecap.map(({ label, value, sub }) => (
                    <div className="col-12 col-sm-4" key={label}>
                        <div
                            className="card p-4"
                            style={{ transition: "border-color .15s" }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "#111"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e2de"}
                        >
                            <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", marginBottom: 10 }}>
                                {label}
                            </p>
                            <p style={{ fontSize: 36, fontWeight: 600, color: "#111", marginBottom: 4 }}>
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
