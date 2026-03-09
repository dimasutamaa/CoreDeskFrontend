import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import api from "../../api/api";
import Swal from "sweetalert2";

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

export default function CreateTicket() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "LOW"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
        setError("");
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/tickets", {
                title: form.title,
                description: form.description,
                priority: form.priority,
                status: "OPEN",
                createdBy: user.id
            });

            await Swal.fire({
                icon: "success",
                title: "Ticket created!",
                text: "Your ticket has been submitted successfully.",
                confirmButtonColor: "#111",
            })

            navigate("/dashboard");
        } catch (err) {
            setError(err?.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <p className="text-muted mb-1" style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase" }}>
                New ticket
            </p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 36, letterSpacing: "-.03em", color: "#111", marginBottom: 36 }}>
                Create<span style={{ color: "#d04f2a" }}>.</span>
            </h2>

            <div className="card p-4" style={{ maxWidth: 640 }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label text-muted" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
                            Title
                        </label>
                        <input type="text" name="title" className="form-control" placeholder="Short summary of the issue" value={form.title}
                            onChange={handleChange} minLength={5} maxLength={50} required />
                        <div className="d-flex justify-content-end mt-1">
                            <span style={{ fontSize: 11, color: "#8a8880" }}>{form.title.length} / 50</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
                            Description
                        </label>
                        <textarea name="description" className="form-control" placeholder="Describe the issue in detail..." value={form.description}
                            onChange={handleChange} minLength={5} maxLength={2000} rows={5} required style={{ resize: "vertical" }} />
                        <div className="d-flex justify-content-end mt-1">
                            <span style={{ fontSize: 11, color: "#8a8880" }}>{form.description.length} / 2000</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
                            Priority
                        </label>
                        <div className="d-flex gap-2">
                            {PRIORITY_OPTIONS.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    onClick={() => setForm({ ...form, priority: option })}
                                    style={{
                                        flex: 1,
                                        padding: "10px 0",
                                        border: "1px solid",
                                        borderRadius: 2,
                                        fontSize: 13,
                                        letterSpacing: ".06em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all .15s",
                                        borderColor: form.priority === option ? "#111" : "#e2e2de",
                                        background: form.priority === option ? "#111" : "transparent",
                                        color: form.priority === option ? "#fff" : "#8a8880",
                                        fontWeight: form.priority === option ? 600 : 400,
                                    }}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="d-flex gap-3 mb-4">
                        <div style={{ flex: 1 }}>
                            <label className="form-label text-muted" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
                                Status
                            </label>
                            <div className="form-control" style={{ color: "#8a8880", background: "#f8f8f6", fontSize: 14 }}>
                                OPEN
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="form-label text-muted" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>
                                Created by
                            </label>
                            <div className="form-control" style={{ color: "#8a8880", background: "#f8f8f6", fontSize: 14 }}>
                                {user?.username ?? user?.email}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p style={{ fontSize: 13, color: "#d04f2a", marginBottom: 16 }}>{error}</p>
                    )}

                    <div className="d-flex gap-2 justify-content-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                background: "none",
                                border: "1px solid #e2e2de",
                                borderRadius: 2,
                                padding: "10px 24px",
                                fontSize: 13,
                                letterSpacing: ".06em",
                                textTransform: "uppercase",
                                color: "#8a8880",
                                cursor: "pointer",
                            }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-dark" disabled={loading}>
                            {loading && <span className="spinner-border spinner-border-sm me-2" />}
                            {loading ? "Submitting…" : "Submit ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
