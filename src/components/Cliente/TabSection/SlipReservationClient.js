import { Badge, Col, Row } from 'reactstrap';
import TabActionHeader from '../Common/TabActionHeader';
import DialogMain from '../../Common/DialogMain';
import { useEffect, useMemo, useState } from 'react';
import SimpleTable from '../../Tables/SimpleTable';
import {
	ACTIVE_DEBT,
	CANCEL_RESERVATION_SUCCESS,
	DELETE_QUESTION_CONFIRMATION,
	ERROR_SERVER,
} from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { addMessage } from '../../../redux/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import TableLoader from '../../Loader/TablaLoader';
import moment from 'moment';
import CellActions from '../../Tables/CellActions';
import {
	cancelReservation,
	cancelReservationUser,
	getSlipReservationByClient,
} from '../../../helpers/marina/slipReservation';
import FormSlipReservationClient from '../../Marina/SlipReservation/FormSlipReservationClient';
import { numberFormat } from '../../../utils/numberFormat';
import ChargesCanvas from '../ChargesCanvas';
import ContentLoader from '../../Loader/ContentLoader';
import { ROLE_ADMINISTRACION, ROLE_COMPANIA } from '../../../constants/roles';
import FormCancelReservation from './FormCancelReservation';
import { Link } from 'react-router-dom';
import { getCurrencyExchangeByCode } from '../../../helpers/catalogos/currencyExchange';

