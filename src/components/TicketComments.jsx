import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function TicketComments({ ticketId, initialComments = [] }) {
    const [comments, setComments] = useState(initialComments);
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const { user } = useAuth();

    const handleAddComment = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setLoading(true);
        try {
            await api.delete(`/comments/${commentId}`);

            const response = await api.get(`/comments/${ticketId}`);
            setComments(response.data.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to delete comment",
                text: error?.response?.data?.message || "Please try again.",
                confirmButtonColor: "#111",
                confirmButtonText: "OK",
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="card p-4 mb-4">
            <p style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#8a8880", marginBottom: 16 }}>
                Comments
            </p>

            <div className="mb-4">
                {comments.length === 0 ? (
                    <p style={{ fontSize: 16, color: "#c8c4be", margin: 0 }}>No comments yet.</p>
                ) : (
                    comments.map((comment, i) => (
                        <div key={comment.id}
                            style={{
                                padding: "14px 0",
                                borderBottom: i < comments.length - 1 ? "1px solid #e2e2de" : "none",
                            }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="d-flex align-items-center gap-2">
                                    <span style={{ fontSize: 16, fontWeight: 500, color: "#111" }}>
                                        {comment.user?.username ?? "Unknown"}
                                    </span>
                                    <span style={{ fontSize: 16, color: "#8a8880" }}>
                                        {new Date(comment.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                                    </span>
                                </div>

                                {user.id === comment.user.id && (
                                    <div className="dropdown" ref={menuRef}>
                                        <span style={{ cursor: "pointer", padding: "5px" }} onClick={() => setOpenMenuId(openMenuId === comment.id ? null : comment.id)}>
                                            &#8942;
                                        </span>
                                        {openMenuId === comment.id && (
                                            <ul className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
                                                <li>
                                                    <button className="dropdown-item text-danger" 
                                                        onClick={() => { 
                                                            setOpenMenuId(null); 
                                                            handleDeleteComment(comment.id); 
                                                        }}>
                                                        {loading && <span className="spinner-border spinner-border-sm me-2" />}
                                                        {loading ? "Deleting..." : "Delete"}
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p style={{ fontSize: 16, color: "#444", margin: 0, lineHeight: 1.6 }}>
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
                        disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm me-2" />}
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
