import { withRouter } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import FormCliente from "../../../components/Cliente/FormCliente"
import Breadcrumbs from "../../../components/Common/Breadcrumbs"
import CardMain from "../../../components/Common/CardMain";

function CreateClient(){

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Cliente'}
                    breadcrumbItem={"Cliente"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Crear Cliente'
                        children={<FormCliente item={null} btnTextSubmit="Guardar"/>}
                    />                                          
                  </Col>
                </Row>
            </Container>
        </div>
    )

}

export default withRouter(CreateClient)