import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import { FIELD_REQUIRED } from '../../../constants/messages';
import ButtonsDisabled from '../../Common/ButtonsDisabled';

const FormCancelReservation = ({ handleCancelReservation, isSubmitting }) => {
	const formik = useFormik({
		initialValues: {
			reason: '',
			forgivenBalance: false,
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
				<Col xs="12" md="12">
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
				<Col xs="12" md="12">
					<Label className="mb-0 opacity-0 d-block">
						Es turistico
					</Label>
					<Input
						id="forgivenBalance"
						name="forgivenBalance"
						type="checkbox"
						className={`form-check-Input form-check-input`}
						onChange={formik.handleChange}
						checked={formik.values.forgivenBalance || false}
					/>
					<Label htmlFor={`forgivenBalance`} className="mb-0 ms-2">
						Condonar deuda
					</Label>
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
