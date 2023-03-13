import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormCompania from "../../../../components/Catalogo/Compania/FormCompania";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";

function CreateCompania(){

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Compañía'}
                    breadcrumbItem={"Compañía"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Crear Compañía'
                        children={<FormCompania item={null} btnTextSubmit="Guardar"/>}
                    />                                          
                  </Col>
                </Row>
            </Container>
        </div>
    )

}

export default withRouter(CreateCompania)