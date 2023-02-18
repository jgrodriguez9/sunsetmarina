import { Card, CardBody, Col, Row } from "reactstrap";

export default function IndicadorTop(){


    return (
        <Row>
            <Col md="4">
                <Card className="mini-stats-wid">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                                Slip rentados
                            </p>
                            <h4 className="mb-0">42</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                                <i className="fas fa-ship font-size-24" />
                            </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md="4">
                <Card className="mini-stats-wid">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                                Slip disponibles
                            </p>
                            <h4 className="mb-0">23</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                                <i className="fas fa-align-justify font-size-24" />
                            </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
            <Col md="4">
                <Card className="mini-stats-wid">
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                                Ganancia mensual
                            </p>
                            <h4 className="mb-0">$3,200.00</h4>
                            </div>
                            <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                                <i className="fas fa-dollar-sign font-size-24" />
                            </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}