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
import FormPayment from '../../Marina/Payment/FormPayment';
import { getBoatByClient } from '../../../helpers/marina/boat';
import CellDate from '../../Tables/CellDate';
import jsFormatNumber from '../../../utils/jsFormatNumber';

export default function PaymentClient({ formik }) {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [paymentDialog, setPaymentDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [idPayment, setIdPayment] = useState(null);
	const [paymentToCancel, setPaymentToCancel] = useState(null);
	const [paymentToEdit, setPaymentToEdit] = useState(null);
	const [openDialogEdit, setOpenDialogEdit] = useState(false);
	const [refetch, setRefetch] = useState(true);

	//paginar
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});

	const [filters, setFilters] = useState([
		{
			label: 'Embarcación',
			field: 'boatId',
			width: 3,
			control: 'select',
			type: '',
			value: '',
			valueSelect: null,
			options: [],
		},
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
	const fetchBoatsByClientApi = async () => {
		try {
			const response = await getBoatByClient(formik.values.id);
			const copyFilters = [...filters];
			copyFilters[0].options = response.list.map((c) => ({
				label: `${c.name}`,
				value: c.id,
			}));
			setFilters(copyFilters);
		} catch (error) {}
	};

	useEffect(() => {
		fetchBoatsByClientApi();
	}, []);

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
				reference: 'Cancelando pago',
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

	const handleEdit = (row) => {
		const { original } = row;
		setPaymentToEdit({
			id: original.id,
			concept: original.concept,
			reference: original.reference,
		});
		setOpenDialogEdit(true);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '7%',
				},
			},
			{
				Header: 'Fecha',
				accessor: 'dateCreated',
				style: {
					width: '7%',
				},
				Cell: CellDate,
			},
			{
				Header: 'Slip / Embarcación',
				accessor: 'systemPayment',
				style: {
					width: '11%',
				},
				Cell: ({ row, value }) =>{
					if(value === 'BALANCE_BP'){
						return "Abono a pase de abordar"
					}else{
						return `${row?.original?.reservation?.slip?.code ?? 'NA'} / ${
							row?.original?.reservation?.boat?.name ?? 'NA'
					}`
					}
					
				},
			},
			{
				Header: 'Moratorios',
				accessor: 'forgivenInterest',
				style: {
					width: '10%',
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
				Header: 'Total',
				id: 'total',
				style: {
					width: '10%',
					textAlign: 'center',
				},
				Cell: ({ row }) => {
					if(row.original.systemPayment === 'BALANCE_BP'){
						const result =  row.original.payments.reduce((acc, curr) => acc+curr.amountUSD, 0)
						return `${jsFormatNumber(result)} (USD)`
					}else{
						const result =  row.original.payments.reduce((acc, curr) => acc+curr.amount, 0)
						return `${jsFormatNumber(result)} (MXN)`
					}
				},
			},			
			{
				Header: 'Detalle',
				accessor: 'payments',
				style: {
					width: '40%',
				},
				Cell: ({ row, value }) => {
					return (
						<table className="mb-0 font-size-12" style={{ width: '100%'}}>
							<thead>
								<tr>
									<th className='border-0 fw-semibold'>Monto</th>
									<th className='border-0 fw-semibold'>C/E</th>
									<th className='border-0 fw-semibold'>Forma de pago</th>
									<th className='border-0 fw-semibold'>Concepto</th>
									<th className='border-0 fw-semibold'>Referencia</th>
								</tr>
							</thead>
							<tbody>
								{
									value.map((item) => (
										<tr key={item.id}>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '20%'}}>{numberFormat(item.currency === 'MXN' ? item.amount :  item.amountUSD)} ({item.currency})</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '10%'}}>{numberFormat(item.currencyExchange, 4, 4)}</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '20%'}}>{getFormaPago(item.paymentForm)}</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '30%'}}>{item.concept}</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '30%'}}>{item.reference}</td>
										</tr>
									))
								}
							</tbody>
						</table>
					)
				}
			},
			{
				Header: 'Estado',
				id: 'status',
				style: {
					width: '5%',
				},
				Cell: ({ row }) => {
					const firStatus = row?.original.payments[0].status
					if (firStatus === 'PENDING') {
						return <Badge color="warning">Pendiente</Badge>;
					} else if (firStatus === 'APPROVED') {
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
					const firStatus = row?.original.payments[0].status
					return (
						<div className="d-flex">
							<Button
								color={'info'}
								size="sm"
								outline
								type="button"
								disabled={firStatus === 'CANCELLED'}
								className={'me-2 fs-4 px-2 py-0'}
								onClick={() => handleEdit(row)}
							>
								<i className="bx bx-pencil" />
							</Button>
							<Button
								color={
									firStatus === 'CANCELLED'
										? 'secondary'
										: 'primary'
								}
								size="sm"
								outline
								type="button"
								disabled={firStatus === 'CANCELLED'}
								className={'me-2 fs-4 px-2 py-0'}
								onClick={
									firStatus === 'APPROVED'
										? () => generatePayment(row)
										: () => {}
								}
							>
								<i className="bx bx-download" />
							</Button>
							<Button
								color={
									firStatus === 'CANCELLED'
										? 'secondary'
										: 'danger'
								}
								size="sm"
								outline
								disabled={firStatus === 'CANCELLED'}
								className={'fs-4 px-2 py-0'}
								type="button"
								onClick={
									firStatus === 'CANCELLED'
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
		if (refetch && formik.values.id) {
			setLoading(true);
			fecthApiPaymentForClient();
			setRefetch(false);
		} else {
			setLoading(false);
		}
	}, [refetch, JSON.stringify(query)]);

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
		setRefetch(true);
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
								{ name: 'Código', width: '10%' },
								{ name: 'Slip / Embarcación', width: '15%' },
								{ name: 'Concepto', width: '20%' },
								{ name: 'Fecha', width: '10%' },
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
			<DialogMain
				open={openDialogEdit}
				setOpen={setOpenDialogEdit}
				title={'Actualizar pago'}
				size="md"
				children={
					<FormPayment
						item={paymentToEdit}
						setOpenModalAdd={setOpenDialogEdit}
						setRefetch={setRefetch}
					/>
				}
			/>
		</>
	);
}
