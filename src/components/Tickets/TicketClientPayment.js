import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import generatePDF, { Resolution, Margin, usePDF } from 'react-to-pdf';
import moment from 'moment';
import ButtonsDisabled from '../Common/ButtonsDisabled';
import { getPayment } from '../../helpers/marina/payment';
import SpinLoader from '../Loader/SpinLoader';
import TicketClientPaymentDetail from './TicketClientPaymentDetail';
import 'moment/locale/es';
moment.locale('es');

const options: Options = {
	filename: `recibo-pago-${moment().format('YYYYMMDDHHMMSS')}.pdf`,
	method: 'save',
	// default is Resolution.MEDIUM = 3, which should be enough, higher values
	// increases the image quality but also the size of the PDF, so be careful
	// using values higher than 10 when having multiple pages generated, it
	// might cause the page to crash or hang.
	resolution: Resolution.MEDIUM,
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

const TicketClientPayment = ({ idPayment, show, toggle = null }) => {
	const [isRequesting, setIsRequesting] = useState(true);
	const [loading, setLoading] = useState(false);
	const [payment, setPayment] = useState(null);
	const exportToPdf = async () => {
		setLoading(true);
		await generatePDF(getTargetElement, options);
		setLoading(false);
		if (toggle) toggle();
	};

	useEffect(() => {
		async function getPaymentApi() {
			setIsRequesting(true);
			try {
				const response = await getPayment(idPayment);
				setPayment(response);
				setIsRequesting(false);
			} catch (error) {
				setPayment(null);
				setIsRequesting(false);
			}
		}
		if (idPayment) {
			getPaymentApi();
		}
	}, [idPayment]);

	return isRequesting ? (
		<div className="d-flex p-5 justify-content-center">
			<SpinLoader />
		</div>
	) : (
		<>
			<TicketClientPaymentDetail payment={payment} />
			<div
				id={'ticketclientpayment'}
				style={{
					position: 'absolute',
					top: '-10000px', // Off-screen position
					gap: '4px',
					width: '100%',
				}}
				className="d-flex flex-column"
			>
				<TicketClientPaymentDetail payment={payment} />
				<hr />
				<TicketClientPaymentDetail payment={payment} />
				<hr />
				<TicketClientPaymentDetail payment={payment} />
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
										onClick={toggle}
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
