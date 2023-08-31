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
import { getNotifcation } from '../../../../helpers/catalogos/notifications';
import FormNotification from '../../../../components/Catalogo/Notification/FormNotification';

const fields = [
	{ label: 'Nota', width: 4 },
	{ label: 'Fecha recordatorio', width: 3 },
	{ label: 'Estado', width: 2 },
];
function EditNotifications() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [item, setItem] = useState(null);
	const [states, setStates] = useState({
		reload: false,
		loading: true,
		error: false,
		success: false,
	});

	const fetchNotification = async () => {
		setStates((prev) => ({
			reload: false,
			loading: true,
			success: false,
			error: false,
		}));
		try {
			const response = await getNotifcation(id);
			setItem(response);
			setStates((prev) => ({
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
				loading: false,
				error: true,
				success: false,
			}));
		}
	};

	useEffect(() => {
		fetchNotification();
	}, [id]);

	useEffect(() => {
		if (states.reload) {
			fetchNotification();
		}
	}, [states.reload]);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs
					title={'Notificación'}
					breadcrumbItem={'Notificación'}
				/>

				<Row className="pb-5">
					<Col lg="12">
						{states.loading && (
							<FormLoader
								fields={fields}
								titleCard="Editar Notificación"
							/>
						)}
						{states.success && (
							<CardMain
								title="Editar Notificación"
								children={
									<FormNotification
										item={item}
										btnTextSubmit="Actualizar"
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

export default EditNotifications;
