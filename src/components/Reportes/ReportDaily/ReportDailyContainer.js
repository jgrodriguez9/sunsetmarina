import { Col, Row } from 'reactstrap';
import DailyReportTable from './DailyReportTable';

const ReportDailyContainer = ({ concepts, groupByCustomer }) => {
	return (
		<>
			{concepts.map((item, index) => (
				<Row key={`concept-${index}`} className="mb-5">
					<Col>
						<h6>{`Concepto: ${item.concept}`}</h6>
						<DailyReportTable
							items={item.items}
							chargeTotal={item.totalCharge}
							chargeTotalUSD={item.totalChargeUSD}
							creditTotal={item.totalCredit}
							creditTotalUSD={item.totalCreditUSD}
							balanceTotal={item.totalBalance}
							balanceTotalUSD={item.totalBalanceUSD}
							groupByCustomer={groupByCustomer}
						/>
					</Col>
				</Row>
			))}
		</>
	);
};

export default ReportDailyContainer;
