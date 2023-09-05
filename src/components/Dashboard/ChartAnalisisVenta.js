import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'reactstrap';

export default function ChartAnalisisRenta({ title }) {
	const series = [56, 38, 26];
	const options = {
		labels: ['Series A', 'Series B', 'Series C'],
		colors: ['#556ee6', '#34c38f', '#f46a6a'],
		legend: { show: !1 },
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
				},
			},
		},
	};

	return (
		<Card className="shadow-sm">
			<CardBody>
				<h4 className="card-title mb-4">{title}</h4>

				<div>
					<div id="donut-chart">
						<ReactApexChart
							options={options}
							series={series}
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
									<i className="mdi mdi-circle text-primary me-1" />{' '}
									Slips
								</p>
								<h5>70</h5>
							</div>
						</Col>
						<Col xs="4">
							<div className="mt-4">
								<p className="mb-2 text-truncate">
									<i className="mdi mdi-circle text-success me-1" />{' '}
									Reservados
								</p>
								<h5 className="text-success">50</h5>
							</div>
						</Col>
						<Col xs="4">
							<div className="mt-4">
								<p className="mb-2 text-truncate">
									<i className="mdi mdi-circle text-danger me-1" />{' '}
									Disponibles
								</p>
								<h5 className="text-danger">20</h5>
							</div>
						</Col>
					</Row>
				</div>
			</CardBody>
		</Card>
	);
}
