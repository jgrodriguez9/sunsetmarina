import { Col, Input, Label, Row } from "reactstrap";

export default function Wizard3({formik}){

    return(
        <>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Contrato</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Tarjeta de registro</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Certificado de matrícula</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                    {/* <Input
                        id="name"
                        name="propietario"
                        className={`form-control ${formik.errors.propietario ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.propietario}  
                    />
                    {
                        formik.errors.propietario &&
                        <div className="invalid-tooltip">{formik.errors.propietario}</div>
                    } */}
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Factura de embarcación</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Poliza de seguro vigente</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Identificación oficial del propietario</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="foto" className="mb-0">Reglamento club de yates</Label>
                    <Input 
                        className="form-control" 
                        type="file" 
                        id="foto" 
                    />
                </Col>
            </Row>
        </>
        
    )
}