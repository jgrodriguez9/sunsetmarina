import { Col, Modal, ModalBody, Row } from 'reactstrap';
import TicketClientPayment from '../Tickets/TicketClientPayment';

export default function SuccessPaymentDialog({ ticket, show, setShow }) {
	const onCloseClick = () => {
		setShow(false);
	};

	return (
		<Modal
			isOpen={show}
			size="xl"
			toggle={onCloseClick}
			centered={true}
			backdrop={'static'}
			keyboard={false}
			className="overflow-hidden"
		>
			<ModalBody className="py-3 px-5">
				<Row>
					<Col lg={12}>
						<div className="text-center">
							<i
								className="mdi mdi-check-circle-outline"
								style={{ fontSize: '9em', color: '#34c38f' }}
							/>
							<h2>Pago procesado correctamente</h2>
							<h4>
								Puede descargar su comprobante en caso de
								requerirlo
							</h4>
						</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<div className="mt-3">
							<TicketClientPayment
								data={ticket}
								show={false}
								toggle={onCloseClick}
							/>
						</div>
					</Col>
				</Row>
			</ModalBody>
		</Modal>
	);
}
