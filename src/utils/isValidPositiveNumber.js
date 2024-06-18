export const isValidPositiveNumber = (input) => {
	// Attempt to convert the input to a number
	const number = parseFloat(input);
	// Check if the conversion resulted in a valid number and if it's greater than zero
	return !isNaN(number) && number > 0;
};
