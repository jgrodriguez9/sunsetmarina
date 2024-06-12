import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import {
	APPROVE_CLOSE_CASH_SUCCESS,
	CLOSE_CASH_SUCCESS,
	ERROR_SERVER,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import moment from 'moment';
import { numberFormat } from '../../../utils/numberFormat';
import {
	approveCloseCashRegisterControl,
	closeCashRegisterControl,
	getCashRegisterControlListPaginado,
} from '../../../helpers/caja/cashRegisterControl';
import DialogMain from '../../../components/Common/DialogMain';
import FormOpenCashRegisterControl from '../../../components/Caja/CashRegisterControl/FormOpenCashRegisterControl';
import TooltipDescription from '../../../components/Common/TooltipDescription';
import CloseCashRegister from '../../../components/Caja/CashRegisterControl/CloseCashRegister';
import ApproveCloseCashRegister from '../../../components/Caja/CashRegisterControl/ApproveCloseCashRegister';
import { getCashRegisterListPaginado } from '../../../helpers/caja/cashRegister';
import { useNavigate } from 'react-router-dom';
import {
	ROLE_ADMINISTRACION,
	ROLE_CONTABILIDAD,
} from '../../../constants/roles';

function CashRegisterControl() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const [openModalCash, setOpenModalCash] = useState(false);
	const [modalCloseCash, setModalCloseCash] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [currentChildren, setCurrentChidlren] = useState('closeCashRegister');
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});
	const [filters, setFilters] = useState([
		{
			label: 'Caja',
			field: 'cashRegisterId',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [],
		},
		{
			label: 'Fecha inicio',
			field: 'openDateStart',
			width: 3,
			control: 'date',
			type: '',
			value: '',
			valueDate: '',
		},
		{
			label: 'Fecha fin',
			field: 'opendDateEnd',
			width: 3,
			control: 'date',
			type: '',
			value: '',
			valueDate: '',
		},
	]);

	useEffect(() => {
		const fetchApi = async () => {
			try {
				const response = await getCashRegisterListPaginado(
					`?max=1000&page=1`
				);
				const copyFilters = [...filters];
				copyFilters[0].options = response.list.map((item) => ({
					label: item.description,
					value: item.id,
				}));
			} catch (error) {}
		};
		fetchApi();
	}, []);

	const fetchList = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getCashRegisterControlListPaginado(`?${q}`);
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

	const columns = useMemo(
		() => [
			{
				Header: 'Caja',
				accessor: 'cashRegister.description',
				style: {
					width: '9%',
				},
			},
			{
				Header: 'Fecha',
				accessor: 'openDate',
				style: {
					width: '8%',
				},
				Cell: ({ value }) =>
					value ? moment.utc(value).local().format('DD-MM-YYYY') : '',
			},
			{
				Header: 'Usuario apertura',
				accessor: 'createdBy.name',
				style: {
					width: '14%',
				},
			},
			{
				id: 'horaApertura',
				Header: 'Hora apertura',
				style: {
					width: '6%',
				},
				Cell: ({ row }) =>
					row.original.openDate
						? moment
								.utc(row.original.openDate)
								.local()
								.format('HH:mm')
						: '',
			},
			{
				Header: 'Usuario cierre',
				accessor: 'closedBy.name',
				style: {
					width: '14%',
				},
			},
			{
				Header: 'Fecha cierre',
				accessor: 'closeDate',
				style: {
					width: '12%',
				},
				Cell: ({ value }) =>
					value
						? moment.utc(value).local().format('DD-MM-YYYY HH:mm')
						: '',
			},
			{
				Header: 'Usuario aprobó',
				accessor: 'approvedBy.name',
				style: {
					width: '14%',
				},
			},
			{
				Header: 'Monto inicial',
				accessor: 'initialAmount',
				style: {
					width: '6%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Monto',
				accessor: 'amount',
				style: {
					width: '7%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<span
							onClick={() => {
								setCurrentChidlren('closeCashRegister');
								if (row.original.closedBy === null) {
									handleCloseCash(row.original.id);
								}
							}}
							className="pe-2"
							id={`btn-span-close-cash-${row.original.id}`}
						>
							<i
								className={`mdi mdi-progress-close text-danger fs-5 ${
									row.original.closedBy === null
										? 'opacity-1'
										: 'opacity-50'
								}`}
							/>
							<TooltipDescription
								text={`${
									row.original.closedBy === null
										? 'Cerrar caja'
										: 'Caja cerrada'
								}`}
								id={`btn-span-close-cash-${row.original.id}`}
							/>
						</span>
						{user.roles.includes(ROLE_ADMINISTRACION) ||
							(user.roles.includes(ROLE_CONTABILIDAD) && (
								<span
									onClick={() => {
										setCurrentChidlren(
											'approveCloseCashRegister'
										);
										if (
											row.original.approvedBy === null &&
											row.original.closedBy !== null
										) {
											handleCloseCash(row.original.id);
										}
									}}
									className="pe-2"
									id={`btn-span-approve-close-cash-${row.original.id}`}
								>
									<i
										className={`mdi mdi-account-key-outline text-primary fs-5 ${
											row.original.approvedBy === null &&
											row.original.closedBy !== null
												? 'opacity-1'
												: 'opacity-50'
										}`}
									/>
									<TooltipDescription
										text={`${
											row.original.closedBy === null
												? 'Debe cerrar la caja primero'
												: row.original.approvedBy ===
												  null
												? 'Aprobar cierre de caja'
												: 'Cierre de caja aprobado'
										}`}
										id={`btn-span-approve-close-cash-${row.original.id}`}
									/>
								</span>
							))}
						<span
							onClick={() => {
								navigate(
									`/cashregistercontrol/movement/${row.original.id}`
								);
							}}
							className="pe-2"
							id={`btn-span-movement-cash-${row.original.id}`}
						>
							<i className={`fas fa-coins text-warning fs-5`} />
							<TooltipDescription
								text={`Movimientos`}
								id={`btn-span-movement-cash-${row.original.id}`}
							/>
						</span>
						<span
							onClick={() => {
								navigate(
									`/cashregistercontrol/summary/${row.original.id}`
								);
							}}
							className="pe-2"
							id={`btn-span-summary-cash-${row.original.id}`}
						>
							<i
								className={`fas fa-balance-scale text-info fs-6`}
							/>
							<TooltipDescription
								text={`Resumen de caja`}
								id={`btn-span-summary-cash-${row.original.id}`}
							/>
						</span>
					</>
				),
				style: {
					width: '10%',
				},
			},
		],
		[navigate]
	);

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

	const handleOpenCash = () => {
		setOpenModalCash(true);
	};
	const handleCloseCash = (id) => {
		setSelectedId(id);
		setModalCloseCash(true);
	};

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Caja', width: '9%' },
						{ name: 'Fecha', width: '8%' },
						{ name: 'Usuario de apertura', width: '14%' },
						{ name: 'Hora apertura', width: '6%' },
						{ name: 'Usuario cierre', width: '14%' },
						{ name: 'Fecha cierre', width: '12%' },
						{ name: 'Usuario aprobó', width: '14%' },
						{ name: 'Monto inicial', width: '6%' },
						{ name: 'Monto total', width: '7%' },
						{ name: 'Acciones', width: '10%' },
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

	const handleCloseCashRegister = async () => {
		setIsSubmiting(true);
		try {
			let response = await closeCashRegisterControl(selectedId);
			if (response) {
				dispatch(
					addMessage({
						type: 'success',
						message: CLOSE_CASH_SUCCESS,
					})
				);
				setSelectedId(null);
				setModalCloseCash(false);
				fetchList();
			} else {
				dispatch(
					addMessage({
						type: 'error',
						message: ERROR_SERVER,
					})
				);
			}
			setIsSubmiting(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setIsSubmiting(false);
		}
	};

	const handleApproveCloseCashRegister = async () => {
		setIsSubmiting(true);
		try {
			let response = await approveCloseCashRegisterControl(selectedId);
			if (response) {
				dispatch(
					addMessage({
						type: 'success',
						message: APPROVE_CLOSE_CASH_SUCCESS,
					})
				);
				setSelectedId(null);
				setModalCloseCash(false);
				fetchList();
			} else {
				dispatch(
					addMessage({
						type: 'error',
						message: ERROR_SERVER,
					})
				);
			}
			setIsSubmiting(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setIsSubmiting(false);
		}
	};
	const childrens = {
		closeCashRegister: (
			<CloseCashRegister
				isSubmiting={isSubmiting}
				handleCloseCashRegister={handleCloseCashRegister}
			/>
		),
		approveCloseCashRegister: (
			<ApproveCloseCashRegister
				isSubmiting={isSubmiting}
				handleApproveCloseCashRegister={handleApproveCloseCashRegister}
			/>
		),
	};

	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Control de caja'}
						breadcrumbItem={'Control de caja'}
						add={{
							allow: true,
							text: 'Crear Nuevo',
							goPageCreate: handleOpenCash,
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
				open={openModalCash}
				setOpen={setOpenModalCash}
				title={'Abrir caja'}
				size="md"
				children={
					<FormOpenCashRegisterControl
						setOpenModalAdd={setOpenModalCash}
						refetch={fetchList}
					/>
				}
			/>
			<DialogMain
				open={modalCloseCash}
				setOpen={setModalCloseCash}
				size="md"
				title={getHeaderTitle(currentChildren)}
				children={childrens[currentChildren]}
			/>
		</>
	);
}

export default CashRegisterControl;

const getHeaderTitle = (children) => {
	const obj = {
		closeCashRegister: 'Cerrar caja',
		approveCloseCashRegister: 'Aprobar cierre de caja',
	};

	return obj[children] || 'Caja';
};
