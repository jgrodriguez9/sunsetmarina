import moment from 'moment';
import { Col, Row } from 'reactstrap';
import { getFormaPago } from '../../../utils/getFormaPago';
import jsFormatNumber from '../../../utils/jsFormatNumber';
import TableGroupByClient from './TableGroupByClient';

const DailyReportTable = ({
	items,
	chargeTotal,
	chargeTotalUSD,
	creditTotal,
	creditTotalUSD,
	balanceTotal,
	balanceTotalUSD,
	groupByCustomer,
}) => {
	if (groupByCustomer) {
		return (
			<TableGroupByClient
				items={items}
				chargeTotal={chargeTotal}
				chargeTotalUSD={chargeTotalUSD}
				creditTotal={creditTotal}
				creditTotalUSD={creditTotalUSD}
				balanceTotal={balanceTotal}
				balanceTotalUSD={balanceTotalUSD}
			/>
		);
	}

	return (
		<Row>
			<Col>
				<div className="table-rep-plugin">
					<div className="table-responsive table-wrapper">
						<table className="table align-middle table-bordered table-hover responsiveTable font-size-10">
							<thead className="table-light th-scrollable">
								<tr>
									<th>Código</th>
									<th>Cliente</th>
									<th>Embarcación</th>
									<th>Slip</th>
									<th>Fecha</th>
									<th>Forma pago</th>
									<th>Cargo (MXN)</th>
									<th>Abono (MXN)</th>
									<th>Deuda (MXN)</th>
									<th>Tipo de cambio</th>
									<th>Cargo (USD)</th>
									<th>Abono (USD)</th>
									<th>Deuda (USD)</th>
								</tr>
							</thead>
							<tbody
								style={{
									maxHeight: '300px',
									overflowY: 'auto',
								}}
							>
								{items.length > 0 ? (
									items.map((it, idx) => (
										<tr key={`${it.code}-${idx}`}>
											<td>{it.code}</td>
											<td>{it.customer}</td>
											<td>{it.boat}</td>
											<td>{it.slip}</td>
											<td>
												{moment
													.utc(it.date)
													.local()
													.format('DD-MM-YYYY')}
											</td>
											<td>
												{getFormaPago(it.paymentForm)}
											</td>
											<td>{jsFormatNumber(it.charge)}</td>
											<td>{jsFormatNumber(it.credit)}</td>
											<td>
												{jsFormatNumber(it.balance)}
											</td>
											<td>
												{jsFormatNumber(
													it.currencyExchange
												)}
											</td>
											<td>
												{jsFormatNumber(it.chargeUSD)}
											</td>
											<td>
												{jsFormatNumber(it.creditUSD)}
											</td>
											<td>
												{jsFormatNumber(it.balanceUSD)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="12">
											No hay información disponible
										</td>
									</tr>
								)}
							</tbody>
							<tfoot>
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>{jsFormatNumber(chargeTotal)}</td>
									<td>{jsFormatNumber(creditTotal)}</td>
									<td>{jsFormatNumber(balanceTotal)}</td>
									<td></td>
									<td>{jsFormatNumber(chargeTotalUSD)}</td>
									<td>{jsFormatNumber(creditTotalUSD)}</td>
									<td>{jsFormatNumber(balanceTotalUSD)}</td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default DailyReportTable;
