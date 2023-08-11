import { Col, Modal, ModalBody, Row } from "reactstrap";

export default function SuccessPaymentDialog({
  handleDownloadBoucher,
  show,
  setShow,
}) {
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
              <button
                type="button"
                className="btn btn-primary btn-lg ms-2"
                onClick={handleDownloadBoucher}
              >
                Descargar
              </button>
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
