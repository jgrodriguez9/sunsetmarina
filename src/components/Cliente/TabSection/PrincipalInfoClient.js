import { useEffect, useState } from 'react';
import { Col, Input, Label, Row, InputGroup, Button, Alert } from 'reactstrap';
import SimpleDate from '../../DatePicker/SimpleDate';
import Select from 'react-select';
import {
	ADD_BALANCE,
	ERROR_SERVER,
	NOT_CASH_REGISTER_ASSIGN,
	SELECT_OPTION,
} from '../../../constants/messages';
import { getClientCategoryList } from '../../../helpers/catalogos/clientCategory';
import { languages } from '../../../data/languages';
import moment from 'moment';
import jsFormatNumber from '../../../utils/jsFormatNumber';
import DialogMain from '../../Common/DialogMain';
import { isValidPositiveNumber } from '../../../utils/isValidPositiveNumber';
import { paymentFormOpt } from '../../../constants/paymentForm';
import { addSaldo } from '../../../helpers/marina/payment';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { currencyOpt } from '../../../constants/currencies';
import { getCurrencyExchangeListPaginado } from '../../../helpers/catalogos/currencyExchange';
import { hasCashRegisterAssign } from '../../../helpers/caja/boardingPass';
import SimpleLoad from '../../Loader/SimpleLoad';

export const getSaldo = (saldo, currency, currCurrency, currExchangeOpt) => {
	if (saldo === 0) return 0;
	if (currCurrency === currency) return parseFloat(saldo);
	else {
		const rate = currExchangeOpt.find((it) => it.currency === 'USD').rate;
		if (currCurrency === 'MXN' && currency === 'USD') {
			const total = saldo * rate;
			const tRound = total.toFixed(2);
			return parseFloat(tRound);
		} else {
			const total = saldo / rate;
			const tRound = total.toFixed(2);
			return parseFloat(tRound);
		}
	}
};

