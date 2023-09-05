import { Card, CardBody, Col, Row } from 'reactstrap';
import { numberFormat } from '../../utils/numberFormat';

export default function IndicadorTop({ indicator }) {
	return (
		<Row>
			<Col md="4">
				<Card className="mini-stats-wid shadow-sm">
					<CardBody>
						<div className="d-flex">
							<div className="flex-grow-1">
								<p className="text-muted fw-medium">
									{!indicator.loading &&
										indicator.data.ind1.title}
								</p>
								<h4 className="mb-0">
									{!indicator.loading &&
										indicator.data.ind1.number}
								</h4>
							</div>
							<div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
								<span className="avatar-title rounded-circle bg-primary">
									<i
										className={`${
											indicator?.data?.ind1?.iconClass ??
											''
										}`}
									/>
								</span>
							</div>
						</div>
					</CardBody>
				</Card>
			</Col>
			<Col md="4">
				<Card className="mini-stats-wid shadow-sm">
					<CardBody>
						<div className="d-flex">
							<div className="flex-grow-1">
								<p className="text-muted fw-medium">
									{!indicator.loading &&
										indicator.data.ind2.title}
								</p>
								<h4 className="mb-0">
									{!indicator.loading &&
										indicator.data.ind2.number}
								</h4>
							</div>
							<div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
								<span className="avatar-title rounded-circle bg-primary">
									<i
										className={`${
											indicator?.data?.ind2?.iconClass ??
											''
										}`}
									/>
								</span>
							</div>
						</div>
					</CardBody>
				</Card>
			</Col>
			<Col md="4">
				<Card className="mini-stats-wid shadow-sm">
					<CardBody>
						<div className="d-flex">
							<div className="flex-grow-1">
								<p className="text-muted fw-medium">
									{!indicator.loading &&
										indicator.data.ind3.title}
								</p>
								<h4 className="mb-0">
									{!indicator.loading &&
										indicator.data.ind3.number}
								</h4>
							</div>
							<div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
								<span className="avatar-title rounded-circle bg-primary">
									<i
										className={`${
											indicator?.data?.ind3?.iconClass ??
											''
										}`}
									/>
								</span>
							</div>
						</div>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
}
