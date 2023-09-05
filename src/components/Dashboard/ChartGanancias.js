import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { numberFormat } from '../../utils/numberFormat';
import { months, years } from '../../constants/dates';

export default function ChartGanancias({
	salesData,
	revenueFilter,
	setRevenueFilter,
}) {
	console.log(salesData);

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
						<h4 className="card-title mb-4">Ganancia</h4>
					</div>

					<Row>
						<Col lg="4">
							<div className="text-muted">
								<div className="mb-4">
									<p>Mes seleccionado</p>
									<h4>
										{numberFormat(
											salesData?.currentRevenue
										)}
									</h4>
									<div>
										<span
											className={`badge font-size-12 me-1 px-1 ${
												salesData?.percentageDifference >=
												0
													? 'badge-soft-success'
													: 'badge-soft-danger'
											}`}
										>
											{`${
												salesData?.percentageDifference >=
												0
													? '+'
													: '-'
											} ${
												salesData?.percentageDifference
											}%`}
										</span>
										Del mes anterior
									</div>
								</div>

								<div className="mt-4">
									<p className="mb-2">Ultimo mes</p>
									<h5>
										{numberFormat(
											salesData?.lastMonthRevenue
										)}
									</h5>
								</div>
							</div>
						</Col>

						<Col lg="8">
							<div id="line-chart" dir="ltr">
								<ReactApexChart
									series={salesData?.series}
									options={salesData?.options}
									type="line"
									height={320}
									className="apex-charts"
								/>
							</div>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</>
	);
}
