import { useFormik } from 'formik';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Form,
	Button,
	NavItem,
	NavLink,
	TabContent,
	TabPane,
	Row,
	Col,
	Nav,
} from 'reactstrap';
import * as Yup from 'yup';
import {
	CORREO_VALID,
	ERROR_SERVER,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	UPDATE_SUCCESS,
} from '../../constants/messages';
import ButtonsDisabled from '../Common/ButtonsDisabled';
import { ResumenCliente } from './ResumenCliente';
import classnames from 'classnames';
import DirectionClient from './TabSection/DirectionClient';
import PrincipalInfoClient from './TabSection/PrincipalInfoClient';
import ObservationClient from './TabSection/ObservationClient';
import moment from 'moment/moment';
import { saveClient, updateClient } from '../../helpers/marina/client';
import { addMessage } from '../../redux/messageSlice';
import { useDispatch } from 'react-redux';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';
import BoatClient from './TabSection/BoatClient';
import NoteClient from './TabSection/NoteClient';
import ContactClient from './TabSection/ContactClient';
import getObjectValid from '../../utils/getObjectValid';
import DocumentClient from './TabSection/DocumentClient';
import SlipReservationClient from './TabSection/SlipReservationClient';
import PaymentClient from './TabSection/PaymentClient';
import TicketClientPayment from '../Tickets/TicketClientPayment';

