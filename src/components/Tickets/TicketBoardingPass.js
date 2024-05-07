import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPayment from './TicketPayment';

const TicketBoardingPass = ({ ticket }) => {
	return (
		<div className="d-flex justify-content-center align-items-center m-5">
			<PDFDownloadLink
				className="btn btn-primary"
				document={<TicketPayment ticket={ticket} />}
				fileName={`${ticket.code}.pdf`}
			>
				{({ blob, url, loading, error }) =>
					loading ? 'Cargando documento...' : 'Descargar ahora'
				}
			</PDFDownloadLink>
		</div>
	);
};

export default TicketBoardingPass;
