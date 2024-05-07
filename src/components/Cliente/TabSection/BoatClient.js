import { Col, Row, Badge } from 'reactstrap';
import TabActionHeader from '../Common/TabActionHeader';
import DialogMain from '../../Common/DialogMain';
import { useEffect, useMemo, useState } from 'react';
import FormBoatClient from '../../Marina/Boat/FormBoatClient';
import { deleteBoat, getBoatByClient } from '../../../helpers/marina/boat';
import SimpleTable from '../../Tables/SimpleTable';
import { DELETE_SUCCESS, ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { addMessage } from '../../../redux/messageSlice';
import { useDispatch } from 'react-redux';
import TableLoader from '../../Loader/TablaLoader';
import moment from 'moment';
import CellActions from '../../Tables/CellActions';
import DeleteDialog from '../../Common/DeleteDialog';

export default function BoatClient({ formik }) {
	const dispatch = useDispatch();
	const [loadingBoats, setLoadingBoats] = useState(true);
	const [openModalAdd, setOpenModalAdd] = useState(false);
	const [boats, setBoats] = useState([]);
	const [refetch, setRefetch] = useState(true);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isDeleting, setDeleting] = useState(false);
	const [selectedIdDelete, setSelectedIdDeleted] = useState(null);
	const [item, setItem] = useState({
		customer: { id: formik.values.id },
	});
	const addNewBoatModal = () => {
		setItem({ customer: { id: formik.values.id } });
		setOpenModalAdd(true);
	};

	const editAction = (row) => {
		const boat = row.original;
		setItem((prev) => ({
			...prev,
			id: boat.id,
			name: boat.name,
			registrationNumber: boat.registrationNumber,
			length: boat.length,
			beam: boat.beam,
			draught: boat.draught,
			markEngine: boat.markEngine,
			nauticalTouristic: boat.nauticalTouristic,
			insuranceExpirationDate: boat.insuranceExpirationDate,
			boatType: boat.boatType,
		}));
		setOpenModalAdd(true);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				style: {
					width: '30%',
				},
			},
			{
				Header: 'Número de registro',
				accessor: 'registrationNumber',
				style: {
					width: '30%',
				},
			},
			{
				Header: 'Estado',
				accessor: 'status',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => {
					if (value === 'AVAILABLE') {
						return <Badge color="secondary">Disponible</Badge>;
					} else if (value === 'RESERVED') {
						return <Badge color="success">Reservado</Badge>;
					} else {
						return <Badge color="danger">Cancelado</Badge>;
					}
				},
			},
			{
				Header: 'Fecha expiración seguro',
				accessor: 'insuranceExpirationDate',
				style: {
					width: '20%',
				},
				Cell: ({ value }) =>
					moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY'),
			},
			{
				id: 'acciones',
				Header: 'Acciones',
				Cell: ({ row }) => (
					<>
						<CellActions
							edit={{ allow: true, action: editAction }}
							del={{
								allow: true,
								action: handleShowDialogDelete,
							}}
							row={row}
						/>
					</>
				),
				style: {
					width: '10%',
				},
			},
		],
		[]
	);

	const handleShowDialogDelete = (row) => {
		setShowDeleteDialog(true);
		setSelectedIdDeleted(row.original.id);
	};

	const fetchBoatForClientApi = async () => {
		try {
			const response = await getBoatByClient(formik.values.id);
			setBoats(response.list);
			setLoadingBoats(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setBoats([]);
			setLoadingBoats(false);
		}
	};

	useEffect(() => {
		if (refetch && formik.values.id) {
			setLoadingBoats(true);
			fetchBoatForClientApi();
			setRefetch(false);
		} else if (!formik.values.id) {
			setLoadingBoats(false);
		}
	}, [refetch, formik.values.id]);

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteBoat(selectedIdDelete);
			setRefetch(true);
			setDeleting(false);
			setShowDeleteDialog(false);
			dispatch(
				addMessage({
					message: DELETE_SUCCESS,
					type: 'success',
				})
			);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setDeleting(false);
		}
	};

	return (
		<>
			<TabActionHeader
				add={{
					allow: formik.values.id ? true : false,
					handleAction: addNewBoatModal,
				}}
			/>
			<Row className="mt-2">
				<Col xs="12" md="12">
					{loadingBoats ? (
						<TableLoader
							columns={[
								{ name: 'Nombre', width: '30%' },
								{ name: 'Número de registro', width: '30%' },
								{ name: 'Estado', width: '10%' },
								{
									name: 'Fecha expiración seguro',
									width: '20%',
								},
								{
									name: 'Acciones',
									width: '10%',
								},
							]}
						/>
					) : (
						<SimpleTable columns={columns} data={boats} />
					)}
				</Col>
			</Row>

			{/*agregar modal boat for client*/}
			<DialogMain
				open={openModalAdd}
				setOpen={setOpenModalAdd}
				title={
					item?.id ? 'Actualizar embarcación' : 'Agregar embarcación'
				}
				size="xl"
				children={
					<FormBoatClient
						item={item}
						setOpenModalAdd={setOpenModalAdd}
						setRefetch={setRefetch}
					/>
				}
			/>

			<DeleteDialog
				handleDelete={handleDelete}
				show={showDeleteDialog}
				setShow={setShowDeleteDialog}
				isDeleting={isDeleting}
			/>
		</>
	);
}
