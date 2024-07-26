import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import CellActions from '../../../components/Tables/CellActions';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import {
	CANCEL_RESERVATION_SUCCESS,
	DELETE_QUESTION_CONFIRMATION,
	ERROR_SERVER,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { getBoatList } from '../../../helpers/marina/boat';
import moment from 'moment';
import {
	getReservationListPaginado,
	updateReservation,
} from '../../../helpers/marina/slipReservation';
import { numberFormat } from '../../../utils/numberFormat';
import { getClientList } from '../../../helpers/marina/client';
import { getSlipList } from '../../../helpers/marina/slip';
import DialogMain from '../../../components/Common/DialogMain';
import ContentLoader from '../../../components/Loader/ContentLoader';

function Reservation() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const navigate = useNavigate();
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [openModalCancel, setOpenModalCancel] = useState(false);
	const [isCancel, setIsCancel] = useState(false);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});
	const [filters, setFilters] = useState([
		{
			label: 'Código',
			field: 'code',
			width: 3,
			control: 'input',
			type: 'text',
			value: '',
		},
		{
			label: 'Cliente',
			field: 'customerId',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [],
		},
		{
			label: 'Embarcación',
			field: 'boatId',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [],
		},
		{
			label: 'Slip',
			field: 'slipId',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [],
		},
	]);

	//datos para llenar los filtros de esta pantalla
	useEffect(() => {
		//clientes
		const fetchClients = async () => {
			try {
				const response = await getClientList();
				const copyFilters = [...filters];
				copyFilters[1].options = response.map((c) => ({
					label: `${c.name} ${c.lastName}`,
					value: c.id,
				}));
				setFilters(copyFilters);
			} catch (error) {}
		};
		fetchClients();

		//embarcacion
		const fetchBoats = async () => {
			try {
				const response = await getBoatList();
				const copyFilters = [...filters];
				copyFilters[2].options = response.map((boat) => ({
					label: boat.name,
					value: boat.id,
				}));
				setFilters(copyFilters);
			} catch (error) {}
		};
		fetchBoats();

		//slips
		const fetchSlips = async () => {
			try {
				const response = await getSlipList();
				const copyFilters = [...filters];
				copyFilters[3].options = response.map((slip) => ({
					label: slip.code,
					value: slip.id,
				}));
				setFilters(copyFilters);
			} catch (error) {}
		};
		fetchSlips();
	}, []);

	const fetchList = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getReservationListPaginado(`?${q}`);
			setItems(response.list);
			setTotalPaginas(response.pagination.totalPages);
			setTotalRegistros(response.pagination.totalCount);
			setLoading(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setItems([]);
			setTotalPaginas(0);
			setTotalRegistros(10);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchList();
	}, [JSON.stringify(query)]);

	const editAction = (row) => {
		navigate(`/reservation/edit/${row.original.id}`);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '13%',
				},
			},
			{
				Header: 'Slip',
				accessor: 'slip.code',
				style: {
					width: '8%',
				},
			},
			{
				Header: 'Cliente',
				accessor: 'customer.name',
				style: {
					width: '15%',
				},
				Cell: ({ row, value }) => (
					<Link to={`/client/edit/${row.original.customer?.id}`}>
						{`${value} ${row.original.customer.lastName}`}
					</Link>
				),
			},
			{
				Header: 'Embarcación',
				accessor: 'boat.name',
				style: {
					width: '12%',
				},
			},
			{
				Header: 'Fecha llegada',
				accessor: 'arrivalDate',
				style: {
					width: '10%',
				},
				Cell: ({ row, value }) =>
					value
						? moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
						: '',
			},
			{
				Header: 'Fecha salida',
				accessor: 'departureDate',
				style: {
					width: '10%',
				},
				Cell: ({ row, value }) =>
					value
						? moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
						: '',
			},
			{
				Header: 'Precio diario',
				accessor: 'price',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Deuda',
				accessor: 'debt.debt',
				style: {
					width: '7%',
				},
				Cell: ({ row, value }) =>
					row.original.status === 'CONFIRMED' ? (
						<span
							className={
								value > 0 ? 'text-danger' : 'text-success'
							}
						>
							{numberFormat(value)}
						</span>
					) : (
						numberFormat(value)
					),
			},
			{
				Header: 'Estado',
				accessor: 'status',
				style: {
					width: '8%',
				},
				Cell: ({ value }) => {
					if (value === 'PENDING') {
						return <Badge color="warning">Pendiente</Badge>;
					} else if (value === 'CONFIRMED') {
						return <Badge color="success">Confirmada</Badge>;
					} else {
						return <Badge color="danger">Cancelada</Badge>;
					}
				},
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<CellActions
							edit={{
								allow: row.original.status !== 'CANCELLED',
								action: editAction,
							}}
							cancel={
								row.original.status === 'CANCELLED'
									? null
									: {
											allow: true,
											action: handleShowDialogCancel,
									  }
							}
							row={row}
						/>
					</>
				),
				style: {
					width: '7%',
				},
			},
		],
		[]
	);

	const handleShowDialogCancel = (row) => {
		setOpenModalCancel(true);
		setSelectedReservation(row.original);
	};

	const handlePageClick = (page) => {
		setQuery((prev) => ({
			...prev,
			page: page,
		}));
	};

	const handleChangeLimit = (limit) => {
		setQuery((prev) => ({
			...prev,
			max: limit,
			page: 1,
		}));
	};

	const fireSearch = (filts) => {
		const activeFilters = filts
			.filter((fl) => fl.value)
			.map((field) => ({ name: field.field, value: field.value }));
		const obj = activeFilters.reduce((accumulator, value) => {
			return { ...accumulator, [value.name]: value.value };
		}, {});

		setQuery((prev) => ({
			max: prev.max,
			page: 1,
			...obj,
		}));
	};

	const goPageCreate = () => {
		navigate('/reservation/create');
	};

	const onCloseCancel = () => {
		setOpenModalCancel(false);
	};

	const handleCancelar = async () => {
		setIsCancel(true);
		try {
			const data = {
				id: selectedReservation.id,
				status: 'CANCELLED',
			};
			const response = await updateReservation(data.id, data);
			if (response) {
				fetchList();
				setOpenModalCancel(false);
				dispatch(
					addMessage({
						message: CANCEL_RESERVATION_SUCCESS,
						type: 'success',
					})
				);
			} else {
				dispatch(
					addMessage({
						type: 'error',
						message: ERROR_SERVER,
					})
				);
			}
			setIsCancel(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setIsCancel(false);
		}
	};

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Código', width: '13%' },
						{ name: 'Slip', width: '8%' },
						{ name: 'Cliente', width: '15%' },
						{ name: 'Embarcación', width: '12%' },
						{ name: 'Fecha llegada', width: '10%' },
						{ name: 'Fecha salida', width: '10%' },
						{ name: 'Precio diario', width: '10%' },
						{ name: 'Deuda', width: '7%' },
						{ name: 'Estado', width: '8%' },
						{ name: 'Acciones', width: '7%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<SimpleTable columns={columns} data={items} />
			</Col>
			{items.length > 0 && (
				<Paginate
					page={query.page}
					totalPaginas={totalPaginas}
					totalRegistros={totalRegistros}
					handlePageClick={handlePageClick}
					limit={query.limite}
					handleChangeLimit={handleChangeLimit}
				/>
			)}
		</Row>
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

	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Reservas'}
						breadcrumbItem={'Reservas'}
						add={{
							allow: true,
							text: 'Crear Nueva',
							goPageCreate: goPageCreate,
						}}
					/>

					<Row>
						<Col xs="12" lg="12">
							<CardBasic
								title="Filtros"
								children={handleFilter}
							/>
						</Col>
					</Row>
					<Row className="pb-5">
						<Col lg="12">
							<CardMain
								title="Listado"
								children={cardHandleList}
							/>
						</Col>
					</Row>
				</Container>
			</div>
			<DialogMain
				open={openModalCancel}
				setOpen={setOpenModalCancel}
				title={'Cancelar reservación'}
				size="md"
				children={
					selectedReservation
						? selectedReservation?.debt > 0
							? contentDialogNotCancel
							: contentDialogCancel(
									isCancel,
									onCloseCancel,
									handleCancelar
							  )
						: null
				}
			/>
		</>
	);
}

