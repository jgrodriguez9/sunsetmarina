import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormAmarre from "../../../../components/Catalogo/Amarre/FormAmarre";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";

function CreateAmarre(){

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Tipo de Slip'}
                    breadcrumbItem={"Tipo de Slip"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Crear Tipo de Slip'
                        children={<FormAmarre item={null} btnTextSubmit="Guardar"/>}
                    />                                          
                  </Col>
                </Row>
            </Container>
        </div>
    )

}

export default withRouter(CreateAmarre)