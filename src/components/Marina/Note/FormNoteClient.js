import {  useState } from "react";
import { useFormik } from "formik"
import { Button, Col, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, UPDATE_SUCCESS } from "../../../constants/messages";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import SimpleDate from "../../DatePicker/SimpleDate";
import { useDispatch } from "react-redux";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import moment from "moment";
import { saveNote, updateNote } from "../../../helpers/marina/note";


export default function FormNoteClient({item, setOpenModalAdd, setRefetch}){
    const dispatch = useDispatch();
    const [fecha, setFecha] = useState(item?.reminderDate  ? moment(item?.reminderDate , 'YYYY-MM-DD').toDate() : null)

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            comments: item?.comments ?? '', 
            reminderDate: item?.reminderDate ?? '', 
            customer: item?.customer ?? {id: ''}, 
        },
        validationSchema: Yup.object({
            comments: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            if(values.id){
                //update
                try{
                    values.reminderDate = values.reminderDate ? moment(values.reminderDate).format('YYYY-MM-DD') : null
                    let response = await updateNote(values.id, values)
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
                    values.reminderDate = values.reminderDate ? moment(values.reminderDate).format('YYYY-MM-DD') : null
                    let response = await saveNote(values)
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
                <Col xs="12" md="7">
                    <Label htmlFor="comments" className="mb-0">Nota</Label>
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
                <Col xs="12" md="5">
                    <Label htmlFor="reminderDate" className="mb-0">Fecha recordatorio (opcional)</Label>
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
                    <span className="text-muted">Escoger una fecha si desea un recordatorio para ese día</span>
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