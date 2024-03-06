import { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { useEffect } from 'react';
import Select from 'react-select';
import { getSlipList } from '../../../helpers/marina/slip';
import { getClientList } from '../../../helpers/marina/client';
import {
	getSlipReservationPriceAndValid,
	saveReservation,
	updateReservation,
} from '../../../helpers/marina/slipReservation';
import { numberFormat } from '../../../utils/numberFormat';
import SimpleDate from '../../DatePicker/SimpleDate';
import moment from 'moment';
import { statusSlipReservation } from '../../../data/statusSlipReservation';
import ContentLoader from '../../Loader/ContentLoader';
import { getBoatByClient } from '../../../helpers/marina/boat';
import getObjectValid from '../../../utils/getObjectValid';
import translateUtils from '../../../utils/translateUtils';

export default function FormReserva({ item, btnTextSubmit = 'Aceptar' }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [clientOpt, setClientOpt] = useState([]);
	const [boatOpt, setBoatOpt] = useState([]);
	const [slipOpt, setSlipOpt] = useState([]);
	const [showControlPrice, setShowControlPrice] = useState(false);
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
	const [checkValidationSlip, setCheckValidationSlip] = useState({
		loading: false,
		isValid: false,
		checked: false,
	});

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const response = await getClientList();
				setClientOpt(
					response.map((c) => ({
						label: `${c.name} ${c.lastName}`,
						name: c.name,
						lastName: c.lastName,
						value: c.id,
					}))
				);
			} catch (error) {}
		};
		fetchClients();

		//slip availables
		const fetchSlips = async () => {
			try {
				const response = await getSlipList();
				setSlipOpt(
					response
						.filter((it) => it.status === 'AVAILABLE')
						.map((slip) => ({
							label: slip.code,
							value: slip.id,
							code: slip.code,
						}))
				);
			} catch (error) {
				setSlipOpt([]);
			}
		};
		fetchSlips();
	}, []);

	const formik = useFormik({
		initialValues: {
			price: item?.price ?? 0,
			observations: item?.observations ?? '',
			arrivalDate: item?.arrivalDate ?? '',
			departureDate: item?.departureDate ?? '',
			customer: item?.customer ?? {
				id: '',
			},
			boat: item?.boat ?? {
				id: '',
			},
			slip: item?.slip ?? {
				id: '',
			},
			status: item?.status ?? 'PENDING',
		},
		validationSchema: Yup.object({
			arrivalDate: Yup.string().required(FIELD_REQUIRED),
			departureDate: Yup.string().required(FIELD_REQUIRED),
			customer: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			boat: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			slip: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarl
			const data = {};
			Object.entries(getObjectValid(values)).forEach((entry) => {
				const [key, value] = entry;
				if (key === 'arrivalDate') {
					data[key] = moment(values.arrivalDate).format('YYYY-MM-DD');
				} else if (key === 'departureDate') {
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
						navigate('/slip');
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
						navigate('/reservation');
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

	//checamos bote del cliente
	useEffect(() => {
		const fetchBoatClientApi = async () => {
			try {
				const response = await getBoatByClient(
					formik.values.customer.id
				);
				setBoatOpt(
					response.list
						.filter((it) => it.status === 'AVAILABLE')
						.map((boat) => ({ label: boat.name, value: boat.id }))
				);
			} catch (error) {
				setBoatOpt([]);
			}
		};
		if (formik.values.customer.id) {
			fetchBoatClientApi();
		}
	}, [formik.values.customer.id]);

	//checamos precio y si es valid el slip
	useEffect(() => {
		if (formik.values.boat.id && formik.values.slip.id) {
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

	return (
		<Form
			className="needs-validation"
			id="tooltipForm"
			onSubmit={(e) => {
				e.preventDefault();
				formik.handleSubmit();
				return false;
			}}
		>
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
				<Col xs="12" md="3">
					<div className="mb-3">
						<Label htmlFor="client" className="mb-0">
							Cliente
						</Label>
						{formik.values.status === 'CONFIRMED' ||
						formik.values.status === 'PENDING' ? (
							<div className="form-control bg-light">
								{formik.values.customer.name}{' '}
								{formik.values.customer.lastName}
							</div>
						) : (
							<Select
								value={
									formik.values.customer?.id
										? {
												value: formik.values.customer
													.id,
												label: `${formik.values.customer.name} ${formik.values.customer.lastName}`,
										  }
										: null
								}
								onChange={(value) => {
									formik.setFieldValue(
										'customer.id',
										value?.value ?? ''
									);
									formik.setFieldValue(
										'customer.label',
										value?.label ?? ''
									);
									formik.setFieldValue(
										'customer.name',
										value?.name ?? ''
									);
									formik.setFieldValue(
										'customer.lastName',
										value?.lastName ?? ''
									);
								}}
								options={clientOpt}
								classNamePrefix="select2-selection"
								placeholder={SELECT_OPTION}
							/>
						)}

						{formik.errors.customer?.id && (
							<div className="invalid-tooltip d-block">
								{formik.errors.customer?.id}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="3">
					<div className="mb-3">
						<Label htmlFor="client" className="mb-0">
							Embarcación
						</Label>
						{formik.values.status === 'CONFIRMED' ? (
							<div className="form-control bg-light">
								{formik.values.boat.name}
							</div>
						) : (
							<Select
								value={
									formik.values.boat?.id
										? {
												value: formik.values.boat.id,
												label: formik.values.boat.name,
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
										value?.label ?? ''
									);
								}}
								options={boatOpt}
								classNamePrefix="select2-selection"
								placeholder={SELECT_OPTION}
							/>
						)}

						{formik.errors.boat?.id && (
							<div className="invalid-tooltip d-block">
								{formik.errors.boat?.id}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="3">
					<div className="mb-3">
						<Label htmlFor="slip" className="mb-0">
							Slip
						</Label>
						{formik.values.status === 'CONFIRMED' ? (
							<div className="form-control bg-light">
								{formik.values.slip.code}
							</div>
						) : (
							<Select
								value={
									formik.values.slip?.id
										? {
												value: formik.values.slip.id,
												label: formik.values.slip.code,
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
										value?.label ?? ''
									);
								}}
								options={slipOpt}
								classNamePrefix="select2-selection"
								placeholder={SELECT_OPTION}
							/>
						)}

						{formik.errors.slip?.id && (
							<div className="invalid-tooltip d-block">
								{formik.errors.slip?.id}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="3">
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
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="3">
					<div className="mb-3">
						<Label htmlFor="price" className="mb-0">
							Fecha inicio
						</Label>
						{formik.values.status === 'CONFIRMED' ? (
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
					</div>
				</Col>
				<Col xs="12" md="3">
					<div className="mb-3">
						<Label htmlFor="price" className="mb-0">
							Fecha terminación
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
				<Col xs="12" md="3">
					<Label className="mb-0 d-block">Estado</Label>
					{formik.values.status === 'CONFIRMED' ||
					formik.values.status === 'CANCELLED' ? (
						<div className="form-control bg-light">
							{translateUtils(formik.values.status)}
						</div>
					) : (
						<Select
							value={
								formik.values.status
									? {
											value: formik.values.status,
											label: statusSlipReservation.find(
												(it) =>
													it.value ===
													formik.values.status
											).label,
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
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="6">
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
			</Row>
			<hr />
			{formik.isSubmitting ? (
				<ButtonsDisabled
					buttons={[
						{
							text: btnTextSubmit,
							color: 'primary',
							className: '',
							loader: true,
						},
						{
							text: 'Cancelar',
							color: 'link',
							className: 'text-danger',
							loader: false,
						},
					]}
				/>
			) : (
				<div className="d-flex">
					{formik.values.status !== 'CANCELLED' && (
						<>
							{!checkValidationSlip.isValid ? (
								<Button
									color="primary"
									disabled
									type="button"
									className="me-2"
								>
									{btnTextSubmit}
								</Button>
							) : (
								<Button
									color="primary"
									type="submit"
									className="me-2"
								>
									{btnTextSubmit}
								</Button>
							)}
						</>
					)}
					<Link to="/reservation" className="btn btn-danger">
						Cancelar
					</Link>
				</div>
			)}
		</Form>
	);
}
