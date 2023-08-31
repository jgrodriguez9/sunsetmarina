import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormSlip from '../../../../components/Marina/Slip/FormSlip';

function CreateSlip() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Slip'} breadcrumbItem={'Slip'} />

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Slip"
							children={
								<FormSlip item={null} btnTextSubmit="Guardar" />
							}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default CreateSlip;
