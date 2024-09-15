import Swal, { SweetAlertResult } from 'sweetalert2';

export const succesAlert = (message: string, title: string, callback?: (value: SweetAlertResult<any>) => void): void => {
    Swal.fire({
        title: title,
        text: message,
        icon: "success"
    }).then(callback);
}

export const errorAlert = (message: string, title: string): void => {
    Swal.fire({
        title: title,
        text: message,
        icon: "error"
    });
}