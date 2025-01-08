import moment from 'moment/moment';

const months = [
	{ value: 1, label: 'Enero' },
	{ value: 2, label: 'Febrero' },
	{ value: 3, label: 'Marzo' },
	{ value: 4, label: 'Abril' },
	{ value: 5, label: 'Mayo' },
	{ value: 6, label: 'Junio' },
	{ value: 7, label: 'Julio' },
	{ value: 8, label: 'Agosto' },
	{ value: 9, label: 'Septiembre' },
	{ value: 10, label: 'Octubre' },
	{ value: 11, label: 'Noviembre' },
	{ value: 12, label: 'Diciembre' },
];

const years = () => {
	const currentYear = moment().format('YYYY');
	const arrayYears = [];
	const firstYear = parseInt(currentYear) - 5;
	let i = firstYear;
	while (i <= parseInt(currentYear) + 3) {
		arrayYears.push({ value: i, label: i });
		i++;
	}

	return arrayYears;
};

const monthsOpt = [
	{ value: '01', label: 'Enero' },
	{ value: '02', label: 'Febrero' },
	{ value: '03', label: 'Marzo' },
	{ value: '04', label: 'Abril' },
	{ value: '05', label: 'Mayo' },
	{ value: '06', label: 'Junio' },
	{ value: '07', label: 'Julio' },
	{ value: '08', label: 'Agosto' },
	{ value: '09', label: 'Septiembre' },
	{ value: 10, label: 'Octubre' },
	{ value: 11, label: 'Noviembre' },
	{ value: 12, label: 'Diciembre' },
];

const yearsOpt = (fromYear) => {
	const currentYear = moment()
		.year(fromYear ?? moment().year())
		.format('YYYY');
	const arrayYears = [];
	const firstYear = parseInt(currentYear);
	let i = firstYear;
	while (i <= parseInt(currentYear) + 5) {
		arrayYears.push({ value: i, label: i });
		i++;
	}

	return arrayYears;
};

export { months, years, monthsOpt, yearsOpt };
