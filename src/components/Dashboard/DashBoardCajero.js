import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import CajeroPaseSalidaForm from '../Caja/CajeroPaseSalidaForm';
import { useEffect } from 'react';
import { getBrazaletsStatics } from '../../helpers/dashobard/stats';

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

	useEffect(() => {
		const fecthApi = async () => {
			try {
				const response = await getBrazaletsStatics();
				console.log(response);
				//setItems(response.list);
				//setLoading(false);
			} catch (error) {
				// let message = ERROR_SERVER;
				// message = extractMeaningfulMessage(error, message);
				// setItems([]);
				// setLoading(false);
			}
		};
		//setLoading(true);
		fecthApi();
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
			<Row>
				<Col>
					<CajeroPaseSalidaForm />
				</Col>
			</Row>
		</>
	);
};

export default DashBoardCajero;
