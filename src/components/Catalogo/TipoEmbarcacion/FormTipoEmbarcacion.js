import { useFormik } from "formik"
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, UPDATE_SUCCESS } from "../../../constants/messages";
import { saveBoadType, updateBoadType } from "../../../helpers/catalogos/boadType";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import ButtonsDisabled from "../../Common/ButtonsDisabled";

export default function FormTipoEmbarcacion({item, btnTextSubmit="Aceptar"}){
    const history = useHistory();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            description: item?.description ?? '',
            enabled: item?.enabled ?? true,
            hasEngine: item?.hasEngine ?? false,           
        },
        validationSchema: Yup.object({
            description: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            console.log(values)
            if(values.id){
                //update
                try {
                    let response = await updateBoadType(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        history.push('/boadtype')
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
                    let response = await saveBoadType(values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: SAVE_SUCCESS
                        }))
                        history.push('/boadtype')
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
                    <Label htmlFor="description" className="mb-0">Nombre</Label>
                    <Input
                        id="description"
                        name="description"
                        className={`form-control ${formik.errors.description ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.description}  
                    />
                    {
                        formik.errors.description &&
                        <div className="invalid-tooltip">{formik.errors.description}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label className="mb-0 opacity-0 d-block">placeholder</Label>
                    <Input
                        id="hasEngine"
                        name="hasEngine"
                        type="checkbox"
                        className={`form-check-Input form-check-input`}
                        onChange={formik.handleChange}
                        checked={formik.values.hasEngine || false}  
                    />
                    <Label htmlFor={`hasEngine`} className="mb-0 ms-2">Tiene motor</Label>
                </Col>
                <Col xs="12" md="2">
                    <Label className="mb-0 opacity-0 d-block">Habilitado</Label>
                    <Input
                        id="enabled"
                        name="enabled"
                        type="checkbox"
                        className={`form-check-Input form-check-input`}
                        onChange={formik.handleChange}
                        checked={formik.values.enabled || false}  
                    />
                    <Label htmlFor={`enabled`} className="mb-0 ms-2">Habilitado</Label>
                </Col>
            </Row>
            <hr />
            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: btnTextSubmit, color: 'primary', className: '', loader: true}, {text: 'Cancelar', color: 'link', className: 'text-danger', loader: false}]}/> :
                <div className="d-flex">
                    <Button color="primary" type="submit">{btnTextSubmit}</Button>
                    <Link to="/boadtype" className="btn btn-link text-danger">Cancelar</Link>
                </div>
            }            
        </Form>
    )
}