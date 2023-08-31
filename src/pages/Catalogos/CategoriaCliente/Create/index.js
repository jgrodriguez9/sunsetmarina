import { Col, Container, Row } from 'reactstrap';
import FormCategoriaCliente from '../../../../components/Catalogo/CategoriaCliente/FormCategoriaCliente';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';

function CreateCategoriaCliente() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Categoría de Cliente'}
					breadcrumbItem={'Categoría de Cliente'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Categoría de Cliente"
							children={
								<FormCategoriaCliente
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

export default CreateCategoriaCliente;
