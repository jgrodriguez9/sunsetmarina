import { useFormik } from "formik"
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, UPDATE_SUCCESS } from "../../../constants/messages";
import { saveCompania, updateCompania } from "../../../helpers/catalogos/compania";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { SELECT_OPTION } from '../../../constants/messages'

export default function FormCompania({item, btnTextSubmit="Aceptar"}){
    const history = useHistory();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            name: item?.name ?? '',
            phone: item?.phone ?? '',
            state: item?.state ?? '',
            city: item?.city ?? '',
            country: item?.country ?? '',
            address: item?.address ?? '',
            website: item?.website ?? '',
            enabled: item?.enabled ?? true,         
        },
        validationSchema: Yup.object({
            name: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            console.log(values)
            if(values.id){
                //update
                try {
                    let response = await updateCompania(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        history.push('/company')
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
                    let response = await saveCompania(values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: SAVE_SUCCESS
                        }))
                        history.push('/company')
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
                    <Label htmlFor="website" className="mb-0">Sitio web</Label>
                    <Input
                        id="website"
                        name="website"
                        className={`form-control ${formik.errors.website ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.website}  
                    />
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
                </Col>                
                <Col xs="12" md="3">
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
            <Row>
                <Col xs="12" md="3">
                    <Label htmlFor="city" className="mb-0">Ciudad</Label>
                    <Select
                        value={null}
                        onChange={() => {}}
                        //options={optionGroup}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="state" className="mb-0">Estado</Label>
                    <Select
                        value={null}
                        onChange={() => {}}
                        //options={optionGroup}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="country" className="mb-0">País</Label>
                    <Select
                        value={null}
                        onChange={() => {}}
                        //options={optionGroup}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                </Col> 
            </Row>
            <Row>
                <Col xs="12" md="9">
                    <Label htmlFor="address" className="mb-0">Dirección</Label>
                    <Input
                        id="address"
                        name="address"
                        className={`form-control ${formik.errors.address ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.address}  
                    />
                </Col>
            </Row>
            <hr />
            <div className="d-flex">
                <Button color="primary" type="submit">{btnTextSubmit}</Button>
                <Link to="/company" className="btn btn-link text-danger">Cancelar</Link>
            </div>
        </Form>
    )
}