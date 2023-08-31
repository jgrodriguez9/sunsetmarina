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
import { getBoat } from '../../../../helpers/marina/boat';
import FormBoat from '../../../../components/Marina/Boat/FormBoat';

const fields = [
	{ label: 'Nombre', width: 3 },
	{ label: 'Número registro', width: 3 },
	{ label: 'Cliente', width: 5 },
	{ label: null, width: 1 },
	{ label: 'Tipo de barco', width: 3 },
	{ label: 'Fecha expiración seguro', width: 3 },
	{ label: 'Marca del motor', width: 3 },
	{ label: null, width: 3 },
	{ label: 'Longitud', width: 2 },
	{ label: 'Manga', width: 2 },
	{ label: 'Calado', width: 2 },
];
function EditBoat() {
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
			const response = await getBoat(id);
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
				<Breadcrumbs title={'Barco'} breadcrumbItem={'Barco'} />

				<Row className="pb-5">
					<Col lg="12">
						{states.loading && (
							<FormLoader
								fields={fields}
								titleCard="Editar Barco"
							/>
						)}
						{states.success && (
							<CardMain
								title="Editar Barco"
								children={
									<FormBoat
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

export default EditBoat;
