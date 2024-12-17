import moment from 'moment';
import { Fragment, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import jsFormatNumber from '../../utils/jsFormatNumber';

export const getTotalsReportContract = (concepts, key) => {
	const total = concepts.reduce((acc, curr) => acc + curr[key], 0);
	return jsFormatNumber(total);
};

const ReportContratos = ({ items }) => {
	const getTotalBalance = useCallback((concepts) => {
		return concepts.reduce((acc, curr) => acc + curr.balance, 0);
	}, []);
	return (
		<Row>
			<Col>
				<div className="table-rep-plugin">
					<div className="table-responsive">
						<table className="table align-middle table-bordered table-hover responsiveTable font-size-12">
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
									<th>Saldo a favor</th>
								</tr>
							</thead>
							<tbody>
								{items.length > 0 ? (
									items.map((it, idx) => (
										<Fragment key={`type-${idx}`}>
											<tr>
												<td
													colSpan={8}
													className="fw-bold"
												>
													{it.boatType}
												</td>
												<td>
													{getTotalsReportContract(
														it.concepts,
														'monthContract'
													)}
												</td>
												<td>
													{getTotalsReportContract(
														it.concepts,
														'monthRental'
													)}
												</td>
												<td
													className={
														it.totalCharges > 0
															? 'text-danger fw-semibold'
															: ''
													}
												>
													{jsFormatNumber(
														it.totalCharges +
															it.totalInterest
													)}
												</td>
												<td
													className={
														it.totalChargesUSD > 0
															? 'text-danger fw-semibold'
															: ''
													}
												>
													{jsFormatNumber(
														it.totalChargesUSD +
															it.totalInterestUSD
													)}
												</td>
												<td
													className={
														getTotalBalance(
															it.concepts
														) > 0
															? 'text-success fw-semibold'
															: ''
													}
												>
													{jsFormatNumber(
														getTotalBalance(
															it.concepts
														)
													)}
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
																slip.charges
																	.amount +
																	slip.charges
																		.interest >
																0
																	? 'text-danger fw-semibold'
																	: ''
															}
														>
															{jsFormatNumber(
																slip.charges
																	.amount +
																	slip.charges
																		.interest
															)}
														</td>
														<td
															className={
																slip.charges
																	.amountUSD >
																0
																	? 'text-danger fw-semibold'
																	: ''
															}
														>
															{jsFormatNumber(
																slip.charges
																	.amountUSD +
																	slip.charges
																		.interestUSD
															)}
														</td>
														<td
															className={
																slip.balance > 0
																	? 'text-success fw-semibold'
																	: ''
															}
														>
															{jsFormatNumber(
																slip.balance
															)}
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
