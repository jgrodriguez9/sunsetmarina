export const classBadge = value => {
    const objBadge = {
        pagado: 'success',
        pendiente: 'warning',
        cancelado: 'danger',
        UPDATE: "warning",
        CREATE: 'success',
        DELETE: 'danger'
    }

    return objBadge[value] || 'light'
}