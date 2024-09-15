import Swal from "sweetalert2"
import { useNavigate } from 'react-router-dom';

export const sendNotification = (message: string, navigate: Function) => {

    Swal.fire({
        title: "Nueva notificación",
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ver publicación",
        cancelButtonText: "Ok"
    }).then((result) => {
        if (result.isConfirmed) {
            navigate()
        }
    });
}