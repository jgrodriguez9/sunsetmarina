import { Col, Container, Row } from 'reactstrap';
import logo from '../../assets/images/logo.png';
import SpanControl from './common/SpanControl';
import moment from 'moment';
import { useMemo } from 'react';
import RowControl from './common/RowControl';
import jsFormatNumber from '../../utils/jsFormatNumber';
import { getFormaPago } from '../../utils/getFormaPago';

const TicketClientPaymentDetail = ({ payment, hide = false }) => {
	const paymentsMonths = useMemo(() => {
		if (!payment) return '';
		return payment.charges
			.map((it) => moment(it.monthYear, 'YYYY-MM').format('MMMM'))
			.join(',');
	}, [payment]);
	const paymentsYears = useMemo(() => {
		if (!payment) return '';
		const years = payment.charges.map((it) =>
			moment(it.monthYear, 'YYYY-MM').format('YYYY')
		);
		const res = Array.from(new Set(years));
		return res.join(',');
	}, [payment]);

	return (
		<Container>
			<Row>
				<Col
					style={{
						border: '2px solid #999',
					}}
				>
					<div
						className="d-flex flex-row"
						style={{ padding: '8px', marginBottom: '10px' }}
					>
						<img
							src={logo}
							alt="logo"
							style={{
								width: 'auto',
								height: '140px',
								marginRight: '7rem',
							}}
						/>
						<div className="d-flex flex-column align-items-center">
							<h4 className="mb-0">RECIBO DE PAGO</h4>
							<h4>SERVICIO DE RENTA DE MUELLE</h4>
						</div>
						<div
							className="d-flex flex-column ms-auto"
							style={{
								marginRight: '5rem',
							}}
						>
							<SpanControl text="Folio recibo" />
							<SpanControl
								text={payment?.code}
								style={{
									fontSize: '16px',
									color: '#f46a69',
								}}
							/>
							<SpanControl text="Fecha" />
							<SpanControl
								text={moment
									.utc(payment?.dateCreated)
									.local()
									.format('DD-MM-YYYY')}
							/>
							<SpanControl text="Año del mes de pago" />
							<SpanControl text={paymentsYears} />
						</div>
					</div>

					<Row
						style={{
							border: '1px solid #999',
							borderLeft: 0,
							borderRight: 0,
						}}
					>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="Propietario"
								text={`${payment?.customer?.name} ${payment?.customer?.lastName}`}
								titleStyle={{
									borderRight: '1px solid #004a8f',
								}}
							/>
						</Col>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="EMBARCACION"
								text={
									payment?.charges[0]?.reservation?.boat
										?.name ?? ''
								}
								titleStyle={{
									borderLeft: '1px solid #004a8f',
									borderRight: '1px solid #004a8f',
								}}
							/>
						</Col>
					</Row>

					<Row>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="SUMA DE IMPORTE"
								text={jsFormatNumber(payment?.amount ?? 0)}
								titleStyle={{
									borderRight: '1px solid #004a8f',
								}}
							/>
						</Col>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="FORMA DE PAGO"
								text={getFormaPago(payment?.paymentForm)}
								titleStyle={{
									borderLeft: '1px solid #004a8f',
									borderRight: '1px solid #004a8f',
								}}
							/>
						</Col>
					</Row>
					<Row
						style={{
							border: '1px solid #999',
							borderLeft: 0,
							borderRight: 0,
						}}
					>
						<Col
							md="3"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="CM"
								titleStyle={{
									borderRight: '1px solid #004a8f',
									width: '100%',
								}}
							/>
						</Col>
						<Col
							md="3"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="MES DE PAGO"
								titleStyle={{
									borderRight: '1px solid #004a8f',
									width: '100%',
								}}
							/>
						</Col>
						<Col
							md="3"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								text="TC"
								textStyle={{
									width: '100%',
								}}
							/>
						</Col>
						<Col
							md="3"
							style={{
								padding: 0,
							}}
						>
							<RowControl text="" />
						</Col>
					</Row>
					<Row>
						<Col
							md="3"
							style={{
								padding: 0,
							}}
						>
							<div style={{ padding: '14px 8px' }} />
						</Col>
						<Col
							md="3"
							style={{
								padding: '4px 8px',
							}}
						>
							<SpanControl
								text={paymentsMonths}
								style={{ textTransform: 'uppercase' }}
							/>
						</Col>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<div style={{ padding: '14px 8px' }} />
						</Col>
					</Row>
					<Row
						style={{
							border: '1px solid #999',
							borderLeft: 0,
							borderRight: 0,
						}}
					>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="GRAN TOTAL"
								text={jsFormatNumber(payment?.amount ?? 0)}
								titleStyle={{
									borderRight: '1px solid #004a8f',
								}}
								textStyle={{
									borderRight: '1px solid #004a8f',
									flexGrow: 1,
								}}
							/>
						</Col>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						></Col>
					</Row>
					<Row>
						<Col
							md="12"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="Estoy de acuerdo con el pago de los conceptos e importe en efectivo que se describen en el presente recibo"
								titleStyle={{
									flexGrow: 1,
									textAlign: 'center',
								}}
							/>
						</Col>
					</Row>
					<Row
						style={{
							border: '1px solid #999',
							borderLeft: 0,
							borderRight: 0,
						}}
					>
						<Col
							md="12"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="Estoy de acuerdo que se aplique en mi tarjeta de crédito o débito los conceptos e importe que se describen"
								titleStyle={{
									flexGrow: 1,
									textAlign: 'center',
								}}
							/>
						</Col>
					</Row>
					<Row>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<div
								style={{
									paddingTop: '80px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<div className="d-flex flex-column align-items-center">
									<div
										className="align-self-end"
										style={{
											border: '1px solid #555',
											width: '80%',
											margin: 'auto',
										}}
									></div>

									<SpanControl
										text={
											'NOMBRE Y FIRMA DE ENCARGADO ATENCION A CLIENTES'
										}
									/>
								</div>
							</div>
						</Col>
						<Col
							md="6"
							style={{
								padding: 0,
							}}
						>
							<div
								style={{
									paddingTop: '80px',
									paddingLeft: '8px',
									paddingRight: '8px',
								}}
							>
								<div className="d-flex flex-column align-items-center">
									<div
										className="align-self-end"
										style={{
											border: '1px solid #555',
											width: '80%',
											margin: 'auto',
										}}
									></div>

									<SpanControl
										text={'NOMBRE Y FIRMA DEL CLIENTE'}
									/>
								</div>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default TicketClientPaymentDetail;
