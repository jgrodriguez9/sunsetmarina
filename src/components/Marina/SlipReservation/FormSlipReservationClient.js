import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
	Alert,
	Button,
	Col,
	FormGroup,
	Input,
	InputGroup,
	Label,
	Row,
} from 'reactstrap';
import * as Yup from 'yup';
import {
	ADD_BALANCE,
	ERROR_SERVER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	NOT_CASH_REGISTER_ASSIGN,
	SAVE_SUCCESS,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import SimpleDate from '../../DatePicker/SimpleDate';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import moment from 'moment';
import Select from 'react-select';
import { getBoatByClient } from '../../../helpers/marina/boat';
import { getSlipList } from '../../../helpers/marina/slip';
import {
	getSlipReservationPriceAndValid,
	saveReservation,
	updateReservation,
} from '../../../helpers/marina/slipReservation';
import { numberFormat } from '../../../utils/numberFormat';
import ContentLoader from '../../Loader/ContentLoader';
import getObjectValid from '../../../utils/getObjectValid';
import { statusSlipReservation } from '../../../data/statusSlipReservation';
import { paymentFrequencyOpt } from '../../../constants/constants';
import jsFormatNumber from '../../../utils/jsFormatNumber';
import { hasCashRegisterAssign } from '../../../helpers/caja/boardingPass';
import SimpleLoad from '../../Loader/SimpleLoad';
import { currencyOpt } from '../../../constants/currencies';
import { getSaldo } from '../../Cliente/TabSection/PrincipalInfoClient';
import { getCurrencyExchangeListPaginado } from '../../../helpers/catalogos/currencyExchange';
import { paymentFormOpt } from '../../../constants/paymentForm';
import { isValidPositiveNumber } from '../../../utils/isValidPositiveNumber';
import { addSaldoReservation } from '../../../helpers/marina/payment';

export default function FormSlipReservationClient({
	item,
	setOpenModalAdd,
	setRefetch,
}) {
	const dispatch = useDispatch();
	const [openModalBalance, setOpenModalBalance] = useState(false);
	const [checkCaja, setCheckCaja] = useState({
		loading: true,
		hasCaja: false,
	});
	const [newBalance, setNewBalance] = useState(0);
	const [paymentForm, setPaymentForm] = useState('CASH');
	const [currency, setCurrency] = useState('USD');
	const [referencia, setReferencia] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currExchangeOpt, setCurrExchangeOpt] = useState([]);
	const [arrivalDate, setArrivalDate] = useState(
		item?.arrivalDate
			? moment(item?.arrivalDate, 'YYYY-MM-DD').toDate()
			: null
	);
	const [departureDate, setDepartureDate] = useState(
		item?.departureDate
			? moment(item?.departureDate, 'YYYY-MM-DD').toDate()
			: null
	);
	const [finalContractDate, setFinalContractDate] = useState(
		item?.finalContractDate
			? moment(item?.finalContractDate, 'YYYY-MM-DD').toDate()
			: null
	);
	const [showControlPrice, setShowControlPrice] = useState(false);
	const [checkValidationSlip, setCheckValidationSlip] = useState({
		loading: false,
		isValid: item.id ? true : false,
		checked: false,
	});

	const [boatOpt, setBoatOpt] = useState([]);
	const [slipOpt, setSlipOpt] = useState([]);

	const fetchBoatApi = async () => {
		try {
			const response = await getBoatByClient(item.customer.id);
			setBoatOpt(
				response.list
					.filter((it) => it.status === 'AVAILABLE')
					.map((boat) => ({
						label: `${boat.name} - ${boat.length} pies`,
						value: boat.id,
						justName: boat.name,
					}))
			);
		} catch (error) {
			setBoatOpt([]);
		}
	};
	const fetchSlips = async () => {
		try {
			const response = await getSlipList();
			setSlipOpt(
				response
					.filter((it) => it.status === 'AVAILABLE')
					.map((slip) => ({
						label: `${slip.code} (${jsFormatNumber(
							slip.price
						)} diario)`,
						value: slip.id,
						justName: slip.code,
					}))
			);
		} catch (error) {
			setSlipOpt([]);
		}
	};
	const fetchCurrencies = async () => {
		const response = await getCurrencyExchangeListPaginado(
			`?max=10&page=1`
		);
		setCurrExchangeOpt(
			response.list.map((it) => ({
				currency: it.currency,
				rate: it.currencyExchange,
			}))
		);
	};
	const checkCajaApi = async () => {
		try {
			await hasCashRegisterAssign();
			setCheckCaja({
				loading: false,
				hasCaja: true,
			});
		} catch (error) {
			setCheckCaja({
				loading: false,
				hasCaja: false,
			});
		}
	};

	useEffect(() => {
		fetchBoatApi();
		fetchSlips();
		fetchCurrencies();
		checkCajaApi();
	}, []);

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			price: item?.price ?? 0,
			observations: item?.observations ?? '',
			customer: item?.customer ?? { id: '' },
			boat: item?.boat ?? { id: '' },
			slip: item?.slip ?? { id: '' },
			arrivalDate: item?.arrivalDate ?? '',
			departureDate: item?.departureDate ?? '',
			status: item?.status ?? 'CONFIRMED',
			paymentFrequency: item?.paymentFrequency ?? '',
			finalContractDate: item?.finalContractDate ?? '',
			balance: item?.balance ?? 0		
		},
		validationSchema: Yup.object({
			boat: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			slip: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			arrivalDate: Yup.string().required(FIELD_REQUIRED),
			paymentFrequency: Yup.string().required(FIELD_REQUIRED),
			price: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			const data = {};
			Object.entries(getObjectValid(values)).forEach((entry) => {
				const [key, value] = entry;
				if (key === 'arrivalDate') {
					data[key] = moment(values.arrivalDate).format('YYYY-MM-DD');
				} else if (key === 'departureDate') {
					data[key] = moment(values.arrivalDate).format('YYYY-MM-DD');
				} else if (key === 'finalContractDate') {
					data[key] = moment(values.arrivalDate).format('YYYY-MM-DD');
				} else {
					data[key] = value;
				}
			});
			if (values.id) {
				//update
				try {
					let response = await updateReservation(values.id, data);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						setOpenModalAdd(false);
						setRefetch(true);
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
							type: 'error',
							message: message,
						})
					);
				}
			} else {
				//save
				try {
					let response = await saveReservation(data);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						setOpenModalAdd(false);
						setRefetch(true);
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
							type: 'error',
							message: message,
						})
					);
				}
			}
		},
	});

	//checamos precio y si es valid el slip
	useEffect(() => {
		if (
			!formik.values.id &&
			formik.values.boat.id &&
			formik.values.slip.id
		) {
			const fecthPriceAndValid = async () => {
				setCheckValidationSlip((prev) => ({
					...prev,
					loading: true,
					checked: false,
					isValid: false,
				}));
				try {
					const query = `${formik.values.slip.id}&${formik.values.boat.id}`;
					const response = await getSlipReservationPriceAndValid(
						query
					);
					setCheckValidationSlip((prev) => ({
						...prev,
						loading: false,
						isValid: response.valid,
						checked: true,
					}));
					formik.setFieldValue('price', response.price);
				} catch (error) {
					let message = ERROR_SERVER;
					message = extractMeaningfulMessage(error, message);
					dispatch(
						addMessage({
							type: 'error',
							message: message,
						})
					);
					setCheckValidationSlip((prev) => ({
						...prev,
						loading: false,
						isValid: false,
						checked: true,
					}));
				}
			};
			fecthPriceAndValid();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.boat.id, formik.values.slip.id, dispatch]);

	const onOpen = (selectedDates, dateStr, instance) => {
		instance.set('minDate', formik.values.arrivalDate);
		if (formik.values.status === 'CONFIRMED') {
			instance.set('minDate', moment().format('DD-MM-YYYY'));
		}
	};

	const handleClickNewSaldo = async () => {
		setIsSubmitting(true);
		try {
			const data = {
				amount: getSaldo(newBalance, currency, 'MXN', currExchangeOpt),
				amountUSD: getSaldo(
					newBalance,
					currency,
					'USD',
					currExchangeOpt
				),
				concept: 'Abono a saldo de cliente reservaciones',
				reference: referencia,
				paymentForm: paymentForm,
				customer: formik.values.customer,
				systemPayment: 'BALANCE_RESERVATION',
				systemId: formik.values.id,
			};
			await addSaldoReservation(data);
			dispatch(
				addMessage({
					type: 'success',
					message: ADD_BALANCE,
				})
			);
			formik.setFieldValue(
				'balance',
				formik.values.balance +
					getSaldo(newBalance, currency, 'MXN', currExchangeOpt)
			);
			setIsSubmitting(false);
			setNewBalance(0);
			setOpenModalBalance(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setIsSubmitting(false);
		}
	};

	const childrenAddSaldo = checkCaja.loading ? (
		<SimpleLoad text="Checando asignación de caja" />
	) : !checkCaja.hasCaja ? (
		<Row>
			<Col>
				<Alert color="warning">{NOT_CASH_REGISTER_ASSIGN}</Alert>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xs={12} md="4" className="mb-2">
				<Label htmlFor="bal" className="mb-0">
					Monto
				</Label>
				<Input
					id="bal"
					name="bal"
					type="number"
					className={`form-control`}
					onChange={(e) => setNewBalance(e.target.value)}
					value={newBalance}
				/>
			</Col>
			<Col xs="12" md="4">
				<Label htmlFor="paymentForm" className="mb-0">
					Moneda
				</Label>
				<Select
					value={{
						value: currency,
						label: currencyOpt.find((it) => it.value === currency)
							.label,
					}}
					onChange={(value) => {
						setCurrency(value.value);
					}}
					options={currencyOpt}
					classNamePrefix="select2-selection"
				/>
			</Col>
			<Col xs="12" md="4">
				<Label htmlFor="currExchange" className="mb-0">
					Monto {currency === 'MXN' ? '(USD)' : '(MXN)'}
				</Label>
				<div className="form-control">
					{jsFormatNumber(
						getSaldo(
							newBalance,
							currency,
							currency === 'MXN' ? 'USD' : 'MXN',
							currExchangeOpt
						)
					)}
				</div>
			</Col>
			<Col xs="12" md="6" className="mb-2">
				<Label htmlFor="paymentForm" className="mb-0">
					Forma de pago
				</Label>
				<Select
					value={{
						value: paymentForm,
						label: paymentFormOpt.find(
							(it) => it.value === paymentForm
						).label,
					}}
					onChange={(value) => {
						setPaymentForm(value.value);
					}}
					options={paymentFormOpt}
					classNamePrefix="select2-selection"
				/>
			</Col>
			<Col xs="12" md="6" className="mb-2">
				<Label htmlFor="ref" className="mb-0">
					Referencia
				</Label>
				<Input
					id="ref"
					name="ref"
					className={`form-control`}
					onChange={(e) => setReferencia(e.target.value)}
					value={referencia}
				/>
			</Col>
			<hr />
			{isSubmitting ? (
				<ButtonsDisabled
					buttons={[
						{
							text: 'Aceptar',
							color: 'primary',
							className: '',
							loader: true,
						},
						{
							text: 'Cerrar',
							color: 'light',
							className: 'text-danger',
							loader: false,
						},
					]}
				/>
			) : (
				<div className="d-flex">
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleClickNewSaldo}
						disabled={!isValidPositiveNumber(newBalance)}
					>
						Aceptar
					</button>
					<button
						type="button"
						className="btn btn-light ms-2"
						onClick={() => {
							setNewBalance(0);
							setOpenModalBalance(false);
						}}
					>
						Cerrar
					</button>
				</div>
			)}
		</Row>
	);
	return (
		<div className="needs-validation position-relative">
			{checkValidationSlip.loading && (
				<ContentLoader text="Checando validez del slip" />
			)}
			{checkValidationSlip.checked && !checkValidationSlip.isValid && (
				<Row>
					<Col>
						<Alert color="danger">El slip no es válido</Alert>
					</Col>
				</Row>
			)}
			{checkValidationSlip.checked && checkValidationSlip.isValid && (
				<Row>
					<Col>
						<Alert color="success">El slip es válido</Alert>
					</Col>
				</Row>
			)}
			<Row>
				<Col xs="12" md="4">
					<div className="mb-3">
						<Label htmlFor="boatType" className="mb-0">
							Embarcación
						</Label>
						{formik.values.id ? (
							<div className="form-control bg-light">
								{formik.values.boat.name}
							</div>
						) : (
							<Select
								value={
									formik.values.boat?.id
										? {
												value: formik.values.boat.id,
												label:
													boatOpt.find(
														(it) =>
															it.value ===
															formik.values.boat
																.id
													)?.label ?? '',
										  }
										: null
								}
								onChange={(value) => {
									formik.setFieldValue(
										'boat.id',
										value?.value ?? ''
									);
									formik.setFieldValue(
										'boat.name',
										value?.justName ?? ''
									);
								}}
								options={boatOpt}
								classNamePrefix="select2-selection"
								placeholder={SELECT_OPTION}
							/>
						)}

						{formik.errors.boat?.id && (
							<div className="invalid-tooltip d-block">
								{formik.errors.boat.id}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="4">
					<div className="mb-3">
						<Label htmlFor="boatType" className="mb-0">
							Slip
						</Label>
						{formik.values.id ? (
							<div className="form-control bg-light">
								{formik.values.slip.code}
							</div>
						) : (
							<Select
								value={
									formik.values.slip?.id
										? {
												value: formik.values.slip.id,
												label:
													slipOpt.find(
														(it) =>
															it.value ===
															formik.values.slip
																.id
													)?.label ?? '',
										  }
										: null
								}
								onChange={(value) => {
									formik.setFieldValue(
										'slip.id',
										value?.value ?? ''
									);
									formik.setFieldValue(
										'slip.code',
										value?.justName ?? ''
									);
								}}
								options={slipOpt}
								classNamePrefix="select2-selection"
								placeholder={SELECT_OPTION}
							/>
						)}
						{formik.errors.documentType && (
							<div className="invalid-tooltip d-block">
								{formik.errors.documentType}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="4">
					<div className="mb-3">
						<Label htmlFor="price" className="mb-0">
							Precio diario
						</Label>
						{showControlPrice ? (
							<Input
								id="price"
								name="price"
								className={`form-control ${
									formik.errors.price ? 'is-invalid' : ''
								}`}
								onChange={formik.handleChange}
								value={formik.values.price}
							/>
						) : (
							<div className="form-control bg-light">
								<div className="d-flex justify-content-between align-items-center">
									<div>
										{numberFormat(
											formik.values?.price ?? 0
										)}
									</div>
									<div>
										<i
											className="fas fa-edit text-info"
											onClick={() =>
												setShowControlPrice(true)
											}
										/>
									</div>
								</div>
							</div>
						)}
						{formik.errors.price && (
							<div className="invalid-tooltip d-block">
								{formik.errors.price}
							</div>
						)}
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="4">
					<div className="mb-3">
						<Label htmlFor="price" className="mb-0">
							Fecha llegada
						</Label>
						{formik.values.id ? (
							<div className="form-control bg-light">
								{moment(arrivalDate).format('DD-MM-YYYY')}
							</div>
						) : (
							<SimpleDate
								date={arrivalDate}
								setDate={(value) => {
									setArrivalDate(value[0]);
									if (value.length > 0) {
										formik.setFieldValue(
											`arrivalDate`,
											value[0]
										);
									} else {
										formik.setFieldValue(
											`arrivalDate`,
											null
										);
									}
								}}
								placeholder="dd-MM-YYYY"
							/>
						)}
						{formik.errors.arrivalDate && (
							<div className="invalid-tooltip d-block">
								{formik.errors.arrivalDate}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="4">
					<div className="mb-3">
						<Label htmlFor="price" className="mb-0">
							Fecha salida
						</Label>
						<SimpleDate
							date={departureDate}
							setDate={(value) => {
								setDepartureDate(value[0]);
								if (value.length > 0) {
									formik.setFieldValue(
										`departureDate`,
										value[0]
									);
								} else {
									formik.setFieldValue(`departureDate`, null);
								}
							}}
							placeholder="dd-MM-YYYY"
							onOpen={onOpen}
						/>
					</div>
				</Col>
				<Col xs="12" md="4">
					<div className="mb-3">
						<Label htmlFor="price" className="mb-0">
							Fecha final contrato
						</Label>
						<SimpleDate
							date={finalContractDate}
							setDate={(value) => {
								setFinalContractDate(value[0]);
								if (value.length > 0) {
									formik.setFieldValue(
										`finalContractDate`,
										value[0]
									);
								} else {
									formik.setFieldValue(
										`finalContractDate`,
										null
									);
								}
							}}
							placeholder="dd-MM-YYYY"
						/>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="8">
					<Label htmlFor="observations" className="mb-0">
						Observación
					</Label>
					<textarea
						id="observations"
						name="observations"
						className={`form-control ${
							formik.errors.observations ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.observations}
						rows={5}
					/>
				</Col>
				<Col xs="12" md="4">
					<Row>
						<Col xs="12" md="12">
							<div className="mb-3">
								<Label className="mb-0 d-block">Estado</Label>
								{formik.values.status === 'CONFIRMED' ? (
									<div className="form-control bg-light">
										Confirmada
									</div>
								) : (
									<Select
										value={
											formik.values.status
												? {
														value: formik.values
															.status,
														label:
															statusSlipReservation.find(
																(it) =>
																	it.value ===
																	formik
																		.values
																		.status
															)?.label ?? '',
												  }
												: null
										}
										onChange={(value) => {
											formik.setFieldValue(
												'status',
												value?.value ?? ''
											);
										}}
										options={statusSlipReservation}
										classNamePrefix="select2-selection"
										placeholder={SELECT_OPTION}
									/>
								)}
							</div>
						</Col>

						<Col xs="12" md="12">
							<div className="mb-3">
								<Label
									htmlFor="paymentFrequency"
									className="mb-0"
								>
									Frecuencia de pago
								</Label>
								<Select
									value={
										formik.values.paymentFrequency
											? {
													value: formik.values
														.paymentFrequency,
													label: formik.values
														.paymentFrequency,
											  }
											: null
									}
									onChange={(value) => {
										formik.setFieldValue(
											'paymentFrequency',
											value?.value ?? ''
										);
									}}
									options={paymentFrequencyOpt}
									classNamePrefix="select2-selection"
									placeholder={SELECT_OPTION}
								/>

								{formik.errors.paymentFrequency && (
									<div className="invalid-tooltip d-block">
										{formik.errors.paymentFrequency}
									</div>
								)}
							</div>
						</Col>
					</Row>
					<Row>
						<Col lg="12">
							<FormGroup check inline>
								<Input
									id="needInvoice"
									name="needInvoice"
									type="checkbox"
									onChange={formik.handleChange}
									checked={formik.values.needInvoice || false}
								/>
								<Label check htmlFor="needInvoice">
									Requiere factura
								</Label>
							</FormGroup>
						</Col>
						<Col lg="12">
							<FormGroup check inline>
								<Input
									id="forgivenInterest"
									name="forgivenInterest"
									type="checkbox"
									onChange={formik.handleChange}
									checked={
										formik.values.forgivenInterest || false
									}
								/>
								<Label check htmlFor="forgivenInterest">
									Condonar moratorio
								</Label>
							</FormGroup>
						</Col>
					</Row>
				</Col>
			</Row>
			{formik.values.id && (
				<Row>
					<Col xs="12" md="4">
						<div className="mb-3">
							<Label htmlFor="balance" className="mb-0">
								Balance reservación
							</Label>
							<InputGroup>
								<div className="form-control">
									{jsFormatNumber(formik.values.balance)}
								</div>
								<Button
									outline
									color="primary"
									type="button"
									onClick={() =>
										setOpenModalBalance(!openModalBalance)
									}
								>
									{openModalBalance
										? 'Cancelar'
										: 'Agregar saldo'}
								</Button>
							</InputGroup>
						</div>
					</Col>
				</Row>
			)}
			{openModalBalance && (
				<>
					<hr />
					{childrenAddSaldo}
				</>
			)}
			<hr />
			{formik.isSubmitting ? (
				<ButtonsDisabled
					buttons={[
						{
							text: 'Aceptar',
							color: 'primary',
							className: '',
							loader: true,
						},
					]}
				/>
			) : (
				<Button
					color="primary"
					disabled={!checkValidationSlip.isValid || openModalBalance}
					type="button"
					className="me-2"
					onClick={
						checkValidationSlip.isValid
							? () => formik.handleSubmit()
							: () => {}
					}
				>
					{formik.values.id ? 'Actualizar' : 'Aceptar'}
				</Button>
			)}
		</div>
	);
}
