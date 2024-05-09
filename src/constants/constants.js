export const slipStatus = (status) => {
	const obj = {
		AVAILABLE: 'Disponible',
		RESERVED: 'Reservado',
		BLOCKED: 'Bloqueado',
		MAINTENANCE: 'Mantenimiento',
	};
	return obj[status] || status;
};

export const paymentFrequencyOpt = [
	{ value: 'SEMANAL', label: 'SEMANAL' },
	{ value: 'QUINCENAL', label: 'QUINCENAL' },
	{ value: 'MENSUAL', label: 'MENSUAL' },
	{ value: 'SEMESTRAL', label: 'SEMESTRAL' },
	{ value: 'ANUAL', label: 'ANUAL' },
];
