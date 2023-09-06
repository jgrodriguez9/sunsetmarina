import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'reactstrap';

export default function ChartAnalisisRenta({ title, salesIndicator }) {
	return (
		<Card className="shadow-sm">
			<CardBody>
				<h4 className="card-title mb-4">{title}</h4>

				<div>
					<div id="donut-chart">
						<ReactApexChart
							options={salesIndicator?.options}
							series={salesIndicator?.series}
							type="donut"
							height={260}
							className="apex-charts"
						/>
					</div>
				</div>

				<div className="text-center text-muted">
					<Row>
						<Col xs="4">
							<div className="mt-4">
								<p className="mb-2 text-truncate">
									<i className="mdi mdi-circle text-success me-1" />{' '}
									Reservados
								</p>
								<h5 className="text-success">
									{salesIndicator?.series[0]}%
								</h5>
							</div>
						</Col>
						<Col xs="4">
							<div className="mt-4">
								<p className="mb-2 text-truncate">
									<i className="mdi mdi-circle text-danger me-1" />{' '}
									Disponibles
								</p>
								<h5 className="text-danger">
									{salesIndicator?.series[1]}%
								</h5>
							</div>
						</Col>
						<Col xs="4">
							<div className="mt-4">
								<p className="mb-2 text-truncate">
									<i className="mdi mdi-circle text-warning me-1" />{' '}
									Bloqueados
								</p>
								<h5 className="text-warning">
									{salesIndicator?.series[2]}%
								</h5>
							</div>
						</Col>
					</Row>
				</div>
			</CardBody>
		</Card>
	);
}