export default function PrincipalInfoClient({ formik, item, setFile }) {
	const [openModal, setOpenModal] = useState(false);
	const [currency, setCurrency] = useState('USD');
	const [newBalance, setNewBalance] = useState(0);
	const [paymentForm, setPaymentForm] = useState('CASH');
	const [referencia, setReferencia] = useState('');
	const [checkCaja, setCheckCaja] = useState({
		loading: true,
		hasCaja: false,
	});
	const [currExchangeOpt, setCurrExchangeOpt] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const [fecha, setFecha] = useState(
		item?.birthDate ? moment(item?.birthDate, 'YYYY-MM-DD').toDate() : null
	);
	const [clientsCategoryOpt, setClientsCategoryOpt] = useState([]);
	const [languageDefault, setLanguageDefault] = useState(
		formik.values.language
			? {
					value: formik.values.language,
					label: formik.values.language,
			  }
			: null
	);
	const [selectedImage, setSelectedImage] = useState(null);

	const fecthClientsCategoryAPi = async () => {
		try {
			const response = await getClientCategoryList();
			setClientsCategoryOpt(
				response
					.filter((it) => it.enabled)
					.map((it) => ({ value: it.id, label: it.name }))
			);
		} catch (error) {}
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
		fecthClientsCategoryAPi();
		fetchCurrencies();
		checkCajaApi();
	}, []);

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
				concept: 'Abono a saldo de cliente',
				reference: referencia,
				paymentForm: paymentForm,
				customer: {
					id: formik.values.id,
				},
				systemPayment: 'BALANCE_BP',
			};
			await addSaldo(data);
			dispatch(
				addMessage({
					type: 'success',
					message: ADD_BALANCE,
				})
			);
			formik.setFieldValue(
				'balance',
				formik.values.balance +
					getSaldo(newBalance, currency, 'USD', currExchangeOpt)
			);
			setIsSubmitting(false);
			setNewBalance(0);
			setOpenModal(false);
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
							setOpenModal(false);
						}}
					>
						Cerrar
					</button>
				</div>
			)}
		</Row>
	);
	return (
		<Row>
			<Col xs="12" md="12"></Col>
			<Col xs="12" md="5">
				<Row className="align-items-center mb-2 ">
					<div className="d-flex align-items-center">
						<div className="me-5 position-relative">
							{selectedImage || formik.values.profilePicture ? (
								<>
									{formik.values.profilePicture &&
									!selectedImage ? (
										<img
											className="btn-image-profile"
											alt="Usuario logo"
											src={formik.values.profilePicture}
										/>
									) : (
										<img
											className="btn-image-profile"
											alt="not found"
											src={URL.createObjectURL(
												selectedImage
											)}
										/>
									)}

									<i className="bx bxs-pencil icon-image-upload text-warning fs-5" />
								</>
							) : (
								<button
									type="button"
									className="btn-block btn-image-profile"
								>
									<i className="fas fa-camera icon-file-upload" />
								</button>
							)}
							<input
								type="file"
								accept="image/*"
								className="input-file"
								onChange={(e) => {
									setSelectedImage(e.target.files[0]);
									setFile(e.target.files[0]);
								}}
							/>
						</div>
						{formik.values.code && (
							<div>
								<span className="fw-bold bg-light p-2 rounded">
									{formik.values.code}
								</span>
							</div>
						)}
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="name" className="mb-0 col-md-3 col-12">
						Nombre
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="name"
							name="name"
							className={`form-control ${
								formik.errors.name ? 'is-invalid' : ''
							}`}
							onChange={formik.handleChange}
							value={formik.values.name}
						/>
						{formik.errors.name && (
							<div className="invalid-tooltip">
								{formik.errors.name}
							</div>
						)}
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="lastName" className="mb-0 col-md-3 col-12">
						Apellidos
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="lastName"
							name="lastName"
							className={`form-control ${
								formik.errors.lastName ? 'is-invalid' : ''
							}`}
							onChange={formik.handleChange}
							value={formik.values.lastName}
						/>
						{formik.errors.lastName && (
							<div className="invalid-tooltip">
								{formik.errors.lastName}
							</div>
						)}
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label
						htmlFor="identification"
						className="mb-0 col-md-3 col-12"
					>
						Identificación
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="identification"
							name="identification"
							className={`form-control ${
								formik.errors.identification ? 'is-invalid' : ''
							}`}
							onChange={formik.handleChange}
							value={formik.values.identification}
						/>
						{formik.errors.identification && (
							<div className="invalid-tooltip">
								{formik.errors.identification}
							</div>
						)}
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="email" className="mb-0 col-md-3 col-12">
						Correo electrónico
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="email"
							name="email"
							className={`form-control ${
								formik.errors.email ? 'is-invalid' : ''
							}`}
							onChange={formik.handleChange}
							value={formik.values.email}
						/>
						{formik.errors.email && (
							<div className="invalid-tooltip">
								{formik.errors.email}
							</div>
						)}
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="balance" className="mb-0 col-md-3 col-12">
						Balance pase de abordar (USD)
					</Label>
					<div className="col-md-9 col-12">
						<InputGroup>
							<div className="form-control">
								{jsFormatNumber(formik.values.balance)}
							</div>
							<Button
								outline
								color="primary"
								type="button"
								onClick={() => setOpenModal(true)}
							>
								Agregar saldo
							</Button>
						</InputGroup>
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label
						htmlFor="needInvoice"
						className="mb-0 col-md-3 col-12"
					>
						Requiere factura
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="needInvoice"
							name="needInvoice"
							type="checkbox"
							className={`form-check-Input form-check-input`}
							onChange={formik.handleChange}
							checked={formik.values.needInvoice || false}
						/>
					</div>
				</Row>
			</Col>
			<Col xs="12" md={{ size: 5, offset: 2 }}>
				<Row className="align-items-center mb-2">
					<Label htmlFor="phone" className="mb-0 col-md-3 col-12">
						Teléfono
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="phone"
							name="phone"
							className={`form-control`}
							onChange={formik.handleChange}
							value={formik.values.phone}
						/>
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="rfc" className="mb-0 col-md-3 col-12">
						RFC
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="rfc"
							name="rfc"
							className={`form-control`}
							onChange={formik.handleChange}
							value={formik.values.rfc}
						/>
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="birthDate" className="mb-0 col-md-3 col-12">
						Fecha nacimiento
					</Label>
					<div className="col-md-9 col-12">
						<SimpleDate
							date={fecha}
							setDate={(value) => {
								setFecha(value[0]);
								if (value.length > 0) {
									formik.setFieldValue(`birthDate`, value[0]);
								} else {
									formik.setFieldValue(`birthDate`, '');
								}
							}}
							placeholder="dd-MM-YYYY"
						/>
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label
						htmlFor="customerCategory"
						className="mb-0 col-md-3 col-12"
					>
						Categoría del cliente
					</Label>
					<div className="col-md-9 col-12">
						<Select
							value={
								formik.values.customerCategory
									? {
											value: formik.values
												.customerCategory.id,
											label: clientsCategoryOpt.find(
												(it) =>
													it.value ===
													formik.values
														.customerCategory.id
											)?.label,
									  }
									: null
							}
							onChange={(value) => {
								formik.setFieldValue(
									'customerCategory.id',
									value?.value ?? ''
								);
							}}
							options={clientsCategoryOpt}
							classNamePrefix="select2-selection"
							placeholder={SELECT_OPTION}
						/>
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label
						htmlFor="customerCategory"
						className="mb-0 col-md-3 col-12"
					>
						Idioma
					</Label>
					<div className="col-md-9 col-12">
						<Select
							value={languageDefault}
							onChange={(value) => {
								setLanguageDefault(value);
								formik.setFieldValue(
									'language',
									value?.value ?? ''
								);
							}}
							options={languages}
							classNamePrefix="select2-selection"
							placeholder={SELECT_OPTION}
						/>
					</div>
				</Row>
				<Row className="align-items-center mb-2">
					<Label htmlFor="fax" className="mb-0 col-md-3 col-12">
						Fax
					</Label>
					<div className="col-md-9 col-12">
						<Input
							id="fax"
							name="fax"
							className={`form-control`}
							onChange={formik.handleChange}
							value={formik.values.fax}
						/>
					</div>
				</Row>
			</Col>
			<DialogMain
				open={openModal}
				setOpen={setOpenModal}
				title={'Agregar saldo'}
				size="lg"
				children={childrenAddSaldo}
			/>
		</Row>
	);
}