export default function SlipReservationClient({ formik }) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [loadingItems, setLoadingItems] = useState(true);
	const [openModalAdd, setOpenModalAdd] = useState(false);
	const [items, setItems] = useState([]);
	const [refetch, setRefetch] = useState(true);
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [openCharges, setOpenCharges] = useState(false);
	const [openModalCancel, setOpenModalCancel] = useState(false);
	const [openModalCancelReservation, setOpenModalCancelReservation] =
		useState(false);
	const [isCancel, setIsCancel] = useState(false);
	const [item, setItem] = useState({
		customer: { id: formik.values.id },
	});
	const [isCancelingReservation, setIsCancelingReservation] = useState(false);
	//calculated  currencyExchange
	const [currencyExchange, setCurrencyExchange] = useState(0)

	const addNewModal = () => {
		setItem({ customer: { id: formik.values.id } });
		setOpenModalAdd(true);
	};

	const editAction = (row) => {
		const slip = row.original;
		setItem((prev) => ({
			...prev,
			...slip,
			id: slip.id,
			price: slip.price,
			observations: slip.observations,
			customer: { id: formik.values.id },
			boat: slip.boat,
			slip: slip.slip,
			arrivalDate: slip.arrivalDate,
			departureDate: slip.departureDate,
			status: slip.status,
			balance: slip.balance,
			needInvoice: slip.needInvoice ?? false,
			forgivenInterest: slip.forgivenInterest ?? false,
		}));
		setOpenModalAdd(true);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '12%',
				},
				Cell: ({ row, value }) => (
					<Link to={`/reservation/edit/${row.original?.id}`}>
						{`${value}`}
					</Link>
				),
			},
			{
				Header: 'Slip',
				accessor: 'slip.code',
				style: {
					width: '4%',
				},
			},
			{
				Header: 'Embarcación',
				accessor: 'boat.name',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Fecha llegada',
				accessor: 'arrivalDate',
				style: {
					width: '8%',
				},
				Cell: ({ value }) =>
					value ? moment.utc(value).local().format('DD-MM-YYYY') : '',
			},
			{
				Header: 'Fecha salida',
				accessor: 'departureDate',
				style: {
					width: '8%',
				},
				Cell: ({ value }) =>
					value
						? moment.utc(value).local().format('DD-MM-YYYY')
						: 'VIGENTE',
			},
			{
				Header: 'Balance',
				accessor: 'balance',
				style: {
					width: '5%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Precio (MXN)',
				accessor: 'price',
				style: {
					width: '8%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Deuda (MXN)',
				accessor: 'debt.debt',
				style: {
					width: '8%',
				},
				Cell: ({ row, value }) =>
					row.original.status === 'CONFIRMED' ? (
						<span
							className={
								value > 0 ? 'text-danger' : 'text-success'
							}
						>
							{numberFormat(value)}
						</span>
					) : (
						numberFormat(value)
					),
			},
			{
				Header: 'Precio (USD)',
				accessor: 'priceUSD',
				style: {
					width: '8%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Deuda (USD)',
				accessor: 'debt.debtUSD',
				style: {
					width: '8%',
				},
				Cell: ({ row, value }) =>
					row.original.status === 'CONFIRMED' ? (
						<span
							className={
								value > 0 ? 'text-danger' : 'text-success'
							}
						>
							{numberFormat(value)}
						</span>
					) : (
						numberFormat(value)
					),
			},
			{
				Header: 'Estado',
				accessor: 'status',
				style: {
					width: '7%',
				},
				Cell: ({ value }) => {
					if (value === 'PENDING') {
						return <Badge color="warning">Pendiente</Badge>;
					} else if (value === 'CONFIRMED') {
						return <Badge color="success">Confirmada</Badge>;
					} else {
						return <Badge color="danger">Cancelada</Badge>;
					}
				},
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<CellActions
							edit={
								row.original.status === 'CANCELLED'
									? null
									: { allow: true, action: editAction }
							}
							cancel={
								row.original.status === 'CANCELLED'
									? null
									: {
											allow: true,
											action: handleShowDialogCancel,
									  }
							}
							charge={
								row.original.status !== 'CONFIRMED'
									? null
									: {
											allow: true,
											action: handleShowDialogCharge,
									  }
							}
							cancelReservation={
								row.original.status === 'CANCELLED'
									? null
									: {
											allow:
												user.roles.includes(
													ROLE_ADMINISTRACION
												) ||
												user.roles.includes(
													ROLE_COMPANIA
												),
											action: handleShowDialogCancelReservation,
									  }
							}
							row={row}
						/>
					</>
				),
				style: {
					width: '13%',
				},
			},
		],
		[user.roles]
	);

	const handleShowDialogCancel = (row) => {
		setOpenModalCancel(true);
		setSelectedReservation(row.original);
	};

	const handleShowDialogCancelReservation = (row) => {
		setOpenModalCancelReservation(true);
		setSelectedReservation(row.original);
	};

	const handleShowDialogCharge = (row) => {
		setSelectedReservation(row.original);
		setOpenCharges(true);
	};

	const fetchItemsForClientApi = async () => {
		try {
			const query = `?page=1&max=100`;
			const response = await getSlipReservationByClient(
				formik.values.id,
				query
			);
			setItems(response.list);
			setLoadingItems(false);
		} catch (error) {
			setItems([]);
			setLoadingItems(false);
		}
	};

	useEffect(() => {
		if (refetch && formik.values.id) {
			setLoadingItems(true);
			fetchItemsForClientApi();
			setRefetch(false);
		} else if (!formik.values.id) {
			setLoadingItems(false);
		}
	}, [refetch, formik.values.id]);

	const onCloseCancel = () => {
		setOpenModalCancel(false);
	};

	const handleCancelar = async () => {
		setIsCancel(true);
		try {
			const response = await cancelReservationUser(
				selectedReservation.id
			);
			if (response) {
				setRefetch(true);
				setOpenModalCancel(false);
				dispatch(
					addMessage({
						message: CANCEL_RESERVATION_SUCCESS,
						type: 'success',
					})
				);
			} else {
				dispatch(
					addMessage({
						type: 'error',
						message: ERROR_SERVER,
					})
				);
			}
			setIsCancel(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setIsCancel(false);
		}
	};

	const handleCancelReservation = async (values) => {
		setIsCancelingReservation(true);
		try {
			const query = `id=${selectedReservation.id}&reason=${values.reason}&forgivenBalance=${values.forgivenBalance}`;
			const response = await cancelReservation(query);
			if (response) {
				setIsCancelingReservation(false);
				setRefetch(true);
				setOpenModalCancelReservation(false);
				dispatch(
					addMessage({
						message: CANCEL_RESERVATION_SUCCESS,
						type: 'success',
					})
				);
			} else {
				dispatch(
					addMessage({
						type: 'error',
						message: ERROR_SERVER,
					})
				);
			}
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setIsCancelingReservation(false);
		}
	};

	//checar //calculated  currencyExchange
	useEffect(() => {
		const fetchCE = async () => {
			try {
				const response = await getCurrencyExchangeByCode('usd')
				setCurrencyExchange(response.currencyExchange)
			} catch (error) {
				setCurrencyExchange(0)
			}
		}
		fetchCE();
	}, [])

	return (
		<>
			<TabActionHeader
				add={{
					allow: formik.values.id ? true : false,
					handleAction: addNewModal,
				}}
			/>
			<Row className="mt-2">
				<Col xs="12" md="12">
					{loadingItems ? (
						<TableLoader
							columns={[
								{ name: 'Código', width: '12%' },
								{ name: 'Slip', width: '6%' },
								{ name: 'Embarcación', width: '15%' },
								{ name: 'Fecha llegada', width: '9%' },
								{ name: 'Fecha salida', width: '9%' },
								{ name: 'Precio (MXN)', width: '8%' },
								{ name: 'Deuda (MXN)', width: '8%' },
								{ name: 'Precio (USD)', width: '8%' },
								{ name: 'Deuda (USD)', width: '8%' },
								{ name: 'Estado', width: '10%' },
								{ name: 'Acciones', width: '10%' },
							]}
						/>
					) : (
						<SimpleTable columns={columns} data={items} />
					)}
				</Col>
			</Row>

			{/*agregar modal boat for client*/}
			<DialogMain
				open={openModalAdd}
				setOpen={setOpenModalAdd}
				title={
					item?.id ? 'Actualizar reservación' : 'Agregar reservación'
				}
				size="xl"
				children={
					<FormSlipReservationClient
						item={item}
						setOpenModalAdd={setOpenModalAdd}
						setRefetch={setRefetch}
					/>
				}
			/>
			<ChargesCanvas
				reservation={selectedReservation}
				customerId={formik.values.id}
				open={openCharges}
				setOpen={setOpenCharges}
				setRefetch={setRefetch}
				currencyExchange={currencyExchange}
			/>

			<DialogMain
				open={openModalCancel}
				setOpen={setOpenModalCancel}
				title={'Cancelar reservación'}
				size="md"
				children={
					selectedReservation
						? selectedReservation?.debt.debt > 0
							? contentDialogNotCancel
							: contentDialogCancel(
									isCancel,
									onCloseCancel,
									handleCancelar
							  )
						: null
				}
			/>

			<DialogMain
				open={openModalCancelReservation}
				setOpen={setOpenModalCancelReservation}
				title={'Cancelar reservación'}
				size="md"
				children={
					<FormCancelReservation
						handleCancelReservation={handleCancelReservation}
						isSubmitting={isCancelingReservation}
					/>
				}
			/>
		</>
	);
}

