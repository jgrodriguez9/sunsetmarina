import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_INTEGER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
} from '../../../constants/messages';
import { saveBracaletLote } from '../../../helpers/contabilidad/bracalet';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import Select from 'react-select';

const colorOpt = [
	{ value: 'Rojo', label: 'Rojo' },
	{ value: 'Verde', label: 'Verde' },
];

const FormBrazaleteLote = ({ btnTextSubmit }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			startNumber: '',
			endNumber: '',
			color: '',
		},
		validationSchema: Yup.object({
			startNumber: Yup.number()
				.integer(FIELD_INTEGER)
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			endNumber: Yup.number()
				.integer(FIELD_INTEGER)
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			color: Yup.string().required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			try {
				let response = await saveBracaletLote(values);
				if (response) {
					dispatch(
						addMessage({
							type: 'success',
							message: SAVE_SUCCESS,
						})
					);
					navigate('/bracelet');
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
				<Col xs="12" md="3">
					<Label htmlFor="startNumber" className="mb-0">
						Iniciar secuencia
					</Label>
					<Input
						id="startNumber"
						name="startNumber"
						className={`form-control ${
							formik.errors.startNumber ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.startNumber}
					/>
					{formik.errors.startNumber && (
						<div className="invalid-tooltip">
							{formik.errors.startNumber}
						</div>
					)}
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="endNumber" className="mb-0">
						Finalizar secuencia
					</Label>
					<Input
						id="endNumber"
						name="endNumber"
						className={`form-control ${
							formik.errors.endNumber ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.endNumber}
					/>
					{formik.errors.endNumber && (
						<div className="invalid-tooltip">
							{formik.errors.endNumber}
						</div>
					)}
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="color" className="mb-0">
						Color
					</Label>
					<Select
						value={
							formik.values.color
								? {
										value: formik.values.color,
										label: formik.values.color,
								  }
								: null
						}
						onChange={(value) => {
							formik.setFieldValue('color', value?.value ?? '');
						}}
						options={colorOpt}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
					{formik.errors.color && (
						<div className="invalid-tooltip">
							{formik.errors.color}
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
					<Link to="/bracelet" className="btn btn-danger">
						Cancelar
					</Link>
				</div>
			)}
		</Form>
	);
};

export default FormBrazaleteLote;
