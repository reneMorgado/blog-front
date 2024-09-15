export const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
}