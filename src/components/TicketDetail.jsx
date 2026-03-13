import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/api";
import { PRIORITY_STYLES, STATUS_STYLES } from "../utils/CommonUtil";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import "../styles/Datatable.css";
import { createRoot } from "react-dom/client";
import LoadingSpinner from "./LoadingSpinner";

DataTable.use(DT);

const labelStyle = {
    fontSize: 12,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#8a8880",
    marginBottom: 6,
    display: "block",
};

const thStyle = {
    fontSize: 13,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#8a8880",
    fontWeight: 400,
    borderBottom: "1px solid #e2e2de",
    paddingBottom: 12,
};

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] ?? { label: status, color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" };
    return (
        <span style={{
            fontSize: 12,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: s.color,
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 2,
            padding: "3px 10px",
        }}>
            {s.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const p = PRIORITY_STYLES[priority] ?? { label: priority, color: "#8a8880", bg: "#f8f8f6", border: "#e2e2de" };
    return (
        <span style={{
            fontSize: 12,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: p.color,
            background: p.bg,
            border: `1px solid ${p.border}`,
            borderRadius: 2,
            padding: "3px 10px",
        }}>
            {p.label}
        </span>
    );
}

export default function TicketDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [logs, setLogs] = useState([]);
    const [agents, setAgents] = useState(null);

    const [assignedTo, setAssignedTo] = useState("");
    const [status, setStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    const isAdmin = user?.role === "ADMIN";
    const isAgent = user?.role === "AGENT";

    useEffect(() => {
        api.get(`/tickets/${id}`)
            .then(response => {
                const data = response.data.data;
                const ticket = data.ticket; 
                setTicket(ticket);
                setLogs(data.logHistories);
                setStatus(ticket.status);
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong",
                    text: "Failed to load ticket. Please try again later.",
                    confirmButtonColor: "#111",
                    confirmButtonText: "OK",
                }).then(result => {
                    if (result.isConfirmed) navigate(-1);
                });
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (isAdmin) {
            api.get("/users?role=AGENT")
                .then(response => setAgents(response.data.data))
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Something went wrong",
                        text: "Failed to load agent list. Please try again later.",
                        confirmButtonColor: "#111",
                        confirmButtonText: "OK",
                    });
                    console.error(error);
                });
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!assignedTo && isAdmin) {
            Swal.fire({
                icon: "warning",
                title: "Select an agent first",
                confirmButtonColor: "#111",
            });
            return;
        }

        setUpdating(true);

        try {
            const payload = {};

            if (isAdmin) {
                payload.assignedTo = assignedTo;
            }

            await api.put(`/tickets/${id}/process?role=` + user.role, payload);

            await Swal.fire({
                icon: "success",
                title: "Ticket updated",
                text: "Changes have been submitted successfully.",
                confirmButtonColor: "#111",
                confirmButtonText: "OK",
            });

            const response = await api.get(`/tickets/${id}`);
            const data = response.data.data;
            const ticket = data.ticket; 
            setTicket(ticket);
            setLogs(data.logHistories);
            setStatus(ticket.status);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: error?.response?.data?.message || "Failed to update ticket. Please try again.",
                confirmButtonColor: "#111",
                confirmButtonText: "OK",
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();
                }
            });
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    const options = {
        ordering: false,
        layout: {
            topStart: null,
            topEnd: null,
            bottomStart: null,
            bottomEnd: null
        },
        language: {
            emptyTable: "No logs yet."
        }
    };

    const columns = [
        {
            data: null,
            className: "text-center",
            sortable: false,
            render: (data, type, row, meta) =>
                `<span style="color: #8a8880; font-size: 16px;">${meta.row + meta.settings._iDisplayStart + 1}</span>`,
        },
        {
            data: "createdAt",
            width: "20%",
            render: (data) => {
                const date = new Date(data);
                return `<span style="color: #8a8880; font-size: 16px;">${date.toLocaleString("en-GB")}</span>`;
            }
        },
        {
            data: "createdBy",
            render: (data) => `<span style="font-weight: 500; color: #111; font-size: 16px;">${data}</span>`,
        },
        {
            data: "status",
            createdCell: (td, cellData) => {
                const root = createRoot(td);
                root.render(<StatusBadge status={cellData} />);
            }
        },
        {
            data: "description",
            render: (data) => `<span style="font-weight: 500; color: #111; font-size: 16px;">${data}</span>`,
        }
    ];

    if (!ticket) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="d-flex align-items-center gap-3 mb-1">
                <button onClick={() => navigate(-1)}
                    style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 13, color: "#8a8880", padding: 0,
                        letterSpacing: ".06em", textTransform: "uppercase",
                    }}>
                    ← Back
                </button>
            </div>
            <p className="text-muted mb-1" style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
                Ticket #{ticket.id}
            </p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 32, letterSpacing: "-.03em", color: "#111", marginBottom: 36 }}>
                {ticket.title}<span style={{ color: "#d04f2a" }}>.</span>
            </h2>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="card p-4 mb-4">
                        <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", marginBottom: 16 }}>
                            Description
                        </p>
                        <p style={{ fontSize: 16, color: "#111", lineHeight: 1.7, marginBottom: 0 }}>
                            {ticket.description}
                        </p>
                    </div>

                    <div className="card p-4">
                        <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", margin: 0 }}>
                            Log history
                        </p>

                        <DataTable className="table" style={{ fontSize: 14 }} data={logs} options={options} columns={columns}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>#</th>
                                    <th style={thStyle}>Timestamp</th>
                                    <th style={thStyle}>User</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Description</th>
                                </tr>
                            </thead>
                            <tbody className="align-middle"></tbody>
                        </DataTable>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card p-4">
                        <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", marginBottom: 20 }}>
                            Details
                        </p>

                        <div className="mb-4">
                            <label style={labelStyle}>Status</label>
                            <div><StatusBadge status={ticket.status} /></div>
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Priority</label>
                            <div><PriorityBadge priority={ticket.priority} /></div>
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Created by</label>
                            <p style={{ fontSize: 15, color: "#111", margin: 0 }}>
                                {ticket.createdBy?.displayName ?? "-"}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Assigned to</label>
                            {isAdmin ? (
                                <select className="form-control" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} disabled={ticket.assignedTo}>
                                    <option value="">{ticket.assignedTo?.displayName ?? "Select agent"}</option>
                                    {Object.entries(agents).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ fontSize: 15, color: ticket.assignedTo ? "#111" : "#c8c4be", margin: 0 }}>
                                    {ticket.assignedTo?.displayName ?? "Unassigned"}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Created</label>
                            <p style={{ fontSize: 14, color: "#8a8880", margin: 0 }}>
                                {new Date(ticket.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                        </div>

                        {ticket.updatedAt && (
                            <div className="mb-4">
                                <label style={labelStyle}>Last updated</label>
                                <p style={{ fontSize: 14, color: "#8a8880", margin: 0 }}>
                                    {new Date(ticket.updatedAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                                </p>
                            </div>
                        )}

                        {isAdmin || isAgent && (
                            <form onSubmit={handleUpdate}>
                                <button type="submit" className="btn btn-dark w-100"
                                    style={{ borderRadius: 2, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase" }}
                                    disabled={isAdmin ? updating || status === "IN_PROGRESS" || status === "ASSIGNED" : updating}>
                                    {updating && <span className="spinner-border spinner-border-sm me-2" />}
                                    {updating ? "Processing..." : "Process"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
