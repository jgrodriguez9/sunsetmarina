import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { months, years } from '../../constants/dates';
import SpinLoader from '../Loader/SpinLoader';

export default function CharBrazaletes({
	salesData,
	revenueFilter,
	setRevenueFilter,
}) {
	return (
		<>
			<Card className="shadow-sm">
				<CardBody>
					<div className="clearfix">
						<div className="float-end">
							<div className="d-flex">
								<div className="input-group input-group-sm me-1">
									<select
										className="form-select form-select-sm"
										value={revenueFilter.monthNumber}
										onChange={(e) => {
											setRevenueFilter((prev) => ({
												...prev,
												monthNumber: e.target.value,
											}));
										}}
									>
										{months.map((it) => (
											<option
												value={it.value}
												key={`m-${it.value}`}
											>
												{it.label}
											</option>
										))}
									</select>
									<label className="input-group-text">
										Mes
									</label>
								</div>
								<div className="input-group input-group-sm">
									<select
										className="form-select form-select-sm"
										value={revenueFilter.yearNumber}
										onChange={(e) => {
											setRevenueFilter((prev) => ({
												...prev,
												yearNumber: e.target.value,
											}));
										}}
									>
										{years().map((it) => (
											<option
												value={it.value}
												key={`y-${it.value}`}
											>
												{it.label}
											</option>
										))}
									</select>
									<label className="input-group-text">
										Año
									</label>
								</div>
							</div>
						</div>
						<h4 className="card-title mb-4">Brazaletes</h4>
					</div>

					<Row>
						<Col lg="12">
							<div id="line-chart" dir="ltr">
								{salesData.loading ? (
									<div
										style={{ height: '320px' }}
										className="d-flex align-items-center justify-content-center"
									>
										<SpinLoader />
									</div>
								) : (
									<ReactApexChart
										series={salesData?.series}
										options={salesData?.options}
										type="line"
										height={320}
										className="apex-charts"
									/>
								)}
							</div>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</>
	);
}
