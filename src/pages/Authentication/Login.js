import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
	Card,
	CardBody,
	Col,
	Container,
	Form,
	Label,
	Row,
	Input,
	FormFeedback,
	Alert,
} from 'reactstrap';

import logo from '../../assets/images/logo.png';
import { postJwtLogin, postSignInSoportec } from '../../helpers/auth';
import { ERROR_SERVER, FIELD_REQUIRED } from '../../constants/messages';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';
import { useState } from 'react';
import packJson from '../../../package.json';

function Login() {
	const [error, setError] = useState();
	const validation = useFormik({
		enableReinitialize: true,

		initialValues: {
			username: '',
			password: '',
		},
		validationSchema: Yup.object({
			username: Yup.string().required(FIELD_REQUIRED),
			password: Yup.string().required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			try {
				postSignInSoportec(values);
				const response = await postJwtLogin(values);
				if (response.access_token) {
					sessionStorage.setItem(
						'sunsetadmiralauth',
						JSON.stringify(response)
					);
					window.location.href = '/dashboard';
				}
			} catch (error) {
				let message = ERROR_SERVER;
				message = extractMeaningfulMessage(error, message);
				setError(message);
			}
		},
	});

	return (
		<div className="account-pages my-5">
			<Container>
				<Row className="justify-content-center">
					<Col md={8} lg={6} xl={5}>
						<div className="text-center mb-4">
							<img
								src={logo}
								alt=""
								className="rounded-circle"
								height="150"
							/>
						</div>
						<Card className="overflow-hidden">
							<CardBody className="pt-0">
								<div className="p-2 py-5">
									<Form
										className="form-horizontal"
										onSubmit={(e) => {
											e.preventDefault();
											validation.handleSubmit();
											return false;
										}}
									>
										{error && (
											<Alert color="danger">
												{error}
											</Alert>
										)}

										<div className="mb-3">
											<Label className="form-label">
												Usuario
											</Label>
											<Input
												name="username"
												className="form-control"
												placeholder="Usuario"
												type="text"
												onChange={
													validation.handleChange
												}
												onBlur={validation.handleBlur}
												value={
													validation.values
														.username || ''
												}
												invalid={
													validation.errors.username
														? true
														: false
												}
											/>
											{validation.errors.username && (
												<FormFeedback type="invalid">
													{validation.errors.username}
												</FormFeedback>
											)}
										</div>

										<div className="mb-3">
											<Label className="form-label">
												Contraseña
											</Label>
											<Input
												name="password"
												value={
													validation.values
														.password || ''
												}
												type="password"
												placeholder="Contraseña"
												onChange={
													validation.handleChange
												}
												onBlur={validation.handleBlur}
												invalid={
													validation.errors.password
														? true
														: false
												}
											/>
											{validation.errors.password && (
												<FormFeedback type="invalid">
													{validation.errors.password}
												</FormFeedback>
											)}
										</div>

										<div className="mt-3 d-grid">
											{validation.isSubmitting ? (
												<span className="btn btn-primary btn-block disabled">
													<i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
												</span>
											) : (
												<button
													className="btn btn-primary btn-block"
													type="submit"
												>
													Ingresar
												</button>
											)}
										</div>
									</Form>
								</div>
							</CardBody>
						</Card>
						<div className="mt-5 text-center">
							<p>
								© {new Date().getFullYear()} Sunset Admiral
								<span className="d-block text-muted">
									v {packJson.version}
								</span>
							</p>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default Login;
