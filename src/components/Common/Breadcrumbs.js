import { Button, Col, Row } from 'reactstrap';

function Breadcrumbs({
	breadcrumbItem,
	title,
	add = null,
	addLote = null,
	deleteLote = null,
	updatePrice = null,
}) {
	return (
		<Row>
			<Col xs="12">
				<div className="page-title-box d-sm-flex align-items-center justify-content-between">
					<h4 className="mb-0 font-size-18">{breadcrumbItem}</h4>
					<div className="page-title-right">
						{add && add.allow && (
							<Button
								color="primary"
								size="sm"
								className="fw-bold"
								onClick={add.goPageCreate}
							>
								{add.text}
							</Button>
						)}
						{addLote && (
							<Button
								color="primary"
								size="sm"
								className="fw-bold ms-2"
								onClick={addLote.goPageCreate}
							>
								{addLote.text}
							</Button>
						)}
						{deleteLote && (
							<Button
								color="danger"
								size="sm"
								className="fw-bold ms-2"
								onClick={deleteLote.action}
							>
								{deleteLote.text}
							</Button>
						)}
						{updatePrice && (
							<Button
								color="warning"
								size="sm"
								className="fw-bold ms-2"
								onClick={updatePrice.goPageCreate}
							>
								{updatePrice.text}
							</Button>
						)}
					</div>
				</div>
			</Col>
		</Row>
	);
}

export default Breadcrumbs;
