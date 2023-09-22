import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormConceptoCaja from '../../../../components/Catalogo/ConceptoCaja/FormConceptoCaja';

function CreateConceptoCaja() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Concepto de caja'}
					breadcrumbItem={'Concepto de caja'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Concepto de caja"
							children={
								<FormConceptoCaja
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

export default CreateConceptoCaja;
