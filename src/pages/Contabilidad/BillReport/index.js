import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import FormFilter from '../../../components/Common/FormFilter';
import { useMemo, useState } from 'react';
import CardMain from '../../../components/Common/CardMain';
import { reportDocktaxBill } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import SimpleTable from '../../../components/Tables/SimpleTable';
import TableLoader from '../../../components/Loader/TablaLoader';

function BillReport() {
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
			const response = await reportDocktaxBill(`?${q}`);
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
				Header: 'Fecha',
				accessor: 'reservation.slip',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Horario',
				accessor: 'time',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Nombre embarcación',
				accessor: 'embarcacion',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Propietario',
				accessor: 'customer',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Tipo cambio',
				accessor: 'currencyExchange',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Pax',
				accessor: 'pax',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Efectivo MXN',
				accessor: 'mxn',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Efectivo USD',
				accessor: 'usd',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'TC',
				accessor: 'tc',
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
				Header: 'IVA',
				accessor: 'iva',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Factura',
				accessor: 'invoice',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Impuesto muelle',
				accessor: 'pier',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'T.C.',
				accessor: 'tcc',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'IVA',
				accessor: 'iva2',
				style: {
					width: '5%',
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
						{ name: 'No. Slip', width: '10%' },
						{ name: 'Horario', width: '10%' },
						{ name: 'Nombre embarcación', width: '15%' },
						{ name: 'Propietario', width: '15%' },
						{ name: 'Tipo cambio', width: '5%' },
						{ name: 'Pax', width: '5%' },
						{ name: 'Efectivo MXN', width: '5%' },
						{ name: 'Efectivo USD', width: '5%' },
						{ name: 'TC', width: '5%' },
						{ name: 'Total', width: '5%' },
						{ name: 'IVA', width: '5%' },
						{ name: 'Factura', width: '5%' },
						{ name: 'Impuesto muelle', width: '5%' },
						{ name: 'T.C.', width: '5%' },
						{ name: 'IVA', width: '5%' },
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
				<Breadcrumbs title={'Cobranza'} breadcrumbItem={'Cobranza'} />

				<Row className="pb-2">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Reporte cobranza impuesto de muelle"
							children={carHandleEstadoCuenta}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default BillReport;
