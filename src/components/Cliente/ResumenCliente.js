import { Card, CardBody, CardHeader, CardText, Col, Row } from "reactstrap";

export function ResumenCliente(){


    return(
        <Row>
            <Col lg={3}>
              <Card outline color="primary" className="border">
                <CardHeader className="bg-transparent">
                  <h5 className="my-0 text-primary">
                    <i className="fas fa-ship me-2" />Barcos
                  </h5>
                </CardHeader>
                <CardBody className="py-0">                  
                  <CardText className="fs-1 text-primary">0</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3}>
              <Card outline color="success" className="border">
                <CardHeader className="bg-transparent">
                  <h5 className="my-0 text-success">
                    <i className="fas fa-calendar-check me-2" />Reservas
                  </h5>
                </CardHeader>
                <CardBody className="py-0">                  
                  <CardText className="fs-1 text-success">0</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3}>
              <Card color="success" className="border">
                <CardHeader className="bg-transparent">
                  <h5 className="my-0 text-white">
                    <i className="fas fa-dollar-sign me-2" />Total cobrado
                  </h5>
                </CardHeader>
                <CardBody className="py-0">                  
                  <CardText className="fs-1 text-white">$0.00</CardText>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3}>
              <Card color="danger" className="border">
                <CardHeader className="bg-transparent">
                  <h5 className="my-0 text-white">
                    <i className="fas fa-exclamation me-2" />Deuda
                  </h5>
                </CardHeader>
                <CardBody className="py-0">                  
                  <CardText className="fs-1 text-white">$0.00</CardText>
                </CardBody>
              </Card>
            </Col>
        </Row>
    )


}