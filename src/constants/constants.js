export const slipStatus = (status) => {
    const obj = {
        AVAILABLE: "Disponible",
        RESERVED: 'Reservado',
        BLOCKED: 'Bloqueado',
        MAINTENANCE: 'Mantenimiento'
    }
    return obj[status] || status
}