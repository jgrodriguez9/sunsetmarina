import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormReserva from '../../../../components/Marina/Reserva/FormReserva';

function CreateReservation() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Reserva'} breadcrumbItem={'Reserva'} />

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Reserva"
							children={
								<FormReserva
									item={null}
									btnTextSubmit="Guardar"
								/>
							}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default CreateReservation;
