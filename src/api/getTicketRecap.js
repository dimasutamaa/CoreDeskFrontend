import { useEffect, useState } from "react"
import api from "./api";
import Swal from "sweetalert2";

export const getTicketRecap = (role) => {
    const [recap, setRecap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        api.get("/users/recap?role=" + role)
            .then(response => setRecap(response.data.data))
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch recap data. Please try again later.",
                    confirmButtonColor: "#111"
                });
                console.error("Error fetching recap data: ", error);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false };
    }, []);

    return { recap, loading };
}
