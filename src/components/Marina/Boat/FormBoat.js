import { useEffect, useState } from "react";
import { useFormik } from "formik"
import { Button, Col, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_NUMERIC, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION } from "../../../constants/messages";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import { getBoadTypeAll } from "../../../helpers/catalogos/boadType";
import Select from "react-select";
import SimpleDate from "../../DatePicker/SimpleDate";
import { saveBoat } from "../../../helpers/marina/boat";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import moment from "moment";


export default function FormBoat({item, setOpenModalAdd, setRefetch}){
    const dispatch = useDispatch();
    const [fecha, setFecha] = useState(null)
    const [boatTypeOpt, setBoatTypeOpt] = useState([])
    const fetchBoatTypeAllApi = async () => {
        try {
            const response = await getBoadTypeAll()
            setBoatTypeOpt(response.map((boat) => ({label: boat.description, value: boat.id})))
        } catch (error) {
            setBoatTypeOpt([])
        }
    }

    useEffect(() => {
        fetchBoatTypeAllApi();
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
            boatType: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            }),            
            length: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            beam: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            draught: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            markEngine: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            console.log(values)
            //save
            try{
                values.insuranceExpirationDate = moment(values.insuranceExpirationDate).format('YYYY-MM-DD')
                let response = await saveBoat(values)
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
                <Col xs="12" md="3">
                    <Label htmlFor="boatType" className="mb-0">Tipo de barco</Label>
                    <Select
                        value={formik.values.boatType ? {label: formik.values.boatType.description, value: formik.values.boatType.id} : null}
                        onChange={(value) => {
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
            <hr />
            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: 'Aceptar', color: 'primary', className: '', loader: true}]}/> :
                <Button color="primary" type="button" className="me-2" onClick={() => formik.handleSubmit()}>Aceptar</Button>
            }
            
        </div>
    )
}