import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { popupMessage } from "./Alert";

const EMPTY_FILTERS = {
    search: "",
    status: "",
    priority: "",
    createdBy: "",
    assignedTo: "",
    dateFrom: "",
    dateTo: "",
};

const displayStatus = {
    OPEN: "OPEN",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN PROGRESS",
    CONFIRMATION: "CONFIRMATION",
    REOPENED: "REOPENED",
    RESOLVED: "RESOLVED",
    CLOSED: "CLOSED",
};

const labelStyle = {
    fontSize: 12,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#8a8880",
    marginBottom: 6,
    display: "block",
};

export default function TicketFilter({ filters, onChange, onReset }) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(filters);
    const [filterOptions, setFilters] = useState(null);

    useEffect(() => {
        api.get("/tickets/filters")
            .then(response => setFilters(response.data.data))
            .catch(error => {
                popupMessage("Error", "Failed to load filters. Please try again later.");
            });
    }, []);

    const handleDraftChange = (field, value) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        onChange(draft);
        setOpen(false);
    };

    const handleReset = () => {
        setDraft(EMPTY_FILTERS);
        onReset();
    };

    const activeCount = [
        filters.search,
        filters.status,
        filters.priority,
        filters.createdBy,
        filters.assignedTo,
        filters.dateFrom,
        filters.dateTo,
    ].filter(Boolean).length;

    return (
        <div className="mb-4">
            <div className="mb-2">
                <button type="button" onClick={() => { setDraft(filters); setOpen(o => !o); }}
                    style={{
                        background: "#fff",
                        border: "1px solid #e2e2de",
                        borderRadius: 2,
                        padding: "8px 18px",
                        fontSize: 13,
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                        color: "#8a8880",
                        cursor: "pointer",
                        transition: "all .15s",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                    {open ? "▲" : "▼"}&nbsp;Filter
                    {activeCount > 0 && (
                        <span style={{
                            background: "#111",
                            color: "#fff",
                            borderRadius: 2,
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "1px 6px"
                        }}>
                            {activeCount}
                        </span>
                    )}
                </button>
            </div>

            {open && (
                <div className="card p-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-6 col-lg-4">
                            <label style={labelStyle}>Search title</label>
                            <input type="text" className="form-control" placeholder="Search by title..." value={draft.search} 
                                onChange={e => handleDraftChange("search", e.target.value)}/>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <label style={labelStyle}>Status</label>
                            <select className="form-control" value={draft.status}
                                onChange={e => handleDraftChange("status", e.target.value)}>
                                <option value="">All statuses</option>
                                {filterOptions.statuses.map(status => (
                                    <option key={status} value={status}>
                                        {displayStatus[status]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <label style={labelStyle}>Priority</label>
                            <select className="form-control" value={draft.priority}
                                onChange={e => handleDraftChange("priority", e.target.value)}>
                                <option value="">All priorities</option>
                                {filterOptions.priorities.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <label style={labelStyle}>Created by</label>
                            <select className="form-control" value={draft.createdBy}
                                onChange={e => handleDraftChange("createdBy", e.target.value)} disabled={user.role === "USER"}>
                                <option value="">{user.role === "USER" ? user.username : "All users"}</option>
                                {Object.entries(filterOptions.users).map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-4">
                            <label style={labelStyle}>Assigned to</label>
                            <select className="form-control" value={draft.assignedTo}
                                onChange={e => handleDraftChange("assignedTo", e.target.value)} disabled={user.role === "AGENT"}>
                                <option value="">{user.role === "AGENT" ? user.username : "All agents"}</option>
                                {Object.entries(filterOptions.agents).map(([id, name]) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2">
                            <label style={labelStyle}>Date from</label>
                            <input type="date" className="form-control" value={draft.dateFrom}
                                onChange={e => handleDraftChange("dateFrom", e.target.value)}/>
                        </div>

                        <div className="col-12 col-md-6 col-lg-2">
                            <label style={labelStyle}>Date to</label>
                            <input type="date" className="form-control" value={draft.dateTo}
                                onChange={e => handleDraftChange("dateTo", e.target.value)}/>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" onClick={handleReset}
                            style={{
                                background: "none",
                                border: "1px solid #e2e2de",
                                borderRadius: 2,
                                padding: "8px 20px",
                                fontSize: 13,
                                letterSpacing: ".06em",
                                textTransform: "uppercase",
                                color: "#8a8880",
                                cursor: "pointer",
                                transition: "all .15s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#d04f2a"; e.currentTarget.style.color = "#d04f2a"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e2de"; e.currentTarget.style.color = "#8a8880"; }}>
                            Reset
                        </button>
                        <button type="button" onClick={handleApply} className="btn btn-dark">
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}