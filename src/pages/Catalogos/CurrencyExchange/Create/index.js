import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormCurrencyExchange from '../../../../components/Catalogo/Moneda/FormCurrencyExchange';

function CreateCurrencyExchange() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Moneda'} breadcrumbItem={'Moneda'} />

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Moneda"
							children={
								<FormCurrencyExchange
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

export default CreateCurrencyExchange;
