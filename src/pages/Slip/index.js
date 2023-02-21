import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import MuelleMap from "../../components/Slip/MuelleMap";

function Slip(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);


    
    return (
        <>
          <div className="page-content">
            <Container fluid>
              {/* Render Breadcrumb */}
              <Breadcrumbs
                title={'Slip'}
                breadcrumbItem={"Slip"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <MuelleMap />
                </Col>
              </Row> 
            </Container>
          </div>
        </>
      );
  }
  
  export default withRouter(Slip)