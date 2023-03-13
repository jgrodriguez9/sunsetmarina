import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { Country, State, City }  from 'country-state-city';
import { useEffect, useState } from "react";
import { SELECT_OPTION } from "../../../constants/messages";

export default function Wizard2({formik}){
    const countryOpt = Country.getAllCountries().map(c=>({label: c.name, value: c.isoCode}))
    const [countryDefault, setCountryDefault] = useState(formik.values?.country ? {label: formik.values?.country, value: formik.values?.country} : null)
    const [statesOpt, setStatesOpt] = useState([])
    const [statesDefault, setStatesDefault] = useState(formik.values?.state ? {label: formik.values?.state, value: formik.values?.state} : null)
    const [citiesOpt, setCitiesOpt] = useState([])
    const [citiesDefault, setCitiesDefault] = useState(formik.values?.city ? {label: formik.values?.city, value: formik.values?.city} : null)

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

    return (
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
                    options={countryOpt}
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    isClearable
                    id="country"
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
                    isClearable
                    id="state"
                />
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
                    isClearable
                    id="city"
                />
            </Col> 
            <Col xs="12" md="3">
                <Label htmlFor="codigoPostal" className="mb-0">Código postal</Label>
                <Input
                    id="codigoPostal"
                    name="codigoPostal"
                    className={`form-control ${formik.errors.codigoPostal ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    value={formik.values.codigoPostal}  
                />
            </Col>
            <Col xs="12" md="6">
                <Label htmlFor="direccion" className="mb-0">Dirección</Label>
                <Input
                    id="direccion"
                    name="direccion"
                    className={`form-control ${formik.errors.direccion ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    value={formik.values.direccion}  
                />
            </Col> 
            <Col xs="12" md="3">
                <Label htmlFor="colonia" className="mb-0">Colonia</Label>
                <Input
                    id="colonia"
                    name="colonia"
                    className={`form-control ${formik.errors.colonia ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    value={formik.values.colonia}  
                />
            </Col>            
        </Row>
    )
}