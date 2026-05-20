import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function SessionExpiredHandler() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        let isShowing = false;

        const handleUnauthorized = async () => {
            if (isShowing) return;

            isShowing = true;

            await Swal.fire({
                title: "Unauthorized",
                text: "Invalid or expired session. Please log in again to continue.",
                confirmButtonColor: "#111",
                confirmButtonText: "Login",
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            logout();

            navigate("/login", { replace: true });

            isShowing = false;
        };

        window.addEventListener("unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("unauthorized", handleUnauthorized);
        };
    }, [logout, navigate]);

    return null;
}
