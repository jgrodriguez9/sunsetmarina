import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import ChartGanancias from './ChartGanancias';
import ChartAnalisisRenta from './ChartAnalisisVenta';

const DashBoardOperator = () => {
	const indicator = {
		ind1: {
			title: 'Slip Rentados',
			number: 42,
			iconClass: 'fas fa-ship font-size-24',
		},
		ind2: {
			title: 'Slip Disponibles',
			number: 23,
			iconClass: 'fas fa-align-justify font-size-24',
		},
		ind3: {
			title: 'Ganancia mensual',
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
				<Col xl="4">
					<ChartAnalisisRenta title={'Analisis de Renta'} />
				</Col>
				<Col xl="8">
					<ChartGanancias />
				</Col>
			</Row>
		</>
	);
};

export default DashBoardOperator;
