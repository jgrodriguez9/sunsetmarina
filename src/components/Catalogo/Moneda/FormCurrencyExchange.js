import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_INTEGER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import {
	saveCurrencyExchange,
	updateCurrencyExchange,
} from '../../../helpers/catalogos/currencyExchange';

export default function FormCurrencyExchange({
	item,
	btnTextSubmit = 'Aceptar',
}) {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			name: item?.name ?? '',
			code: item?.code ?? '',
			iso3: item?.iso3 ?? '',
			currency: item?.currency ?? '',
			currencyExchange: item?.currencyExchange ?? '',
		},
		validationSchema: Yup.object({
			name: Yup.string().required(FIELD_REQUIRED),
			code: Yup.string().required(FIELD_REQUIRED),
			iso3: Yup.string().required(FIELD_REQUIRED),
			currency: Yup.string().required(FIELD_REQUIRED),
			currencyExchange: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			if (values.id) {
				//update
				try {
					let response = await updateCurrencyExchange(
						values.id,
						values
					);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						navigate('/currencyexchange');
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
					let response = await saveCurrencyExchange(values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						navigate('/currencyexchange');
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
			<Row>
				<Col xs="12" md="4">
					<Label htmlFor="name" className="mb-0">
						Nombre
					</Label>
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
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="code" className="mb-0">
						Código
					</Label>
					<Input
						id="code"
						name="code"
						className={`form-control ${
							formik.errors.code ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.code}
					/>
					{formik.errors.code && (
						<div className="invalid-tooltip">
							{formik.errors.code}
						</div>
					)}
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="iso3" className="mb-0">
						ISO3
					</Label>
					<Input
						id="iso3"
						name="iso3"
						className={`form-control ${
							formik.errors.iso3 ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.iso3}
					/>
					{formik.errors.iso3 && (
						<div className="invalid-tooltip">
							{formik.errors.iso3}
						</div>
					)}
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="code" className="mb-0">
						Moneda
					</Label>
					<Input
						id="currency"
						name="currency"
						className={`form-control ${
							formik.errors.currency ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.currency}
					/>
					{formik.errors.currency && (
						<div className="invalid-tooltip">
							{formik.errors.currency}
						</div>
					)}
				</Col>
				<Col xs="12" md="4">
					<Label className="mb-0 d-block" htmlFor="currencyExchange">
						Tipo de cambio
					</Label>
					<Input
						id="currencyExchange"
						name="currencyExchange"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.currencyExchange}
					/>
					{formik.errors.currencyExchange && (
						<div className="invalid-tooltip d-block">
							{formik.errors.currencyExchange}
						</div>
					)}
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
					<Button color="primary" type="submit" className="me-2">
						{btnTextSubmit}
					</Button>
					<Link to="/currencyexchange" className="btn btn-danger">
						Cancelar
					</Link>
				</div>
			)}
		</Form>
	);
}
