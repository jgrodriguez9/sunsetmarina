import { Col, Container, Row } from 'reactstrap';
import logo from '../../../assets/images/logo.png';
import RowControl from '../common/RowControl';
import { Fragment, useMemo } from 'react';
import jsFormatNumber from '../../../utils/jsFormatNumber';
import { processMonthYearCharges } from '../TicketClientPaymentDetail';
import SpanControl from '../common/SpanControl';
import moment from 'moment';

const getTotalPay = (payments) => {
    return payments.reduce((acc, curr) => acc+curr.amount, 0)
}

const getPaymentDate = (payment) => {
    const { years, months } = processMonthYearCharges(payment.monthYearCharges)
    return {
        years,
        months
    }
}

const TicketMultiDetail = ({payments}) => {

    const customerFullName = useMemo(() => {
        if(payments.length > 0){
            return `${payments[0].customer.name} ${payments[0].customer.lastName}`
        }
        return ''
    }, [payments])

    const granTotal = useMemo(() => {
        if(payments.length > 0){
            return payments.reduce((acc, curr) => {
                const totalEachPay = curr.payments.reduce((acc, curr) => acc+curr.amount, 0)
                return acc + totalEachPay
            }, 0)
        }
        return 0
	}, [payments])

    return (
        <Container>
            <Row>
                <Col
                    style={{
                        border: '2px solid #999',
                    }}
                >
                    <div
						className="d-flex flex-row justify-content-between align-items-center"
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
					</div>

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
								title="PROPIETARIO"
								text={customerFullName}
								titleStyle={{
									borderRight: '1px solid #004a8f',
								}}
							/>
						</Col>						
					</Row>
                    {
                        payments.map((payment) => (
                            <Fragment key={payment.id}>
                                <Row style={{ paddingTop: '4px' }}>
                                    <Col
                                        md="7"
                                        style={{
                                            padding: 0,
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center"
                                            style={{
                                                padding: '0px 8px',
                                                gap: '4px'
                                            }}
                                        >
                                            <SpanControl text="FOLIO:" style={{ fontWeight: 400 }} />
                                            <SpanControl text={payment?.code} />
                                        </div>                                        
                                    </Col>
                                    <Col
                                        md="5"
                                        style={{
                                            padding: 0,
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center"
                                            style={{
                                                padding: '0px 8px',
                                                gap: '4px'
                                            }}
                                        >
                                            <SpanControl text="FECHA:" style={{ fontWeight: 400 }} />
                                            <SpanControl text={moment.utc(payment?.dateCreated).local().format('DD-MM-YYYY')} />
                                        </div>                                        					
                                    </Col>
                                </Row>
                                <Row>
                                    <Col
                                        md="7"
                                        style={{
                                            padding: 0,
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center"
                                            style={{
                                                padding: '0px 8px',
                                                gap: '4px'
                                            }}
                                        >
                                            <SpanControl text="EMBARCACION:" style={{ fontWeight: 400 }} />
                                            <SpanControl text={payment?.reservation?.boat?.name ?? '-'} />
                                        </div>
                                    </Col>
                                    <Col
                                        md="5"
                                        style={{
                                            padding: 0,
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center justify-content-between"
                                            style={{
                                                padding: '0px 8px',
                                                gap: '4px'
                                            }}
                                        >
                                            <SpanControl text="SUMA DE IMPORTE:" style={{ fontWeight: 400 }} />
                                            <SpanControl text={`${jsFormatNumber(getTotalPay(payment.payments))} (MXN)`} />
                                        </div>                                        						
                                    </Col>
                                </Row>
                                <Row style={{
                                        borderBottom: '1px solid #999',
                                        borderLeft: 0,
                                        borderRight: 0,
                                        paddingBottom: '4px'
                                    }}
                                >
                                    <Col
                                        md="7"
                                        style={{
                                            padding: 0,
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center"
                                            style={{
                                                padding: '0px 8px',
                                                gap: '4px'
                                            }}
                                        >
                                            <SpanControl text="MES DE PAGO:" style={{ fontWeight: 400 }} />
                                            <SpanControl
                                                text={getPaymentDate(payment).months}
                                                style={{
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col
                                        md="5"
                                        style={{
                                            padding: 0,
                                        }}
                                    >
                                        <div
                                            className="d-flex align-items-center"
                                            style={{
                                                padding: '0px 8px',
                                                gap: '4px'
                                            }}
                                        >
                                            <SpanControl text="AÑO:" style={{ fontWeight: 400 }} />
                                            <SpanControl text={getPaymentDate(payment).years} />
                                        </div>						
                                    </Col>
                                </Row>
                            </Fragment>                            
                        ))
                    }

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
							md="12"
							style={{
								padding: 0,
							}}
						>
							<RowControl
								title="GRAN TOTAL"
								text={`${jsFormatNumber(granTotal ?? 0)} (MXN)`}
								titleStyle={{
									borderRight: '1px solid #004a8f',
								}}
								textStyle={{
									borderRight: '1px solid #004a8f',
									flexGrow: 1,
                                    textAlign:'right'
								}}
							/>
						</Col>						
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
    )
}

export default TicketMultiDetail