import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Badge, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { getBracaletListPaginado } from '../../../helpers/contabilidad/bracalet';
import moment from 'moment';
import DialogMain from '../../../components/Common/DialogMain';
import FormBrazaleteDelete from '../../../components/Contabilidad/Brazalete/FormBrazaleteDelete';

function Brazaletes() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const navigate = useNavigate();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
			label: 'Color',
			field: 'color',
			width: 3,
			control: 'input',
			type: 'text',
			value: '',
		},
		{
			label: 'Estado',
			field: 'status',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [
				{ label: 'Reservado', value: 'RESERVED' },
				{ label: 'Disponible', value: 'AVAILABLE' },
			],
		},
	]);

	const fetchList = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getBracaletListPaginado(`?${q}`);
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
					width: '50%',
				},
			},
			{
				Header: 'Fecha creación',
				accessor: 'dateCreated',
				style: {
					width: '10%',
				},
				Cell: ({ value }) =>
					value ? moment.utc(value).local().format('DD-MM-YYYY') : '',
			},
			{
				Header: 'Color',
				accessor: 'color',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => {
					if (value === 'Rojo') {
						return (
							<span>
								<span
									className="bg-danger me-2"
									style={{
										width: '8px',
										height: '8px',
										display: 'inline-block',
										borderRadius: '50%',
									}}
								></span>
								Rojo
							</span>
						);
					} else if (value === 'Verde') {
						return (
							<span>
								<span
									className="bg-success me-2"
									style={{
										width: '8px',
										height: '8px',
										display: 'inline-block',
										borderRadius: '50%',
									}}
								></span>
								Verde
							</span>
						);
					} else {
						return value;
					}
				},
			},
			{
				Header: 'Estado',
				accessor: 'status',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => {
					if (value === 'AVAILABLE') {
						return <Badge color="secondary">Disponible</Badge>;
					} else if (value === 'RESERVED') {
						return <Badge color="success">Reservado</Badge>;
					} else {
						return <Badge color="danger">Cancelado</Badge>;
					}
				},
			},
		],
		[]
	);

	const onHandleModalToDelete = () => {
		setShowDeleteDialog(true);
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
		navigate('/bracelet/create');
	};
	const goPageCreateLote = () => {
		navigate('/bracelet/create/lote');
	};

	const onHandleCloseDialog = () => {
		setShowDeleteDialog(false);
		fetchList();
	};

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Código', width: '50%' },
						{ name: 'Fecha creación', width: '10%' },
						{ name: 'Color', width: '20%' },
						{ name: 'Estado', width: '20%' },
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
						title={'Brazalete'}
						breadcrumbItem={'Brazalete'}
						add={{
							allow: true,
							text: 'Crear Nuevo',
							goPageCreate: goPageCreate,
						}}
						addLote={{
							allow: true,
							text: 'Crear Lote',
							goPageCreate: goPageCreateLote,
						}}
						deleteLote={{
							allow: true,
							text: 'Eliminar Lote',
							action: onHandleModalToDelete,
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
				open={showDeleteDialog}
				setOpen={setShowDeleteDialog}
				title={'Eliminar brazalete por lote'}
				size="xl"
				children={
					<FormBrazaleteDelete
						onHandleCloseDialog={onHandleCloseDialog}
						setOpen={setShowDeleteDialog}
					/>
				}
			/>
		</>
	);
}

export default Brazaletes;
