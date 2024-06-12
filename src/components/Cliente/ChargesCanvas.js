import { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Input,
	Label,
	Offcanvas,
	OffcanvasBody,
	OffcanvasHeader,
	Row,
	Alert,
} from 'reactstrap';
import {
	getChargeByReservation,
	getTotalChargeUpdated,
} from '../../helpers/marina/charges';
import TableCharges from '../Marina/Charge/TableCharges';
import { numberFormat } from '../../utils/numberFormat';
import SpinLoader from '../Loader/SpinLoader';
import Select from 'react-select';
import moment from 'moment';
import 'moment/locale/es';
import { savePayment } from '../../helpers/marina/payment';
import {
	ERROR_SERVER,
	NOT_CASH_REGISTER_ASSIGN,
} from '../../constants/messages';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';
import { addMessage } from '../../redux/messageSlice';
import { useDispatch } from 'react-redux';
import SuccessPaymentDialog from '../Common/SuccessPaymentDialog';
import { paymentFormOpt } from '../../constants/paymentForm';
import TooltipDescription from '../Common/TooltipDescription';
import { monthsOpt, yearsOpt } from '../../constants/dates';
import { hasCashRegisterAssign } from '../../helpers/caja/boardingPass';
import SimpleLoad from '../Loader/SimpleLoad';
moment.locale('es');

