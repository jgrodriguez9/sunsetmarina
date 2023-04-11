import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormTipoDocumento from "../../../../components/Catalogo/TipoDocumento/FormTipoDocumento";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";

function CreateTipoDocumento(){

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Tipo de Documento'}
                    breadcrumbItem={"Tipo de Documento"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Crear Tipo de Documento'
                        children={<FormTipoDocumento item={null} btnTextSubmit="Guardar"/>}
                    />                                          
                  </Col>
                </Row>
            </Container>
        </div>
    )

}

export default withRouter(CreateTipoDocumento)