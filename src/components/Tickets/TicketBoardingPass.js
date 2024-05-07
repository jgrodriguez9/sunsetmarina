import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPayment from './TicketPayment';

const TicketBoardingPass = ({ ticket }) => {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center m-3">
			<h3 className="mb-3 text-center">
				Se ha generado su pase de salida correctamente
			</h3>
			<PDFDownloadLink
				className="btn btn-primary"
				document={<TicketPayment ticket={ticket} />}
				fileName={`${ticket.code}.pdf`}
			>
				{({ blob, url, loading, error }) =>
					loading ? 'Cargando documento...' : 'Descargar ticket'
				}
			</PDFDownloadLink>
		</div>
	);
};

export default TicketBoardingPass;
