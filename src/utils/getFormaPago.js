export const getFormaPago = (paymentForm) => {
    const objAction = {
        CASH: "Efectivo",
    }

    return objAction[paymentForm] || paymentForm;
}