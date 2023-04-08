import { useState } from "react";
import { useFormik } from "formik"
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import ButtonsDisabled from "../../Common/ButtonsDisabled";
import { saveMuelle, updateMuelle } from "../../../helpers/catalogos/muelle";
import { getCompaniaListPaginado } from "../../../helpers/catalogos/compania";
import { useEffect } from "react";
import Select from "react-select";

export default function FormMuelle({item, btnTextSubmit="Aceptar"}){
    const history = useHistory();
    const dispatch = useDispatch();
    const [companyOpt, setCompanyOpt] = useState([])
    const [companyDefault, setCompanyDefault] = useState(null)

    useEffect(() => {
        if(item && companyOpt.length > 0){
            setCompanyDefault({
                value: item.company.id,
                label: companyOpt.find(c=>c.value===item.company.id)?.label
            })
        }
    }, [item, companyOpt])

    const fetchCompanyApiList = async () => {
        try {
            const response = await getCompaniaListPaginado(`?page=1&max=1000`);
            if(response.list.length > 0){
                setCompanyOpt(response.list.map(c=>({value: c.id, label:c.name})))
            }else{
                setCompanyOpt([])
            }
        } catch (error) {
            setCompanyOpt([])
        } 
    }

    useEffect(() => {
        fetchCompanyApiList();
    }, [])

    const formik = useFormik({
        initialValues: {
            id: item?.id ?? '',
            name: item?.name ?? '',
            orderPosition: item?.orderPosition ?? '',
            description: item?.description ?? '', 
            company: {
                id: item?.company?.id ?? ''
            }, 
        },
        validationSchema: Yup.object({
            name: Yup.string().required(FIELD_REQUIRED),
            company: Yup.object({
                id: Yup.number().required(FIELD_REQUIRED)
            })
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            console.log(values)
            if(values.id){
                //update
                try {
                    let response = await updateMuelle(values.id, values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: UPDATE_SUCCESS
                        }))
                        history.push('/pier')
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
                    let response = await saveMuelle(values)
                    if(response){
                        dispatch(addMessage({
                            type: 'success',
                            message: SAVE_SUCCESS
                        }))
                        history.push('/pier')
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
                <Col xs="12" md="2">
                    <Label className="mb-0 d-block">Orden</Label>
                    <Input
                        id="orderPosition"
                        name="orderPosition"
                        type="number"
                        min={0}
                        className={`form-control`}
                        onChange={formik.handleChange}
                        value={formik.values.orderPosition}
                    />
                </Col>                
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="country" className="mb-0">Companía</Label>
                    <Select
                        value={companyDefault}
                        onChange={(value) => {
                            setCompanyDefault(value)
                            formik.setFieldValue('company.id', value?.value ?? '') 
                        }}
                        options={companyOpt}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                    />
                    {
                        formik.errors.company &&
                        <div className="invalid-tooltip d-block">{formik.errors.company?.id}</div>
                    }
                </Col> 
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label className="mb-0 d-block">Descripción</Label>
                    <textarea
                        id="description"
                        name="description"
                        className={`form-control`}
                        onChange={formik.handleChange}
                        value={formik.values.description} 
                        rows="5"
                    />
                </Col>         
            </Row>
            <hr />
            {
                formik.isSubmitting ?
                <ButtonsDisabled buttons={[{text: btnTextSubmit, color: 'primary', className: '', loader: true}, {text: 'Cancelar', color: 'link', className: 'text-danger', loader: false}]}/> :
                <div className="d-flex">
                    <Button color="primary" type="submit">{btnTextSubmit}</Button>
                    <Link to="/pier" className="btn btn-link text-danger">Cancelar</Link>
                </div>
            }
            
        </Form>
    )
}