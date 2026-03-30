import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

export default function TicketComments({ ticketId, initialComments = [] }) {
    const [comments, setComments] = useState(initialComments);
    const [commentInput, setCommentInput] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleAddComment = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/comments/${ticketId}`, {
                message: commentInput,
            });
            setCommentInput("");

            const response = await api.get(`/comments/${ticketId}`);
            setComments(response.data.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to post comment",
                text: error?.response?.data?.message || "Please try again.",
                confirmButtonColor: "#111",
                confirmButtonText: "OK",
            });
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card p-4 mb-4">
            <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", marginBottom: 16 }}>
                Comments
            </p>

            <div className="mb-4">
                {comments.length === 0 ? (
                    <p style={{ fontSize: 14, color: "#c8c4be", margin: 0 }}>No comments yet.</p>
                ) : (
                    comments.map((comment, i) => (
                        <div key={comment.id}
                            style={{
                                padding: "14px 0",
                                borderBottom: i < comments.length - 1 ? "1px solid #e2e2de" : "none",
                            }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>
                                    {comment.user?.username ?? "Unknown"}
                                </span>
                                <span style={{ fontSize: 12, color: "#8a8880" }}>
                                    {new Date(comment.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                                </span>
                            </div>
                            <p style={{ fontSize: 15, color: "#444", margin: 0, lineHeight: 1.6 }}>
                                {comment.message}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleAddComment}>
                <div className="mb-2">
                    <textarea className="form-control" rows={3} placeholder="Write a comment..." value={commentInput}
                        onChange={e => setCommentInput(e.target.value)} style={{ resize: "none", fontSize: 14 }} required />
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-dark"
                        style={{ borderRadius: 2, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase" }}
                        disabled={submitting}>
                        {submitting && <span className="spinner-border spinner-border-sm me-2" />}
                        {submitting ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
