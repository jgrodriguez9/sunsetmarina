import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import CajeroPaseSalidaForm from '../Caja/CajeroPaseSalidaForm';

const DashBoardCajero = () => {
	const indicator = {
		ind1: {
			title: 'Brazaletes Vendidos',
			number: 42,
			iconClass: 'fas fa-barcode font-size-24',
		},
		ind2: {
			title: 'Brazaletes Disponibles',
			number: 23,
			iconClass: 'fas fa-align-justify font-size-24',
		},
		ind3: {
			title: 'Ganancia al día',
			number: 3200,
			iconClass: 'fas fa-dollar-sign font-size-24',
		},
	};

	return (
		<>
			<Row>
				<Col xl="4">
					<WelcomeCard />
				</Col>
				<Col xl="8">
					<IndicadorTop indicator={indicator} />
				</Col>
			</Row>
			<Row>
				<Col>
					<CajeroPaseSalidaForm />
				</Col>
			</Row>
		</>
	);
};

export default DashBoardCajero;