export default Reservation;

const contentDialogNotCancel = (
	<>
		<Row>
			<Col lg={12}>
				<div className="text-center">
					<i
						className="mdi mdi-alert-circle-outline"
						style={{ fontSize: '9em', color: 'orange' }}
					/>
					<h4>
						Debe pagar su deuda antes de cancelar la reservación
					</h4>
				</div>
			</Col>
		</Row>
	</>
);

const contentDialogCancel = (isCancel, onCloseCancel, handleCancelar) => (
	<>
		{isCancel && <ContentLoader text="Cancelando reservación..." />}
		<Row>
			<Col lg={12}>
				<div className="text-center">
					<i
						className="mdi mdi-alert-circle-outline"
						style={{ fontSize: '9em', color: 'orange' }}
					/>
					<h2>¿Estas seguro de cancelar la reservación</h2>
					<h4>{DELETE_QUESTION_CONFIRMATION}</h4>
				</div>
			</Col>
		</Row>
		<Row>
			<Col>
				{isCancel ? (
					<div className="text-center mt-3">
						<button
							type="button"
							className="btn btn-danger btn-lg ms-2"
							disabled
						>
							¡Sí, cancelar reservación!
						</button>
					</div>
				) : (
					<div className="text-center mt-3">
						<button
							type="button"
							className="btn btn-danger btn-lg ms-2"
							onClick={handleCancelar}
						>
							¡Sí, cancelar reservación!
						</button>
					</div>
				)}
			</Col>
		</Row>
	</>
);
