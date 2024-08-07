import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
} from '../../../constants/messages';
import { saveBracalet } from '../../../helpers/contabilidad/bracalet';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import ButtonsDisabled from '../../Common/ButtonsDisabled';

const FormBrazalete = ({ btnTextSubmit }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			code: '',
			color: '',
		},
		validationSchema: Yup.object({
			code: Yup.string().required(FIELD_REQUIRED),
			color: Yup.string().required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			try {
				let response = await saveBracalet(values);
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
				<Col xs="12" md="3">
					<Label htmlFor="color" className="mb-0">
						Color
					</Label>
					<Input
						id="color"
						name="color"
						className={`form-control ${
							formik.errors.color ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.color}
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

export default FormBrazalete;
