import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { updatePayment } from '../../../helpers/marina/payment';
import { addMessage } from '../../../redux/messageSlice';
import { ERROR_SERVER, UPDATE_SUCCESS } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { Button, Col, Form, Label, Row } from 'reactstrap';
import ButtonsDisabled from '../../Common/ButtonsDisabled';

const FormPayment = ({ item, setOpenModalAdd, setRefetch }) => {
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			concept: item?.concept ?? '',
			reference: item?.reference ?? '',
		},
		validationSchema: Yup.object({
			concept: Yup.string(),
		}),
		onSubmit: async (values) => {
			try {
				let response = await updatePayment(values.id, values);
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
		},
	});

	return (
		<div className="needs-validation" id="tooltipForm">
			<Row>
				<Col xs="12" md="12">
					<Label htmlFor="concept" className="mb-0">
						Concepto
					</Label>
					<textarea
						id="concept"
						name="concept"
						className={`form-control ${
							formik.errors.concept ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.concept}
						rows={3}
					/>
				</Col>
				<Col xs="12" md="12">
					<Label htmlFor="reference" className="mb-0">
						Referencia
					</Label>
					<textarea
						id="reference"
						name="reference"
						className={`form-control ${
							formik.errors.reference ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.reference}
						rows={3}
					/>
				</Col>
			</Row>

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
					type="button"
					className="me-2"
					onClick={() => formik.handleSubmit()}
				>
					Aceptar
				</Button>
			)}
		</div>
	);
};

export default FormPayment;
