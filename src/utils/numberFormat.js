import { NumericFormat } from 'react-number-format';

export const numberFormat = (number) => {
	if (number) return '$0.00';
	return (
		<NumericFormat
			value={number >= 0 ? number : ''}
			displayType="text"
			prefix="$"
			thousandSeparator={true}
			allowedDecimalSeparators={true}
			fixedDecimalScale={2}
			decimalScale={2}
		/>
	);
};
