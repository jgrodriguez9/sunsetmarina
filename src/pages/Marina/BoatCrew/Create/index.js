import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormBoatCrew from '../../../../components/Marina/BoatCrew/FormBoatCrew';

function CreateBoatCrew() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Tripulación'}
					breadcrumbItem={'Tripulación'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Tripulación"
							children={
								<FormBoatCrew
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

export default CreateBoatCrew;
