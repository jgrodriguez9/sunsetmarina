import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import ChartAnalisisRenta from './ChartAnalisisVenta';
import DockImage from '../Dock/DockImage';
import CardMain from '../Common/CardMain';

const DashBoardMuelle = () => {
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
			<div>
				<CardMain title="Muelle" children={<DockImage />} />
			</div>
		</>
	);
};

export default DashBoardMuelle;
