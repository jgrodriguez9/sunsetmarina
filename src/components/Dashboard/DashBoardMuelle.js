import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import DockImage from '../Dock/DockImage';
import CardMain from '../Common/CardMain';
import { useEffect, useState } from 'react';
import { slipAnalytics } from '../../helpers/dashobard/stats';

const DashBoardMuelle = () => {
	const [indicator, setIndicator] = useState({
		data: null,
		loading: true,
	});

	useEffect(() => {
		const fecthSlipAnalyticsApi = async () => {
			try {
				const response = await slipAnalytics();
				const reserved = response.listStatus.find(
					(it) => it.status === 'RESERVED'
				);
				const available = response.listStatus.find(
					(it) => it.status === 'AVAILABLE'
				);
				// const bloqueados = response.listStatus.find(
				// 	(it) => it.status === 'BLOCKED'
				// );
				const data = {
					ind1: {
						title: 'Total de slip',
						number: response.totalSlip,
						iconClass: 'far fa-map font-size-24',
					},
					ind2: {
						title: 'Slip Rentados',
						number: reserved?.total ?? null,
						iconClass: 'fas fa-ship font-size-24',
					},
					ind3: {
						title: 'Slip Disponibles',
						number: available?.total ?? null,
						iconClass: 'fas fa-align-justify font-size-24',
					},
				};
				setIndicator((prev) => ({
					...prev,
					loading: false,
					data: data,
				}));
			} catch (error) {
				setIndicator((prev) => ({
					...prev,
					loading: true,
					data: null,
				}));
			}
		};
		fecthSlipAnalyticsApi();
	}, []);
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
