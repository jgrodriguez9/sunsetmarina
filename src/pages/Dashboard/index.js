import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import DashBoardOperator from '../../components/Dashboard/DashBoardOperator';
import DashBoardContador from '../../components/Dashboard/DashBoardContador';
import DashBoardCajero from '../../components/Dashboard/DashBoardCajero';
import DashBoardMuelle from '../../components/Dashboard/DashBoardMuelle';

function Dashboard() {
	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs title={'Inicio'} breadcrumbItem={'Inicio'} />

					<DashBoardOperator />

					{/* <DashBoardContador /> */}

					{/* <DashBoardCajero /> */}

					{/* <DashBoardMuelle /> */}
				</Container>
			</div>
		</>
	);
}

export default Dashboard;
