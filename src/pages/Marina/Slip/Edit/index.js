import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	Col,
	Container,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from 'reactstrap';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import ErrorEntity from '../../../../components/Common/ErrorEntity';
import FormLoader from '../../../../components/Loader/FormLoader';
import FormSlip from '../../../../components/Marina/Slip/FormSlip';
import { ERROR_SERVER } from '../../../../constants/messages';
import { getSlip } from '../../../../helpers/marina/slip';
import { addMessage } from '../../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../../utils/extractMeaningfulMessage';
import ListReservation from '../../../../components/Marina/SlipReservation/ListReservation';
import DialogMain from '../../../../components/Common/DialogMain';

const fields = [
	{ label: 'Número', width: 2 },
	{ label: 'Tipo de slip', width: 2 },
	{ label: 'Muelle', width: 2 },
	{ label: 'Estado', width: 2 },
	{ label: 'Tipo de rampa', width: 2 },
	{ label: 'Precio', width: 2 },
	{ label: 'Amperage', width: 2 },
	{ label: 'Voltage', width: 2 },
	{ label: 'Posición X', width: 2 },
	{ label: 'Posición Y', width: 2 },
	{ label: 'Altura', width: 1 },
	{ label: 'Ancho', width: 1 },
	{ label: 'Observaciones', width: 5 },
];
function EditSlip() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [item, setItem] = useState(null);
	const [states, setStates] = useState({
		reload: true,
		loading: true,
		error: false,
		success: false,
	});
	const [openModal, setOpenModal] = useState(false);

	const fetchItem = async () => {
		try {
			const response = await getSlip(id);
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

	const modalChild = (
		<Row>
			<Col xs="12" md="12">
				<ListReservation
					reservations={item?.reservations ?? []}
					loading={false}
				/>
			</Col>
		</Row>
	);

	const toggleModalReservation = () => setOpenModal(true);

	return (
		<div className="page-content">
			<Container fluid>
				<Breadcrumbs title={'Slip'} breadcrumbItem={'Slip'} />

				<Row className="pb-5">
					<Col lg="12">
						{states.loading && (
							<FormLoader
								fields={fields}
								titleCard="Editar Slip"
							/>
						)}
						{states.success && (
							<CardMain
								title="Editar Slip"
								children={
									<FormSlip
										item={item}
										btnTextSubmit="Actualizar"
										toggleModalReservation={
											toggleModalReservation
										}
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
			<DialogMain
				open={openModal}
				setOpen={setOpenModal}
				title={'Historial de reservaciones'}
				size="xl"
				children={modalChild}
			/>
		</div>
	);
}

export default EditSlip;