const contentDialogNotCancel = (
	<>
		<Row>
			<Col lg={12}>
				<div className="text-center">
					<i
						className="mdi mdi-alert-circle-outline"
						style={{ fontSize: '9em', color: 'orange' }}
					/>
					<h4>
						Debe pagar su deuda antes de cancelar la reservación
					</h4>
				</div>
			</Col>
		</Row>
	</>
);

const contentDialogCancel = (isCancel, onCloseCancel, handleCancelar) => (
	<>
		{isCancel && <ContentLoader text="Cancelando reservación..." />}
		<Row>
			<Col lg={12}>
				<div className="text-center">
					<i
						className="mdi mdi-alert-circle-outline"
						style={{ fontSize: '9em', color: 'orange' }}
					/>
					<h2>¿Estas seguro de cancelar la reservación</h2>
					<h4>{DELETE_QUESTION_CONFIRMATION}</h4>
				</div>
			</Col>
		</Row>
		<Row>
			<Col>
				{isCancel ? (
					<div className="text-center mt-3">
						<button
							type="button"
							className="btn btn-danger btn-lg ms-2"
							disabled
						>
							¡Sí, cancelar reservación!
						</button>
					</div>
				) : (
					<div className="text-center mt-3">
						<button
							type="button"
							className="btn btn-danger btn-lg ms-2"
							onClick={handleCancelar}
						>
							¡Sí, cancelar reservación!
						</button>
					</div>
				)}
			</Col>
		</Row>
	</>
);
