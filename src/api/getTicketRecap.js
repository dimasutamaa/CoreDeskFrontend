import { useEffect, useState } from "react"
import api from "./api";
import { popupMessage } from "../components/Alert";

export const getTicketRecap = (role) => {
    const [recap, setRecap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        api.get("/users/recap")
            .then(response => setRecap(response.data.data))
            .catch(error => {
                popupMessage("Error", "Failed to fetch recap data. Please try again later.");
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false };
    }, []);

    return { recap, loading };
}
