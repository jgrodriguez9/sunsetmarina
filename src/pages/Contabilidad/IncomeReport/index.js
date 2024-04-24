import { useMemo } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { useDispatch } from 'react-redux';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import FormFilter from '../../../components/Common/FormFilter';
import { useState } from 'react';
import CardMain from '../../../components/Common/CardMain';
import { reportCobranza } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { addMessage } from '../../../redux/messageSlice';
import TableLoader from '../../../components/Loader/TablaLoader';
import SimpleTable from '../../../components/Tables/SimpleTable';

function IncomeReport() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [filters, setFilters] = useState([
		{
			label: 'Fecha inicio',
			field: 'startDate',
			width: 3,
			control: 'date',
			type: '',
			value: '',
			valueDate: '',
		},
		{
			label: 'Fecha fin',
			field: 'endDate',
			width: 3,
			control: 'date',
			type: '',
			value: '',
			valueDate: '',
		},
	]);

	const fireSearch = async (filts, isClean) => {
		if (isClean) {
			setItems([]);
			return;
		}
		setLoading(true);
		const activeFilters = filts
			.filter((fl) => fl.value)
			.map((field) => ({ name: field.field, value: field.value }));
		const obj = activeFilters.reduce((accumulator, value) => {
			return { ...accumulator, [value.name]: value.value };
		}, {});
		try {
			let q = Object.keys(obj)
				.map((key) => `${key}=${obj[key]}`)
				.join('&');
			const response = await reportCobranza(`?${q}`);
			console.log(response);
			setItems(response.items);
			setLoading(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setItems([]);
			setLoading(false);
		}
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Periodo',
				accessor: 'period',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Mes de pago',
				accessor: 'monthPayment',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Forma de pago',
				accessor: 'paymentMethod',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Año de pago',
				accessor: 'yearPayment',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Importe',
				accessor: 'amount',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Observación',
				accessor: 'observation',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Tipo embarcación',
				accessor: 'boatType',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Tipo rampa',
				accessor: 'ramType',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Base',
				accessor: 'base',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'IVA',
				accessor: 'iva',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Total',
				accessor: 'total',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Pago',
				accessor: 'paymentDescription',
				style: {
					width: '10%',
				},
			},
		],
		[]
	);

	const handleFilter = (
		<Row>
			<Col>
				<FormFilter
					filters={filters}
					setFilters={setFilters}
					fireSearch={fireSearch}
				/>
			</Col>
		</Row>
	);
	const carHandleEstadoCuenta = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Periodo', width: '10%' },
						{ name: 'Mes de pago', width: '10%' },
						{ name: 'Forma de pago', width: '10%' },
						{ name: 'Año de pago', width: '10%' },
						{ name: 'Importe', width: '5%' },
						{ name: 'Observación', width: '10%' },
						{ name: 'Tipo embarcación', width: '10%' },
						{ name: 'Tipo rampa', width: '10%' },
						{ name: 'Base', width: '5%' },
						{ name: 'IVA', width: '5%' },
						{ name: 'Total', width: '5%' },
						{ name: 'Pago', width: '10%' },
					]}
				/>
			</Col>
		</Row>
	) : items.length === 0 ? (
		<Row>
			<Col xs="12" xl="12">
				<p>No hay información disponible</p>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xs="12" xl="12">
				<SimpleTable columns={columns} data={items} />
			</Col>
		</Row>
	);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Ingreso'} breadcrumbItem={'Ingreso'} />

				<Row className="pb-5">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Reporte de ingresos"
							children={carHandleEstadoCuenta}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default IncomeReport;
