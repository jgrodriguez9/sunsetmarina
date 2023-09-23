import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import FormCashRegister from '../../../../components/Caja/CashRegister/FormCashRegister';

function CreateCashRegister() {
	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Registro de caja'}
					breadcrumbItem={'Registro de caja'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						<CardMain
							title="Crear Registro de caja"
							children={
								<FormCashRegister
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

export default CreateCashRegister;
