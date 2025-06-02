import { useCallback, useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Container, Row, Badge } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import Paginate from '../../../components/Tables/Paginate';
import { ERROR_SERVER, UPDATE_SUCCESS } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import {
	getCurrencyExchangeListPaginado,
	updateCurrencyExchange,
} from '../../../helpers/catalogos/currencyExchange';
import DialogMain from '../../../components/Common/DialogMain';
import FormCurrencyExchange from '../../../components/Catalogo/Moneda/FormCurrencyExchange';
import ContentLoader from '../../../components/Loader/ContentLoader';
import { numberFormat } from '../../../utils/numberFormat';
import CellActions from '../../../components/Tables/CellActions';
import SimpleTable from '../../../components/Tables/SimpleTable';


function CurrencyExchange() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [item, setItem] = useState(null);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const [isSubmiting, setIsSubmiting] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});
	const [filters, setFilters] = useState([
		{
			label: 'Nombre',
			field: 'name',
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
			const response = await getCurrencyExchangeListPaginado(`?${q}`);
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


	const editAction = useCallback((row) => {
		const { original } = row;
		setItem(original);
		setOpenModal(true);
	}, []);

	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				style: {
					width: '30%',
				},
			},
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Moneda',
				accessor: 'currency',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'ISO3',
				accessor: 'iso3',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Tipo de cambio',
				accessor: 'currencyExchange',
				style: {
					width: '10%',
				},
				ell: ({ getValue }) => numberFormat(getValue()),
			},
			{
				Header: 'Tipo de cambio de ayer',
				accessor: 'yesterdayCurrencyExchange',
				style: {
					width: '10%',
				},
				cell: ({ getValue }) => numberFormat(getValue()),
			},
			{
				Header: 'Diferencia',
				accessor: 'difference',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => {
					if (value > 0) {
						return <Badge color="danger">{numberFormat(value)}</Badge>;
					} else {
						return <Badge color="success">{numberFormat(value)}</Badge>;
					}
				},
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<CellActions
							edit={{ allow: true, action: editAction }}
							row={row}
						/>
					</>
				),
				style: {
					width: '10%',
				},
			},
		],
		[editAction]
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

	const goPageCreate = () => {
		setOpenModal(true);
	};
	const updateCurr = async (id, columnId, value) => {
		const data = {
			id: id,
			[columnId]: value,
		};
		setIsSubmiting(true);
		try {
			let response = await updateCurrencyExchange(id, data);
			if (response) {
				dispatch(
					addMessage({
						type: 'success',
						message: UPDATE_SUCCESS,
					})
				);
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

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Nombre', width: '30%' },
						{ name: 'Código', width: '10%' },
						{ name: 'Moneda', width: '10%' },
						{ name: 'ISO3', width: '10%' },
						{ name: 'Tipo de cambio', width: '10%' },
						{ name: 'Tipo de cambio de ayer', width: '10%' },
						{ name: 'Diferencia', width: '10%' },
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
			{isSubmiting && <ContentLoader text="Procesando solicitud" />}
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Moneda'}
						breadcrumbItem={'Moneda'}
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
				open={openModal}
				setOpen={setOpenModal}
				title={'Nueva moneda'}
				size="lg"
				children={
					<FormCurrencyExchange
						item={item}
						handleCloseModal={() => setOpenModal(false)}
						fetchList={fetchList}
					/>
				}
			/>
		</>
	);
}

export default CurrencyExchange;
