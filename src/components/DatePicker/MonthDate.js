import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

function MonthDate({ date, setDate }) {
	return <DatePicker selected={date} onChange={(date) => setDate(date)} />;
}

export default MonthDate;
