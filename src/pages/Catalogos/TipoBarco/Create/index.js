import { Col, Container, Row } from 'reactstrap';
import FormTipoEmbarcacion from '../../../../components/Catalogo/TipoEmbarcacion/FormTipoEmbarcacion';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';

function CreateTipoBarco() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Tipo de embarcación'}
					breadcrumbItem={'Tipo de embarcación'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Tipo de Embarcación"
							children={
								<FormTipoEmbarcacion
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

export default CreateTipoBarco;
