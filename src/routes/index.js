import { Redirect } from "react-router-dom"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Compania from "../pages/Catalogos/Compania"
import TipoBarco from "../pages/Catalogos/TipoBarco"
import CreateTipoBarco from "../pages/Catalogos/TipoBarco/Create"
import EditTipoBarco from "../pages/Catalogos/TipoBarco/Edit"
import Dashboard from "../pages/Dashboard"
import CreateCompania from '../pages/Catalogos/Compania/Create'
import EditCompania from '../pages/Catalogos/Compania/Edit'
import Logs from "../pages/Seguridad/Logs"
import CreateClient from '../pages/Marina/Client/Create'
import Client from "../pages/Marina/Client"
import Dock from "../pages/Dock"
import Muelle from "../pages/Catalogos/Muelle"
import CreateMuelle from "../pages/Catalogos/Muelle/Create"
import EditMUelle from "../pages/Catalogos/Muelle/Edit"
import Amarre from "../pages/Catalogos/Amarre"
import CreateAmarre from "../pages/Catalogos/Amarre/Create"
import EditAmarre from "../pages/Catalogos/Amarre/Edit"
import Slip from "../pages/Marina/Slip"
import CreateSlip from "../pages/Marina/Slip/Create";
import EditSlip from "../pages/Marina/Slip/Edit";
import TipoDocumento from "../pages/Catalogos/TipoDocumento"
import CreateTipoDocumento from "../pages/Catalogos/TipoDocumento/Create";
import EditTipoDocumento from "../pages/Catalogos/TipoDocumento/Edit";
import CategoriaCliente from "../pages/Catalogos/CategoriaCliente"
import CreateCategoriaCliente from '../pages/Catalogos/CategoriaCliente/Create';
import EditCategoriaCliente from '../pages/Catalogos/CategoriaCliente/Edit';
import EditCliente from '../pages/Marina/Client/Edit';

const authProtectedRoutes = [
    { path: "/logout", component: Logout },
    { path: "/dashboard", component: Dashboard },
    { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

    // //user
    // { path: "/user-list", exact: true, component: UserList },
    // { path: "/user-add", exact: true, component: UserAdd },
    // { path: "/user-edit/:id", exact: true, component: UserEdit },
]


const publicRoutes = [
    { path: "/login", component: Login },
]


const adminRoutes = [
    //user
    // { path: "/user-list", exact: true, component: UserList },
    // { path: "/user-add", exact: true, component: UserAdd },
    // { path: "/user-edit/:id", exact: true, component: UserEdit },

    //seguridad
    //logs
    { path: "/logs", exact: true, component: Logs },

    //catalogos
    //boadTypes
    { path: "/boadtype", exact: true, component: TipoBarco },
    { path: "/boadtype/edit/:id", exact: true, component: EditTipoBarco },
    { path: "/boadtype/create", exact: true, component: CreateTipoBarco },
    //compania
    { path: "/company", exact: true, component: Compania },
    { path: "/company/create", exact: true, component: CreateCompania },
    { path: "/company/edit/:id", exact: true, component: EditCompania },
    //muelle
    { path: "/pier", exact: true, component: Muelle },
    { path: "/pier/create", exact: true, component: CreateMuelle },
    { path: "/pier/edit/:id", exact: true, component: EditMUelle },
    //amarre
    { path: "/sliptype", exact: true, component: Amarre },
    { path: "/sliptype/create", exact: true, component: CreateAmarre },
    { path: "/sliptype/edit/:id", exact: true, component: EditAmarre },
    //tipo documento
    { path: "/documenttype", exact: true, component: TipoDocumento },
    { path: "/documenttype/create", exact: true, component: CreateTipoDocumento },
    { path: "/documenttype/edit/:id", exact: true, component: EditTipoDocumento },

    //categoria cliente
    { path: "/clientcategory", exact: true, component: CategoriaCliente },
    { path: "/clientcategory/create", exact: true, component: CreateCategoriaCliente },
    { path: "/clientcategory/edit/:id", exact: true, component: EditCategoriaCliente },

    //end catalogos


    //marina
    //cliente
    { path: "/client", exact: true, component: Client },
    { path: "/client/create", exact: true, component: CreateClient },
    { path: "/client/edit/:id", exact: true, component: EditCliente },

    //slip
    { path: "/slip", exact: true, component: Slip },
    { path: "/slip/create", exact: true, component: CreateSlip },
    { path: "/slip/edit/:id", exact: true, component: EditSlip },

    //endmarina
]
const managerRoutes = []
const agentRoutes = [
    //mapa muelle
    { path: "/muelle", exact: true, component: Dock },
]

export { 
    authProtectedRoutes, 
    publicRoutes,
    adminRoutes,
    managerRoutes,
    agentRoutes
}