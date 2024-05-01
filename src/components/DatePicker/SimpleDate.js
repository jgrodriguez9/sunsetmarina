import 'react-datepicker/dist/react-datepicker.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
//Import Flatepicker
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import { InputGroup } from 'reactstrap';

function SimpleDate({
	date,
	setDate,
	element,
	options,
	placeholder,
	onOpen = () => {},
	onClose = () => {},
	onReady = () => {},
	dateFormat = 'd-m-Y',
}) {
	return (
		<InputGroup>
			<Flatpickr
				className={`form-control d-block`}
				placeholder={placeholder ? placeholder : 'dd-MM-YYYY'}
				options={{
					altInput: true,
					altFormat: dateFormat,
					dateFormat: dateFormat,
					locale: Spanish,
					...options,
				}}
				value={date}
				onChange={(date) => setDate(date, element)}
				onOpen={onOpen}
				onClose={onClose}
				onReady={onReady}
			/>
		</InputGroup>
	);
}

export default SimpleDate;
