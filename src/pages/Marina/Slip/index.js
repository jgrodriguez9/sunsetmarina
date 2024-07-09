import { useCallback, useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Badge, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import DeleteDialog from '../../../components/Common/DeleteDialog';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import CellActions from '../../../components/Tables/CellActions';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { DELETE_SUCCESS, ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { deleteSlip, getSlipListPaginado } from '../../../helpers/marina/slip';
import { numberFormat } from '../../../utils/numberFormat';
import DialogMain from '../../../components/Common/DialogMain';
import FormUpdatePrice from '../../../components/Marina/Slip/FormUpdatePrice';

function Slip() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const navigate = useNavigate();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setDeleting] = useState(false);
	const [selectedIdDelete, setSelectedIdDeleted] = useState(null);
	const [showModalUpdatePrice, setShowModalUpdatePrice] = useState(false);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});
	const [filters, setFilters] = useState([
		{
			label: 'Número',
			field: 'code',
			width: 3,
			control: 'input',
			type: 'text',
			value: '',
		},
	]);

	const fetchList = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getSlipListPaginado(`?${q}`);
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
		navigate(`/slip/edit/${row.original.id}`);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Número',
				accessor: 'code',
				style: {
					width: '30%',
				},
			},
			{
				Header: 'Muelle',
				accessor: 'pier.name',
				style: {
					width: '40%',
				},
			},
			{
				Header: 'Precio',
				accessor: 'price',
				Cell: ({ row }) => numberFormat(row.values.price),
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Estado',
				accessor: 'status',
				Cell: ({ value }) => {
					if (value === 'AVAILABLE') {
						return <Badge color="info">Disponible</Badge>;
					} else if (value === 'RESERVED') {
						return <Badge color="success">Reservado</Badge>;
					} else {
						return <Badge color="danger">Bloqueado</Badge>;
					}
				},
				style: {
					width: '10%',
				},
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<CellActions
							edit={{ allow: true, action: editAction }}
							del={{
								allow: true,
								action: handleShowDialogDelete,
							}}
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

	const handleShowDialogDelete = (row) => {
		setShowDeleteDialog(true);
		setSelectedIdDeleted(row.original.id);
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
		navigate('/slip/create');
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteSlip(selectedIdDelete);
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

	const showModalToUpdatePrice = useCallback(() => {
		setShowModalUpdatePrice(true);
	}, []);

	const successAction = useCallback(() => {
		setShowModalUpdatePrice(false);
		fetchList();
	}, []);

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Número', width: '20%' },
						{ name: 'Muelle', width: '30%' },
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

	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Slip'}
						breadcrumbItem={'Slip'}
						add={{
							allow: true,
							text: 'Crear Nuevo',
							goPageCreate: goPageCreate,
						}}
						updatePrice={{
							allow: true,
							text: 'Actualizar precio slips',
							goPageCreate: showModalToUpdatePrice,
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
				open={showModalUpdatePrice}
				setOpen={setShowModalUpdatePrice}
				title={'Actualizar precio de slips'}
				size="md"
				children={
					<FormUpdatePrice toggleModalReservation={successAction} />
				}
			/>
		</>
	);
}

export default Slip;
