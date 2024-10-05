import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getClientList } from '../../../helpers/marina/client';
import { reportDailySummary } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { addMessage } from '../../../redux/messageSlice';
import { Button, Col, Container, Input, Label, Row } from 'reactstrap';
import FormFilter from '../../../components/Common/FormFilter';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import SpinLoader from '../../../components/Loader/SpinLoader';
import ReportDailyContainer from '../../../components/Reportes/ReportDaily/ReportDailyContainer';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import jsFormatNumber from '../../../utils/jsFormatNumber';
import { getFormaPago } from '../../../utils/getFormaPago';

const getColumns = (isGroupByCustomer) => {
	const columns = [
		{
			key: 'code',
			header: 'Código',
			width: 14,
		},
		{
			key: 'customer',
			header: 'Cliente',
			width: 35,
		},
		{
			key: 'boat',
			header: 'Embarcación',
			width: 35,
		},
		{
			key: 'slip',
			header: 'Slip',
			width: 14,
		},
		{
			key: 'date',
			header: 'Fecha',
			width: 14,
		},
		{
			key: 'paymentForm',
			header: 'Forma pago',
			width: 14,
		},
		{
			key: 'charge',
			header: 'Cargo (MXN)',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
		{
			key: 'credit',
			header: 'Abono (MXN)',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
		{
			key: 'balance',
			header: 'Deuda (MXN)',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
		{
			key: 'currencyExchange',
			header: 'Tipo de cambio',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
		{
			key: 'chargeUSD',
			header: 'Cargo (USD)',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
		{
			key: 'creditUSD',
			header: 'Abono (USD)',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
		{
			key: 'balanceUSD',
			header: 'Deuda (USD)',
			width: 14,
			style: {
				alignment: { horizontal: 'right' },
			},
		},
	];
	if (isGroupByCustomer) {
		const columnsCustomer = columns.filter(
			(it) =>
				it.key !== 'code' &&
				it.key !== 'boat' &&
				it.key !== 'slip' &&
				it.key !== 'paymentForm' &&
				it.key !== 'currencyExchange'
		);
		return columnsCustomer;
	} else {
		return columns;
	}
};

const groupedByCustomer = (data) => {
	const grouped = data.map((d) => {
		return {
			...d,
			items: d.items.reduce((acc, item) => {
				// Find if there is already an entry in acc with the same customerID
				const existingCustomer = acc.find(
					(el) => el.customerID === item.customerID
				);

				if (existingCustomer) {
					// If found, aggregate the charges and other fields
					existingCustomer.charge += item.charge;
					existingCustomer.chargeUSD += item.chargeUSD;
					existingCustomer.credit += item.credit;
					existingCustomer.creditUSD += item.creditUSD;
					existingCustomer.balance += item.balance;
					existingCustomer.balanceUSD += item.balanceUSD;
					existingCustomer.code = '-';
					existingCustomer.boat = '-';
					existingCustomer.slip = '-';
					existingCustomer.paymentForm = '-';
					existingCustomer.currencyExchange = 0;
				} else {
					// If not found, create a new entry
					acc.push({ ...item });
				}

				return acc;
			}, []),
		};
	});

	return grouped;
};

function DailyReport() {
	const dispatch = useDispatch();
	const [groupByCustomer, setGroupByCustomer] = useState(false);
	const [loading, setLoading] = useState(false);
	const [originalsItems, setOriginalsItems] = useState([]);
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
		setGroupByCustomer(false);
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
			const response = await reportDailySummary(`?${q}`);
			setOriginalsItems(response);
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

	const downloadToCSV = async () => {
		console.log('entro');
		const workbook = new ExcelJS.Workbook();
		workbook.creator = 'Sunset Admiral';
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;
		workbook.calcProperties.fullCalcOnLoad = true;

		items.forEach((val) => {
			let posI = 1;
			const sheet = workbook.addWorksheet(val.concept);
			sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

			const columns = getColumns(groupByCustomer);
			console.log(columns);
			sheet.columns = columns;
			val.items
				.map((item) => ({
					code: item.code,
					customer: item.customer,
					boat: item.boat,
					slip: item.slip,
					date: moment.utc(item.date).local().format('DD-MM-YYYY'),
					paymentForm: getFormaPago(item.paymentForm),
					charge: jsFormatNumber(item.charge),
					credit: jsFormatNumber(item.credit),
					balance: jsFormatNumber(item.balance),
					currencyExchange: jsFormatNumber(item.currencyExchange),
					chargeUSD: jsFormatNumber(item.chargeUSD),
					creditUSD: jsFormatNumber(item.creditUSD),
					balanceUSD: jsFormatNumber(item.balanceUSD),
				}))
				.forEach((val2, idx, _) => {
					posI += 1;
					sheet.insertRow(posI, val2);
				});
			const totalRow = {
				code: '',
				customer: '',
				boat: '',
				date: '',
				paymentForm: '',
				charge: jsFormatNumber(val.totalCharge),
				credit: jsFormatNumber(val.totalCredit),
				balance: jsFormatNumber(val.totalBalance),
				currencyExchange: '',
				chargeUSD: jsFormatNumber(val.totalChargeUSD),
				creditUSD: jsFormatNumber(val.totalCreditUSD),
				balanceUSD: jsFormatNumber(val.totalBalanceUSD),
			};
			posI += 1;
			sheet.insertRow(posI, totalRow);
			sheet.getRow(posI).font = { bold: true };
			sheet.getRow(posI).border = {
				top: { style: 'medium', color: { argb: '021e4c' } },
				bottom: { style: 'medium', color: { argb: '021e4c' } },
			};

			sheet.getRow(1).font = { bold: true };
			sheet.getRow(1).border = {
				top: { style: 'medium', color: { argb: '021e4c' } },
				bottom: { style: 'medium', color: { argb: '021e4c' } },
			};
		});
		workbook.xlsx
			.writeBuffer()
			.then((response) => {
				var blob = new Blob([response], {
					type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				});
				saveAs(
					blob,
					`resporteDaily${moment().format('DDMMYYYYHHmmss')}`
				);
			})
			.catch((error) => {
				console.log('Error');
				console.log(error);
			});
	};

	useEffect(() => {
		if (groupByCustomer) {
			const grouped = groupedByCustomer(originalsItems);
			setItems(grouped);
		} else {
			setItems(originalsItems);
		}
	}, [groupByCustomer, originalsItems]);

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
				<SpinLoader />
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
			<Col xs="12" md="12">
				<div
					className="d-flex flex-row align-items-center"
					style={{ gap: '10px' }}
				>
					<Button
						color="info"
						size="sm"
						type="button"
						onClick={downloadToCSV}
					>
						<i className="far fa-file-pdf me-2" />
						Descargar
					</Button>
					<div>
						<Input
							id="groupByCustomer"
							name="groupByCustomer"
							type="checkbox"
							className={`form-check-Input form-check-input`}
							onChange={(e) =>
								setGroupByCustomer(e.target.checked)
							}
							checked={groupByCustomer}
						/>
						<Label
							htmlFor={`nauticalTouristic`}
							className="mb-0 ms-2"
						>
							Agrupar por cliente
						</Label>
					</div>
				</div>
			</Col>
			<Col xs="12" xl="12">
				<ReportDailyContainer
					concepts={items}
					groupByCustomer={groupByCustomer}
				/>
			</Col>
		</Row>
	);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Reporte general de ingresos'}
					breadcrumbItem={'Reporte general de ingresos'}
				/>

				<Row className="pb-2">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Reporte general de ingresos"
							children={carHandleEstadoCuenta}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default DailyReport;
