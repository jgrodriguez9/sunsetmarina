import Login from '../pages/Authentication/Login';
import Compania from '../pages/Catalogos/Compania';
import TipoBarco from '../pages/Catalogos/TipoBarco';
import CreateTipoBarco from '../pages/Catalogos/TipoBarco/Create';
import EditTipoBarco from '../pages/Catalogos/TipoBarco/Edit';
import Dashboard from '../pages/Dashboard';
import CreateCompania from '../pages/Catalogos/Compania/Create';
import EditCompania from '../pages/Catalogos/Compania/Edit';
import Logs from '../pages/Seguridad/Logs';
import CreateClient from '../pages/Marina/Client/Create';
import Client from '../pages/Marina/Client';
import Dock from '../pages/Dock';
import Muelle from '../pages/Catalogos/Muelle';
import CreateMuelle from '../pages/Catalogos/Muelle/Create';
import EditMUelle from '../pages/Catalogos/Muelle/Edit';
import Amarre from '../pages/Catalogos/Amarre';
import CreateAmarre from '../pages/Catalogos/Amarre/Create';
import EditAmarre from '../pages/Catalogos/Amarre/Edit';
import Slip from '../pages/Marina/Slip';
import CreateSlip from '../pages/Marina/Slip/Create';
import EditSlip from '../pages/Marina/Slip/Edit';
import TipoDocumento from '../pages/Catalogos/TipoDocumento';
import CreateTipoDocumento from '../pages/Catalogos/TipoDocumento/Create';
import EditTipoDocumento from '../pages/Catalogos/TipoDocumento/Edit';
import CategoriaCliente from '../pages/Catalogos/CategoriaCliente';
import CreateCategoriaCliente from '../pages/Catalogos/CategoriaCliente/Create';
import EditCategoriaCliente from '../pages/Catalogos/CategoriaCliente/Edit';
import EditCliente from '../pages/Marina/Client/Edit';
import Boat from '../pages/Marina/Boat';
import CreateBoat from '../pages/Marina/Boat/Create';
import EditBoat from '../pages/Marina/Boat/Edit';
import BoatCrew from '../pages/Marina/BoatCrew';
import CreateBoatCrew from '../pages/Marina/BoatCrew/Create';
import EditBoatCrew from '../pages/Marina/BoatCrew/Edit';
import AccountStatus from '../pages/Contabilidad/AccountStatus';
import BillReport from '../pages/Contabilidad/BillReport';
import IncomeReport from '../pages/Contabilidad/IncomeReport';
import DockTaxBill from '../pages/Contabilidad/DockTaxBill';
import Notifications from '../pages/Catalogos/Notifications';
import EditNotifications from '../pages/Catalogos/Notifications/Edit';
import Reservation from '../pages/Marina/Reservation';
import CreateReservation from '../pages/Marina/Reservation/Create';
import EditReservation from '../pages/Marina/Reservation/Edit';
import Brazaletes from '../pages/Contabilidad/Brazaletes';
import CreateBrazalete from '../pages/Contabilidad/Brazaletes/Create';
import CreateBrazaleteLote from '../pages/Contabilidad/Brazaletes/CreateLote';
import BoardingPass from '../pages/Caja/BoardingPass';
import CreateBoardingPass from '../pages/Caja/BoardingPass/Create';
import NoAccessPage from '../pages/Utility/NoAccessPage';
import { Navigate } from 'react-router-dom';
import ConceptoCaja from '../pages/Catalogos/ConceptoCaja';
import CreateConceptoCaja from '../pages/Catalogos/ConceptoCaja/Create';
import EditConceptoCaja from '../pages/Catalogos/ConceptoCaja/Edit';
import CashRegister from '../pages/Caja/CashRegister';
import CreateCashRegister from '../pages/Caja/CashRegister/Create';
import EditCashRegister from '../pages/Caja/CashRegister/Edit';
import CashRegisterControl from '../pages/Caja/CashRegisterControl';
import Users from '../pages/Seguridad/Users';
import CashMovement from '../pages/Caja/CashRegisterControl/Movement';
import CurrencyExchange from '../pages/Catalogos/CurrencyExchange';
import CreateCurrencyExchange from '../pages/Catalogos/CurrencyExchange/Create';
import CashSummary from '../pages/Caja/CashRegisterControl/Summary';

const authProtectedRoutes = [
	{ path: '/dashboard', component: <Dashboard /> },
	{ path: '/forbiden', component: <NoAccessPage /> },
	{ path: '/', component: <Navigate to="/dashboard" /> },

	// //user
	// { path: "/user-list", exact: true, component: UserList },
	// { path: "/user-add", exact: true, component: UserAdd },
	// { path: "/user-edit/:id", exact: true, component: UserEdit },
];

const publicRoutes = [{ path: '/login', component: <Login /> }];

