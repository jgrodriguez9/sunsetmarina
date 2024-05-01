import { useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import logo from '../../assets/images/logo.png';
import SpanControl from './common/SpanControl';
import RowControl from './common/RowControl';
import moment from 'moment';
import ButtonsDisabled from '../Common/ButtonsDisabled';
import jsFormatNumber from '../../utils/jsFormatNumber';
import { getFormaPago } from '../../utils/getFormaPago';

const options: Options = {
	filename: `recibo-pago-${moment().format('YYYYMMDDHHMMSS')}.pdf`,
	method: 'save',
	// default is Resolution.MEDIUM = 3, which should be enough, higher values
	// increases the image quality but also the size of the PDF, so be careful
	// using values higher than 10 when having multiple pages generated, it
	// might cause the page to crash or hang.
	resolution: Resolution.HIGH,
	page: {
		// margin is in MM, default is Margin.NONE = 0
		margin: Margin.LARGE,
		// default is 'A4'
		format: 'letter',
		// default is 'portrait'
		orientation: 'portrait',
	},
	canvas: {
		// default is 'image/jpeg' for better size performance
		mimeType: 'image/jpeg',
		qualityRatio: 1,
	},
	// Customize any value passed to the jsPDF instance and html2canvas
	// function. You probably will not need this and things can break,
	// so use with caution.
	overrides: {
		// see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
		pdf: {
			compress: true,
		},
		// see https://html2canvas.hertzen.com/configuration for more options
		canvas: {
			useCORS: true,
		},
	},
};

const getTargetElement = () => document.getElementById('ticketclientpayment');

const TicketClientPayment = ({ data, show, toggle = null }) => {
	const [loading, setLoading] = useState(false);
	const exportToPdf = async () => {
		setLoading(true);
		await generatePDF(getTargetElement, options);
		setLoading(false);
		if (toggle) toggle();
	};

	return (
		<>
			<div id="ticketclientpayment" style={{ visibility: 0 }}>
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
										text={data?.payment?.code}
										style={{
											fontSize: '16px',
											color: '#f46a69',
										}}
									/>
									<SpanControl text="Fecha" />
									<SpanControl
										text={moment(
											data?.payment?.dateCreated,
											'YYYY-MM-DD'
										).format('DD/MM/YYYY')}
									/>
									<SpanControl text="Año del mes de pago" />
									<SpanControl text="2024" />
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
										text={`${data?.payment?.customer?.name} ${data?.payment?.customer?.lastName}`}
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
										text={data?.reservation?.boat?.name}
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
										text={jsFormatNumber(
											data?.payment?.amount ?? 0
										)}
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
										text={getFormaPago(
											data?.payment?.paymentForm
										)}
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
									<RowControl text="GRAN TOTAL" />
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
										padding: 0,
									}}
								>
									<div style={{ padding: '14px 8px' }} />
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
										text={jsFormatNumber(
											data?.payment?.amount ?? 0
										)}
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
												text={
													'NOMBRE Y FIRMA DEL CLIENTE'
												}
											/>
										</div>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
			<Container>
				<hr />
				<Row>
					<Col>
						{loading ? (
							<ButtonsDisabled
								buttons={[
									{
										text: 'Descargar',
										color: 'primary',
										className: '',
										loader: true,
									},
								]}
							/>
						) : (
							<div className="d-flex">
								<Button
									color="primary"
									type="button"
									onClick={exportToPdf}
								>
									Descargar
								</Button>
								{toggle && (
									<Button
										color="link"
										type="button"
										className={'text-danger'}
										onClick={exportToPdf}
									>
										Cerrar
									</Button>
								)}
							</div>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default TicketClientPayment;
