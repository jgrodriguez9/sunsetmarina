import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormBrazalete from '../../../../components/Contabilidad/Brazalete/FormBrazalete';

function CreateBrazalete() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Brazalete'} breadcrumbItem={'Brazalete'} />

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Brazalete"
							children={<FormBrazalete btnTextSubmit="Guardar" />}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default CreateBrazalete;