const adminRoutes = [
	//seguridad
	//logs
	{ path: '/logs', exact: true, component: <Logs /> },

	//users
	{ path: '/users', exact: true, component: <Users /> },

	//end seguridad

	//catalogos
	//boadTypes
	{ path: '/boadtype', exact: true, component: <TipoBarco /> },
	{ path: '/boadtype/edit/:id', exact: true, component: <EditTipoBarco /> },
	{ path: '/boadtype/create', exact: true, component: <CreateTipoBarco /> },
	//compania
	{ path: '/company', exact: true, component: <Compania /> },
	{ path: '/company/create', exact: true, component: <CreateCompania /> },
	{ path: '/company/edit/:id', exact: true, component: <EditCompania /> },
	//muelle
	{ path: '/pier', exact: true, component: <Muelle /> },
	{ path: '/pier/create', exact: true, component: <CreateMuelle /> },
	{ path: '/pier/edit/:id', exact: true, component: <EditMUelle /> },
	//amarre
	{ path: '/sliptype', exact: true, component: <Amarre /> },
	{ path: '/sliptype/create', exact: true, component: <CreateAmarre /> },
	{ path: '/sliptype/edit/:id', exact: true, component: <EditAmarre /> },
	//tipo documento
	{ path: '/documenttype', exact: true, component: <TipoDocumento /> },
	{
		path: '/documenttype/create',
		exact: true,
		component: <CreateTipoDocumento />,
	},
	{
		path: '/documenttype/edit/:id',
		exact: true,
		component: <EditTipoDocumento />,
	},

	//categoria cliente
	{ path: '/clientcategory', exact: true, component: <CategoriaCliente /> },
	{
		path: '/clientcategory/create',
		exact: true,
		component: <CreateCategoriaCliente />,
	},
	{
		path: '/clientcategory/edit/:id',
		exact: true,
		component: <EditCategoriaCliente />,
	},
	//concepto de caja
	{ path: '/cashconcept', exact: true, component: <ConceptoCaja /> },
	{
		path: '/cashconcept/create',
		exact: true,
		component: <CreateConceptoCaja />,
	},
	{
		path: '/cashconcept/edit/:id',
		exact: true,
		component: <EditConceptoCaja />,
	},
	//moneda
	{ path: '/currencyexchange', exact: true, component: <CurrencyExchange /> },
	{
		path: '/currencyexchange/edit/:id',
		exact: true,
		component: <EditTipoBarco />,
	},
	{
		path: '/currencyexchange/create',
		exact: true,
		component: <CreateCurrencyExchange />,
	},

	//end catalogos

	//marina
	//cliente
	{ path: '/client', exact: true, component: <Client /> },
	{ path: '/client/create', exact: true, component: <CreateClient /> },
	{ path: '/client/edit/:id', exact: true, component: <EditCliente /> },

	//slip
	{ path: '/slip', exact: true, component: <Slip /> },
	{ path: '/slip/create', exact: true, component: <CreateSlip /> },
	{ path: '/slip/edit/:id', exact: true, component: <EditSlip /> },

	//boat
	{ path: '/boat', exact: true, component: <Boat /> },
	{ path: '/boat/create', exact: true, component: <CreateBoat /> },
	{ path: '/boat/edit/:id', exact: true, component: <EditBoat /> },

	//tripulacion
	{ path: '/boatcrew', exact: true, component: <BoatCrew /> },
	{ path: '/boatcrew/create', exact: true, component: <CreateBoatCrew /> },
	{ path: '/boatcrew/edit/:id', exact: true, component: <EditBoatCrew /> },

	//reservation
	{ path: '/reservation', exact: true, component: <Reservation /> },
	{
		path: '/reservation/create',
		exact: true,
		component: <CreateReservation />,
	},
	{
		path: '/reservation/edit/:id',
		exact: true,
		component: <EditReservation />,
	},

	//contabilidad
	//estado de cuenta
	{ path: '/accountstatus', exact: true, component: <AccountStatus /> },
	//reporte de cobranza
	{ path: '/billreport', exact: true, component: <BillReport /> },
	//reporte de ingresos
	{ path: '/incomereport', exact: true, component: <IncomeReport /> },
	//cobro impuesto de muelle
	{ path: '/docktaxbill', exact: true, component: <DockTaxBill /> },
	//brazaletes
	{ path: '/bracelet', exact: true, component: <Brazaletes /> },
	{ path: '/bracelet/create', exact: true, component: <CreateBrazalete /> },
	{
		path: '/bracelet/create/lote',
		exact: true,
		component: <CreateBrazaleteLote />,
	},
	//endmarina

	//caja
	//brazaletes
	{ path: '/boardingpass', exact: true, component: <BoardingPass /> },
	{
		path: '/boardingpass/create',
		exact: true,
		component: <CreateBoardingPass />,
	},
	//registro de caja
	{ path: '/cashregister', exact: true, component: <CashRegister /> },
	{
		path: '/cashregister/create',
		exact: true,
		component: <CreateCashRegister />,
	},
	{
		path: '/cashregister/edit/:id',
		exact: true,
		component: <EditCashRegister />,
	},
	//control de caja
	{
		path: '/cashregistercontrol',
		exact: true,
		component: <CashRegisterControl />,
	},
	{
		path: '/cashregistercontrol/create',
		exact: true,
		component: <CreateCashRegister />,
	},
	{
		path: '/cashregistercontrol/edit/:id',
		exact: true,
		component: <EditCashRegister />,
	},
	{
		path: '/cashregistercontrol/movement/:id',
		exact: true,
		component: <CashMovement />,
	},
	{
		path: '/cashregistercontrol/summary/:id',
		exact: true,
		component: <CashSummary />,
	},
	//end caja
];
const managerRoutes = [];
const agentRoutes = [
	//mapa muelle
	{ path: '/map', exact: true, component: <Dock /> },

	//notificaciones
	{ path: '/notification', exact: true, component: <Notifications /> },
	{
		path: '/notification/edit/:id',
		exact: true,
		component: <EditNotifications />,
	},
];

export {
	authProtectedRoutes,
	publicRoutes,
	adminRoutes,
	managerRoutes,
	agentRoutes,
};
