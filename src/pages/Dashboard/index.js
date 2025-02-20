import { Container } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import DashBoardOperator from '../../components/Dashboard/DashBoardOperator';
import DashBoardContador from '../../components/Dashboard/DashBoardContador';
import DashBoardCajero from '../../components/Dashboard/DashBoardCajero';
import DashBoardMuelle from '../../components/Dashboard/DashBoardMuelle';
import { useSelector } from 'react-redux';
import {
	ROLE_ADMINISTRACION,
	ROLE_CAJA,
	ROLE_CONTABILIDAD,
	ROLE_MUELLE,
	ROLE_OPERACIONES,
} from '../../constants/roles';

function Dashboard() {
	const user = useSelector((state) => state.user);
	console.log(user)
	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs title={'Inicio'} breadcrumbItem={'Inicio'} />
					{user.roles.includes(ROLE_ADMINISTRACION) ||
					user.roles.includes(ROLE_CONTABILIDAD) ? (
						<DashBoardContador />
					) : user.roles.includes(ROLE_OPERACIONES) ? (
						<DashBoardOperator />
					) : user.roles.includes(ROLE_CAJA) ? (
						<DashBoardCajero />
					) : (
						user.roles.includes(ROLE_MUELLE) && <DashBoardMuelle />
					)}
				</Container>
			</div>
		</>
	);
}

export default Dashboard;
