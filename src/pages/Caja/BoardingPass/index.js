import { useCallback, useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { DELETE_SUCCESS, ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import {
	deleteBoardingPass,
	getBoardingPassListPaginado,
} from '../../../helpers/caja/boardingPass';
import DeleteDialog from '../../../components/Common/DeleteDialog';
import { numberFormat } from '../../../utils/numberFormat';
import moment from 'moment';
import DialogMain from '../../../components/Common/DialogMain';
import TicketBoardingPass from '../../../components/Tickets/TicketBoardingPass';

function BoardingPass() {
	const dispatch = useDispatch();
	const [ticket, setTicket] = useState(null);
	const [ticketDialog, setTicketDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const navigate = useNavigate();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setDeleting] = useState(false);
	const [selectedIdDelete, setSelectedIdDeleted] = useState(null);
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

	const fetchList = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getBoardingPassListPaginado(`?${q}`);
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

	const generateTicket = useCallback((row) => {
		setTicket(row.original);
		setTicketDialog(true);
	}, []);

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Pax',
				accessor: 'pax',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Brazaletes',
				accessor: 'bracelets',
				style: {
					width: '50%',
				},
				Cell: ({ value }) =>
					value.map((it) => it.color + ' ' + it.code).join(', '),
			},
			{
				Header: 'Total',
				accessor: 'amount',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Fecha',
				accessor: 'dateCreated',
				style: {
					width: '10%',
				},
				Cell: ({ value }) =>
					moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY'),
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => {
					return (
						<div className="d-flex">
							<Button
								color={
									row.original.deleted
										? 'secondary'
										: 'primary'
								}
								size="sm"
								outline
								type="button"
								disabled={row.original.deleted}
								className={'me-1 fs-5 py-0'}
								onClick={
									!row.original.deleted
										? () => generateTicket(row)
										: () => {}
								}
							>
								<i className="bx bx-download" />
							</Button>
							<Button
								color={
									row.original.deleted
										? 'secondary'
										: 'danger'
								}
								size="sm"
								outline
								disabled={row.original.deleted}
								className={'fs-5 py-0'}
								type="button"
								onClick={
									row.original.deleted
										? () => {}
										: () => handleShowDialogDelete(row)
								}
							>
								<i className="far fa-trash-alt" />
							</Button>
						</div>
					);
				},
				style: {
					width: '5%',
					textAlign: 'center',
				},
			},
		],
		[generateTicket]
	);

	const handleShowDialogDelete = (row) => {
		setShowDeleteDialog(true);
		setSelectedIdDeleted(row.original.id);
	};
	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteBoardingPass(selectedIdDelete);
			fetchList();
			setDeleting(false);
			setShowDeleteDialog(false);
			dispatch(
				addMessage({
					message: DELETE_SUCCESS,
					type: 'success',
				})
			);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setDeleting(false);
		}
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
		navigate('/boardingpass/create');
	};

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Código', width: '15%' },
						{ name: 'Pax', width: '10%' },
						{ name: 'Brazaletes', width: '50%' },
						{ name: 'Total', width: '10%' },
						{ name: 'Fecha', width: '10%' },
						{ name: 'Acciones', width: '5%' },
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
						title={'Pase de salida'}
						breadcrumbItem={'Pase de salida'}
						add={{
							allow: true,
							text: 'Crear Nuevo',
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
			<DeleteDialog
				handleDelete={handleDelete}
				show={showDeleteDialog}
				setShow={setShowDeleteDialog}
				isDeleting={isDeleting}
			/>
			<DialogMain
				open={ticketDialog}
				setOpen={setTicketDialog}
				title={'Ticket'}
				size="md"
				children={<TicketBoardingPass ticket={ticket} />}
			/>
		</>
	);
}

export default BoardingPass;
