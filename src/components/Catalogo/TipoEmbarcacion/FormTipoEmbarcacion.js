import { useFormik } from "formik"
import { Link } from "react-router-dom";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED } from "../../../constants/messages";

export default function FormTipoEmbarcacion({item, btnTextSubmit="Aceptar"}){
    
    const formik = useFormik({
        initialValues: {
            description: item?.description ?? '',
            enabled: item?.enabled ?? true,
            hasEngine: item?.hasEngine ?? false,           
        },
        validationSchema: Yup.object({
            description: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: (values) => {
            //validaciones antes de enviarlo
            console.log(values)
           
            //service here
            // try {
            //     async function savePartnerApi() {
            //         let response = await savePartner(values)
            //         if(response.state){
            //             toast.success("Actualizado correctamente");
            //             setReloadPartner(true)
            //             setShowForm(false)
            //         }else{
            //             toast.error(ERROR_SERVER);
            //         }
            //     }
            //     savePartnerApi()
            // }catch(error) {
            //     toast.error(ERROR_SERVER); 
            // }
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
            <div className="d-flex">
                <Button color="primary" type="submit">{btnTextSubmit}</Button>
                <Link to="/boadtype" className="btn btn-link text-danger">Cancelar</Link>
            </div>
        </Form>
    )
}