const objStyle = {
	border: '1px solid #2A7EC3',
	fontWeight: 'bolder',
	textTransform: 'uppercase',
	backgroundColor: 'transparent!important',
	boxShadow: 0,
	padding: 0,
	height: '24px',
};
const ChargesCanvas = ({
	reservation,
	open,
	setOpen,
	customerId,
	setRefetch,
}) => {
	const [charge, setCharge] = useState([]);
	const [loading, setLoading] = useState(false);
	const [desde, setDesde] = useState(null);
	const [chargesToPay, setChargesToPay] = useState([]);
	const [concept, setConcept] = useState('');
	const [reference, setReference] = useState('');
	const [paymentForm, setPaymentForm] = useState('CASH');
	const [finalizarReserva, setFinalizarReserva] = useState(false);
	const dispatch = useDispatch();
	const [isPaying, setIsPaying] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [month, setMonth] = useState(null);
	const [year, setYear] = useState(null);
	const [isCalculating, setIsCalculating] = useState(false);
	const [toPay, setToPay] = useState({
		total: null,
		totalCalc: null,
	});
	const [ediTotal, setEditTotal] = useState(false);
	const [disabledButton, setDisabledButton] = useState(true);
	const [ticket, setTicket] = useState({ idPayment: null });
	//states para checar caja
	const [checkCaja, setCheckCaja] = useState({
		loading: true,
		hasCaja: false,
	});
	useEffect(() => {
		const fecthChargesByReservation = async () => {
			try {
				const response = await getChargeByReservation(reservation.id);
				const list = response.list
					.filter((it) => it.status !== 'PAYED')
					.map((it) => ({
						id: it.id,
						amount: it.amount,
						interest: it.interest,
						status: it.status,
						monthYear: it.monthYear,
						fullMonth: true,
						totalMonth: it.totalMonth,
						price: it.reservation.price,
					}));
				setCharge(list);
				setChargesToPay(list);
				setLoading(false);

				if (list.length > 0) {
					setDesde({
						id: list[0].id,
						date: list[0].monthYear,
					});
				}
			} catch (error) {
				setCharge([]);
				setLoading(false);
			}
		};
		if (reservation?.id && open) {
			setLoading(true);
			fecthChargesByReservation();
			setEditTotal(false);
		}
	}, [reservation?.id, open]);

	const toggle = () => {
		setOpen(!open);
	};

	const onHandlePayment = async () => {
		setIsPaying(true);
		const data = {
			endDate: moment(`${year.value}-${month.value}`)
				.endOf('month')
				.format('YYYY-MM-DD'),
			payment: {
				amount: toPay.total,
				concept: concept,
				reference: reference,
				paymentForm: paymentForm,
				customer: {
					id: customerId,
				},
				systemId: 777084,
				systemPayment: 'RESERVATION',
			},
			reservationId: reservation.id,
			charges: chargesToPay,
		};

		try {
			const response = await savePayment(data);
			setTicket({ idPayment: response.id });
			setShowSuccess(true);
			setIsPaying(false);
			// setOpen(false);
			setRefetch(true);
		} catch (error) {
			setIsPaying(false);
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
		}
	};

	const onHandleChangeFinalizarReserva = (isFinalizar) => {
		setFinalizarReserva(isFinalizar);
		const copyChargesToPay = [...chargesToPay];
		if (isFinalizar) {
			copyChargesToPay[copyChargesToPay.length - 1].fullMonth = false;
			setChargesToPay(copyChargesToPay);
		} else {
			copyChargesToPay[copyChargesToPay.length - 1].fullMonth = true;
			setChargesToPay(copyChargesToPay);
		}
	};
	useEffect(() => {
		if (!showSuccess) {
			setOpen(false);
		}
	}, [showSuccess, ticket.payment]);

	//check if has caja asignada
	useEffect(() => {
		const checkCajaApi = async () => {
			try {
				await hasCashRegisterAssign();
				setCheckCaja({
					loading: false,
					hasCaja: true,
				});
			} catch (error) {
				dispatch(
					addMessage({
						type: 'warning',
						message: NOT_CASH_REGISTER_ASSIGN,
					})
				);
				setCheckCaja({
					loading: false,
					hasCaja: false,
				});
			}
		};
		if (open) checkCajaApi();
	}, [dispatch, open]);

	useEffect(() => {
		async function getTotalToPay() {
			try {
				if (month !== null && year !== null) {
					setIsCalculating(true);
					const data = {
						endDate: moment(`${year.value}-${month.value}`)
							.endOf('month')
							.format('YYYY-MM-DD'),
						finished: finalizarReserva,
						charges: charge.map((it) => ({ id: it.id })),
						reservationId: reservation.id,
					};
					const response = await getTotalChargeUpdated(data);
					setIsCalculating(false);
					setToPay({
						total: response.totalAmountMXN,
						totalCalc: response.totalAmountMXN,
					});
					setDisabledButton(false);
				} else {
					setIsCalculating(false);
					setToPay({
						total: null,
						totalCalc: null,
					});
					setDisabledButton(true);
				}
			} catch (error) {
				let message = ERROR_SERVER;
				message = extractMeaningfulMessage(error, message);
				dispatch(
					addMessage({
						type: 'error',
						message: message,
					})
				);
				setIsCalculating(false);
				setToPay({
					total: null,
					totalCalc: null,
				});
				setDisabledButton(true);
			}
		}
		getTotalToPay();
	}, [month, year, charge, finalizarReserva, dispatch, reservation.id]);

	const toggleEditTotal = () => {
		setEditTotal(!ediTotal);
		if (!ediTotal) {
			setToPay((prev) => ({
				...prev,
				total: prev.totalCalc,
			}));
		}
	};
	return (
		<Offcanvas
			isOpen={open}
			toggle={toggle}
			direction="end"
			style={{
				minWidth: '100%',
			}}
		>
			<OffcanvasHeader toggle={toggle} className="border-bottom">
				Cargos
			</OffcanvasHeader>
			<OffcanvasBody className="p-4">
				{loading ? (
					<SpinLoader />
				) : (
					<Row>
						<Col xs="12" md="8">
							<TableCharges items={charge} />
						</Col>
						<Col xs="12" md="4">
							<div className="py-4 border bottom-0 w-100 bg-light ">
								<Row>
									<Col xs="12" md={{ size: 8, offset: 2 }}>
										<h4 className="mb-0">{`${reservation?.customer?.name} ${reservation?.customer?.lastName}`}</h4>
										<h5 className="m-0 fw-normal">
											Embarcación:{' '}
											{reservation?.boat?.name}
										</h5>
										<h5 className="m-0 fw-normal">
											Slip: {reservation?.slip?.code}
										</h5>
										<h5 className="m-0 fw-normal">
											Duración:{' '}
											{moment(
												reservation?.arrivalDate,
												'YYYY-MM-DD'
											).format('DD-MM-YYYY')}{' '}
											{reservation?.departureDate
												? `al{' '}
												${moment(reservation?.departureDate, 'YYYY-MM-DD').format('DD-MM-YYYY')}`
												: ' - No definido'}
										</h5>
									</Col>
								</Row>
								<hr />
								<Row>
									<Col xs="12" md={{ size: 8, offset: 2 }}>
										<div className="d-flex justify-content-between align-items-center mb-2">
											<div>Desde</div>
											<div>
												<strong className="text-uppercase">
													{desde
														? moment(
																desde.date,
																'YYYY-MM'
														  ).format('MMMM YYYY')
														: '-'}
												</strong>
											</div>
										</div>
										<div className="d-flex justify-content-between align-items-center mb-2">
											<div className="flex-1">Hasta</div>
											<div>
												<div className="w-100">
													<div className="d-flex">
														<div className="me-1">
															<Select
																value={month}
																onChange={(
																	value
																) => {
																	setMonth(
																		value
																	);
																}}
																options={
																	year?.value >
																	moment().year()
																		? monthsOpt
																		: monthsOpt.filter(
																				(
																					it
																				) =>
																					parseInt(
																						it.value
																					) >=
																					parseInt(
																						desde?.date?.split(
																							'-'
																						)[1] ??
																							0
																					)
																		  )
																}
																placeholder="Mes"
																classNamePrefix="select2-selection"
																styles={{
																	control: (
																		baseStyles,
																		state
																	) => ({
																		...baseStyles,
																		...objStyle,
																	}),
																}}
															/>
														</div>
														<div>
															<Select
																value={year}
																onChange={(
																	value
																) => {
																	setYear(
																		value
																	);
																}}
																placeholder="Año"
																options={yearsOpt().map(
																	(it) => it
																)}
																classNamePrefix="select2-selection"
																styles={{
																	control: (
																		baseStyles,
																		state
																	) => ({
																		...baseStyles,
																		...objStyle,
																	}),
																}}
															/>
														</div>
													</div>
												</div>
												<div className="text-end">
													<Input
														id="enabled"
														name="enabled"
														type="checkbox"
														className={`form-check-Input form-check-input`}
														disabled={
															charge.length !==
															chargesToPay.length
														}
														checked={
															finalizarReserva
														}
														onChange={(e) =>
															onHandleChangeFinalizarReserva(
																e.target.checked
															)
														}
													/>
													<Label
														htmlFor={`enabled`}
														className="mb-0 ms-1 me-2 text-danger"
													>
														Finalizar reserva
													</Label>
													<i
														className="far fa-question-circle text-dark"
														id="help"
													/>
													<TooltipDescription
														text="Si marca esta casilla el monto a cobrar será hasta el día actual"
														id="help"
													/>
												</div>
											</div>
										</div>
										<div className="mb-2">
											<Label
												htmlFor="paymentForm"
												className="mb-0"
											>
												Forma de pago
											</Label>
											<Select
												value={{
													value: paymentForm,
													label: paymentFormOpt.find(
														(it) =>
															it.value ===
															paymentForm
													).label,
												}}
												onChange={(value) => {
													setPaymentForm(value.value);
												}}
												options={paymentFormOpt}
												classNamePrefix="select2-selection"
											/>
										</div>
										<div className="mb-2">
											<Label
												htmlFor="concept"
												className="mb-0 fw-normal"
											>
												Concepto (Opcional)
											</Label>
											<Input
												id="concept"
												name="concept"
												className="form-control"
												onChange={(e) =>
													setConcept(e.target.value)
												}
												value={concept}
											/>
										</div>
										<div className="mb-2">
											<Label
												htmlFor="concept"
												className="mb-0 fw-normal"
											>
												Referencia (Opcional)
											</Label>
											<Input
												id="concept"
												name="concept"
												className="form-control"
												onChange={(e) =>
													setReference(e.target.value)
												}
												value={reference}
											/>
										</div>

										<div className="d-flex justify-content-between align-items-center mt-5">
											<div>
												<span>
													<strong>Subtotal</strong>
												</span>
											</div>
											<div>
												{isCalculating ? (
													<SpinLoader />
												) : (
													<h4 className="text-secondary m-0">
														{toPay.totalCalc
															? numberFormat(
																	toPay.totalCalc
															  )
															: '-'}
													</h4>
												)}
											</div>
										</div>
										<div className="d-flex justify-content-between align-items-center">
											<div>
												<span>
													<strong>Interés</strong>
												</span>
											</div>
											<div>
												{isCalculating ? (
													<SpinLoader />
												) : (
													<>
														<h4 className="text-secondary m-0 text-end">
															{toPay.totalCalc
																? numberFormat(
																		0
																  )
																: '-'}
														</h4>
														<div className="text-end">
															<Input
																id="enabled"
																name="enabled"
																type="checkbox"
																className={`form-check-Input form-check-input`}
																disabled={
																	charge.length !==
																	chargesToPay.length
																}
																checked={
																	finalizarReserva
																}
																onChange={(e) =>
																	onHandleChangeFinalizarReserva(
																		e.target
																			.checked
																	)
																}
															/>
															<Label
																htmlFor={`enabled`}
																className="mb-0 ms-1 text-secondary"
															>
																Condonar
																intereses
															</Label>
														</div>
													</>
												)}
											</div>
										</div>
										<hr />
										<div className="d-flex justify-content-between align-items-center">
											<div>
												<span>
													<strong>Total</strong>
												</span>
											</div>
											<div>
												{isCalculating ? (
													<SpinLoader />
												) : (
													<>
														{ediTotal ? (
															<div className="position-relative text-end">
																<input
																	className="border px-3 py-2 text-primary fw-semibold fs-4 w-50"
																	value={
																		toPay.total
																	}
																	type="number"
																	onChange={(
																		e
																	) =>
																		setToPay(
																			(
																				prev
																			) => ({
																				...prev,
																				total: e
																					.target
																					.value,
																			})
																		)
																	}
																/>
																<i
																	className="mdi mdi-close-circle-outline text-danger position-absolute"
																	style={{
																		fontSize:
																			'24px',
																		top: '50%',
																		transform:
																			'translateY(-50%)',
																	}}
																	onClick={
																		toggleEditTotal
																	}
																/>
															</div>
														) : (
															<h3
																className="text-primary m-0"
																onClick={
																	toggleEditTotal
																}
															>
																{toPay.totalCalc
																	? numberFormat(
																			toPay.totalCalc
																	  )
																	: '-'}
															</h3>
														)}
													</>
												)}
											</div>
										</div>
										{checkCaja.loading && (
											<SimpleLoad text="Checando asignación de caja" />
										)}
										{!checkCaja.hasCaja &&
											!checkCaja.loading && (
												<Alert color="warning">
													{NOT_CASH_REGISTER_ASSIGN}
												</Alert>
											)}
										{checkCaja.hasCaja && (
											<div className="text-center mt-3">
												{isPaying ? (
													<Button
														color="primary"
														className="fs-4"
														disabled
														block
													>
														<i className="bx bx-loader bx-spin font-size-16 align-middle" />{' '}
														Pagar
													</Button>
												) : (
													<Button
														color="primary"
														className="fs-4"
														disabled={
															toPay.total <= 0 ||
															!paymentForm ||
															disabledButton
														}
														block
														onClick={
															onHandlePayment
														}
													>
														Pagar
													</Button>
												)}
											</div>
										)}
									</Col>
								</Row>
							</div>
						</Col>
					</Row>
				)}

				<SuccessPaymentDialog
					show={showSuccess}
					setShow={setShowSuccess}
					ticket={ticket}
				/>
			</OffcanvasBody>
		</Offcanvas>
	);
};

export default ChargesCanvas;
