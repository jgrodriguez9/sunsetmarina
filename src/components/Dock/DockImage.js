import { useEffect, useMemo, useState } from 'react';
import {
	Badge,
	Col,
	ListGroup,
	ListGroupItem,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from 'reactstrap';
import marinaMap from '../../assets/images/dock/maplast2.webp';
import DialogMain from '../Common/DialogMain';
import { ERROR_SERVER } from '../../constants/messages';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';
import { addMessage } from '../../redux/messageSlice';
import { useDispatch } from 'react-redux';
import { getSlipList } from '../../helpers/marina/slip';
import { getClassSlipStatus } from '../../utils/getClassSlipStatus';
import { slipStatus } from '../../constants/constants';
import { classBadge } from '../../utils/classBadge';
import moment from 'moment';
import { numberFormat } from '../../utils/numberFormat';
import classNames from 'classnames';
import { getBoatCrewByBoat } from '../../helpers/marina/boatCrew';
import SimpleTable from '../Tables/SimpleTable';
import TableLoader from '../Loader/TablaLoader';
import { getContactByClient } from '../../helpers/marina/contact';
import SimpleLoad from '../Loader/SimpleLoad';

export default function DockImage() {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [slips, setSlips] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [slipInfo, setSlipInfo] = useState(null);
	const [customActiveTab, setcustomActiveTab] = useState('1');
	const [loadingBoatCrew, setLoadingBoatCrew] = useState(true);
	const [boatId, setBoatId] = useState(null);
	const [tripulantes, setTripulantes] = useState([]);
	const [customerId, setCustometId] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [loadContact, setLoadContacts] = useState(false);
	const toggleCustom = (tab) => {
		if (customActiveTab !== tab) {
			setcustomActiveTab(tab);
		}
	};
	const columns = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				Cell: ({ row, value }) =>
					`${row.original.name} ${row.original.lastName}`,
				style: {
					width: '60%',
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
				Header: 'Identificación',
				accessor: 'identification',
				style: {
					width: '20%',
				},
			},
		],
		[]
	);
	const columnsContacts = useMemo(
		() => [
			{
				Header: 'Nombre',
				accessor: 'name',
				style: {
					width: '60%',
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
		],
		[]
	);
	useEffect(() => {
		if (boatId && customActiveTab === '2') {
			setLoadingBoatCrew(true);
			const fetchBoatCrewByBoatApi = async () => {
				try {
					const response = await getBoatCrewByBoat(boatId);
					setTripulantes(response.list);
					setLoadingBoatCrew(false);
				} catch (error) {
					setTripulantes([]);
					setLoadingBoatCrew(false);
				}
			};
			fetchBoatCrewByBoatApi();
		}
		if (customerId && customActiveTab === '3') {
			setLoadContacts(true);
			const fetchItemsForClientApi = async () => {
				try {
					const response = await getContactByClient(customerId);
					setContacts(response.list);
					setLoadContacts(false);
				} catch (error) {
					setContacts([]);
					setLoadContacts(false);
				}
			};
			fetchItemsForClientApi();
		}
	}, [boatId, customActiveTab, customerId]);
	const children = (
		<Row>
			<Col xs="12" md="12">
				<Nav tabs className="nav-tabs-custom">
					<NavItem>
						<NavLink
							style={{ cursor: 'pointer' }}
							className={classNames({
								active: customActiveTab === '1',
							})}
							onClick={() => {
								toggleCustom('1');
							}}
						>
							<span className="d-none d-sm-block">
								Información general
							</span>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							style={{ cursor: 'pointer' }}
							className={classNames({
								active: customActiveTab === '2',
							})}
							onClick={() => {
								toggleCustom('2');
							}}
						>
							<span className="d-none d-sm-block">
								Tripulación
							</span>
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink
							style={{ cursor: 'pointer' }}
							className={classNames({
								active: customActiveTab === '3',
							})}
							onClick={() => {
								toggleCustom('3');
							}}
						>
							<span className="d-none d-sm-block">Contactos</span>
						</NavLink>
					</NavItem>
				</Nav>
				<TabContent
					activeTab={customActiveTab}
					className="p-3 text-muted bg-light bg-soft"
				>
					<TabPane tabId="1">
						<Row>
							<Col xs="12" md="12">
								<ListGroup flush className="fs-5">
									<ListGroupItem className="d-flex justify-content-between">
										<h5 className="m-0">No. Slip</h5>
										<Badge color="secondary">
											{slipInfo?.slip}
										</Badge>
									</ListGroupItem>
									<ListGroupItem className="d-flex justify-content-between">
										<h5 className="m-0">Estado</h5>
										<Badge
											color={classBadge(slipInfo?.estado)}
										>
											{slipStatus(slipInfo?.estado)}
										</Badge>
									</ListGroupItem>
									{/* {slipInfo?.estado !== 'AVAILABLE' && (
						<ListGroupItem className="d-flex justify-content-between">
							<h5 className="m-0">
								{slipInfo?.estado === 'RESERVED'
									? 'Fecha de reserva'
									: 'Fecha de operación'}
							</h5>
							<span>
								{moment(
									slipInfo?.fechaOperacion,
									'YYYY-MM-DD'
								).format('DD-MM-YYYY')}
							</span>
						</ListGroupItem>
					)} */}
									{slipInfo?.arrivalDate && (
										<ListGroupItem className="d-flex justify-content-between">
											<h5 className="m-0">
												Fecha inicio
											</h5>
											<span>
												{moment(
													slipInfo?.arrivalDate,
													'YYYY-MM-DD'
												).format('DD-MM-YYYY')}
											</span>
										</ListGroupItem>
									)}
									{slipInfo?.departureDate && (
										<ListGroupItem className="d-flex justify-content-between">
											<h5 className="m-0">Fecha fin</h5>
											<span>
												{slipInfo?.departureDate}
											</span>
										</ListGroupItem>
									)}
									{slipInfo?.debt && (
										<ListGroupItem className="d-flex justify-content-between">
											<h5 className="m-0">Deuda</h5>
											<span
												className={`${
													slipInfo.debt > 0
														? 'text-danger'
														: 'text-black'
												}`}
											>
												{numberFormat(slipInfo?.debt)}
											</span>
										</ListGroupItem>
									)}
									{slipInfo?.propietario && (
										<ListGroupItem className="d-flex justify-content-between">
											<h5 className="m-0">Propietario</h5>
											<span>{slipInfo?.propietario}</span>
										</ListGroupItem>
									)}
									{slipInfo?.embarcacion && (
										<ListGroupItem className="d-flex justify-content-between">
											<h5 className="m-0">Embarcación</h5>
											<span>{slipInfo?.embarcacion}</span>
										</ListGroupItem>
									)}
									{slipInfo?.dimensiones && (
										<ListGroupItem className="d-flex justify-content-between">
											<h5 className="m-0">
												Pies de embarcación
											</h5>
											<span>{slipInfo?.dimensiones}</span>
										</ListGroupItem>
									)}
								</ListGroup>
							</Col>
						</Row>
					</TabPane>
					<TabPane tabId="2">
						{loadingBoatCrew ? (
							<TableLoader
								columns={[
									{ name: 'Nombre', width: '60%' },
									{ name: 'Teléfono', width: '20%' },
									{
										name: 'Identificación',
										width: '20%',
									},
								]}
							/>
						) : (
							<SimpleTable columns={columns} data={tripulantes} />
						)}
					</TabPane>
					<TabPane tabId="3">
						{loadContact ? (
							<TableLoader
								columns={[
									{ name: 'Nombre', width: '60%' },
									{ name: 'Teléfono', width: '20%' },
									{
										name: 'Parentesco',
										width: '20%',
									},
								]}
							/>
						) : (
							<SimpleTable
								columns={columnsContacts}
								data={contacts}
							/>
						)}
					</TabPane>
				</TabContent>
			</Col>
			<div className="d-flex mt-3 justify-content-center">
				<button
					type="button"
					className="btn btn-light btn-lg"
					onClick={() => setShowDialog(false)}
				>
					Cerrar
				</button>
			</div>
		</Row>
	);
	const showDialogInfo = (slip) => {
		setSlipInfo({
			slip: slip.code,
			propietario:
				slip.status !== 'AVAILABLE' && slip?.reservations.length > 0
					? `${slip?.reservations[0]?.customer?.name} ${slip?.reservations[0].customer?.lastName}`
					: null,
			arrivalDate:
				slip.status !== 'AVAILABLE' && slip?.reservations.length > 0
					? `${
							slip?.reservations[slip?.reservations.length - 1]
								?.arrivalDate
					  } ${
							slip?.reservations[slip?.reservations.length - 1]
								.arrivalDate
					  }`
					: null,
			departureDate:
				slip.status !== 'AVAILABLE' && slip?.reservations.length > 0
					? slip?.reservations[slip?.reservations.length - 1]
							?.departureDate
						? moment(
								slip?.reservations[
									slip?.reservations.length - 1
								]?.departureDate,
								'YYYY-MM-DD'
						  ).format('DD-MM-YYYY')
						: 'Vigente'
					: null,
			debt:
				slip.status !== 'AVAILABLE' && slip?.reservations.length > 0
					? `${
							slip?.reservations[slip?.reservations.length - 1]
								?.debt?.debt
					  }`
					: null,
			embarcacion:
				slip.status !== 'AVAILABLE'
					? slip?.reservations[slip?.reservations.length - 1].boat
							?.name ?? null
					: null,
			dimensiones:
				slip?.reservations.length > 0
					? slip?.reservations[slip?.reservations.length - 1].boat
							.length
					: null,
			estado: slip.status,
			fechaOperacion: slip.lastUpdated,
		});
		if (slip.status !== 'AVAILABLE' && slip?.reservations.length > 0) {
			setBoatId(
				slip?.reservations[slip?.reservations.length - 1].boat.id
			);
			setCustometId(
				slip?.reservations[slip?.reservations.length - 1].customer.id
			);
		}

		setShowDialog(true);
	};

	const fecthSlipsAllApi = async () => {
		try {
			const response = await getSlipList();
			setSlips(response);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			let message = ERROR_SERVER;
			message = extractMeaningfulMessage(error, message);
			dispatch(
				addMessage({
					message: message,
					type: 'error',
				})
			);
			setSlips([]);
		}
	};
	useEffect(() => {
		fecthSlipsAllApi();
	}, []);

	if (loading) {
		return <SimpleLoad text="Cargando mapa" />;
	}

	return (
		<>
			<Row>
				<Col>
					<div className="dock-container">
						<div className="position-relative">
							{slips.map((slip) => (
								<div
									key={slip.id}
									className={`slip slip-1 ${getClassSlipStatus(
										slip.status
									)}`}
									style={{
										left: `${slip.xPosition}px`,
										top: `${slip.yPosition}px`,
										width: `${slip.width}px`,
										height: `${slip.height}px`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
									title={slip.number}
									onClick={(e) => showDialogInfo(slip)}
								>
									<span
										style={{
											color: '#fff',
											background: '#a9752e',
											fontWeight: 600,
											fontSize: '70%',
											borderRadius: '50%',
											width: '20px',
											height: '20px',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										{slip.code}
									</span>
								</div>
							))}
							<img
								src={marinaMap}
								alt="imagen  del muelle"
								className="dock-map"
							/>
						</div>
					</div>
				</Col>
			</Row>
			<DialogMain
				open={showDialog}
				setOpen={setShowDialog}
				title="Datos del slip"
				children={children}
				size="lg"
			/>
		</>
	);
}
