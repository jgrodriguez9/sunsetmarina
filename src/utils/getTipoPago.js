export const getTipoPago = (systemPayment) => {
    const objAction = {
        RESERVATION: "Reservación de slip",
    }

    return objAction[systemPayment] || systemPayment;
}