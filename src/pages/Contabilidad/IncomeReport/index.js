import { useMemo, useEffect } from 'react';
import { Col, Container, Row, Button } from 'reactstrap';
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
import { numberFormat } from '../../../utils/numberFormat';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { getFormaPago } from '../../../utils/getFormaPago';
import { getClientList } from '../../../helpers/marina/client';

function IncomeReport() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [totals, setTotals] = useState(null);
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
		{
			label: 'Cliente',
			field: 'customer',
			width: 4,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [],
		},
	]);
	const fetchClientsApi = async () => {
		try {
			const response = await getClientList();
			const copyFilters = [...filters];
			copyFilters[2].options = response.map((c) => ({
				label: `${c.name} ${c.lastName}`,
				value: c.id,
			}));
			setFilters(copyFilters);
		} catch (error) {}
	};

	useEffect(() => {
		fetchClientsApi();
	}, []);

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
			setItems(response.items);
			setTotals({
				totalBase: response.totalBase.toFixed(2),
				totalIVA: response.totalIVA.toFixed(2),
				totalUSD: response.totalUSD.toFixed(2),
			});
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
				Cell: ({ value }) => getFormaPago(value),
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
				Cell: ({ value }) => numberFormat(value),
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
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'IVA',
				accessor: 'iva',
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
				Header: 'Pago',
				accessor: 'paymentDescription',
				style: {
					width: '10%',
				},
			},
		],
		[]
	);

	const downloadToCSV = async () => {
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Sunset Admiral';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;
		workbook.calcProperties.fullCalcOnLoad = true;

		const sheet = workbook.addWorksheet('Ingresos', {
			headerFooter: {
				firstHeader: 'Ingresos',
				firstFooter: 'Ingresos',
			},
		});
		sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

		// en items tengo toda la info
		const columns = [
			{
				key: 'period',
				header: 'Periodo',
				width: 14,
			},
			{
				key: 'monthPayment',
				header: 'Mes de pago',
				width: 14,
			},
			{
				key: 'paymentMethod',
				header: 'Forma de pago',
				width: 14,
			},
			{
				key: 'yearPayment',
				header: 'Año de pago',
				width: 14,
			},
			{
				key: 'amount',
				header: 'Importe',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'observation',
				header: 'Observación',
				width: 34,
			},
			{
				key: 'boatType',
				header: 'Tipo embarcación',
				width: 24,
			},
			{
				key: 'ramType',
				header: 'Tipo rampa',
				width: 24,
			},
			{
				key: 'base',
				header: 'Base',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'iva',
				header: 'IVA',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'total',
				header: 'Total',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'paymentDescription',
				header: 'Pago',
				width: 34,
			},
		];
		sheet.columns = columns;
		items.forEach((val, i, _) => {
			sheet.addRow(val);
		});

		sheet.getRow(1).font = { bold: true };
		sheet.getRow(1).border = {
			top: { style: 'medium', color: { argb: '021e4c' } },
			bottom: { style: 'medium', color: { argb: '021e4c' } },
		};
		sheet.getCell('E1').alignment = {
			horizontal: 'center',
			wrapText: true,
		};
		sheet.getCell('K1').alignment = {
			horizontal: 'center',
			wrapText: true,
		};

		//totals
		const totalLabel = `A${items.length + 5}`;
		sheet.getCell(totalLabel).value = 'TOTALES';
		sheet.getCell(totalLabel).font = { bold: true };

		const totalBase = 'I' + (items.length + 5);
		sheet.getCell(totalBase).value = totals.totalBase;
		sheet.getCell(totalBase).font = { bold: true };
		sheet.getCell(totalBase).numFmt = '"$"#,###.##';

		const totalIVA = 'J' + (items.length + 5);
		sheet.getCell(totalIVA).value = totals.totalIVA;
		sheet.getCell(totalIVA).font = { bold: true };
		sheet.getCell(totalIVA).numFmt = '"$"#,###.##';

		const totalUSD = 'K' + (items.length + 5);
		sheet.getCell(totalUSD).value = totals.totalUSD;
		sheet.getCell(totalUSD).font = { bold: true };
		sheet.getCell(totalUSD).numFmt = '"$"#,###.##';

		workbook.xlsx
			.writeBuffer()
			.then((response) => {
				var blob = new Blob([response], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});
				saveAs(
					blob,
					`resporteIngreso${moment().format('DDMMYYYYHHmmss')}`
				);
			})
			.catch((error) => {
				console.log('Error');
				console.log(error);
			});
	};

	const tFooter = (
		<tfoot>
			<tr>
				<th colSpan={8}>Total</th>
				<th>{numberFormat(totals?.totalBase ?? 0)}</th>
				<th>{numberFormat(totals?.totalIVA ?? 0)}</th>
				<th>{numberFormat(totals?.totalUSD ?? 0)}</th>
			</tr>
		</tfoot>
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
				<SimpleTable columns={columns} data={items} footer={tFooter} />
			</Col>
		</Row>
	);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Reporte cobranza reservaciones'}
					breadcrumbItem={'Reporte cobranza reservaciones'}
				/>

				<Row className="pb-2">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Reporte cobranza reservaciones"
							children={carHandleEstadoCuenta}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default IncomeReport;
