import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormBrazaleteLote from '../../../../components/Contabilidad/Brazalete/FormBrazaleteLote';

function CreateBrazaleteLote() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Brazalete'} breadcrumbItem={'Brazalete'} />

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Brazalete Lote"
							children={
								<FormBrazaleteLote btnTextSubmit="Guardar" />
							}
						/>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default CreateBrazaleteLote;
