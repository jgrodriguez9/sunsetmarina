import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { DELETE_SUCCESS, ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import {
	cancelPayment,
	getPaymentByClient,
} from '../../../helpers/marina/payment';
import { Badge, Button, Col, Row } from 'reactstrap';
import TableLoader from '../../Loader/TablaLoader';
import SimpleTable from '../../Tables/SimpleTable';
import Paginate from '../../Tables/Paginate';
import { numberFormat } from '../../../utils/numberFormat';
import { getFormaPago } from '../../../utils/getFormaPago';
import { getTipoPago } from '../../../utils/getTipoPago';
import FormFilter from '../../Common/FormFilter';
import CardBasic from '../../Common/CardBasic';
import DialogMain from '../../Common/DialogMain';
import TicketClientPayment from '../../Tickets/TicketClientPayment';
import DeleteDialog from '../../Common/DeleteDialog';

export default function PaymentClient({ formik }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [paymentDialog, setPaymentDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [idPayment, setIdPayment] = useState(null);
	const [paymentToCancel, setPaymentToCancel] = useState(null);

	//paginar
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
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
			label: 'Referencia',
			field: 'reference',
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

	const generatePayment = useCallback((row) => {
		setIdPayment(row.original.id);
		setPaymentDialog(true);
	}, []);

	const fecthApiPaymentForClient = async () => {
		try {
			let q = Object.keys(query)
				.map((key) => `${key}=${query[key]}`)
				.join('&');
			const response = await getPaymentByClient(
				formik.values.id,
				`?${q}`
			);
			setItems(response.list);
			setTotalPaginas(response.pagination.totalPages);
			setTotalRegistros(response.pagination.totalCount);
			setLoading(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setItems([]);
			setLoading(false);
		}
	};

	const handleCancelPayment = useCallback((row) => {
		setIdPayment(row.original.id);
		setPaymentToCancel({
			payment: {
				amount: row.original.amount,
				concept: row.original.concept,
				reference: 'necoPina',
				customer: {
					id: row.original.customer.id,
				},
				systemId: row.original.systemId,
				systemPayment: row.original.systemPayment,
			},
			charges: row.original.charges.map((it) => ({ id: it.id })),
		});
		setShowDeleteDialog(true);
	}, []);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await cancelPayment(idPayment, paymentToCancel);
			fecthApiPaymentForClient();
			setIsDeleting(false);
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
			setIsDeleting(false);
		}
	};

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
				Header: 'Concepto',
				accessor: 'concept',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Fecha',
				accessor: 'dateCreated',
				style: {
					width: '10%',
				},
				Cell: ({ value }) =>
					value ? moment.utc(value).local().format('DD-MM-YYYY') : '',
			},
			{
				Header: 'Monto',
				accessor: 'amount',
				style: {
					width: '8%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Moratorios',
				accessor: 'forgivenInterest',
				style: {
					width: '15%',
					textAlign: 'center',
				},
				Cell: ({ row, value }) => {
					if (value) {
						return (
							<div className="d-flex flex-column align-items-center justify-content-center">
								<strong>Condonado</strong>
								<span className="text-center">
									{row.original.forgivenInterestReason}
								</span>
							</div>
						);
					} else {
						return (
							<span className="text-center d-block">Pagado</span>
						);
					}
				},
			},
			{
				Header: 'Forma de pago',
				accessor: 'paymentForm',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => getFormaPago(value),
			},
			{
				Header: 'Tipo de pago',
				accessor: 'systemPayment',
				style: {
					width: '15%',
				},
				Cell: ({ value }) => getTipoPago(value),
			},
			{
				Header: 'Estado',
				accessor: 'status',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => {
					if (value === 'PENDING') {
						return <Badge color="warning">Pendiente</Badge>;
					} else if (value === 'APPROVED') {
						return <Badge color="success">Aprobado</Badge>;
					} else {
						return <Badge color="danger">Cancelado</Badge>;
					}
				},
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => {
					return (
						<div className="d-flex">
							<Button
								color={
									row.original.status === 'CANCELLED'
										? 'secondary'
										: 'primary'
								}
								size="sm"
								outline
								type="button"
								disabled={row.original.status === 'CANCELLED'}
								className={'me-2 fs-4 px-2 py-0'}
								onClick={
									row.original.status === 'APPROVED'
										? () => generatePayment(row)
										: () => {}
								}
							>
								<i className="bx bx-download" />
							</Button>
							<Button
								color={
									row.original.status === 'CANCELLED'
										? 'secondary'
										: 'danger'
								}
								size="sm"
								outline
								disabled={row.original.status === 'CANCELLED'}
								className={'fs-4 px-2 py-0'}
								type="button"
								onClick={
									row.original.status === 'CANCELLED'
										? () => {}
										: () => handleCancelPayment(row)
								}
							>
								<i className="mdi mdi-cash-remove" />
							</Button>
						</div>
					);
				},
				style: {
					width: '10%',
					textAlign: 'center',
				},
			},
		],
		[]
	);

	useEffect(() => {
		if (formik.values.id) {
			setLoading(true);
			fecthApiPaymentForClient();
		} else {
			setLoading(false);
		}
	}, [JSON.stringify(query)]);

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
			<Row>
				<Col xs="12" lg="12">
					<CardBasic
						title="Filtros"
						children={handleFilter}
						initOpen={false}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="12">
					{loading ? (
						<TableLoader
							columns={[
								{ name: 'Código', width: '15%' },
								{ name: 'Concepto', width: '20%' },
								{ name: 'Fecha', width: '15%' },
								{ name: 'Monto', width: '10%' },
								{ name: 'Forma de pago', width: '10%' },
								{ name: 'Tipo de pago', width: '15%' },
								{ name: 'Estado', width: '10%' },
								{ name: 'Acciones', width: '5%' },
							]}
						/>
					) : (
						<>
							<SimpleTable columns={columns} data={items} />
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
						</>
					)}
				</Col>
			</Row>
			<DialogMain
				open={paymentDialog}
				setOpen={setPaymentDialog}
				title={''}
				size="xl"
				children={<TicketClientPayment idPayment={idPayment} />}
			/>
			<DeleteDialog
				handleDelete={handleDelete}
				show={showDeleteDialog}
				setShow={setShowDeleteDialog}
				isDeleting={isDeleting}
			/>
		</>
	);
}
