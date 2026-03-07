import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Common.css"

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            const data = response.data.data;

            login(data.accessToken, data.user);

            if (data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-vh-100 d-flex align-items-center justify-content-center px-3">
                <div className="card p-4 p-md-5" style={{ width: "100%", maxWidth: 380 }}>
                    <div className="mb-4">
                        <div className="wordmark mb-1">CoreDesk<span className="dot">.</span></div>
                        <p className="text-muted mb-0" style={{ fontSize: 13 }}>Sign in to continue</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label text-muted" style={{ fontSize: 12 }}>EMAIL</label>
                            <input type="email" className="form-control" placeholder="you@example.com" value={email}
                                onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted" style={{ fontSize: 12 }}>PASSWORD</label>
                            <input type="password" className="form-control" placeholder="••••••••" value={password}
                                onChange={e => setPassword(e.target.value)} required />
                        </div>

                        {error && ( <p className="text-danger mb-3" style={{ fontSize: 12 }}>{error}</p> )}

                        <button type="submit" className="btn btn-dark w-100 mb-3" disabled={loading}>
                            {loading && <span className="spinner-border spinner-border-sm me-2" />}
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
};
