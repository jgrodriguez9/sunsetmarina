import { Button, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import FormFilter from '../../../components/Common/FormFilter';
import { useEffect, useMemo, useState } from 'react';
import { getClientList } from '../../../helpers/marina/client';
import CardMain from '../../../components/Common/CardMain';
import SimpleTable from '../../../components/Tables/SimpleTable';
import TableLoader from '../../../components/Loader/TablaLoader';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportAccountStatus from '../../../components/Contabilidad/ReportAccountStatus';
import { getAccountStatusList } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import { numberFormat } from '../../../utils/numberFormat';
import {
	getSlipNames,
	getTotalBalanceReduce,
	getTotalChargesReduce,
	getTotalInterestReduce,
	getTotalPaymentsReduce,
} from '../../../utils/reportsUtils';
import moment from 'moment';

function AccountStatus() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [pdfData, setPdfData] = useState(null);
	const [filters, setFilters] = useState([
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
	const fetchClientsApi = async () => {
		try {
			const response = await getClientList();
			const copyFilters = [...filters];
			copyFilters[0].options = response.map((c) => ({
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
			const response = await getAccountStatusList(`?${q}`);
			setItems(response);
			const customerSelected = filts.find(
				(it) => it.field === 'customer'
			);
			const startDate = filts.find((it) => it.field === 'startDate');
			const endDate = filts.find((it) => it.field === 'endDate');
			const customerName =
				customerSelected.options.find(
					(it) => it.value === customerSelected.value
				)?.label ?? '';
			const totalCharges = getTotalChargesReduce(response);
			const totalInterest = getTotalInterestReduce(response);
			const totalPayments = getTotalPaymentsReduce(response);
			const balance = getTotalBalanceReduce(response);
			const periodDays = endDate.value
				? moment(endDate.value, 'DD/MM/YYYY').diff(
						moment(startDate.value, 'DD/MM/YYYY'),
						'days'
				  )
				: '-';
			const slipNames = getSlipNames(response);
			setPdfData({
				client: customerName,
				range: startDate.value
					? `${startDate.value} al ${endDate.value}`
					: '-',
				totalCharges,
				totalInterest,
				totalPayments,
				balance,
				periodDays,
				slipNames,
				slips: response,
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

	const handleFilter = (
		<Row>
			<Col>
				<FormFilter
					filters={filters}
					setFilters={setFilters}
					fireSearch={fireSearch}
					validate={['startDate', 'endDate']}
				/>
			</Col>
		</Row>
	);

	const columns = useMemo(
		() => [
			{
				Header: 'No. Slip',
				accessor: 'reservation.slip',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Cod. Reservación',
				accessor: 'reservation.code',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Cliente',
				accessor: 'reservation.customer',
				style: {
					width: '25%',
				},
			},
			{
				Header: 'Embarcación',
				accessor: 'reservation.boat',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Deuda',
				accessor: 'reservation.balanceCustomer',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => {
					const customerSelected = filters.find(
						(it) => it.field === 'customer'
					);
					const startDate = filters.find(
						(it) => it.field === 'startDate'
					);
					const endDate = filters.find(
						(it) => it.field === 'endDate'
					);
					const customerName =
						customerSelected.options.find(
							(it) => it.value === customerSelected.value
						)?.label ?? '';
					const periodDays = moment(endDate.value, 'DD/MM/YYYY').diff(
						moment(startDate.value, 'DD/MM/YYYY'),
						'days'
					);
					const data = {
						client: customerName,
						range: `${startDate.value} al ${endDate.value}`,
						totalCharges: row.original.reservation.totalCharges,
						totalInterest: row.original.reservation.totalInterest,
						totalPayments: row.original.reservation.totalPayments,
						balance: row.original.reservation.balanceCustomer,
						periodDays,
						slipNames: row.original.reservation.slip,
						slips: [row.original],
					};
					return (
						<PDFDownloadLink
							document={<ReportAccountStatus pdfData={data} />}
							fileName={`${moment().format(
								'DDMMYYYY'
							)}_estado_cuenta.pdf`}
						>
							{({ blob, url, loading, error }) =>
								loading ? (
									<Button
										color="secondary"
										outline
										disabled
										type="button"
										size="sm"
									>
										<i className="far fa-file-pdf" />{' '}
										Cargando documento
									</Button>
								) : (
									<Button
										color="info"
										outline
										className="mb-2"
										size="sm"
									>
										<i className="far fa-file-pdf" />{' '}
										Descargar
									</Button>
								)
							}
						</PDFDownloadLink>
					);
				},
				style: {
					width: '10%',
				},
			},
		],
		[]
	);
	const showPdfGlobal = useMemo(() => {
		return filters.find((it) => it.field === 'customer').value !== '';
	}, [filters]);
	const carHandleEstadoCuenta = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'No. Slip', width: '60%' },
						{ name: 'Deuda', width: '30%' },
						{ name: 'Acciones', width: '10%' },
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
			{showPdfGlobal && (
				<Col xs="12" xl="12">
					<PDFDownloadLink
						document={<ReportAccountStatus pdfData={pdfData} />}
						fileName={`${moment().format(
							'DDMMYYYY'
						)}_estado_cuenta_general.pdf`}
					>
						{({ blob, url, loading, error }) =>
							loading ? (
								<Button
									color="secondary"
									outline
									disabled
									type="button"
									size="sm"
								>
									<i className="far fa-file-pdf" /> Cargando
									documento
								</Button>
							) : (
								<Button
									color="info"
									outline
									className="mb-2"
									size="sm"
								>
									<i className="far fa-file-pdf" /> Descargar
									Reporte general
								</Button>
							)
						}
					</PDFDownloadLink>
				</Col>
			)}
			<Col xs="12" xl="12">
				<SimpleTable columns={columns} data={items} />
			</Col>
		</Row>
	);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Estado de cuenta'}
					breadcrumbItem={'Estado de cuenta'}
				/>

				<Row className="pb-2">
					<Col lg="12">
						<CardBasic title="Filtros" children={handleFilter} />
					</Col>
				</Row>
				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Estado de cuenta"
							children={carHandleEstadoCuenta}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default AccountStatus;
