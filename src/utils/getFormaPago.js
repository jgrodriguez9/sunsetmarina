export const getFormaPago = (paymentForm) => {
	const objAction = {
		CASH: 'Efectivo',
		CHECK: 'Cheque',
		WIRE_TRANSFER: 'Transferencia electrónica',
		DEBIT_CARD: 'Tarjeta de débito',
		CREDIT_CARD: 'Tarjeta de crédito',
	};

	return objAction[paymentForm] || paymentForm;
};
