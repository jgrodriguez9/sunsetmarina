import { PDFDownloadLink } from "@react-pdf/renderer";
import { Col, Modal, ModalBody, Row } from "reactstrap";
import TicketPayment from "../Tickets/TicketPayment";

export default function SuccessPaymentDialog({ ticket, show, setShow }) {
  const onCloseClick = () => {
    setShow(false);
  };

  return (
    <Modal
      isOpen={show}
      toggle={onCloseClick}
      centered={true}
      backdrop={"static"}
      keyboard={false}
      className="overflow-hidden"
    >
      <ModalBody className="py-3 px-5">
        <Row>
          <Col lg={12}>
            <div className="text-center">
              <i
                className="mdi mdi-check-circle-outline"
                style={{ fontSize: "9em", color: "#34c38f" }}
              />
              <h2>Pago procesado correctamente</h2>
              <h4>Puede descargar su comprobante en caso de requerirlo</h4>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center mt-3">
              {ticket.payment && (
                <PDFDownloadLink
                  document={<TicketPayment ticket={ticket} />}
                  fileName={`pago.pdf`}
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      <button
                        className="btn btn-secondary btn-outline btn-lg ms-2"
                        disabled
                        type="button"
                      >
                        <i className="bx bxs-file-pdf" /> Cargando documento
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-lg ms-2"
                      >
                        Descargar
                      </button>
                    )
                  }
                </PDFDownloadLink>
              )}
              <button
                type="button"
                className="btn btn-light btn-lg ms-2"
                onClick={onCloseClick}
              >
                Cerrar
              </button>
            </div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
}
