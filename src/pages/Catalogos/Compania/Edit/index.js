import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import FormCompania from '../../../../components/Catalogo/Compania/FormCompania';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import ErrorEntity from '../../../../components/Common/ErrorEntity';
import FormLoader from '../../../../components/Loader/FormLoader';
import { ERROR_SERVER } from '../../../../constants/messages';
import { getCompania } from '../../../../helpers/catalogos/compania';
import { addMessage } from '../../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../../utils/extractMeaningfulMessage';

const fields = [
	{ label: 'Nombre', width: 3 },
	{ label: 'Sitio web', width: 3 },
	{ label: 'Teléfono', width: 3 },
	{ label: 'Habilitado', width: 2 },
	{ label: 'Ciudad', width: 3 },
	{ label: 'Estado', width: 3 },
	{ label: 'País', width: 3 },
	{ label: 'Dirección', width: 9 },
];
function EditCompania() {
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
			const response = await getCompania(id);
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
				<Breadcrumbs title={'Compañía'} breadcrumbItem={'Compañía'} />

				<Row className="pb-5">
					<Col lg="12">
						{states.loading && (
							<FormLoader
								fields={fields}
								titleCard="Editar Compañía"
							/>
						)}
						{states.success && (
							<CardMain
								title="Editar Compañía"
								children={
									<FormCompania
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

export default EditCompania;
