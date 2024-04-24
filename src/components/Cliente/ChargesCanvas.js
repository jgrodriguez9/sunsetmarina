import { useEffect, useMemo, useState } from 'react';
import {
	Button,
	Col,
	Input,
	Label,
	Offcanvas,
	OffcanvasBody,
	OffcanvasHeader,
	Row,
} from 'reactstrap';
import { getChargeByReservation } from '../../helpers/marina/charges';
import TableCharges from '../Marina/Charge/TableCharges';
import { numberFormat } from '../../utils/numberFormat';
import SpinLoader from '../Loader/SpinLoader';
import Select from 'react-select';
import moment from 'moment';
import 'moment/locale/es';
import TooltipDescription from '../Common/TooltipDescription';
import { savePayment } from '../../helpers/marina/payment';
import { ERROR_SERVER } from '../../constants/messages';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';
import { addMessage } from '../../redux/messageSlice';
import { useDispatch } from 'react-redux';
import SuccessPaymentDialog from '../Common/SuccessPaymentDialog';
import { paymentFormOpt } from '../../constants/paymentForm';
moment.locale('es');

const getTotalToPay = (charges, isFullMonth) => {
	if (isFullMonth) {
		return charges.reduce((acc, cValue) => acc + cValue.totalMonth, 0);
	} else {
		if (charges.length === 1) {
			return charges[0].amount + charges[0].interest;
		} else {
			const sumTotal = charges
				.filter((it, idx) => idx < charges.length - 1)
				.reduce((acc, cValue) => acc + cValue.totalMonth, 0);

			return (
				sumTotal +
				(charges[charges.length - 1].amount +
					charges[charges.length - 1].interest)
			);
		}
	}
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
	const [hasta, setHasta] = useState(null);
	const [hastOpt, setHastaOpt] = useState([]);
	const [chargesToPay, setChargesToPay] = useState([]);
	const [concept, setConcept] = useState('');
	const [reference, setReference] = useState('');
	const [paymentForm, setPaymentForm] = useState('CASH');
	const [finalizarReserva, setFinalizarReserva] = useState(false);
	const dispatch = useDispatch();
	const [isPaying, setIsPaying] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [ticket, setTicket] = useState({
		reservation: null,
		payment: null,
		chargesSuccess: [],
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
					setHasta({
						id: list[list.length - 1].id,
						date: list[list.length - 1].monthYear,
					});
					setHastaOpt(
						list.map((it) => ({
							value: it.id,
							date: it.monthYear,
							label: moment(it.monthYear, 'YYYY-MM').format(
								'MMMM YYYY'
							),
						}))
					);
				}
			} catch (error) {
				setCharge([]);
				setLoading(false);
			}
		};
		if (reservation?.id) {
			setLoading(true);
			fecthChargesByReservation();
		}
	}, [reservation?.id]);

	const toggle = () => {
		setOpen(!open);
	};

	const total = useMemo(() => {
		if (chargesToPay.length > 0) {
			return getTotalToPay(chargesToPay, !finalizarReserva);
		} else {
			return 0;
		}
	}, [chargesToPay, finalizarReserva]);

	const onHandlePayment = async () => {
		setIsPaying(true);
		const data = {
			payment: {
				amount: total,
				concept: concept,
				reference: reference,
				paymentForm: paymentForm,
				customer: {
					id: customerId,
				},
				systemId: 777084,
				systemPayment: 'RESERVATION',
			},
			charges: chargesToPay,
		};

		try {
			const response = await savePayment(data);
			setTicket((prev) => ({
				reservation: reservation,
				payment: response,
				chargesSuccess: chargesToPay,
				concept: concept,
			}));
			setShowSuccess(true);
			setIsPaying(false);
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
		if (!showSuccess && ticket.payment) {
			setOpen(false);
		}
	}, [showSuccess, ticket.payment]);

	const updateChargesToPay = (date) => {
		const updatedChargesToPay = charge.filter((it) =>
			moment(it.monthYear, 'YYYY-MM').isSameOrBefore(
				moment(date, 'YYYY-MM')
			)
		);
		setChargesToPay(updatedChargesToPay);
		if (updatedChargesToPay.length !== charge.length) {
			setFinalizarReserva(false);
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
											al{' '}
											{moment(
												reservation?.departureDate,
												'YYYY-MM-DD'
											).format('DD-MM-YYYY')}
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
											<div>Hasta</div>
											{hasta ? (
												<div>
													<Select
														value={{
															value: hasta.id,
															label: `${moment(
																hasta.date,
																'YYYY-MM'
															).format(
																'MMMM YYYY'
															)}`,
														}}
														onChange={(value) => {
															if (value) {
																setHasta({
																	id: value.value,
																	date: value.date,
																});
																updateChargesToPay(
																	value.date
																);
															}
														}}
														options={hastOpt}
														classNamePrefix="select2-selection"
														styles={{
															control: (
																baseStyles,
																state
															) => ({
																...baseStyles,
																border: '1px solid #2A7EC3',
																fontWeight:
																	'bolder',
																textTransform:
																	'uppercase',
																backgroundColor:
																	'transparent!important',
																boxShadow: 0,
																padding: 0,
															}),
														}}
													/>
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
											) : (
												<strong>-</strong>
											)}
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
													<strong>Total</strong>
												</span>
											</div>
											<div>
												{total >= 0 ? (
													<h3 className="text-primary m-0">
														{numberFormat(total)}
													</h3>
												) : (
													<SpinLoader />
												)}
											</div>
										</div>
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
														total <= 0 ||
														!paymentForm
													}
													block
													onClick={onHandlePayment}
												>
													Pagar
												</Button>
											)}
										</div>
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
