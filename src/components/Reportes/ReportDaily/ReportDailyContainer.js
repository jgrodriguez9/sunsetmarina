import { Card, CardBody, CardHeader, CardText, Col, Row } from 'reactstrap';
import DailyReportTable from './DailyReportTable';
import { useMemo } from 'react';
import { numberFormat } from '../../../utils/numberFormat';

const ReportDailyContainer = ({ concepts, groupByCustomer }) => {
	console.log(concepts);
	const {
		totalChargesMXN,
		totalChargesUSD,
		totalAbonadoMXN,
		totalAbonadoUSD,
		totalDeudaMXN,
		totalDeudaUSD,
	} = useMemo(() => {
		if (concepts.length > 0) {
			return {
				totalChargesMXN: concepts.reduce(
					(acc, current) => acc + current.totalCharge,
					0
				),
				totalChargesUSD: concepts.reduce(
					(acc, current) => acc + current.totalChargeUSD,
					0
				),
				totalAbonadoMXN: concepts.reduce(
					(acc, current) => acc + current.totalCredit,
					0
				),
				totalAbonadoUSD: concepts.reduce(
					(acc, current) => acc + current.totalCreditUSD,
					0
				),
				totalDeudaMXN: concepts.reduce(
					(acc, current) => acc + current.totalBalance,
					0
				),
				totalDeudaUSD: concepts.reduce(
					(acc, current) => acc + current.totalBalanceUSD,
					0
				),
			};
		}
		return {
			totalChargesMXN: 0,
			totalChargesUSD: 0,
			totalAbonadoMXN: 0,
			totalAbonadoUSD: 0,
			totalDeudaMXN: 0,
			totalDeudaUSD: 0,
		};
	}, [concepts]);

	return (
		<>
			<Row className={'mt-4 my-2'}>
				<Col lg={3}>
					<Card outline color="primary" className="border">
						<CardHeader className="bg-transparent">
							<h5 className="my-0 text-primary">
								<i className="fas fa-dollar-sign me-2" />
								Total Cargos
							</h5>
						</CardHeader>
						<CardBody className="py-0">
							<CardText className="fs-3 text-primary mb-0">
								MXN {numberFormat(totalChargesMXN)}
							</CardText>
							<CardText className="fs-3 text-primary">
								USD {numberFormat(totalChargesUSD)}
							</CardText>
						</CardBody>
					</Card>
				</Col>
				<Col lg={3}>
					<Card color="success" className="border">
						<CardHeader className="bg-transparent">
							<h5 className="my-0 text-white">
								<i className="fas fa-dollar-sign me-2" />
								Total Abonado
							</h5>
						</CardHeader>
						<CardBody className="py-0">
							<CardText className="fs-3 text-white mb-0">
								MXN {numberFormat(totalAbonadoMXN)}
							</CardText>
							<CardText className="fs-3 text-white">
								USD {numberFormat(totalAbonadoUSD)}
							</CardText>
						</CardBody>
					</Card>
				</Col>
				<Col lg={3}>
					<Card color="danger" className="border">
						<CardHeader className="bg-transparent">
							<h5 className="my-0 text-white">
								<i className="fas fa-exclamation me-2" />
								Total Deuda
							</h5>
						</CardHeader>
						<CardBody className="py-0">
							<CardText className="fs-3 text-white mb-0">
								MXN {numberFormat(totalDeudaMXN)}
							</CardText>
							<CardText className="fs-3 text-white">
								USD {numberFormat(totalDeudaUSD)}
							</CardText>
						</CardBody>
					</Card>
				</Col>
			</Row>
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
