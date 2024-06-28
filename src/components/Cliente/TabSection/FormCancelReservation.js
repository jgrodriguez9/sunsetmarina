import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Form, Label, Row } from 'reactstrap';
import { FIELD_REQUIRED } from '../../../constants/messages';
import ButtonsDisabled from '../../Common/ButtonsDisabled';

const FormCancelReservation = ({ handleCancelReservation, isSubmitting }) => {
	const formik = useFormik({
		initialValues: {
			reason: '',
		},
		validationSchema: Yup.object({
			reason: Yup.string().required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			handleCancelReservation(values);
		},
	});

	return (
		<Form className="needs-validation">
			<Row>
				<Col>
					<Label htmlFor="reason" className="mb-0">
						Motivo
					</Label>
					<textarea
						className={`form-control ${
							formik.errors.reason ? 'is-invalid' : ''
						}`}
						rows={3}
						id="reason"
						name="reason"
						onChange={formik.handleChange}
						value={formik.values.reason}
					/>
					{formik.errors.reason && (
						<div className="invalid-tooltip">
							{formik.errors.reason}
						</div>
					)}
				</Col>
			</Row>
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
					]}
				/>
			) : (
				<div className="d-flex">
					<Button
						color="primary"
						type="button"
						className="me-2"
						onClick={() => {
							formik.handleSubmit();
						}}
					>
						Aceptar
					</Button>
				</div>
			)}
		</Form>
	);
};

export default FormCancelReservation;
