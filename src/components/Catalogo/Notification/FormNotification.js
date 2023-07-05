import { useFormik } from "formik"
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Col, Form, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SELECT_OPTION, UPDATE_SUCCESS } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import { statusNotifications } from "../../../data/statusNotifications";
import Select from "react-select";
import SimpleDate from "../../DatePicker/SimpleDate";
import { useState } from "react";
import moment from "moment";
import { updateNotification } from "../../../helpers/catalogos/notifications";

export default function FormNotification({item, btnTextSubmit="Aceptar"}){
    const history = useHistory();
    const dispatch = useDispatch();
    const [fecha, setFecha] = useState(item?.reminderDate  ? moment(item?.reminderDate , 'YYYY-MM-DD').toDate() : null)

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            concept: item?.concept ?? '',
            comments: item?.comments ?? '',
            status: item?.status ?? '',
            reminderDate: item?.reminderDate ?? '',
        },
        validationSchema: Yup.object({
            comments: Yup.string().required(FIELD_REQUIRED),
            reminderDate: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            
            values.reminderDate = moment(values.reminderDate).format('YYYY-MM-DD')
            if(values.id){
                //update
                try {
                    let response = await updateNotification(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        history.push('/notification')
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
            }
        }
    })

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
                <Col xs="12" md="4">
                    <Label htmlFor="concept" className="mb-0">Concepto</Label>
                    <div className="form-control bg-light">{formik.values?.concept}</div>
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="4">
                    <Label htmlFor="name" className="mb-0">Nota</Label>
                    <textarea
                        id="comments"
                        name="comments"
                        className={`form-control ${formik.errors.comments ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.comments}
                        rows={5}
                    />
                    {
                        formik.errors.comments &&
                        <div className="invalid-tooltip">{formik.errors.comments}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="reminderDate" className="mb-0">Fecha recordatorio</Label>
                    <SimpleDate
                        date={fecha}
                        setDate={value=>{ 
                            setFecha(value[0])
                            if(value.length > 0){
                            formik.setFieldValue(`reminderDate`, value[0])
                            }else{
                            formik.setFieldValue(`reminderDate`, null)
                            }                                                          
                        }}
                        placeholder="dd-MM-YYYY"
                        options={{
                            minDate: moment().format("YYYY-MM-DD")
                        }}
                    />   
                    {
                        formik.errors.reminderDate &&
                        <div className="invalid-tooltip">{formik.errors.reminderDate}</div>
                    }                 
                </Col>   
                <Col xs="12" md="2">
                    <Label className="mb-0 d-block">Estado</Label>
                    <Select
                        value={formik.values.status ? 
                            {value: formik.values.status, label: statusNotifications.find(it=>it.value===formik.values.status).label} 
                            : null
                        }
                        onChange={(value) => {
                            formik.setFieldValue('status', value?.value ?? '') 
                        }}
                        options={statusNotifications}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                </Col>             
            </Row>
            <hr />
            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: btnTextSubmit, color: 'primary', className: '', loader: true}, {text: 'Cancelar', color: 'link', className: 'text-danger', loader: false}]}/> :
                <div className="d-flex">
                    <Button color="primary" type="submit" className="me-2">{btnTextSubmit}</Button>
                    <Link to="/notification" className="btn btn-danger">Cancelar</Link>
                </div>
            }
            
        </Form>
    )
}