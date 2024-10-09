import { Button, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import FormFilter from '../../../components/Common/FormFilter';
import { useCallback, useState, useEffect } from 'react';
import CardMain from '../../../components/Common/CardMain';
import { reportCollection } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import TableLoader from '../../../components/Loader/TablaLoader';
import ReportContratos, {
	getTotalsReportContract,
} from '../../../components/Reportes/ReportContratos';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import jsFormatNumber from '../../../utils/jsFormatNumber';
import { getClientList } from '../../../helpers/marina/client';

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
			const response = await reportCollection(`?${q}`);
			setItems(response);
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

	const getDeuda = useCallback((charges, payments, currency) => {
		if (currency === 'MXN') {
			const deudaMXN = charges.amount - payments.amount;
			return jsFormatNumber(deudaMXN);
		} else {
			const deudaUSD = charges.amountUSD - payments.amountUSD;
			return jsFormatNumber(deudaUSD);
		}
	}, []);

	const downloadToCSV = async () => {
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Sunset Admiral';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;
		workbook.calcProperties.fullCalcOnLoad = true;

		const sheet = workbook.addWorksheet('Estado de contratos', {
			headerFooter: {
				firstHeader: 'Hello Exceljs',
				firstFooter: 'Hello World',
			},
		});
		sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

		// en items tengo toda la info
		const columns = [
			{
				key: 'slip',
				header: 'Slip',
				width: 14,
			},
			{
				key: 'boat',
				header: 'Embarcación',
				width: 35,
			},
			{
				key: 'customer',
				header: 'Dueño',
				width: 35,
			},
			{
				key: 'boatLength',
				header: 'Real Pies',
				width: 14,
			},
			{
				key: 'paymentFrequency',
				header: 'Forma pago',
				width: 14,
			},
			{
				key: 'arrivalDate',
				header: 'Llegada',
				width: 14,
			},
			{
				key: 'departureDate',
				header: 'Salida',
				width: 14,
			},
			{
				key: 'finalContractDate',
				header: 'Venc. Contrato',
				width: 14,
			},
			{
				key: 'monthContract',
				header: 'Renta Contratada',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'monthRental',
				header: 'Renta Mensual',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'deudaMXN',
				header: 'Deuda (MXN)',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
			{
				key: 'deudaUSD',
				header: 'Deuda (MXN)',
				width: 14,
				style: {
					alignment: { horizontal: 'right' },
				},
			},
		];
		sheet.columns = columns;
		let posI = 0;
		items.forEach((val, i, _) => {
			console.log(val);
			const value = {
				slip: val.boatType,
				monthContract: getTotalsReportContract(
					val.concepts,
					'monthContract'
				),
				monthRental: getTotalsReportContract(
					val.concepts,
					'monthRental'
				),
				deudaMXN: jsFormatNumber(val.totalCharges - val.totalPayments),
				deudaUSD: jsFormatNumber(
					val.totalChargesUSD - val.totalPaymentsUSD
				),
			};
			if (i === 0) {
				posI += 2;
			} else {
				posI += 1;
			}
			sheet.insertRow(posI, value);
			sheet.getCell(`A${posI}`).font = { bold: true };
			val.concepts
				.map((concept) => ({
					slip: concept.slip,
					boat: concept.boat,
					customer: concept.customer,
					boatLength: concept.boatLength,
					paymentFrequency: concept.paymentFrequency,
					arrivalDate: moment(
						concept.arrivalDate,
						'YYYY-MM-DD'
					).format('DD/MM/YYYY'),
					departureDate:
						concept.departureDate !== 'VIGENTE'
							? moment(
									concept.departureDate,
									'YYYY-MM-DD'
							  ).format('DD/MM/YYYY')
							: concept.departureDate,
					finalContractDate:
						concept.finalContractDate !== 'INDEFINIDO'
							? moment(
									concept.finalContractDate,
									'YYYY-MM-DD'
							  ).format('DD/MM/YYYY')
							: concept.finalContractDate,
					monthContract: jsFormatNumber(concept.monthContract),
					monthRental: jsFormatNumber(concept.monthRental),
					deudaMXN: getDeuda(
						concept.charges,
						concept.payments,
						'MXN'
					),
					deudaUSD: getDeuda(
						concept.charges,
						concept.payments,
						'USD'
					),
				}))
				.forEach((val2, idx, _) => {
					posI += 1;
					sheet.insertRow(posI, val2);
				});
		});

		sheet.getRow(1).font = { bold: true };
		sheet.getRow(1).border = {
			top: { style: 'medium', color: { argb: '021e4c' } },
			bottom: { style: 'medium', color: { argb: '021e4c' } },
		};

		workbook.xlsx
			.writeBuffer()
			.then((response) => {
				var blob = new Blob([response], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});
				saveAs(
					blob,
					`resporteContratos${moment().format('DDMMYYYYHHmmss')}`
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
	const carHandleEstadoCuenta = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Slip', width: '10%' },
						{ name: 'Embarcación', width: '150%' },
						{ name: 'Dueño', width: '15%' },
						{ name: 'Real Pies', width: '10%' },
						{ name: 'Forma pago', width: '10%' },
						{ name: 'Llegada', width: '10%' },
						{ name: 'Salida', width: '10%' },
						{ name: 'Venc. Contrato', width: '10%' },
						{ name: 'Renta Contratada', width: '10%' },
						{ name: 'Renta Mensual', width: '10%' },
						{ name: 'Deuda (MXN)', width: '10%' },
						{ name: 'Deuda (USD)', width: '10%' },
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
				<ReportContratos items={items} />
			</Col>
		</Row>
	);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Reporte de saldo de cliente'}
					breadcrumbItem={'Reporte de saldo de cliente'}
				/>

				<Row className="pb-2">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Reporte de saldo de cliente"
							children={carHandleEstadoCuenta}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default BillReport;
