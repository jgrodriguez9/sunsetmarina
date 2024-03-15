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
			setTotals({
				totalPax: response.totalPax,
				totalAmount: response.totalAmount.toFixed(2),
				totalIVA2: response.totalIVA2.toFixed(2),
				totalIVABase: response.totalIVABase.toFixed(2),
				totalMXN: response.totalMXN.toFixed(2),
				totalTax: response.totalTax,
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

	const downloadToCSV = async () => {
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Sunset Admiral';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;
		workbook.calcProperties.fullCalcOnLoad = true;

		const sheet = workbook.addWorksheet('Cobranza impuestos muelle', {
			headerFooter: {
				firstHeader: 'Hello Exceljs',
				firstFooter: 'Hello World',
			},
		});
		sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

		// const imageSrc = '../../../assets/images/logoExcel.png';
		// const response = await fetch(imageSrc);
		// const buffer = await response.arrayBuffer();
		// //console.log(buffer);
		// const image = workbook.addImage({
		// 	buffer: buffer,
		// 	extension: 'png',
		// });
		// sheet.addImage(image, 'A1:C4');

		// en items tengo toda la info
		console.log(items);
		const columns = [
			{
				key: 'date',
				header: 'Fecha',
				width: 14,
			},
			{
				key: 'hour',
				header: 'Horario',
				width: 14,
			},
			{
				key: 'boat',
				header: 'Nombre embarcación',
				width: 35,
			},
			{
				key: 'customer',
				header: 'Propietario',
				width: 35,
			},
			{
				key: 'currencyExchange',
				header: 'Tipo cambio',
				width: 10,
				style: {
					alignment: { horizontal: 'right', wrapText: true },
				},
			},
			{
				key: 'pax',
				header: 'Pax',
				width: 12,
			},
			{
				key: 'amountMXN',
				header: 'Efectivo MXN',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'amountUSD',
				header: 'Efectivo USD',
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
				key: 'totalIVABase',
				header: 'IVA',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'tax',
				header: 'Impuesto muelle',
				width: 12,
				style: {
					alignment: { horizontal: 'right', wrapText: true },
				},
			},
			{
				key: 'IVA2',
				header: 'IVA',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
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
		// sheet.getCell('A1').fill = {
		// 	type: 'pattern',
		// 	pattern: 'solid',
		// 	fgColor: { argb: 'F3FF33' },
		// };
		// sheet.getCell('B1').fill = {
		// 	type: 'pattern',
		// 	pattern: 'solid',
		// 	fgColor: { argb: 'F3FF33' },
		// };
		// sheet.getCell('C1').fill = {
		// 	type: 'pattern',
		// 	pattern: 'solid',
		// 	fgColor: { argb: 'F3FF33' },
		// };
		// sheet.getCell('D1').fill = {
		// 	type: 'pattern',
		// 	pattern: 'solid',
		// 	fgColor: { argb: 'F3FF33' },
		// };
		// sheet.getCell('E1').fill = {
		// 	type: 'pattern',
		// 	pattern: 'solid',
		// 	fgColor: { argb: 'F3FF33' },
		// };
		// sheet.getCell('F1').fill = {
		// 	type: 'pattern',
		// 	pattern: 'solid',
		// 	fgColor: { argb: 'F3FF33' },
		// };

		//totals
		const totalLabel = `A${items.length + 5}`;
		sheet.getCell(totalLabel).value = 'TOTALES';
		sheet.getCell(totalLabel).font = { bold: true };

		const totalPax = 'F' + (items.length + 5);
		sheet.getCell(totalPax).value = totals.totalPax;
		sheet.getCell(totalPax).font = { bold: true };

		const totalMXN = 'G' + (items.length + 5);
		sheet.getCell(totalMXN).value = totals.totalMXN;
		sheet.getCell(totalMXN).font = { bold: true };
		sheet.getCell(totalMXN).numFmt = '"$"#,###.##';

		const totalUSD = 'H' + (items.length + 5);
		sheet.getCell(totalUSD).value = totals.totalUSD;
		sheet.getCell(totalUSD).font = { bold: true };
		sheet.getCell(totalUSD).numFmt = '"$"#,###.##';

		const totalAmount = 'I' + (items.length + 5);
		sheet.getCell(totalAmount).value = totals.totalAmount;
		sheet.getCell(totalAmount).font = { bold: true };
		sheet.getCell(totalAmount).numFmt = '"$"#,###.##';

		const totalIVABase = 'J' + (items.length + 5);
		sheet.getCell(totalIVABase).value = totals.totalIVABase;
		sheet.getCell(totalIVABase).font = { bold: true };
		sheet.getCell(totalIVABase).numFmt = '"$"#,###.##';

		const totalTax = 'K' + (items.length + 5);
		sheet.getCell(totalTax).value = totals.totalTax;
		sheet.getCell(totalTax).font = { bold: true };
		// sheet.getCell(totalTax).numFmt = '"$"#,###.##';

		const totalIVA2 = 'L' + (items.length + 5);
		sheet.getCell(totalIVA2).value = totals.totalIVA2;
		sheet.getCell(totalIVA2).font = { bold: true };
		sheet.getCell(totalIVA2).numFmt = '"$"#,###.##';

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
				console.log(error);
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
