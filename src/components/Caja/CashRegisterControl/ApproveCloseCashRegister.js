import { Button, Col, Row } from 'reactstrap';

export default function ApproveCloseCashRegister({
	isSubmiting,
	handleApproveCloseCashRegister,
}) {
	return (
		<Row>
			<Col lg={12}>
				<div className="text-center">
					<i
						className="mdi mdi-account-key-outline text-primary"
						style={{ fontSize: '9em', color: 'orange' }}
					/>
					<h2>¿Estas seguro?</h2>
					<h4>¡Esta acción no es reversible!</h4>
				</div>
			</Col>
			<Col lg={12}>
				<div className="text-center mt-3">
					{isSubmiting ? (
						<Button color="danger" size="lg" disabled>
							<i className="bx bx-loader bx-spin font-size-16 align-middle" />
							¡Sí, aprobar!
						</Button>
					) : (
						<Button
							color="danger"
							size="lg"
							onClick={handleApproveCloseCashRegister}
						>
							¡Sí, aprobar!
						</Button>
					)}
				</div>
			</Col>
		</Row>
	);
}
