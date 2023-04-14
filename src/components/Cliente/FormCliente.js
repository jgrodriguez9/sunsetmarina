import classNames from "classnames";
import {useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED } from "../../constants/messages";
import { ResumenCliente } from "./ResumenCliente";
import Wizard1 from "./Wizard/Wizard1";
import Wizard2 from "./Wizard/Wizard2";
import Wizard3 from "./Wizard/Wizard3";


export default function FormCliente({item, btnTextSubmit="Aceptar"}){
    const [activeTab, setActiveTab] = useState(1)
    const [passedSteps, setPassedSteps] = useState([1])

    const validationTab = {
        1: Yup.object({
                propietario: Yup.string().required(FIELD_REQUIRED),
                embarcacion: Yup.string().required(FIELD_REQUIRED),
            }),
        2: Yup.object({
                country: Yup.string().required(FIELD_REQUIRED),
            }),
        3: Yup.object({
                foto: Yup.string().required(FIELD_REQUIRED),
            }),
    }

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            propietario: item?.propietario ?? '',
            embarcacion: item?.embarcacion ?? '',
            identificacion: item?.identificacion ?? '', 
            nacionalidad: item?.nacionalidad ?? '',
            status: item?.status ?? '',
            
            country: item?.country ?? '',
            state: item?.state ?? '',
            city: item?.city ?? '',
            codigoPostal: item?.codigoPostal ?? '',
            direccion: item?.direccion ?? '',
            colonia: item?.colonia ?? '',
        },
        validationSchema: validationTab[activeTab],
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            console.log(values)
            if(activeTab === 3){
                console.log('submit')
            }else{
                setActiveTab(activeTab+1)
            }
        }
    })

    console.log(formik.values)
    console.log(formik.errors)

    return(
        <>
            <ResumenCliente />
            <hr />
            
        </>


        // <div className="wizard clearfix">
        //     <div className="steps clearfix">
        //         <ul>
        //         <NavItem
        //             className={classNames({ current: activeTab === 1 })}
        //         >
        //             <NavLink
        //                 className={classNames({ current: activeTab === 1 })}
        //                 onClick={() => {
        //                     setActiveTab(1)
        //                 }}
        //                 disabled
        //             >
        //                 <span className="number">1.</span> Información personal
        //             </NavLink>
        //         </NavItem>
        //         <NavItem
        //             className={classNames({ current: activeTab === 2 })}
        //         >
        //             <NavLink
        //                 className={classNames({ current: activeTab === 2 })}
        //                 onClick={() => {
        //                     setActiveTab(2)
        //                 }}
        //                 disabled
        //             >
        //                 <span className="number">2.</span> Dirección de residencia
        //             </NavLink>
        //         </NavItem>
        //         <NavItem
        //             className={classNames({ current: activeTab === 3 })}
        //         >
        //             <NavLink
        //                 className={classNames({ active: activeTab === 3 })}
        //                 onClick={() => {
        //                     setActiveTab(3)
        //                 }}
        //                 disabled
        //             >
        //                 <span className="number ms-2">03</span> Documentos
        //             </NavLink>
        //         </NavItem>
        //         </ul>
        //     </div>
        //     <Form
        //         className="needs-validation"
        //         id="tooltipForm"
        //         onSubmit={(e) => {
        //             e.preventDefault();
        //             formik.handleSubmit();
        //             return false;
        //         }}
        //     >
        //         <div className="content clearfix mt-4">
        //             <TabContent activeTab={activeTab}>
        //                 <TabPane tabId={1}>
        //                     <Wizard1
        //                         formik={formik} 
        //                     />
        //                 </TabPane>
        //                 <TabPane tabId={2}>
        //                     <Wizard2
        //                         formik={formik} 
        //                     />
        //                 </TabPane>
        //                 <TabPane tabId={3}>
        //                     <Wizard3
        //                         formik={formik} 
        //                     />
        //                 </TabPane>
        //             </TabContent>
        //         </div>
        //         <hr />
        //         <div className="d-flex clearfix">
        //             <div className="pe-2">
        //                 <Button
        //                     color="primary"
        //                     type="button"
        //                     onClick={() => setActiveTab(activeTab - 1)}
        //                     disabled={activeTab === 1}
        //                 >
        //                     Anterior
        //                 </Button>
        //             </div>
        //             <div className="pe-2">
        //                 <Button
        //                     color="primary"
        //                     type="submit"
        //                 >
        //                 {activeTab === 3 ? btnTextSubmit : 'Siguiente'}
        //                 </Button>
        //             </div>
        //             <div className="pe-2">
        //                 <Button
        //                     color="success"
        //                     type="submit"
        //                 >
        //                 Guardar como borrador
        //                 </Button>
        //             </div>
        //             <div>
        //                 <Link to="/client" className="btn btn-link text-danger">Cancelar</Link>
        //             </div>
        //         </div>
        //     </Form>
            
        // </div>
    );
}