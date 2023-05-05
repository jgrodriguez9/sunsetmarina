export const getClassSlipStatus = (status) => {
    const objAction = {
        AVAILABLE: "bg-secondary bg-soft",
        RESERVED: 'bg-success',
        BLOCKED: 'bg-danger',
        MAINTENANCE: 'bg-warning'
    }

    return objAction[status] || 'bg-info';
}