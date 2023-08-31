import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import error from '../../assets/images/error-img.png';

const NoAccessPage = () => {
	return (
		<>
			<div className="account-pages my-5">
				<Container>
					<Row>
						<Col lg="12">
							<div className="text-center mb-5">
								<h1 className="display-2 font-weight-medium">
									4
									<i className="bx bx-buoy bx-spin text-primary display-3" />
									3
								</h1>
								<h4 className="text-uppercase">
									Lo sentimos, usted no tiene acceso a la
									página solicitada
								</h4>
								<div className="mt-5 text-center">
									<Link
										className="btn btn-primary"
										to="/dashboard"
									>
										Regresar al Inicio
									</Link>
								</div>
							</div>
						</Col>
					</Row>
					<Row className="justify-content-center">
						<Col md="8" xl="6">
							<div>
								<img src={error} alt="" className="img-fluid" />
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default NoAccessPage;
