import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	UPDATE_PRICE_SUCCESS,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { updatePricesSlips } from '../../../helpers/marina/slip';

export default function FormUpdatePrice({
	btnTextSubmit = 'Aceptar',
	toggleModalReservation = null,
}) {
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			newPrice: 5,
		},
		validationSchema: Yup.object({
			newPrice: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			try {
				await updatePricesSlips(values);
				dispatch(
					addMessage({
						type: 'success',
						message: UPDATE_PRICE_SUCCESS,
					})
				);
				toggleModalReservation();
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
				<Col xs="12" md="12">
					<Label htmlFor="newPrice" className="mb-0">
						Precio
					</Label>
					<Input
						id="newPrice"
						name="newPrice"
						className={`form-control ${
							formik.errors.newPrice ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.newPrice}
					/>
					{formik.errors.newPrice && (
						<div className="invalid-tooltip">
							{formik.errors.newPrice}
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
					]}
				/>
			) : (
				<div className="d-flex">
					<Button color="primary" type="submit" className="me-2">
						{btnTextSubmit}
					</Button>
				</div>
			)}
		</Form>
	);
}
