import { Redirect } from "react-router-dom"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Compania from "../pages/Catalogos/Compania"
import TipoBarco from "../pages/Catalogos/TipoBarco"
import CreateTipoBarco from "../pages/Catalogos/TipoBarco/Create"
import EditTipoBarco from "../pages/Catalogos/TipoBarco/Edit"
import Dashboard from "../pages/Dashboard"
import Slip from "../pages/Slip"
import CreateCompania from '../pages/Catalogos/Compania/Create'
import EditCompania from '../pages/Catalogos/Compania/Edit'
import Logs from "../pages/Seguridad/Logs"
import CreateClient from '../pages/Client/Create'
import Client from "../pages/Client"
import Dock from "../pages/Dock"

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
    //end catalogos

    //cliente
    { path: "/client", exact: true, component: Client },
    { path: "/client/create", exact: true, component: CreateClient },
]
const managerRoutes = [
     //satges
 
    //  //satges
    //  { path: "/relationship-list", exact: true, component: RelationshipList },
    //  { path: "/relationship-add", exact: true, component: RelationshipAdd },
    //  { path: "/relationship-edit/:id", exact: true, component: RelationshipEdit },
 
    //  //header report
    //  { path: "/topconfiguration-list", exact: true, component: HeaderReportList },
    //  { path: "/topconfiguration-add", exact: true, component: HeaderReportAdd },
    //  { path: "/topconfiguration-edit/:id", exact: true, component: HeaderReportEdit },

    //  //header report
    //  { path: "/survey-list", exact: true, component: SurveyList },
    //  { path: "/survey-add", exact: true, component: SurveyAdd },
    //  { path: "/survey-edit/:id", exact: true, component: SurveyEdit },
]
const agentRoutes = [
    //documents
    { path: "/muelle", exact: true, component: Dock },
    // { path: "/case-add", exact: true, component: DocumentAdd },
    // { path: "/case-edit/:id", exact: true, component: DocumentEdit },
]

export { 
    authProtectedRoutes, 
    publicRoutes,
    adminRoutes,
    managerRoutes,
    agentRoutes
}