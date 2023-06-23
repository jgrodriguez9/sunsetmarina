import { useEffect, useState } from "react"
import { Col, Input, Label, Row } from "reactstrap"
import SimpleDate from "../../DatePicker/SimpleDate"
import Select from "react-select";
import { SELECT_OPTION } from "../../../constants/messages";
import { getClientCategoryList } from "../../../helpers/catalogos/clientCategory";
import { languages } from "../../../data/languages";
import moment from "moment";

export default function PrincipalInfoClient({formik, item}){
    const [fecha, setFecha] = useState(item?.birthDate ? moment(item?.birthDate, "YYYY-MM-DD").toDate() : null)
    const [clientsCategoryOpt, setClientsCategoryOpt] = useState([])
    const [languageDefault, setLanguageDefault] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);

    const fecthClientsCategoryAPi = async () => {
        try {
            const response = await getClientCategoryList();
            setClientsCategoryOpt(response.filter(it=>it.enabled).map(it=>({value: it.id, label:it.name})))
        } catch (error) {
            console.log(error)
        } 
    }

    useEffect(() => {
        fecthClientsCategoryAPi();
    }, [])

    return (
        <Row>
            <Col xs="12" md="12">          
            </Col>
            <Col xs="12" md="5">
                <Row className="align-items-center mb-2 ">
                    <div className="d-flex align-items-center">
                        <div className="me-5">
                            {selectedImage ?
                                <>
                                    <img
                                        className="btn-image-profile"
                                        alt="not found"
                                        src={URL.createObjectURL(selectedImage)}
                                    />
                                    <i className="bx bxs-pencil icon-image-upload"/>
                                </> :
                                <button type="button" className="btn-block btn-image-profile">
                                    <i className="fas fa-camera icon-file-upload"/>
                                </button>
                            }
                            <input
                                type="file"
                                accept="image/*"
                                className="input-file"
                                onChange={e=>setSelectedImage(e.target.files[0])}
                            />
                        </div>
                        {formik.values.code && <div>
                            <span className="fw-bold bg-light p-2 rounded">{formik.values.code}</span>                            
                        </div>}
                    </div>                    
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="name" className="mb-0 col-md-3 col-12">Nombre</Label>
                    <div className="col-md-9 col-12">
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
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="lastName" className="mb-0 col-md-3 col-12">Apellidos</Label>
                    <div className="col-md-9 col-12">
                        <Input
                            id="lastName"
                            name="lastName"
                            className={`form-control ${formik.errors.lastName ? 'is-invalid' : ''}`}
                            onChange={formik.handleChange}
                            value={formik.values.lastName}  
                        />
                        {
                            formik.errors.lastName &&
                            <div className="invalid-tooltip">{formik.errors.lastName}</div>
                        }
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="identification" className="mb-0 col-md-3 col-12">Identificación</Label>
                    <div className="col-md-9 col-12">
                        <Input
                            id="identification"
                            name="identification"
                            className={`form-control ${formik.errors.identification ? 'is-invalid' : ''}`}
                            onChange={formik.handleChange}
                            value={formik.values.identification}  
                        />
                        {
                            formik.errors.identification &&
                            <div className="invalid-tooltip">{formik.errors.identification}</div>
                        }
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="email" className="mb-0 col-md-3 col-12">Correo electrónico</Label>
                    <div className="col-md-9 col-12">
                        <Input
                            id="email"
                            name="email"
                            className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                            onChange={formik.handleChange}
                            value={formik.values.email}  
                        />
                        {
                            formik.errors.email &&
                            <div className="invalid-tooltip">{formik.errors.email}</div>
                        }
                    </div>
                </Row>
            </Col>
            <Col xs="12" md={{size: 5, offset: 2}}>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="phone" className="mb-0 col-md-3 col-12">Teléfono</Label>
                    <div className="col-md-9 col-12">
                        <Input
                            id="phone"
                            name="phone"
                            className={`form-control`}
                            onChange={formik.handleChange}
                            value={formik.values.phone}  
                        />
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="rfc" className="mb-0 col-md-3 col-12">RFC</Label>
                    <div className="col-md-9 col-12">
                        <Input
                            id="rfc"
                            name="rfc"
                            className={`form-control`}
                            onChange={formik.handleChange}
                            value={formik.values.rfc}  
                        />
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="birthDate" className="mb-0 col-md-3 col-12">Fecha nacimiento</Label>
                    <div className="col-md-9 col-12">
                        <SimpleDate 
                            date={fecha}
                            setDate={value=>{ 
                                setFecha(value[0])
                                if(value.length > 0){
                                formik.setFieldValue(`birthDate`, value[0])
                                }else{
                                formik.setFieldValue(`birthDate`, '')
                                }                                                          
                            }}
                            placeholder="dd-MM-YYYY"
                        />
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="customerCategory" className="mb-0 col-md-3 col-12">Categoría del cliente</Label>
                    <div className="col-md-9 col-12">
                        <Select
                            value={formik.values.customerCategory ?
                                {
                                    value: formik.values.customerCategory.id, 
                                    label: clientsCategoryOpt.find(it=>it.value===formik.values.customerCategory.id)?.label} :
                                null
                            }
                            onChange={(value) => {
                                formik.setFieldValue('customerCategory.id', value?.value ?? '') 
                            }}
                            options={clientsCategoryOpt}
                            classNamePrefix="select2-selection"
                            placeholder={SELECT_OPTION}
                        />
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="customerCategory" className="mb-0 col-md-3 col-12">Idioma</Label>
                    <div className="col-md-9 col-12">
                        <Select
                            value={languageDefault}
                            onChange={(value) => {
                                setLanguageDefault(value)
                                formik.setFieldValue('language', value?.value ?? '') 
                            }}
                            options={languages}
                            classNamePrefix="select2-selection"
                            placeholder={SELECT_OPTION}
                        />
                    </div>
                </Row>
                <Row className="align-items-center mb-2">
                    <Label htmlFor="fax" className="mb-0 col-md-3 col-12">Fax</Label>
                    <div className="col-md-9 col-12">
                        <Input
                            id="fax"
                            name="fax"
                            className={`form-control`}
                            onChange={formik.handleChange}
                            value={formik.values.fax}  
                        />
                    </div>
                </Row>
            </Col>
        </Row>
    )
}