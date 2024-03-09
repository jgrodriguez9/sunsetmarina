import { Button, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import FormFilter from '../../../components/Common/FormFilter';
import { useMemo, useState } from 'react';
import CardMain from '../../../components/Common/CardMain';
import { useDispatch } from 'react-redux';
import { reportDocktaxBill } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { addMessage } from '../../../redux/messageSlice';
import TableLoader from '../../../components/Loader/TablaLoader';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { numberFormat } from '../../../utils/numberFormat';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';

function DockTaxBill() {
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
			const itemsParse = response.items.map((it) => ({
				...it,
				IVA2: it.IVA2.toFixed(2),
				totalIVABase: it.totalIVABase.toFixed(2),
			}));
			setItems(itemsParse);
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
				accessor: 'date',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Horario',
				accessor: 'hour',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Nombre embarcación',
				accessor: 'boat',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Propietario',
				accessor: 'customer',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Tipo cambio',
				accessor: 'currencyExchange',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
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
				accessor: 'amountMXN',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Efectivo USD',
				accessor: 'amountUSD',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Total',
				accessor: 'total',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'IVA',
				accessor: 'totalIVABase',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Impuesto muelle',
				accessor: 'tax',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'IVA',
				accessor: 'IVA2',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
		],
		[]
	);

	const downloadToCSV = () => {
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Sunset Admiral';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;
		workbook.calcProperties.fullCalcOnLoad = true;

		const sheet = workbook.addWorksheet('Cobranza impuestos muelle');
		sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

		const arrDatos = items.map((it) => [
			it.date,
			it.hour,
			it.boat,
			it.customer,
			it.currencyExchange,
			it.pax,
			it.amountMXN,
			it.amountUSD,
			it.total,
			it.totalIVABase,
			it.tax,
			it.IVA2,
		]);
		const columns = [
			{ name: 'Fecha' },
			{ name: 'Horario' },
			{ name: 'Nombre embarcación' },
			{ name: 'Propietario' },
			{ name: 'Tipo cambio' },
			{ name: 'Pax' },
			{ name: 'Efectivo MXN' },
			{ name: 'Efectivo USD' },
			{ name: 'Total' },
			{ name: 'IVA' },
			{ name: 'Impuesto muelle' },
			{ name: 'IVA' },
		];

		sheet.addTable({
			name: 'Table',
			ref: 'A8',
			headerRow: true,
			columns: columns,
			rows: arrDatos,
		});
		sheet.getColumn(1).width = 12;
		sheet.getColumn(2).width = 12;
		sheet.getColumn(3).width = 45;
		sheet.getColumn(4).width = 40;
		sheet.getColumn(5).width = 16;
		sheet.getColumn(6).width = 12;
		sheet.getColumn(7).width = 14;
		sheet.getColumn(8).width = 14;
		sheet.getColumn(9).width = 14;
		sheet.getColumn(10).width = 14;
		sheet.getColumn(11).width = 14;
		sheet.getColumn(12).width = 14;

		workbook.xlsx
			.writeBuffer()
			.then((response) => {
				var blob = new Blob([response], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});
				saveAs(
					blob,
					`resporteInpuestoMuelle${moment().format('DDMMYYYYHHmmss')}`
				);
			})
			.catch((error) => {
				console.log('Error');
			});
	};

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
	const carHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Fecha', width: '10%' },
						{ name: 'Horario', width: '10%' },
						{ name: 'Nombre embarcación', width: '20%' },
						{ name: 'Propietario', width: '20%' },
						{ name: 'Tipo cambio', width: '5%' },
						{ name: 'Pax', width: '5%' },
						{ name: 'Efectivo MXN', width: '5%' },
						{ name: 'Efectivo USD', width: '5%' },
						{ name: 'Total', width: '5%' },
						{ name: 'IVA', width: '5%' },
						{ name: 'Impuesto muelle', width: '5%' },
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
			<Col xs="12" md="2">
				<Button
					color="info"
					size="sm"
					type="button"
					onClick={downloadToCSV}
					className="mb-2"
				>
					<i className="far fa-file-pdf me-2" />
					Descargar
				</Button>
			</Col>
			<Col xs="12" xl="12">
				<SimpleTable columns={columns} data={items} />
			</Col>
		</Row>
	);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Cobro de impuesto de muelle'}
					breadcrumbItem={'Cobro de impuesto de muelle'}
				/>

				<Row className="pb-1">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Cobro de impuesto de muelle"
							children={carHandleList}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default DockTaxBill;
