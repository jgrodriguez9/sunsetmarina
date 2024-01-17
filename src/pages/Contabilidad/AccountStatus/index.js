import { Button, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import FormFilter from '../../../components/Common/FormFilter';
import { useEffect, useMemo, useState } from 'react';
import { getClientList } from '../../../helpers/marina/client';
import CardMain from '../../../components/Common/CardMain';
import CellActions from '../../../components/Tables/CellActions';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { listClientAccounsStatus } from '../../../data/testData';
import TableLoader from '../../../components/Loader/TablaLoader';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportAccountStatus from '../../../components/Contabilidad/ReportAccountStatus';
import { getAccountStatusList } from '../../../helpers/reports/accountStatus';
import { ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import { numberFormat } from '../../../utils/numberFormat';

function AccountStatus() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
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

	const fireSearch = async (filts) => {
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

	const report = (row) => {
		console.log(row);
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

	const columns = useMemo(
		() => [
			{
				Header: 'No. Slip',
				accessor: 'reservation.slip',
				style: {
					width: '60%',
				},
			},
			{
				Header: 'Deuda',
				accessor: 'reservation.balanceCustomer',
				style: {
					width: '30%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<CellActions
							edit={{ allow: false }}
							del={{ allow: false }}
							report={{ allow: true, action: report }}
							row={row}
						/>
					</>
				),
				style: {
					width: '10%',
				},
			},
		],
		[]
	);

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
			<Col xs="12" xl="12">
				<PDFDownloadLink
					document={<ReportAccountStatus pdfData={null} />}
					fileName={`estado_cuenta.pdf`}
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

				<Row className="pb-5">
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
