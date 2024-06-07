import moment from 'moment';
import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Badge, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import Paginate from '../../../components/Tables/Paginate';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { ERROR_SERVER } from '../../../constants/messages';
import { getLogsListPaginado } from '../../../helpers/seguridad/logs';
import { addMessage } from '../../../redux/messageSlice';
import { classBadge } from '../../../utils/classBadge';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { getTranslateAction } from '../../../utils/getTranslateAction';
import { getTranslateModel } from '../../../utils/getTranslateModel';

function Logs() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});
	const [filters, setFilters] = useState([
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
		{
			label: 'Acción',
			field: 'actionMethod',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [
				{
					label: 'Actualizado',
					value: 'UPDATE',
				},
				{
					label: 'Creado',
					value: 'CREATE',
				},
				{
					label: 'Eliminado',
					value: 'DELETE',
				},
			],
		},
		{
			label: 'Usuario',
			field: 'username',
			width: 3,
			control: 'input',
			type: 'text',
			value: '',
		},
	]);

	const fetchList = async () => {
		let q = Object.keys(query)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getLogsListPaginado(`?${q}`);
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
				Header: 'Modelo',
				accessor: 'model',
				Cell: ({ value }) => getTranslateModel(value),
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Acción',
				accessor: 'action',
				Cell: ({ value }) => (
					<Badge
						className={
							'font-size-12 badge-soft-' + classBadge(value)
						}
						color={classBadge(value)}
						pill
					>
						{getTranslateAction(value)}
					</Badge>
				),
				style: {
					width: '8%',
				},
			},
			{
				Header: 'Trace ID',
				id: 'data-id',
				Cell: ({ row, value }) => JSON.parse(row.original.data)?.id,
				style: {
					width: '7%',
				},
			},
			{
				Header: 'Usuario',
				accessor: 'user.name',
				style: {
					width: '12%',
				},
			},
			{
				Header: 'Fecha',
				accessor: 'dateCreated',
				Cell: ({ value }) =>
					value
						? moment(value, 'YYYY-MM-DDTHH:mm:ss').format(
								'DD/MM/YYYY HH:mm:ss'
						  )
						: '',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Descripción técnica',
				accessor: 'data',
				style: {
					width: '40%',
				},
			},
			{
				Header: 'IP',
				accessor: 'ipAddress',
				style: {
					width: '8%',
				},
			},
		],
		[]
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

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Descripción', width: '60%' },
						{ name: 'Usuario', width: '15%' },
						{ name: 'Fecha', width: '15%' },
						{ name: 'IP', width: '10%' },
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
						title={'Bitácora'}
						breadcrumbItem={'Bitácora'}
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
		</>
	);
}

export default Logs;
