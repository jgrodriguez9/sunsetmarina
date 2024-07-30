export const getTipoPago = (systemPayment) => {
	const objAction = {
		RESERVATION: 'Reservación de slip',
		BALANCE_BP: 'Abono a saldo de cliente BP',
		BALANCE_RESERVATION: 'Abono a saldo de reservación',
	};

	return objAction[systemPayment] || systemPayment;
};
