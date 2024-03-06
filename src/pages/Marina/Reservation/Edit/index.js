import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import ErrorEntity from '../../../../components/Common/ErrorEntity';
import FormLoader from '../../../../components/Loader/FormLoader';
import { ERROR_SERVER } from '../../../../constants/messages';
import { addMessage } from '../../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../../utils/extractMeaningfulMessage';
import { getReservation } from '../../../../helpers/marina/slipReservation';
import FormReserva from '../../../../components/Marina/Reserva/FormReserva';

const fields = [
	{ label: 'Cliente', width: 3 },
	{ label: 'Embarcación', width: 3 },
	{ label: 'Slip', width: 3 },
	{ label: 'Precio diario', width: 3 },
	{ label: 'Fecha inicio', width: 3 },
	{ label: 'Fecha terminación', width: 3 },
	{ label: 'Estado', width: 3 },
	{ label: null, width: 3 },
	{ label: 'Observación', width: 6 },
];
function EditReservation() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [item, setItem] = useState(null);
	const [states, setStates] = useState({
		reload: true,
		loading: true,
		error: false,
		success: false,
	});

	const fetchItem = async () => {
		try {
			const response = await getReservation(id);
			setItem(response);
			setStates((prev) => ({
				...prev,
				loading: false,
				error: false,
				success: true,
			}));
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setStates((prev) => ({
				...prev,
				loading: false,
				error: true,
				success: false,
			}));
		}
	};

	useEffect(() => {
		if (states.reload) {
			fetchItem();
			setStates({
				reload: false,
				loading: true,
				error: false,
				success: false,
			});
		}
	}, [states.reload]);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Reservación'}
					breadcrumbItem={'Reservación'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						{states.loading && (
							<FormLoader
								fields={fields}
								titleCard="Editar Reservación"
							/>
						)}
						{states.success && (
							<CardMain
								title="Editar Reservación"
								children={
									<FormReserva
										item={item}
										btnTextSubmit="Guardar"
									/>
								}
							/>
						)}
						{states.error && (
							<ErrorEntity
								text="En estos momentos no podemos obtener la información"
								setReload={setStates}
							/>
						)}
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default EditReservation;
