import { Col, Input, Label, Row } from "reactstrap";
import Select from "react-select";
import { Country }  from 'country-state-city';
import { useState } from "react";
import { SELECT_OPTION } from "../../../constants/messages";
import { statusClient } from "../../../data/statusClient";

export default function Wizard1({formik}){
    const countryOpt = Country.getAllCountries().map(c=>({label: c.name, value: c.name}))
    const [nacionalidadDefault, setNacionalidadDefault] = useState(formik.values?.nacionalidad ? {label: formik.values?.nacionalidad, value: formik.values?.nacionalidad} : null)
    const [statusDefault, setStatusDefault] = useState(formik.values?.status ? {label: formik.values?.status, values: formik.values?.status} : null)

    return (
        <Row>
            <Col xs="12" md="4">
                <Label htmlFor="propietario" className="mb-0">Propietario</Label>
                <Input
                    id="name"
                    name="propietario"
                    className={`form-control ${formik.errors.propietario ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    value={formik.values.propietario}  
                />
                {
                    formik.errors.propietario &&
                    <div className="invalid-tooltip">{formik.errors.propietario}</div>
                }
            </Col>
            <Col xs="12" md="4">
                <Label htmlFor="embarcacion" className="mb-0">Embarcación</Label>
                <Input
                    id="name"
                    name="embarcacion"
                    className={`form-control ${formik.errors.embarcacion ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    value={formik.values.embarcacion}  
                />
                {
                    formik.errors.embarcacion &&
                    <div className="invalid-tooltip">{formik.errors.embarcacion}</div>
                }
            </Col>
            <Col xs="12" md="4">
                <Label htmlFor="nacionalidad" className="mb-0">Nacionalidad</Label>
                <Select
                    value={nacionalidadDefault}
                    onChange={(value) => {
                        setNacionalidadDefault(value)
                        formik.setFieldValue('nacionalidad', value?.label ?? '') 
                    }}
                    options={countryOpt}
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    id="nacionalidad"
                />
            </Col>
            <Col xs="12" md="4">
                <Label htmlFor="identificacion" className="mb-0">INE/Pasaporte</Label>
                <Input
                    id="name"
                    name="identificacion"
                    className={`form-control ${formik.errors.identificacion ? 'is-invalid' : ''}`}
                    onChange={formik.handleChange}
                    value={formik.values.identificacion}  
                />
                {
                    formik.errors.identificacion &&
                    <div className="invalid-tooltip">{formik.errors.identificacion}</div>
                }
            </Col>
            <Col xs="12" md="4">
                <Label htmlFor="nacionalidad" className="mb-0">Estado del cliente</Label>
                <Select
                    value={statusDefault}
                    onChange={(value) => {
                        setStatusDefault(value)
                        formik.setFieldValue('status', value?.label ?? '') 
                    }}
                    options={statusClient}
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    id="nacionalidad"
                />
            </Col>
             
        </Row>
    )
}