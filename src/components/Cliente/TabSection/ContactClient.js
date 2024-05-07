import { Col, Row } from 'reactstrap';
import TabActionHeader from '../Common/TabActionHeader';
import DialogMain from '../../Common/DialogMain';
import { useEffect, useMemo, useState } from 'react';
import SimpleTable from '../../Tables/SimpleTable';
import { DELETE_SUCCESS, ERROR_SERVER } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { addMessage } from '../../../redux/messageSlice';
import { useDispatch } from 'react-redux';
import TableLoader from '../../Loader/TablaLoader';
import CellActions from '../../Tables/CellActions';
import DeleteDialog from '../../Common/DeleteDialog';
import {
	deleteContact,
	getContactByClient,
} from '../../../helpers/marina/contact';
import FormContactClient from '../../Marina/Contact/FormContactClient';

export default function ContactClient({ formik }) {
	const dispatch = useDispatch();
	const [loadingItems, setLoadingItems] = useState(true);
	const [openModalAdd, setOpenModalAdd] = useState(false);
	const [items, setItems] = useState([]);
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
			description: boat.description,
			phone: boat.phone,
			email: boat.email,
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
				Header: 'Correo electrónico',
				accessor: 'email',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Teléfono',
				accessor: 'phone',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Parentesco',
				accessor: 'description',
				style: {
					width: '20%',
				},
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

	const fetchItemsForClientApi = async () => {
		try {
			const response = await getContactByClient(formik.values.id);
			setItems(response.list);
			setLoadingItems(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					type: 'error',
					message: message,
				})
			);
			setItems([]);
			setLoadingItems(false);
		}
	};

	useEffect(() => {
		if (refetch && formik.values.id) {
			setLoadingItems(true);
			fetchItemsForClientApi();
			setRefetch(false);
		} else if (!formik.values.id) {
			setLoadingItems(false);
		}
	}, [refetch, formik.values.id]);

	const handleDelete = async () => {
		setDeleting(true);
		try {
			await deleteContact(selectedIdDelete);
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
					{loadingItems ? (
						<TableLoader
							columns={[
								{ name: 'Nombre', width: '30%' },
								{ name: 'Correo electrónico', width: '20%' },
								{ name: 'Teléfono', width: '20%' },
								{ name: 'Parentesco', width: '20%' },
								{ name: 'Acciones', width: '10%' },
							]}
						/>
					) : (
						<SimpleTable columns={columns} data={items} />
					)}
				</Col>
			</Row>

			{/*agregar modal boat for client*/}
			<DialogMain
				open={openModalAdd}
				setOpen={setOpenModalAdd}
				title={item?.id ? 'Actualizar contacto' : 'Agregar contacto'}
				size="xl"
				children={
					<FormContactClient
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
