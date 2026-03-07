const statCards = [
    { label: "Tickets", value: "284", sub: "101 done" },
];

export default function AdminDashboard() {
    return (
        <div>
            {/* Stat cards */}
            <div className="row g-4 mb-4">
                {statCards.map(({ label, value, sub }) => (
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
                            <p style={{ fontSize: 14, color: "#8a8880", marginBottom: 0 }}>
                                {sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
