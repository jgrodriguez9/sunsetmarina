const getTotalChargesReduce = (slips) => {
	return slips.reduce((acc, curr) => acc + curr.reservation.totalCharges, 0);
};

const getTotalInterestReduce = (slips) => {
	return slips.reduce((acc, curr) => acc + curr.reservation.totalInterest, 0);
};

const getTotalPaymentsReduce = (slips) => {
	return slips.reduce((acc, curr) => acc + curr.reservation.totalPayments, 0);
};

const getTotalBalanceReduce = (slips) => {
	return slips.reduce(
		(acc, curr) => acc + curr.reservation.balanceCustomer,
		0
	);
};

const getSlipNames = (slips) => {
	return slips.map((it) => it.reservation.slip).join(',');
};

export {
	getTotalChargesReduce,
	getTotalInterestReduce,
	getTotalPaymentsReduce,
	getTotalBalanceReduce,
	getSlipNames,
};