export default function FormCliente({ item, btnTextSubmit = 'Aceptar' }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [customActiveTab, setcustomActiveTab] = useState('1');
	const [file, setFile] = useState(null);

	const toggleCustom = (tab) => {
		if (customActiveTab !== tab) {
			setcustomActiveTab(tab);
		}
	};

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			code: item?.code ?? '',
			name: item?.name ?? '',
			lastName: item?.lastName ?? '',
			identification: item?.identification ?? '',
			country: item?.country ?? '',
			state: item?.state ?? '',
			city: item?.city ?? '',
			address: item?.address ?? '',
			email: item?.email ?? '',
			phone: item?.phone ?? '',
			rfc: item?.rfc ?? '',
			birthDate: item?.birthDate ?? '',
			customerCategory: item?.customerCategory
				? { id: item.customerCategory?.id }
				: null,
			language: item?.language ?? '',
			fax: item?.fax ?? '',
			profilePicture: item?.profilePicture ?? '',
			observations: item?.observations ?? '',
			needInvoice: item?.needInvoice ?? false,
		},
		validationSchema: Yup.object({
			name: Yup.string().required(FIELD_REQUIRED),
			lastName: Yup.string().required(FIELD_REQUIRED),
			identification: Yup.string().required(FIELD_REQUIRED),
			email: Yup.string().email(CORREO_VALID),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			delete values.code;
			let formData = new FormData();
			if (file) {
				formData['file'] = file;
			}
			Object.entries(getObjectValid(values)).forEach((entry) => {
				const [key, value] = entry;
				if (key === 'birthDate') {
					formData[key] = moment(values.birthDate).format(
						'YYYY-MM-DD'
					);
				} else {
					formData[key] = value;
				}
			});
			if (values.id) {
				//update
				try {
					let response = await updateClient(values.id, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						navigate('/client');
					} else {
						dispatch(
							addMessage({
								type: 'error',
								message: ERROR_SERVER,
							})
						);
					}
				} catch (error) {
					let message = ERROR_SERVER;
					message = extractMeaningfulMessage(error, message);
					dispatch(
						addMessage({
							type: 'error',
							message: message,
						})
					);
				}
			} else {
				//save
				try {
					let response = await saveClient(formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						navigate('/client');
					} else {
						dispatch(
							addMessage({
								type: 'error',
								message: ERROR_SERVER,
							})
						);
					}
				} catch (error) {
					let message = ERROR_SERVER;
					message = extractMeaningfulMessage(error, message);
					dispatch(
						addMessage({
							type: 'error',
							message: message,
						})
					);
				}
			}
		},
	});

	return (
		<>
			<ResumenCliente item={item} />
			<hr />
			<Form
				className="needs-validation"
				id="tooltipForm"
				onSubmit={(e) => {
					e.preventDefault();
					formik.handleSubmit();
					return false;
				}}
			>
				<PrincipalInfoClient
					formik={formik}
					item={item}
					setFile={setFile}
				/>

				<Row className="mt-2">
					<Col xs="12" md="12">
						<Nav tabs className="nav-tabs-custom">
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '1',
									})}
									onClick={() => {
										toggleCustom('1');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-home"></i>
									</span>
									<span className="d-none d-sm-block">
										Dirección de residencia
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '3',
									})}
									onClick={() => {
										toggleCustom('3');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-credit-card"></i>
									</span>
									<span className="d-none d-sm-block">
										Pagos
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '4',
									})}
									onClick={() => {
										toggleCustom('4');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-anchor"></i>
									</span>
									<span className="d-none d-sm-block">
										Slips
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '5',
									})}
									onClick={() => {
										toggleCustom('5');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-ship"></i>
									</span>
									<span className="d-none d-sm-block">
										Barcos
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '6',
									})}
									onClick={() => {
										toggleCustom('6');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-file-alt"></i>
									</span>
									<span className="d-none d-sm-block">
										Documentos
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '7',
									})}
									onClick={() => {
										toggleCustom('7');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-file-alt"></i>
									</span>
									<span className="d-none d-sm-block">
										Notas
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '8',
									})}
									onClick={() => {
										toggleCustom('8');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-address-book"></i>
									</span>
									<span className="d-none d-sm-block">
										Contactos
									</span>
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									style={{ cursor: 'pointer' }}
									className={classnames({
										active: customActiveTab === '10',
									})}
									onClick={() => {
										toggleCustom('10');
									}}
								>
									<span className="d-block d-sm-none">
										<i className="fas fa-sticky-note"></i>
									</span>
									<span className="d-none d-sm-block">
										Observación
									</span>
								</NavLink>
							</NavItem>
						</Nav>
						<TabContent
							activeTab={customActiveTab}
							className="p-3 text-muted bg-light bg-soft"
						>
							<TabPane tabId="1">
								<DirectionClient formik={formik} item={item} />
							</TabPane>
							<TabPane tabId="3">
								{customActiveTab === '3' && (
									<PaymentClient formik={formik} />
								)}
							</TabPane>
							<TabPane tabId="4">
								{customActiveTab === '4' && (
									<SlipReservationClient formik={formik} />
								)}
							</TabPane>
							<TabPane tabId="5">
								{customActiveTab === '5' && (
									<BoatClient formik={formik} />
								)}
							</TabPane>
							<TabPane tabId="6">
								{customActiveTab === '6' && (
									<DocumentClient formik={formik} />
								)}
							</TabPane>
							<TabPane tabId="7">
								{customActiveTab === '7' && (
									<NoteClient formik={formik} />
								)}
							</TabPane>
							<TabPane tabId="8">
								{customActiveTab === '8' && (
									<ContactClient formik={formik} />
								)}
							</TabPane>
							<TabPane tabId="10">
								{customActiveTab === '10' && (
									<ObservationClient
										formik={formik}
										item={item}
									/>
								)}
							</TabPane>
						</TabContent>
					</Col>
				</Row>
				<hr />
				{formik.isSubmitting ? (
					<ButtonsDisabled
						buttons={[
							{
								text: btnTextSubmit,
								color: 'primary',
								className: '',
								loader: true,
							},
							{
								text: 'Cancelar',
								color: 'link',
								className: 'text-danger',
								loader: false,
							},
						]}
					/>
				) : (
					<div className="d-flex">
						<Button color="primary" type="submit" className="me-2">
							{btnTextSubmit}
						</Button>
						<Link to="/client" className="btn btn-danger">
							Cancelar
						</Link>
					</div>
				)}
			</Form>
		</>
	);
}
