import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Col, Container, Row } from 'reactstrap';
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
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPayment from '../../../components/Tickets/TicketPayment';

function BoardingPass() {
	const dispatch = useDispatch();
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

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Pax',
				accessor: 'pax',
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Brazaletes',
				accessor: 'bracelets',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => (
					<div className="d-flex flex-wrap">
						{value.map((it, idx) => (
							<Badge color="secondary" key={`braz-${idx}`}>
								{`${it.color} ${it.code}`}
							</Badge>
						))}
					</div>
				),
			},
			{
				Header: 'Precio x Pax (USD)',
				accessor: 'priceUSD',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Total (USD)',
				accessor: 'amountUSD',
				style: {
					width: '9%',
				},
				Cell: ({ value }) => (
					<span className="text-primary fw-bold">
						{numberFormat(value)}
					</span>
				),
			},
			{
				Header: 'Tipo cambio',
				accessor: 'currencyExchange',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Precio x Pax (MXN)',
				accessor: 'price',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Total (MXN)',
				accessor: 'amount',
				style: {
					width: '9%',
				},
				Cell: ({ value }) => (
					<span className="text-success fw-bold">
						{numberFormat(value)}
					</span>
				),
			},
			{
				Header: 'Fecha salida',
				accessor: 'departureDate',
				style: {
					width: '12%',
				},
				Cell: ({ value }) =>
					moment(value, 'YYYY-MM-DDTHH:mm').format(
						'DD-MM-YYYY HH:mm'
					),
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => {
					return (
						<div className="d-flex">
							{row.original.deleted ? (
								<Button
									color="secondary"
									size="sm"
									outline
									type="button"
									disabled
									className={'me-1 fs-5 py-0'}
								>
									<i className="bx bx-download" />
								</Button>
							) : (
								<PDFDownloadLink
									className="btn btn-outline-primary btn-sm me-1 fs-5 py-0"
									document={
										row.original ? (
											<TicketPayment
												ticket={row.original}
											/>
										) : null
									}
									fileName={`${row.original.code}.pdf`}
								>
									{({ blob, url, loading, error }) =>
										loading ? (
											<i className="mdi mdi-timer-sand" />
										) : (
											<i className="bx bx-download" />
										)
									}
								</PDFDownloadLink>
							)}
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
		[]
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
						{ name: 'Código', width: '10%' },
						{ name: 'Pax', width: '5%' },
						{ name: 'Brazaletes', width: '20%' },
						{ name: 'Precio x Pax (USD)', width: '10%' },
						{ name: 'Total (USD)', width: '9%' },
						{ name: 'Tipo cambio', width: '10%' },
						{ name: 'Precio x Pax (MXN)', width: '10%' },
						{ name: 'Total (MXN)', width: '9%' },
						{ name: 'Fecha salida', width: '12%' },
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
		</>
	);
}

export default BoardingPass;
