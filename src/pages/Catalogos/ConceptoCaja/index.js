import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import DeleteDialog from '../../../components/Common/DeleteDialog';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import CellActions from '../../../components/Tables/CellActions';
import CellFormatEnable from '../../../components/Tables/CellFormatEnable';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { DELETE_SUCCESS, ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import {
	deleteCashConcept,
	getCashConceptListPaginado,
} from '../../../helpers/catalogos/cashConcept';

function ConceptoCaja() {
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
			label: 'Descripción',
			field: 'description',
			width: 3,
			control: 'input',
			type: 'text',
			value: '',
		},
		{
			label: 'Habilitado',
			field: 'enabled',
			width: 2,
			control: 'checkbox',
			type: 'text',
			value: '',
		},
		{
			label: 'Tipo de operación',
			field: 'typeOperation',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [
				{ label: 'Salida', value: 'OUT' },
				{ label: 'Entrada', value: 'IN' },
			],
		},
	]);

	const fetchList = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getCashConceptListPaginado(`?${q}`);
			//console.log(response)
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
		navigate(`/cashconcept/edit/${row.original.id}`);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Descripción',
				accessor: 'description',
				style: {
					width: '40%',
				},
			},
			{
				Header: 'No. cuenta',
				accessor: 'accountNumber',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Tipo de operación',
				accessor: 'typeOperation',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => (value === 'IN' ? 'Entrada' : 'Salida'),
			},
			{
				Header: 'Habilitado',
				accessor: 'enabled',
				Cell: ({ row, value }) => (
					<CellFormatEnable
						value={value}
						okText="Habilitado"
						failText="No habilitado"
					/>
				),
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
		navigate('/cashconcept/create');
	};

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteCashConcept(selectedIdDelete);
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

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Descripción', width: '40%' },
						{ name: 'No. cuenta', width: '20%' },
						{ name: 'Tipo de operación', width: '20%' },
						{ name: 'Habilitado', width: '10%' },
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
						title={'Concepto de caja'}
						breadcrumbItem={'Concepto de caja'}
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

export default ConceptoCaja;
