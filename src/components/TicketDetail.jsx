import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/api";
import { PRIORITY_STYLES, STATUS_STYLES } from "../utils/CommonUtil";
import LoadingSpinner from "./LoadingSpinner";
import LogHistory from "./LogHistory";
import Badge from "./Badge";
import TicketComments from "./TicketComments";

const labelStyle = {
    fontSize: 12,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: "#8a8880",
    marginBottom: 6,
    display: "block",
};

const StatusBadge = ({ status }) => (
    <Badge value={status} stylesMap={STATUS_STYLES} />
);

const PriorityBadge = ({ priority }) => (
    <Badge value={priority} stylesMap={PRIORITY_STYLES} />
);

export default function TicketDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [logs, setLogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [agents, setAgents] = useState(null);

    const [assignedTo, setAssignedTo] = useState("");
    const [status, setStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    const isAdmin = user?.role === "ADMIN";
    const isAgent = user?.role === "AGENT";

    const getTicketEndpoint = isAgent ? `/tickets/${id}?role=AGENT` : isAdmin ? `/tickets/${id}` : `/tickets/${id}?role=USER`;

    useEffect(() => {
        api.get(getTicketEndpoint)
            .then(response => {
                const data = response.data.data;
                const ticket = data.ticket;
                setTicket(ticket);
                setComments(data.comments);
                setLogs(data.logHistories);
                setStatus(ticket.status);
                setAssignedTo(ticket.assignedTo);
            })
            .catch(error => {
                const response = error.response;
                let errorMsg = null;
                
                if (response.status === 403) {
                    errorMsg = response.data?.message;
                }

                Swal.fire({
                    icon: "error",
                    title: "Something went wrong",
                    text: errorMsg ?? "Failed to load ticket. Please try again later.",
                    confirmButtonColor: "#111",
                    confirmButtonText: "OK",
                }).then(result => {
                    if (result.isConfirmed) navigate(-1);
                });
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

            const response = await api.get(getTicketEndpoint);
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

                    <TicketComments ticketId={ticket.id} initialComments={comments} />
                    <LogHistory logs={logs} />
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
                            <label style={labelStyle}>SLA</label>
                            <p style={{ fontSize: 15, color: "#8a8880", margin: 0 }}>
                                {new Date(ticket.slaDate).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Created by</label>
                            <p style={{ fontSize: 15, color: "#111", margin: 0 }}>
                                {ticket.createdBy?.username ?? "-"}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Assigned to</label>
                            {isAdmin ? (
                                <select className="form-control" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} disabled={ticket.assignedTo}>
                                    <option value="">{ticket.assignedTo?.username ?? "Select agent"}</option>
                                    {Object.entries(agents).map(([id, name]) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p style={{ fontSize: 15, color: ticket.assignedTo ? "#111" : "#c8c4be", margin: 0 }}>
                                    {ticket.assignedTo?.username ?? "Unassigned"}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label style={labelStyle}>Created</label>
                            <p style={{ fontSize: 15, color: "#8a8880", margin: 0 }}>
                                {new Date(ticket.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                            </p>
                        </div>

                        {ticket.updatedAt && (
                            <div className="mb-4">
                                <label style={labelStyle}>Last updated</label>
                                <p style={{ fontSize: 15, color: "#8a8880", margin: 0 }}>
                                    {new Date(ticket.updatedAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                                </p>
                            </div>
                        )}

                        {(isAdmin || isAgent) && (
                            <form onSubmit={handleUpdate}>
                                <button type="submit" className="btn btn-dark w-100"
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
