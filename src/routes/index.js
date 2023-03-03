import { Redirect } from "react-router-dom"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import TipoBarco from "../pages/Catalogos/TipoBarco"
import CreateTipoBarco from "../pages/Catalogos/TipoBarco/Create"
import EditTipoBarco from "../pages/Catalogos/TipoBarco/Edit"
import CicloEscolar from "../pages/CicloEscolar"
import Cobranza from "../pages/Cobranza"
import Colegiatura from "../pages/Colegiatura"
import Concepto from "../pages/Concepto"
import Configuracion from "../pages/Configuracion"
import Dashboard from "../pages/Dashboard"
import Documento from "../pages/Documento"
import PasarelaPagos from "../pages/PasarelaPagos"
import Slip from "../pages/Slip"

const authProtectedRoutes = [
    { path: "/logout", component: Logout },
    { path: "/dashboard", component: Dashboard },
    { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

    //slip
    { path: "/slip", exact: true, component: Slip },

    //catalogos

    //boadTypes
    { path: "/boadtype", exact: true, component: TipoBarco },
    { path: "/boadtype/edit/:id", exact: true, component: EditTipoBarco },
    { path: "/boadtype/create", exact: true, component: CreateTipoBarco },
    // //documents
    // { path: "/case-list", exact: true, component: DocumentList },
    // { path: "/case-add", exact: true, component: DocumentAdd },
    // { path: "/case-edit/:id", exact: true, component: DocumentEdit },

    // //satges
    // { path: "/stage-list", exact: true, component: StagesList },
    // { path: "/stage-add", exact: true, component: StagesAdd },
    // { path: "/stage-edit/:id", exact: true, component: StagesEdit },

    // //satges
    // { path: "/relationship-list", exact: true, component: RelationshipList },
    // { path: "/relationship-add", exact: true, component: RelationshipAdd },
    // { path: "/relationship-edit/:id", exact: true, component: RelationshipEdit },

    // //header report
    // { path: "/topconfiguration-list", exact: true, component: HeaderReportList },
    // { path: "/topconfiguration-add", exact: true, component: HeaderReportAdd },
    // { path: "/topconfiguration-edit/:id", exact: true, component: HeaderReportEdit },

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
]
const managerRoutes = [
     //satges
    { path: "/cobranza", exact: true, component: Cobranza },
    { path: "/documento", exact: true, component: Documento },
    { path: "/configuracion", exact: true, component: Configuracion },
    { path: "/cicloescolar", exact: true, component: CicloEscolar },
    { path: "/concepto", exact: true, component: Concepto },
    { path: "/colegiatura", exact: true, component: Colegiatura },
    { path: "/pagos", exact: true, component: PasarelaPagos },
 
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
    // { path: "/case-list", exact: true, component: DocumentList },
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