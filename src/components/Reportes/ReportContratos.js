import moment from 'moment';
import { Fragment, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import jsFormatNumber from '../../utils/jsFormatNumber';

const ReportContratos = ({ items }) => {
	const getDeuda = useCallback((charges, payments, currency) => {
		if (currency === 'MXN') {
			const deudaMXN = charges.amount - payments.amount;
			return {
				total: deudaMXN,
				totalFormat: jsFormatNumber(deudaMXN),
			};
		} else {
			const deudaUSD = charges.amountUSD - payments.amountUSD;
			return {
				total: deudaUSD,
				totalFormat: jsFormatNumber(deudaUSD),
			};
		}
	}, []);
	return (
		<Row>
			<Col>
				<div className="table-rep-plugin">
					<div className="table-responsive">
						<table className="table align-middle table-bordered table-hover responsiveTable">
							<thead className="table-light">
								<tr>
									<th>Slip</th>
									<th>Embarcación</th>
									<th>Dueño</th>
									<th>Real Pies</th>
									<th>Forma pago</th>
									<th>Llegada</th>
									<th>Salida</th>
									<th>Venc. Contrato</th>
									<th>Renta Contratada</th>
									<th>Renta Mensual</th>
									<th>Deuda (MXN)</th>
									<th>Deuda (USD)</th>
								</tr>
							</thead>
							<tbody>
								{items.length > 0 ? (
									items.map((it, idx) => (
										<Fragment key={`type-${idx}`}>
											<tr>
												<td
													colSpan={12}
													className="fw-bold"
												>
													{it.boatType}
												</td>
											</tr>
											{it.concepts.map(
												(slip, idxSlip) => (
													<tr
														key={`concept-${idxSlip}`}
													>
														<td>{slip.slip}</td>
														<td>{slip.boat}</td>
														<td>{slip.customer}</td>
														<td>
															{slip.boatLength}
														</td>
														<td>
															{
																slip.paymentFrequency
															}
														</td>
														<td>
															{slip.arrivalDate
																? moment(
																		slip.arrivalDate,
																		'YYYY-MM-DD'
																  ).format(
																		'DD-MM-YYYY'
																  )
																: ''}
														</td>
														<td>
															{slip.departureDate !==
															'VIGENTE'
																? moment(
																		slip.departureDate,
																		'YYYY-MM-DD'
																  ).format(
																		'DD-MM-YYYY'
																  )
																: slip.departureDate}
														</td>
														<td>
															{slip.finalContractDate !==
															'INDEFINIDO'
																? moment(
																		slip.finalContractDate,
																		'YYYY-MM-DD'
																  ).format(
																		'DD-MM-YYYY'
																  )
																: slip.finalContractDate}
														</td>
														<td>
															{jsFormatNumber(
																slip.monthContract
															)}
														</td>
														<td>
															{jsFormatNumber(
																slip.monthRental
															)}
														</td>
														<td
															className={
																getDeuda(
																	slip.charges,
																	slip.payments,
																	'MXN'
																).total > 0
																	? 'text-danger fw-semibold'
																	: ''
															}
														>
															{
																getDeuda(
																	slip.charges,
																	slip.payments,
																	'MXN'
																).totalFormat
															}
														</td>
														<td
															className={
																getDeuda(
																	slip.charges,
																	slip.payments,
																	'USD'
																).total > 0
																	? 'text-danger fw-semibold'
																	: ''
															}
														>
															{
																getDeuda(
																	slip.charges,
																	slip.payments,
																	'USD'
																).totalFormat
															}
														</td>
													</tr>
												)
											)}
										</Fragment>
									))
								) : (
									<tr>
										<td colSpan="">
											No hay información disponible
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default ReportContratos;
