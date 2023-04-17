import {useFormik } from "formik";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, NavItem, NavLink, TabContent, TabPane, Row, Col, Nav } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, UPDATE_SUCCESS } from "../../constants/messages";
import ButtonsDisabled from "../Common/ButtonsDisabled";
import { ResumenCliente } from "./ResumenCliente";
import classnames from "classnames";
import DirectionClient from "./TabSection/DirectionClient";
import PrincipalInfoClient from "./TabSection/PrincipalInfoClient";
import ObservationClient from "./TabSection/ObservationClient";
import moment from "moment/moment";
import { saveClient, updateClient } from "../../helpers/marina/client";
import { addMessage } from "../../redux/messageSlice";
import { useDispatch } from "react-redux";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";


export default function FormCliente({item, btnTextSubmit="Aceptar"}){
    const history = useHistory();
    const dispatch = useDispatch();
    const [customActiveTab, setcustomActiveTab] = useState("1");

    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
          setcustomActiveTab(tab);
        }
    };

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            code: item?.code ?? '',
            name: item?.name ?? '',
            lastName: item?.lastName ?? '',
            identification : item?.identification  ?? '',             
            country: item?.country ?? '',
            state: item?.state ?? '',
            city: item?.city ?? '',
            address: item?.address ?? '',
            email: item?.email ?? '',
            phone: item?.phone ?? '',
            rfc: item?.rfc ?? '', 
            birthDate: item?.birthDate ?? '', 
            customerCategory: item?.customerCategory ? {id: item.customerCategory?.id} : null,
            language: item?.language ?? '', 
            fax: item?.fax ?? '', 
        },
        validationSchema: Yup.object({
            name: Yup.string().required(FIELD_REQUIRED),
            lastName: Yup.string().required(FIELD_REQUIRED),
            identification: Yup.string().required(FIELD_REQUIRED),
            email: Yup.string().email("Correo electrónico inválido")
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            values.birthDate = moment(values.birthDate).format('YYYY-MM-DD')
            console.log(values)
            console.log('submit')
            if(values.id){
                //update
                try {
                    let response = await updateClient(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        history.push('/client')
                    }else{
                        dispatch(addMessage({
                            type: 'error',
                            message: ERROR_SERVER
                        }))
                    }
                } catch (error) {
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    dispatch(addMessage({
                        type: 'error',
                        message: message
                    })) 
                }
            }else{
                //save
                try{
                    let response = await saveClient(values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: SAVE_SUCCESS
                        }))
                        history.push('/client')
                    }else{
                        dispatch(addMessage({
                            type: 'error',
                            message: ERROR_SERVER
                        }))
                    }
                }catch(error){
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    dispatch(addMessage({
                        type: 'error',
                        message: message
                    }))
                }
            }
        }
    })

    console.log(formik.values)
    console.log(formik.errors)

    return(
        <>
            <ResumenCliente />
            <hr />
            <Form
                className="needs-validation"
                id="tooltipForm"
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                }}
            >
                <PrincipalInfoClient formik={formik} item={item} />
                
                <Row className="mt-2">
                    <Col xs="12" md="12">
                        <Nav tabs className="nav-tabs-custom">
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({
                                    active: customActiveTab === "1",
                                    })}
                                    onClick={() => {
                                    toggleCustom("1");
                                    }}
                                >
                                    <span className="d-block d-sm-none">
                                    <i className="fas fa-home"></i>
                                    </span>
                                    <span className="d-none d-sm-block">Dirección de residencia</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    style={{ cursor: "pointer" }}
                                    className={classnames({
                                    active: customActiveTab === "2",
                                    })}
                                    onClick={() => {
                                    toggleCustom("2");
                                    }}
                                >
                                    <span className="d-block d-sm-none">
                                    <i className="fas fa-home"></i>
                                    </span>
                                    <span className="d-none d-sm-block">Observaciones</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent
                            activeTab={customActiveTab}
                            className="p-3 text-muted bg-light bg-soft"
                        >
                            <TabPane tabId="1">
                                <DirectionClient formik={formik} item={item}/>
                            </TabPane>
                            <TabPane tabId="2">
                                <ObservationClient formik={formik} item={item}/>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
                <hr />
                {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: btnTextSubmit, color: 'primary', className: '', loader: true}, {text: 'Cancelar', color: 'link', className: 'text-danger', loader: false}]}/> :
                <div className="d-flex">
                    <Button color="primary" type="submit">{btnTextSubmit}</Button>
                    <Link to="/client" className="btn btn-link text-danger">Cancelar</Link>
                </div>
            }
            </Form>
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