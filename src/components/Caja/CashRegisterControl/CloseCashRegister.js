import { Button, Col, Row } from 'reactstrap';

export default function CloseCashRegister({
	isSubmiting,
	handleCloseCashRegister,
}) {
	return (
		<Row>
			<Col lg={12}>
				<div className="text-center">
					<i
						className="mdi mdi-progress-close text-danger"
						style={{ fontSize: '9em' }}
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
							¡Sí, cerrarla!
						</Button>
					) : (
						<Button
							color="danger"
							size="lg"
							onClick={handleCloseCashRegister}
						>
							¡Sí, cerrarla!
						</Button>
					)}
				</div>
			</Col>
		</Row>
	);
}
