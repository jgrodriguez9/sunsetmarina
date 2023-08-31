import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormBoardingPass from '../../../../components/Caja/BoardingPass/FormBoardingPass';

function CreateBoardingPass() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Pase de Salida'}
					breadcrumbItem={'Pase de Salida'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Pase de Salida"
							children={<FormBoardingPass />}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default CreateBoardingPass;
