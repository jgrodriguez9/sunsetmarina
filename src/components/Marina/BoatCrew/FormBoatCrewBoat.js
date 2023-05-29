import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../../constants/messages";
import { saveBoatCrew, updateBoatCrew } from "../../../helpers/marina/boatCrew";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { Button, Col, Input, Label, Row } from "reactstrap";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import { Country, State, City }  from 'country-state-city';
import { useEffect, useState } from "react";
import Select from "react-select";

export default function FormBoatCrewBoat({item, setOpenModalAdd, setRefetch}){
    const dispatch = useDispatch();
    const countryOpt = Country.getCountryByCode('MX')
    const [countryDefault, setCountryDefault] = useState(item ? {label: item?.country, value: countryOpt.name === item?.country ? countryOpt.isoCode : item?.country} : null)
    const [statesOpt, setStatesOpt] = useState([])
    const [statesDefault, setStatesDefault] = useState(item ? {label: item?.state, value: item?.state} : null)
    const [citiesOpt, setCitiesOpt] = useState([])
    const [citiesDefault, setCitiesDefault] = useState(item ? {label: item?.city, value: item?.city} : null)

    useEffect(() => {
        if(countryDefault){
            setStatesOpt(State.getStatesOfCountry(countryDefault.value))
        }else{
            setStatesOpt([])
            setCitiesOpt([])
        }      
    },[countryDefault])

    useEffect(() => {
        if(statesDefault){
            setCitiesOpt(City.getCitiesOfState(countryDefault.value ,statesDefault.value))
        }else{
            setCitiesOpt([])
        }
    },[statesDefault])

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            name: item?.name ?? '', 
            lastName: item?.lastName ?? '', 
            identification: item?.identification ?? '',
            country: item?.country ?? '',
            state: item?.state ?? '',
            city: item?.city ?? '',
            phone: item?.phone ?? '', 
            isCaptain : item?.isCaptain  ?? false,
            boat: item?.boat ?? {id: ''}, 
        },
        validationSchema: Yup.object({
            name: Yup.string().required(FIELD_REQUIRED),
            lastName: Yup.string().required(FIELD_REQUIRED),
            identification: Yup.string().required(FIELD_REQUIRED),
            boat: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            }),
            country: Yup.string().required(FIELD_REQUIRED),
            state: Yup.string().required(FIELD_REQUIRED),
            city: Yup.string().required(FIELD_REQUIRED),
            phone: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            if(values.id){
                //update
                try{
                    let response = await updateBoatCrew(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        setOpenModalAdd(false)
                        setRefetch(true)
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
                    let response = await saveBoatCrew(values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: SAVE_SUCCESS
                        }))
                        setOpenModalAdd(false)
                        setRefetch(true)
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

    return(
        <div className="needs-validation">
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
                    <Label htmlFor="lastName" className="mb-0">Apellidos</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        className={`form-control ${formik.errors.lastName ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.lastName}  
                    />
                    {
                        formik.errors.lastName &&
                        <div className="invalid-tooltip">{formik.errors.lastName}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="identification" className="mb-0">Identificación</Label>
                    <Input
                        id="identification"
                        name="identification"
                        className={`form-control ${formik.errors.identification ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.identification}  
                    />
                    {
                        formik.errors.identification &&
                        <div className="invalid-tooltip">{formik.errors.identification}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="phone" className="mb-0">Teléfono</Label>
                    <Input
                        id="phone"
                        name="phone"
                        className={`form-control ${formik.errors.phone ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.phone}  
                    />
                    {
                        formik.errors.phone &&
                        <div className="invalid-tooltip">{formik.errors.phone}</div>
                    }
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="3">
                    <Label htmlFor="country" className="mb-0">País</Label>
                    <Select
                        value={countryDefault}
                        onChange={(value) => {
                            setCountryDefault(value)
                            formik.setFieldValue('country', value?.label ?? '')
                            setStatesDefault(null)
                            setCitiesDefault(null)  
                        }}
                        options={[{label: countryOpt.name, value: countryOpt.isoCode}]}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                    {
                        formik.errors.country &&
                        <div className="invalid-tooltip d-block">{formik.errors.country}</div>
                    }
                </Col> 
                <Col xs="12" md="3">
                    <Label htmlFor="state" className="mb-0">Estado</Label>
                    <Select
                        value={statesDefault}
                        onChange={value => {
                            setStatesDefault(value)
                            formik.setFieldValue('state', value?.label ?? '')
                            setCitiesDefault(null)  
                        }}
                        options={statesOpt.map(s=>({label: s.name, value: s.isoCode}))}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                    {
                        formik.errors.state &&
                        <div className="invalid-tooltip d-block">{formik.errors.state}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="city" className="mb-0">Ciudad</Label>
                    <Select
                        value={citiesDefault}
                        onChange={(value) => {
                            setCitiesDefault(value)
                            formik.setFieldValue('city', value?.label ?? '')
                        }}
                        options={citiesOpt.map(c=>({label: c.name, value:c.isoCode}))}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                    {
                        formik.errors.city &&
                        <div className="invalid-tooltip d-block">{formik.errors.city}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label className="mb-0 opacity-0 d-block">Es capitán</Label>
                    <Input
                        id="isCaptain"
                        name="isCaptain"
                        type="checkbox"
                        className={`form-check-Input form-check-input`}
                        onChange={formik.handleChange}
                        checked={formik.values.isCaptain  || false}  
                    />
                    <Label htmlFor={`isCaptain`} className="mb-0 ms-2">Es capitán</Label>
                </Col>
            </Row>
            
            <hr />
            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: formik.values.id ? 'Actualizar' : 'Aceptar', color: 'primary', className: '', loader: true}]}/> :
                <Button color="primary" type="button" className="me-2" onClick={() => formik.handleSubmit()}>
                    {
                        formik.values.id ? 'Actualizar' : 'Aceptar'
                    }
                </Button>
            }
            
        </div>
    )
}