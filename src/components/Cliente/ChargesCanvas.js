import { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Col,
  Input,
  Label,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
} from "reactstrap";
import { getChargeByReservation } from "../../helpers/marina/charges";
import TableCharges from "../Marina/Charge/TableCharges";
import { numberFormat } from "../../utils/numberFormat";
import SpinLoader from "../Loader/SpinLoader";
import Select from "react-select";
import moment from "moment";
import "moment/locale/es";
import TooltipDescription from "../Common/TooltipDescription";
moment.locale("es");

const getTotalToPay = (charges) => {
  return charges
    .filter((it) => it.status !== "PAYED")
    .reduce((acc, cValue) => acc + cValue.amount + cValue.interest, 0);
};

const ChargesCanvas = ({ reservationId, open, setOpen, customerId }) => {
  const [charge, setCharge] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState(null);
  const [hasta, setHasta] = useState(null);
  const [chargesToPay, setChargesToPay] = useState([]);
  const [concept, setConcept] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const fecthChargesByReservation = async () => {
      try {
        const response = await getChargeByReservation(reservationId);
        const list = response.list.map((it) => ({
          id: it.id,
          amount: it.amount,
          interest: it.interest,
          status: it.status,
          monthYear: it.monthYear,
          checked: true,
          disabled: it.status === "PAYED",
          fullMonth: true,
        }));
        setCharge(list);
        setChargesToPay(list);
        setTotal(getTotalToPay(list));
        setLoading(false);
        const firstCharge = list.find((it) => it.status !== "PAYED");
        if (firstCharge) {
          setDesde({
            id: firstCharge.id,
            date: firstCharge.monthYear,
          });
          setHasta({
            id: firstCharge.id,
            date: firstCharge.monthYear,
          });
        }
      } catch (error) {
        setCharge([]);
        setLoading(false);
      }
    };
    if (reservationId) {
      setLoading(true);
      fecthChargesByReservation();
    }
  }, [reservationId]);

  const toggle = () => {
    setOpen(!open);
  };

  const onHandlePayment = () => {
    const data = {
      payment: {
        amount: total,
        concept: concept,
        reference: reference,
        customer: {
          id: customerId,
        },
        systemId: 777084,
        systemPayment: "RESERVATION",
      },
      charges: chargesToPay,
    };

    console.log(data);
  };

  return (
    <Offcanvas
      isOpen={open}
      toggle={toggle}
      direction="end"
      style={{
        minWidth: "100%",
      }}
    >
      <OffcanvasHeader toggle={toggle} className="border-bottom">
        Cargos
      </OffcanvasHeader>
      <OffcanvasBody className="p-4">
        {loading ? (
          <SpinLoader />
        ) : (
          <Row>
            <Col xs="12" md="8">
              <TableCharges items={charge} />
            </Col>
            <Col xs="12" md="4">
              <div className="py-4 border bottom-0 w-100 bg-light ">
                <Row>
                  <Col xs="12" md={{ size: 8, offset: 2 }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>Desde</div>
                      <div>
                        <strong className="text-uppercase">
                          {desde
                            ? moment(desde.date, "YYYYY-MM").format("MMMM YYYY")
                            : "-"}
                        </strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>Hasta</div>
                      {hasta ? (
                        <div>
                          <Select
                            value={{
                              value: hasta.id,
                              label: `${moment(hasta.date, "YYYYY-MM").format(
                                "MMMM YYYY"
                              )}`,
                            }}
                            onChange={(value) => {
                              console.log(value);
                            }}
                            options={[]}
                            classNamePrefix="select2-selection"
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: "1px solid #2A7EC3",
                                fontWeight: "bolder",
                                textTransform: "uppercase",
                                backgroundColor: "transparent!important",
                                boxShadow: 0,
                                padding: 0,
                              }),
                            }}
                          />
                          <div className="text-end">
                            <Input
                              id="enabled"
                              name="enabled"
                              type="checkbox"
                              className={`form-check-Input form-check-input`}
                            />
                            <Label
                              htmlFor={`enabled`}
                              className="mb-0 ms-1 me-2 text-danger"
                            >
                              Finalizar reserva
                            </Label>
                            <i
                              className="far fa-question-circle text-dark"
                              id="help"
                            />
                            <TooltipDescription
                              text="Si marca esta casilla el monto a cobrar será hasta el día actual"
                              id="help"
                            />
                          </div>
                        </div>
                      ) : (
                        <strong>-</strong>
                      )}
                    </div>
                    <div className="mb-2">
                      <Label htmlFor="concept" className="mb-0 fw-normal">
                        Concepto (Opcional)
                      </Label>
                      <Input
                        id="concept"
                        name="concept"
                        className="form-control"
                        onChange={(e) => setConcept(e.target.value)}
                        value={concept}
                      />
                    </div>
                    <div className="mb-2">
                      <Label htmlFor="concept" className="mb-0 fw-normal">
                        Referencia (Opcional)
                      </Label>
                      <Input
                        id="concept"
                        name="concept"
                        className="form-control"
                        onChange={(e) => setReference(e.target.value)}
                        value={reference}
                      />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-5">
                      <div>
                        <span>
                          <strong>Total</strong>
                        </span>
                      </div>
                      <div>
                        {total >= 0 ? (
                          <h3 className="text-primary m-0">
                            {numberFormat(total)}
                          </h3>
                        ) : (
                          <SpinLoader />
                        )}
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <Button
                        color="primary"
                        className="fs-4"
                        disabled={total <= 0}
                        block
                        onClick={onHandlePayment}
                      >
                        Pagar
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default ChargesCanvas;
