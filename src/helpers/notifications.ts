import Swal from "sweetalert2"

export const sendNotification = (message: string) => {

    Swal.fire({
        title: "Nueva notificación",
        text: message,
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "Ok"
    })

}