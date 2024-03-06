import { useEffect } from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../../components/Common/Breadcrumbs';
import CardMain from '../../../components/Common/CardMain';
import TableLoader from '../../../components/Loader/TablaLoader';
import SimpleTable from '../../../components/Tables/SimpleTable';
import { ERROR_SERVER } from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { getUserList } from '../../../helpers/seguridad/users';
import CellFormatEnable from '../../../components/Tables/CellFormatEnable';
import TooltipDescription from '../../../components/Common/TooltipDescription';
import DialogMain from '../../../components/Common/DialogMain';
import FormCashRegisterAssign from '../../../components/Seguridad/User/FormCashRegisterAssign';

function Users() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [item, setItem] = useState({});

	const fetchList = async () => {
		try {
			const response = await getUserList();
			setItems(response.list);
			setLoading(false);
		} catch (error) {
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setItems([]);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchList();
	}, []);

	const onHandleShowDialog = (row) => {
		setItem({
			id: row.original.id,
			cashRegister: row.original.cashRegister,
		});
		setOpenDialog(true);
	};

	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				style: {
					width: '40%',
				},
			},
			{
				Header: 'Usuario',
				accessor: 'username',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Caja asignada',
				accessor: 'cashRegister.description',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => (value ? value : 'No tiene'),
			},
			{
				Header: 'Activo',
				accessor: 'enabled',
				style: {
					width: '10%',
				},
				Cell: ({ row, value }) => (
					<CellFormatEnable value={value} okText="SI" failText="NO" />
				),
			},
			{
				Header: 'Acción',
				id: 'acciones',
				Cell: ({ row }) => (
					<>
						<span
							onClick={() => onHandleShowDialog(row)}
							className="pe-2"
							id={`btn-span-asignarcaja-${row.original.id}`}
						>
							<i
								className={`fas fa-cash-register ${
									row.original.cashRegister === null
										? 'text-danger'
										: 'text-success'
								}`}
							/>
							<TooltipDescription
								text={`${
									row.original.cashRegister === null
										? 'Asignar caja'
										: 'Cambiar de caja'
								}`}
								id={`btn-span-asignarcaja-${row.original.id}`}
							/>
						</span>
					</>
				),
				style: {
					width: '10%',
				},
			},
		],
		[]
	);

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Nombre', width: '40%' },
						{ name: 'Usuario', width: '20%' },
						{ name: 'Caja asignada', width: '20%' },
						{ name: 'Activo', width: '10%' },
						{ name: 'Acción', width: '10%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<SimpleTable columns={columns} data={items} />
			</Col>
		</Row>
	);

	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Usuarios'}
						breadcrumbItem={'Usuarios'}
					/>
					<Row className="pb-5">
						<Col lg="12">
							<CardMain
								title="Listado"
								children={cardHandleList}
							/>
						</Col>
					</Row>
				</Container>
			</div>
			<DialogMain
				open={openDialog}
				setOpen={setOpenDialog}
				title={'Asignar caja'}
				size="md"
				children={
					<FormCashRegisterAssign
						item={item}
						setOpenModalAdd={setOpenDialog}
						refetch={fetchList}
					/>
				}
			/>
		</>
	);
}

export default Users;
