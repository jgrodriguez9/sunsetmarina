import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormMuelle from "../../../../components/Catalogo/Muelle/FormMuelle";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";

function CreateMuelle(){

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Muelle'}
                    breadcrumbItem={"Muelle"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Crear Muelle'
                        children={<FormMuelle item={null} btnTextSubmit="Guardar"/>}
                    />                                          
                  </Col>
                </Row>
            </Container>
        </div>
    )

}

export default withRouter(CreateMuelle)