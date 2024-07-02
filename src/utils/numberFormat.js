import { NumericFormat } from 'react-number-format';

export const numberFormat = (number) => {
	if (!number || number === '0') return '$0.00';
	return (
		<NumericFormat
			value={number}
			displayType="text"
			prefix="$"
			thousandSeparator={true}
			allowedDecimalSeparators={true}
			fixedDecimalScale={2}
			decimalScale={2}
		/>
	);
};
