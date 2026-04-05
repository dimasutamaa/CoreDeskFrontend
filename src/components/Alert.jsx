import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import "../styles/Alert.css";

const popup = withReactContent(Swal);

export const popupMessage = async (title, text, callback) => {
    const result = await popup.fire({
        title: title || "Title",
        text: text || "Text",
        confirmButtonColor: "#111",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false
    });

    if (result.isConfirmed && typeof callback === "function") {
        await callback();
    }
};

export const popupConfirm = async (title, text, callback) => {
    const result = await popup.fire({
        title: title || "Title",
        text: text || "Text",
        showCancelButton: true,
        confirmButtonColor: "#111",
        confirmButtonText: "Process",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: true
    });

    if (result.isConfirmed) {
        await callback();
    }
}