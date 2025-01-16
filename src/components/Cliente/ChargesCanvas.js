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
	Collapse,
	Card,
	CardBody,
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
import jsFormatNumber from '../../utils/jsFormatNumber';
import { currencyOpt, currencyShortOpt } from '../../constants/currencies';
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
	const [totalToPay, setTotalToPay] = useState(null);
	const [ticket, setTicket] = useState({ idPayment: null });
	//states para checar caja
	const [checkCaja, setCheckCaja] = useState({
		loading: true,
		hasCaja: false,
	});
	//condonar intereses
	const [forgivenInterest, setForgivenInterest] = useState(false);
	const [forgivenInterestReason, setForgivenInterestReason] = useState('');

	const [openCollapse, setOpenCollapse] = useState(false)
	const [entryPayment, setEntryPayment] = useState([
		{
			paymentForm: 'CASH',
			currency: 'MXN',
			amount: 0,
			amountMXN: 0
		}
	])
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
				amount: totalToPay,
				concept: concept,
				reference: reference,
				paymentForm: paymentForm,
				customer: {
					id: customerId,
				},
				systemId: reservation.id,
				systemPayment: 'RESERVATION',
				forgivenInterest: forgivenInterest,
				forgivenInterestReason: forgivenInterestReason,
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
						payment: {
							forgivenInterest: forgivenInterest,
							forgivenInterestReason: forgivenInterestReason,
						},
					};
					const response = await getTotalChargeUpdated(data);
					setIsCalculating(false);
					setTotalToPay(response.totalAmountMXN);
				} else {
					setIsCalculating(false);
					setTotalToPay(null);
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
				setTotalToPay(null);
			}
		}
		getTotalToPay();
	}, [month, year, charge, finalizarReserva, dispatch, forgivenInterest]);
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
				<div className='d-flex align-items-center'>
					<div className='d-flex flex-column'>
						<div className='d-flex align-items-center'>
							<i className='fas fa-user' />
							<label>Cliente</label>
						</div>
						<h6></h6>
					</div>
					
				</div>
			</OffcanvasHeader>
			<OffcanvasBody className="p-4">
				{loading ? (
					<SpinLoader />
				) : (
					<>
						<Row>
							<Col xs="12" md="6">
								<div 
									className='d-flex justify-content-between border p-3 div-hover'
									onClick={() => setOpenCollapse(!openCollapse)}
								>
									<h4 className='m-0'>Nuevo Cliente</h4>
									<h4 className='m-0'>
										Embarcación:{' '}
										{reservation?.boat?.name}
									</h4>
									<h4 className='m-0'>
										Slip: {reservation?.slip?.code}
									</h4>
									<h4 className="text-primary m-0">
									Balance:{' '}
												{jsFormatNumber(
													reservation?.balance
												)}
									</h4>
								</div>
								<Collapse isOpen={openCollapse} className="accordion-collapse">
									<Card>
										<CardBody>
											<TableCharges items={charge} />
										</CardBody>
									</Card>
								</Collapse>
							</Col>
							<Col xs="12" md={"6"} className={"mt-2"}>
								<div className="p-4 border bottom-0 w-100 bg-light ">
									<div className="d-flex align-items-center mb-2">
										<div>Desde</div>
										<div className='ps-2'>
											<strong className="text-uppercase">
												{desde
													? moment(
															desde.date,
															'YYYY-MM'
													).format('MMMM YYYY')
													: '-'}
											</strong>
										</div>
										<div className="ps-4">Hasta</div>
										<div className="ps-2">
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
																) => {
																	if (
																		year?.value ===
																			moment().year() &&
																		year?.value !==
																			parseInt(
																				desde?.date?.split(
																					'-'
																				)[2]
																			)
																	) {
																		return true;
																	} else {
																		return (
																			parseInt(
																				it.value
																			) >=
																			parseInt(
																				desde?.date?.split(
																					'-'
																				)[1] ??
																					0
																			)
																		);
																	}
																}
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
										<div className='ps-2'>
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
												options={yearsOpt(
													moment(
														desde?.date,
														'YYYY-MM'
													).format(
														'YYYY'
													)
												).map(
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
										<div className="ps-2">
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
									<hr />
									
									{
										entryPayment.map((entry, index) => (
											<Row key={`payment-${index}`}>
												<Col xs="3" md="8">
													{index === 0 && <Label
														htmlFor="paymentForm"
														className="mb-0"
													>
														Forma de pago
													</Label>}
													<Select
														value={{
															value: entry.paymentForm,
															label: paymentFormOpt.find(
																(it) =>
																	it.value ===
																	entry.paymentForm
															)?.label ?? '',
														}}
														onChange={(value) => {
															setPaymentForm(value.value);
														}}
														options={paymentFormOpt}
														classNamePrefix="select2-selection"
													/>
												</Col>
												<Col xs="2" md="4">
													{index === 0 && <Label htmlFor="currency" className="mb-0">
														Moneda
													</Label>}
													<Select
														id='currency'
														value={{
															value: entry.currency,
															label: currencyShortOpt.find(
																(it) =>
																	it.value === entry.currency
															).label,
														}}
														onChange={(value) => {
															
														}}
														options={currencyShortOpt}
														classNamePrefix="select2-selection"
													/>
												</Col>
												
												<Col xs="12" md="4">
													{index === 0 && <Label
														htmlFor="concept"
														className="mb-0 fw-normal"
													>
														Concepto (Opcional)
													</Label>}
													<Input
														id="concept"
														name="concept"
														className="form-control"
														onChange={(e) =>
															setConcept(e.target.value)
														}
														value={concept}
													/>
												</Col>
												<Col xs="12" md="4">
													{index === 0 &&<Label
														htmlFor="concept"
														className="mb-0 fw-normal"
													>
														Referencia (Opcional)
													</Label>}
													<Input
														id="concept"
														name="concept"
														className="form-control"
														onChange={(e) =>
															setReference(e.target.value)
														}
														value={reference}
													/>
												</Col>
												<Col xs="3" md="4">
													{index === 0 && <Label htmlFor="amount" className="mb-0">
														Monto
													</Label>}
													<Input
														id="amount"
														name="amount"
														className={`form-control text-primary fw-semibold`}
														onChange={(e) => {}}
														value={entry.amount}
													/>
												</Col>
												{index > 0 && <Col xs="1" md="1">
													<Button
														color="danger"
														outline
														onClick={() => {
															const copyEntryPayment = [...entryPayment]
															copyEntryPayment.splice(index, 1)
															setEntryPayment(copyEntryPayment)
														}}
													>
														<i className="fas fa-trash" />
													</Button>
												</Col>}
												<hr className='mt-2' />
											</Row>
										))
									}
									<Row className={"mt-1"}>
										<Col xs="12" md="3">
										<Button color="secondary" size={"sm"} onClick={() => {
											setEntryPayment(prev=>[...prev, {
												paymentForm: 'CASH',
												currency: 'MXN',
												amount: 0,
												amountMXN: 0
											}])
										}}>
											Nueva forma de pago
										</Button>
										</Col>
									</Row>	

									<Row>
										<Col xs="7" md="7" className={'text-end'}>
											<strong className='fs-4 '>Total</strong>
										</Col>
										<Col xs="5" md="5">
										
											{isCalculating ? (
												<SimpleLoad text='' extraClass='text-start text-dark' />
											) : (
												<h3 className="text-primary m-0">
													{totalToPay
														? numberFormat(
																totalToPay
														)
														: '-'}
												</h3>
											)}
											{totalToPay > 0 && 
											<div>
												<Input
													id="forgivenInterest"
													name="forgivenInterest"
													type="checkbox"
													className={`form-check-Input form-check-input`}
													checked={
														forgivenInterest
													}
													onChange={(e) => {
														setForgivenInterest(
															e.target.checked
														);
														if (
															!e.target
																.checked
														) {
															setForgivenInterestReason(
																''
															);
														}
													}}
												/>
												<Label
													htmlFor={`forgivenInterest`}
													className="mb-0 ms-1 me-2 text-secondary"
												>
													Condonar intereses
												</Label>
												<i
													className="far fa-question-circle text-dark"
													id="help-forgivenInterest"
												/>
												<TooltipDescription
													text="Si marca esta casilla no se tomará en cuenta los intereses de la reservación"
													id="help-forgivenInterest"
												/>
											</div>}
											{forgivenInterest && (
												<div className="w-100">
													<textarea
														className="form-control"
														rows={2}
														placeholder="Razón por la que condona los interses"
														value={
															forgivenInterestReason
														}
														onChange={(e) =>
															setForgivenInterestReason(
																e.target
																	.value
															)
														}
													/>
												</div>
											)}
											{checkCaja.loading && (
												<SimpleLoad text="Checando asignación de caja" />
											)}
										</Col>
									</Row>

									{!checkCaja.hasCaja && !checkCaja.loading && (
										<Row>
											<Col>
												<Alert color="warning">
													{NOT_CASH_REGISTER_ASSIGN}
												</Alert>
											</Col>
										</Row>
									)}
									{checkCaja.hasCaja && (
										<Row>
											<Col>
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
																totalToPay <= 0 ||
																!paymentForm ||
																(forgivenInterest &&
																	!Boolean(
																		forgivenInterestReason
																	))
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
											</Col>
										</Row>	
									)}
								</div>
							</Col>
						</Row>
						{/* <Row>
							
							<Col xs="12" md="4">
								<div className="py-4 border bottom-0 w-100 bg-light ">
									
									<Row>
										<Col xs="12" md={{ size: 8, offset: 2 }}>
											
											
											
											
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
																totalToPay <= 0 ||
																!paymentForm ||
																(forgivenInterest &&
																	!Boolean(
																		forgivenInterestReason
																	))
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
						</Row> */}
					</>
					
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
