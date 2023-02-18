import { withRouter } from "react-router-dom"
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import ChartAnalisisVenta from "../../components/Dashboard/ChartAnalisisVenta";
import ChartGanancias from "../../components/Dashboard/ChartGanancias";
import IndicadorTop from "../../components/Dashboard/IndicadorTop";
import UltimasTransacciones from "../../components/Dashboard/UltimasTransacciones";
import WelcomeCard from "../../components/Dashboard/WelcomeCard";

function Dashboard(){  
  
  return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={'Inicio'}
              breadcrumbItem={"Inicio"}
            />

            <Row>
              <Col xl="4">                
                <WelcomeCard />
              </Col>
              <Col xl="8">
                <IndicadorTop />
              </Col>
            </Row>

            <Row>
              <Col xl="4">      
                <ChartAnalisisVenta />  
              </Col>
              <Col xl="8">
                <ChartGanancias />
              </Col>
            </Row>

            <Row>
              <Col md="12">
                <UltimasTransacciones />
              </Col>
            </Row>

          </Container>
        </div>
      </>
    );
}

export default withRouter(Dashboard)