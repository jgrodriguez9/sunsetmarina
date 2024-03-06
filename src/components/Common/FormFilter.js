import moment from 'moment/moment';
import { Button, Col, Row } from 'reactstrap';
import ControlFilter from './ControlFilter';

const getValueByControl = (item) => {
	switch (item.control) {
		case 'select':
			return item.valueSelect ?? '';
		case 'date':
			return item.value;
		default:
			return item.value;
	}
};

export default function FormFilter({
	filters,
	setFilters,
	fireSearch,
	validate = [],
}) {
	const handleChange = (fieldId, value, controlType) => {
		const filterCopy = [...filters];
		const idx = filterCopy.findIndex((f) => f.field === fieldId);
		switch (controlType) {
			case 'input':
				filterCopy[idx].value = value;
				break;
			case 'checkbox':
				if (value) {
					filterCopy[idx].value = value;
				} else {
					filterCopy[idx].value = '';
				}
				break;
			case 'date':
				if (value.length > 0) {
					filterCopy[idx].value = moment(value[0]).format(
						'DD/MM/YYYY'
					);
				} else {
					filterCopy[idx].value = '';
				}
				filterCopy[idx].valueDate = value;
				break;
			case 'select':
				if (value) {
					filterCopy[idx].value = value.value;
				} else {
					filterCopy[idx].value = '';
				}
				filterCopy[idx].valueSelect = value;
				break;
			default:
				break;
		}

		setFilters(filterCopy);
	};

	const handleFilter = () => {
		if (validate.length > 0) {
			let valid = true;
			validate.forEach((elem) => {
				const item = filters.find((it) => it.field === elem);
				if (item !== undefined) {
					const value = getValueByControl(item);
					if (value === '') {
						valid = false;
					}
				}
			});
			if (valid) {
				fireSearch(filters);
			}
		} else {
		}
	};

	const handleCleanFilter = () => {
		const cleanFilter = filters.map((f) => ({
			...f,
			value: '',
			valueDate: '',
			valueSelect: '',
		}));
		setFilters(cleanFilter);
		fireSearch(cleanFilter, true);
	};

	return (
		<>
			<Row>
				{filters.map((filter) => (
					<Col xs="12" md={filter.width} key={filter.field}>
						<ControlFilter
							field={filter}
							handleChange={handleChange}
						/>
					</Col>
				))}
			</Row>
			<hr />
			<Row>
				<Col xs="12" md="12">
					<div className="d-flex">
						<Button
							color="primary"
							size="sm"
							outline
							onClick={handleFilter}
							className="me-2"
						>
							<i className="fas fa-search" /> Buscar
						</Button>
						<Button
							color="danger"
							size="sm"
							outline
							onClick={handleCleanFilter}
						>
							<i className="fas fa-trash" /> Limpiar Filtros
						</Button>
					</div>
				</Col>
			</Row>
		</>
	);
}
