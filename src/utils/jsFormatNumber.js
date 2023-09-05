const jsFormatNumber = (number) => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	});
	if (number) return formatter.format(number);
	return '$0.00';
};

export default jsFormatNumber;
