import { useState } from "react";
import { useFormik } from "formik"
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Col, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_NUMERIC, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import { useEffect } from "react";
import Select from "react-select";
import { getBoadTypeAll } from "../../../helpers/catalogos/boadType";
import moment from "moment";
import { saveBoat, updateBoat } from "../../../helpers/marina/boat";
import SimpleDate from "../../DatePicker/SimpleDate";
import { getClientList } from "../../../helpers/marina/client";
import classNames from "classnames";
import BoatCrew from "./TabSection/BoatCrew";

export default function FormBoat({item, btnTextSubmit="Aceptar"}){
    const history = useHistory();
    const dispatch = useDispatch();
    const [boatTypeOpt, setBoatTypeOpt] = useState([])
    const [boatTypeDefault, setBoatTypeDefault] = useState(null)
    const [fecha, setFecha] = useState(item?.insuranceExpirationDate ? moment(item?.insuranceExpirationDate, 'YYYY-MM-DD').toDate() : null)
    const [clientOpt, setClientOpt] = useState([])
    const [clientDefault, setClientDefault] = useState(null)
    const [customActiveTab, setcustomActiveTab] = useState("1");

    useEffect(() => {
        if(item && clientOpt.length > 0){
            const client = clientOpt.find(c=>c.value===item.customer?.id);
            setClientDefault({
                value: item.customer?.id ?? null,
                label: `${client.code} - ${client.name} ${client.lastName}`,
                code: client.code,
                name: client.name,
                lastName: client.lastName
            })
        }
        if(item && boatTypeOpt.length > 0){
            setBoatTypeDefault({
                value: item.boatType.id,
                label: boatTypeOpt.find(c=>c.value===item.boatType.id)?.label
            })
        }
    }, [item, clientOpt, boatTypeOpt])

    const fetchBoatTypeAllApi = async () => {
        try {
            const response = await getBoadTypeAll()
            setBoatTypeOpt(response.map((boat) => ({label: boat.description, value: boat.id})))
        } catch (error) {
            setBoatTypeOpt([])
        }
    }

    const fetchClientAllApi = async () => {
        try {
            const response = await getClientList()
            setClientOpt(response.map((clt) => ({
                label: `${clt.code} - ${clt.name} ${clt.lastName}`,
                value: clt.id,
                code: clt.code,
                name: clt.name,
                lastName: clt.lastName
            })))
        } catch (error) {
            setBoatTypeOpt([])
        }
    }

    useEffect(() => {
        fetchBoatTypeAllApi();
        fetchClientAllApi()
    }, [])

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            name: item?.name ?? '', 
            registrationNumber: item?.registrationNumber ?? '', 
            length: item?.length ?? '',
            beam: item?.beam ?? '',
            draught: item?.draught ?? '',
            markEngine: item?.markEngine ?? '',
            nauticalTouristic: item?.nauticalTouristic ?? false, 
            insuranceExpirationDate: item?.insuranceExpirationDate ?? '', 
            customer: item?.customer ?? {id: ''}, 
            boatType: item?.boatType ?? {id: ''}, 
        },
        validationSchema: Yup.object({
            name: Yup.string().required(FIELD_REQUIRED),
            registrationNumber: Yup.string().required(FIELD_REQUIRED),
            customer: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            }), 
            boatType: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            }),            
            length: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            beam: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            draught: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            markEngine: Yup.string().required(FIELD_REQUIRED),
            insuranceExpirationDate: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            if(values.id){
                //update
                try{
                    values.insuranceExpirationDate = moment(values.insuranceExpirationDate).format('YYYY-MM-DD')
                    let response = await updateBoat(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        history.push('/boat')
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
            }else{
                //save
                try{
                    values.insuranceExpirationDate = moment(values.insuranceExpirationDate).format('YYYY-MM-DD')
                    let response = await saveBoat(values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: SAVE_SUCCESS
                        }))
                        history.push('/boat')
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

    const toggleCustom = tab => {
        if (customActiveTab !== tab) {
          setcustomActiveTab(tab);
        }
    };

    return(
        <Form
            className="needs-validation"
            id="tooltipForm"
            onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
                return false;
            }}
        >
            <Row>
                <Col xs="12" md="3">
                    <Label htmlFor="name" className="mb-0">Nombre</Label>
                    <Input
                        id="name"
                        name="name"
                        className={`form-control ${formik.errors.name ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.name}  
                    />
                    {
                        formik.errors.name &&
                        <div className="invalid-tooltip">{formik.errors.name}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="registrationNumber" className="mb-0">Número registro</Label>
                    <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        className={`form-control ${formik.errors.registrationNumber ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.registrationNumber}  
                    />
                    {
                        formik.errors.registrationNumber &&
                        <div className="invalid-tooltip">{formik.errors.registrationNumber}</div>
                    }
                </Col>
                <Col xs="12" md="5">
                    <Label htmlFor="customer" className="mb-0">Client</Label>
                    <Select
                        value={clientDefault}
                        onChange={(value) => {
                            setClientDefault(value)
                            formik.setFieldValue('customer.id', value?.value ?? '')
                            formik.setFieldValue('customer.code', value?.code ?? '') 
                            formik.setFieldValue('customer.name', value?.name ?? '') 
                            formik.setFieldValue('customer.lastName', value?.lastName ?? '')
                        }}
                        options={clientOpt}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                    {
                        formik.errors.customer &&
                        <div className="invalid-tooltip d-block">{formik.errors.customer?.id}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="boatType" className="mb-0">Tipo de barco</Label>
                    <Select
                        value={boatTypeDefault}
                        onChange={(value) => {
                            setBoatTypeDefault(value)
                            formik.setFieldValue('boatType.id', value?.value ?? '')
                            formik.setFieldValue('boatType.description', value?.label ?? '') 
                        }}
                        options={boatTypeOpt}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                    {
                        formik.errors.boatType &&
                        <div className="invalid-tooltip d-block">{formik.errors.boatType?.id}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="insuranceExpirationDate" className="mb-0">Fecha expiración seguro</Label>
                    <SimpleDate
                        date={fecha}
                        setDate={value=>{ 
                            setFecha(value[0])
                            if(value.length > 0){
                            formik.setFieldValue(`insuranceExpirationDate`, value[0])
                            }else{
                            formik.setFieldValue(`insuranceExpirationDate`, '')
                            }                                                          
                        }}
                        placeholder="dd-MM-YYYY"
                    />
                    {
                        formik.errors.insuranceExpirationDate &&
                        <div className="invalid-tooltip d-block">{formik.errors.insuranceExpirationDate}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="markEngine" className="mb-0">Marca del motor</Label>
                    <Input
                        id="markEngine"
                        name="markEngine"
                        className={`form-control ${formik.errors.markEngine ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.markEngine}  
                    />
                    {
                        formik.errors.markEngine &&
                        <div className="invalid-tooltip">{formik.errors.markEngine}</div>
                    }
                </Col>                
            </Row>
            <Row>
                <Col xs="12" md="2">
                    <Label htmlFor="length" className="mb-0">Longitud</Label>
                    <Input
                        id="length"
                        name="length"
                        className={`form-control ${formik.errors.length ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.length}  
                    />
                    {
                        formik.errors.length &&
                        <div className="invalid-tooltip">{formik.errors.length}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="beam" className="mb-0">Manga</Label>
                    <Input
                        id="beam"
                        name="beam"
                        className={`form-control ${formik.errors.beam ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.beam}  
                    />
                    {
                        formik.errors.beam &&
                        <div className="invalid-tooltip">{formik.errors.beam}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="draught" className="mb-0">Calado</Label>
                    <Input
                        id="draught"
                        name="draught"
                        className={`form-control ${formik.errors.draught ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.draught}  
                    />
                    {
                        formik.errors.draught &&
                        <div className="invalid-tooltip">{formik.errors.draught}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label className="mb-0 opacity-0 d-block">Es turistico</Label>
                    <Input
                        id="nauticalTouristic"
                        name="nauticalTouristic"
                        type="checkbox"
                        className={`form-check-Input form-check-input`}
                        onChange={formik.handleChange}
                        checked={formik.values.nauticalTouristic || false}  
                    />
                    <Label htmlFor={`nauticalTouristic`} className="mb-0 ms-2">Es turístico</Label>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xs="12" md="12">
                    <Nav tabs className="nav-tabs-custom">
                        <NavItem>
                            <NavLink
                                style={{ cursor: "pointer" }}
                                className={classNames({
                                active: customActiveTab === "1",
                                })}
                                onClick={() => {
                                toggleCustom("1");
                                }}
                            >
                                <span className="d-block d-sm-none">
                                <i className="mdi mdi-tshirt-crew-outline"></i>
                                </span>
                                <span className="d-none d-sm-block">Tripulación</span>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent
                            activeTab={customActiveTab}
                            className="p-3 text-muted bg-light bg-soft"
                    >
                        <TabPane tabId="1">
                            <BoatCrew formik={formik}/>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
            <hr />

            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: btnTextSubmit, color: 'primary', className: '', loader: true}, {text: 'Cancelar', color: 'link', className: 'text-danger', loader: false}]}/> :
                <div className="d-flex">
                    <Button color="primary" type="submit" className="me-2">{btnTextSubmit}</Button>
                    <Link to="/boat" className="btn btn-danger">Cancelar</Link>
                </div>
            }
            
        </Form>
    )
}