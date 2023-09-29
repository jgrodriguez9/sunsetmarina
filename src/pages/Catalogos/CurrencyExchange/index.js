import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardBasic from '../../../components/Common/CardBasic';
import CardMain from '../../../components/Common/CardMain';
import FormFilter from '../../../components/Common/FormFilter';
import TableLoader from '../../../components/Loader/TablaLoader';
import Paginate from '../../../components/Tables/Paginate';
import { ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { getCurrencyExchangeListPaginado } from '../../../helpers/catalogos/currencyExchange';
import { numberFormat } from '../../../utils/numberFormat';
import EditableTable from '../../../components/Tables/EditableTable';
import DialogMain from '../../../components/Common/DialogMain';
import FormCurrencyExchange from '../../../components/Catalogo/Moneda/FormCurrencyExchange';

function CurrencyExchange() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const navigate = useNavigate();
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

	const TableCell = ({ getValue, row, column, table }) => {
		const initialValue = getValue();
		const [toggleClass, setToggleClass] = useState(false);
		const [value, setValue] = useState(initialValue);
		useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);
		const onBlur = () => {
			if (value === '') {
				setValue(initialValue);
			} else {
				table.options.meta?.updateData(
					row.original.id,
					column.id,
					value
				);
			}
			setToggleClass(false);
		};
		return (
			<input
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onBlur={onBlur}
				onFocus={() => setToggleClass(!toggleClass)}
				className={`border-0 ${
					toggleClass ? 'form-control border py-1' : ''
				}`}
			/>
		);
	};

	const columns = useMemo(
		() => [
			{
				id: 'name',
				header: 'Nombre',
				accessorKey: 'name',
				style: {
					width: '30%',
				},
				cell: TableCell,
			},
			{
				id: 'code',
				header: 'Código',
				accessorKey: 'code',
				style: {
					width: '20%',
				},
				cell: TableCell,
			},
			{
				id: 'currency',
				header: 'Moneda',
				accessorKey: 'currency',
				style: {
					width: '10%',
				},
				cell: TableCell,
			},
			{
				id: 'iso3',
				header: 'ISO3',
				accessorKey: 'iso3',
				style: {
					width: '10%',
				},
				cell: TableCell,
			},
			{
				id: 'currencyExchange',
				header: 'Tipo de cambio',
				accessorKey: 'currencyExchange',
				style: {
					width: '20%',
				},
				cell: TableCell,
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

	const goPageCreate = () => {
		setOpenModal(true);
	};

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Nombre', width: '30%' },
						{ name: 'Código', width: '20%' },
						{ name: 'Moneda', width: '10%' },
						{ name: 'ISO3', width: '10%' },
						{ name: 'Tipo de cambio', width: '20%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<EditableTable columns={columns} data={items} />
				{/* <SimpleTable columns={columns} data={items} /> */}
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
				children={<FormCurrencyExchange />}
			/>
		</>
	);
}

export default CurrencyExchange;
