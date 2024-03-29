import { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import { getClientShowAllData } from "../../helpers/marina/client";
import { numberFormat } from "../../utils/numberFormat";

export function ResumenCliente({ item }) {
  const [resumeClient, setResumeClient] = useState({
    boats: -1,
    reservations: -1,
    total: null,
    debts: null,
  });

  useEffect(() => {
    const fetchAPi = async () => {
      try {
        const response = await getClientShowAllData(item.id);
        setResumeClient({
          boats: response.boats,
          reservations: response.slips,
          total: numberFormat(response.payments),
          debts: numberFormat(response.debt),
        });
      } catch (error) {
        setResumeClient({
          boats: null,
          reservations: null,
          total: null,
          debts: null,
        });
      }
    };
    if (item) {
      fetchAPi();
    } else {
      setResumeClient({
        boats: 0,
        reservations: 0,
        total: numberFormat(0),
        debts: numberFormat(0),
      });
    }
  }, []);

  return (
    <Row>
      <Col lg={3}>
        <Card outline color="primary" className="border">
          <CardHeader className="bg-transparent">
            <h5 className="my-0 text-primary">
              <i className="fas fa-ship me-2" />
              Barcos
            </h5>
          </CardHeader>
          <CardBody className="py-0">
            <CardText className="fs-1 text-primary">
              {resumeClient.boats >= 0 ? (
                resumeClient.boats
              ) : (
                <Spinner className="fs-5" color="primary" />
              )}
            </CardText>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3}>
        <Card outline color="success" className="border">
          <CardHeader className="bg-transparent">
            <h5 className="my-0 text-success">
              <i className="fas fa-calendar-check me-2" />
              Reservas
            </h5>
          </CardHeader>
          <CardBody className="py-0">
            <CardText className="fs-1 text-success">
              {resumeClient.reservations >= 0 ? (
                resumeClient.reservations
              ) : (
                <Spinner className="fs-5" color="success" />
              )}
            </CardText>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3}>
        <Card color="success" className="border">
          <CardHeader className="bg-transparent">
            <h5 className="my-0 text-white">
              <i className="fas fa-dollar-sign me-2" />
              Total cobrado
            </h5>
          </CardHeader>
          <CardBody className="py-0">
            <CardText className="fs-1 text-white">
              {resumeClient.total ? (
                resumeClient.total
              ) : (
                <Spinner className="fs-5" />
              )}
            </CardText>
          </CardBody>
        </Card>
      </Col>
      <Col lg={3}>
        <Card color="danger" className="border">
          <CardHeader className="bg-transparent">
            <h5 className="my-0 text-white">
              <i className="fas fa-exclamation me-2" />
              Deuda
            </h5>
          </CardHeader>
          <CardBody className="py-0">
            <CardText className="fs-1 text-white">
              {resumeClient.debts ? (
                resumeClient.debts
              ) : (
                <Spinner className="fs-5" />
              )}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
