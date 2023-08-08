export const classBadge = value => {
    const objBadge = {
        pagado: 'success',
        pendiente: 'warning',
        cancelado: 'danger',
        UPDATE: "warning",
        CREATE: 'success',
        DELETE: 'danger',
        PAYED: 'success',
        BLOCKED: 'danger',
        RESERVED: 'success'
    }

    return objBadge[value] || 'light'
}