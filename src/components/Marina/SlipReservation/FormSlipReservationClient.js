
import {  useEffect, useState } from "react";
import { useFormik } from "formik"
import { Button, Col, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../../constants/messages";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import SimpleDate from "../../DatePicker/SimpleDate";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import moment from "moment";
import getObjectValid from "../../../utils/getObjectValid";
import { saveDocument, updateDocument } from "../../../helpers/marina/document";
import { getDocumentTypeList } from "../../../helpers/catalogos/documentType";
import Select from "react-select";
import { getBoadTypeAll } from "../../../helpers/catalogos/boadType";
import { getBoatByClient } from "../../../helpers/marina/boat";
import { getSlipList } from "../../../helpers/marina/slip";
import { getSlipReservationPriceAndValid } from "../../../helpers/marina/slipReservation";
import { numberFormat } from "../../../utils/numberFormat";


export default function FormSlipReservationClient({item, setOpenModalAdd, setRefetch}){
    const dispatch = useDispatch();
    const [validSlip, setValidSlip] = useState(null)
    const [arrivalDate, setArrivalDate] = useState(item?.arrivalDate  ? moment(item?.arrivalDate , 'YYYY-MM-DD').toDate() : null)
    const [departureDate, setDepartureDate] = useState(item?.departureDate  ? moment(item?.departureDate , 'YYYY-MM-DD').toDate() : null)

    const [boatOpt, setBoatOpt] = useState([])
    const [slipOpt, setSlipOpt] = useState([])
    
    const fetchBoatApi = async () => {
        try {
            const response = await getBoatByClient(item.customer.id)
            setBoatOpt(response.list.map((boat) => ({label: boat.name, value: boat.id})))
        } catch (error) {
            setBoatOpt([])
        }
    }
    const fetchSlips = async () => {
        try {
            const response = await getSlipList()
            setSlipOpt(response.filter(it=>it.status==='AVAILABLE').map((slip) => ({label: slip.code, value: slip.id})))
        } catch (error) {
            setSlipOpt([])
        }
    }

    useEffect(() => {
        fetchBoatApi();
        fetchSlips();
    }, [])

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            price: item?.price ?? 0, 
            observations: item?.observations ?? '', 
            customer: item?.customer ?? {id: ''},
            boat: item?.boat ?? {id: ''},
            slip: item?.slip ?? {id: ''}, 
        },
        validationSchema: Yup.object({
            boat: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            }),
            slip: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            }),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            console.log(values)
            // if(values.id){
            //     //update
            //     try{
            //         values.insuranceExpirationDate = moment(values.insuranceExpirationDate).format('YYYY-MM-DD')
            //         let response = await updateBoat(values.id, values)
            //         if(response){
            //             dispatch(addMessage({
            //                 type: 'success',
            //                 message: UPDATE_SUCCESS
            //             }))
            //             setOpenModalAdd(false)
            //             setRefetch(true)
            //         }else{
            //             dispatch(addMessage({
            //                 type: 'error',
            //                 message: ERROR_SERVER
            //             }))
            //         }
                
            //     }catch(error){
            //         let message  = ERROR_SERVER;
            //         message = extractMeaningfulMessage(error, message)
            //         dispatch(addMessage({
            //             type: 'error',
            //             message: message
            //         }))
            //     }
            // }else{
            //     //save
            //     try{
            //         values.insuranceExpirationDate = moment(values.insuranceExpirationDate).format('YYYY-MM-DD')
            //         let response = await saveBoat(values)
            //         if(response){
            //             dispatch(addMessage({
            //                 type: 'success',
            //                 message: SAVE_SUCCESS
            //             }))
            //             setOpenModalAdd(false)
            //             setRefetch(true)
            //         }else{
            //             dispatch(addMessage({
            //                 type: 'error',
            //                 message: ERROR_SERVER
            //             }))
            //         }
                
            //     }catch(error){
            //         let message  = ERROR_SERVER;
            //         message = extractMeaningfulMessage(error, message)
            //         dispatch(addMessage({
            //             type: 'error',
            //             message: message
            //         }))
            //     }
            // }
        }
    })

    //checamos precio y si es valid el slip
    useEffect(() => {
        if(formik.values.boat.id && formik.values.slip.id){
            const fecthPriceAndValid = async () => {
                try {
                    const query = `${formik.values.slip.id}&${formik.values.boat.id}`
                    const response = await getSlipReservationPriceAndValid(query)
                    setValidSlip(response.valid)
                    formik.setFieldValue('price', response.price)
                    console.log(response)
                } catch (error) {
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    dispatch(addMessage({
                        type: 'error',
                        message: message
                    })) 
                }
            }
            fecthPriceAndValid();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formik.values.boat.id, formik.values.slip.id, dispatch])

    const onOpen = (selectedDates, dateStr, instance) => {
        instance.set('minDate',  formik.values.arrivalDate)
    }
    return(
        <div className="needs-validation">
            <Row>
                <Col xs="12" md="4">
                    <div className="mb-3">
                        <Label htmlFor="boatType" className="mb-0">Embarcación</Label>
                        <Select
                            value={formik.values.boat?.id ? 
                                {
                                    value: formik.values.boat.id, 
                                    label: boatOpt.find(it=>it.value === formik.values.boat.id)?.label ?? ''} :
                                        null}
                            onChange={(value) => {
                                formik.setFieldValue('boat.id', value?.value ?? '')
                                formik.setFieldValue('boat.name', value?.label ?? '') 
                            }}
                            options={boatOpt}
                            classNamePrefix="select2-selection"
                            placeholder={SELECT_OPTION}
                        />
                        {
                            formik.errors.documentType &&
                            <div className="invalid-tooltip d-block">{formik.errors.documentType}</div>
                        }
                    </div>
                </Col>
                <Col xs="12" md="4">
                    <div className="mb-3">
                        <Label htmlFor="boatType" className="mb-0">Slip</Label>
                        <Select
                            value={formik.values.slip?.id ? 
                                {
                                    value: formik.values.slip.id, 
                                    label: slipOpt.find(it=>it.value === formik.values.slip.id)?.label ?? ''} :
                                        null}
                            onChange={(value) => {
                                formik.setFieldValue('slip.id', value?.value ?? '')
                                formik.setFieldValue('slip.code', value?.label ?? '') 
                            }}
                            options={slipOpt}
                            classNamePrefix="select2-selection"
                            placeholder={SELECT_OPTION}
                        />
                        {
                            formik.errors.documentType &&
                            <div className="invalid-tooltip d-block">{formik.errors.documentType}</div>
                        }
                    </div>
                </Col>
                <Col xs="12" md="4">
                    <div className="mb-3">
                        <Label htmlFor="price" className="mb-0">Precio</Label>
                        <div className="form-control bg-light">{numberFormat(formik.values?.price ?? 0)}</div>
                    </div>    
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="4">
                    <div className="mb-3">
                        <Label htmlFor="price" className="mb-0">Fecha inicio</Label>
                        <SimpleDate
                            date={arrivalDate}
                            setDate={value=>{ 
                                setArrivalDate(value[0])
                                if(value.length > 0){
                                formik.setFieldValue(`arrivalDate`, value[0])
                                }else{
                                formik.setFieldValue(`arrivalDate`, null)
                                }                                                          
                            }}
                            placeholder="dd-MM-YYYY"
                        />
                    </div> 
                </Col>               
                <Col xs="12" md="4">
                    <div className="mb-3">
                        <Label htmlFor="price" className="mb-0">Fecha terminación</Label>
                        <SimpleDate
                            date={departureDate}
                            setDate={value=>{ 
                                setDepartureDate(value[0])
                                if(value.length > 0){
                                formik.setFieldValue(`departureDate`, value[0])
                                }else{
                                formik.setFieldValue(`departureDate`, null)
                                }                                                          
                            }}
                            placeholder="dd-MM-YYYY"
                            onOpen={onOpen}
                        />
                    </div> 
                </Col>  
            </Row>
            <Row>
                <Col xs="12" md="8">
                    <Label htmlFor="observations" className="mb-0">Observación</Label>
                    <textarea
                        id="observations"
                        name="observations"
                        className={`form-control ${formik.errors.observations ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.observations}
                        rows={5}
                    />
                </Col>
            </Row>
            <hr />
            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: 'Aceptar', color: 'primary', className: '', loader: true}]}/> :
                <Button color="primary" type="button" className="me-2" onClick={() => formik.handleSubmit()}>
                    {
                        formik.values.id ? 'Actualizar' : 'Aceptar'
                    }
                </Button>
            }
            
        </div>
    )
}