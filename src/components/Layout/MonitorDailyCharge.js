import { useEffect, useState } from 'react';
import TooltipDescription from '../Common/TooltipDescription';
import {
	monitorDailyChargeJob,
	runManuallyDailyChargeJob,
} from '../../helpers/marina/monitor';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../redux/messageSlice';
import {
	CHARGES_RUN_SUCCESSFULLY,
	ERROR_SERVER,
} from '../../constants/messages';
import moment from 'moment';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';

const MonitorDailyCharge = () => {
	const dispatch = useDispatch();
	const [textInfo, setTextInfo] = useState('');
	const [text, setText] = useState(
		'Todas las deudas de los slips se encuentran actualizadas'
	);
	const [showButton, setShowButton] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [refetch, setRetch] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await monitorDailyChargeJob();
				setShowButton(response.error);
				let message = '';
				if (response.error) {
					message = 'Actualizar pagos de slips';
					setText(
						'No se encuentra actualizada la deuda de los slips, por favor de click en el botón para ejecutarla'
					);
				} else {
					const formatDate = moment
						.utc(response.lastDateExcecuted)
						.local()
						.format('DD-MM-YYYY');
					message = `Actualizado: ${formatDate}`;
				}
				setTextInfo(message);
				setError(false);
				setLoading(false);
			} catch (error) {
				setTextInfo('Ops!, ocurrió un error');
				setText(
					'No se pudo obtener el chequeo de pagos de slips debido a un error del servidor, por favor refresque la página o contacte con el administrador.'
				);
				setError(true);
				setLoading(false);
			}
		};
		if (refetch) {
			fetchData();
			setRetch(false);
		}
	}, [refetch]);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const executeCharges = async () => {
		setIsSubmitting(true);
		try {
			await runManuallyDailyChargeJob();
			dispatch(
				addMessage({
					type: 'success',
					message: CHARGES_RUN_SUCCESSFULLY,
				})
			);
			setRetch(true);
			setIsSubmitting(false);
		} catch (error) {
			setIsSubmitting(false);
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
		}
	};
	return !loading ? (
		<div className="dropdown d-lg-inline-block ms-1">
			<div className="btn header-item d-flex">
				<div className="d-flex align-items-center">
					<div
						className="text-muted d-flex align-items-center me-1 border rounded"
						style={{
							fontSize: '12px',
							padding: '7.5px 12px',
						}}
					>
						<span
							className={`pe-1 ${
								error ? 'text-danger' : 'text-inherit'
							}`}
						>
							{textInfo}
						</span>
						<i
							className="fas fa-question-circle text-info"
							id="debt-description"
						/>
						<TooltipDescription
							text={text}
							id={'debt-description'}
						/>
					</div>
					{!error && showButton && (
						<button
							type="button"
							onClick={executeCharges}
							className="btn btn-danger"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<i className="bx bx-loader bx-spin font-size-16 align-middle" />
							) : (
								<i className="mdi mdi-reload" />
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	) : null;
};

export default MonitorDailyCharge;
