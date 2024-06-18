export const getTipoPago = (systemPayment) => {
	const objAction = {
		RESERVATION: 'Reservación de slip',
		BALANCE_BP: 'Abono a saldo de cliente BP',
	};

	return objAction[systemPayment] || systemPayment;
};
