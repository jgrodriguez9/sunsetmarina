import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Badge, Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_INTEGER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import {
	getBoardingPassPrice,
	saveBoardingPass,
} from '../../../helpers/caja/boardingPass';
import { useState } from 'react';
import { useEffect } from 'react';
import { getClientList } from '../../../helpers/marina/client';
import { getSlipList } from '../../../helpers/marina/slip';
import { getBoatList } from '../../../helpers/marina/boat';
import Select from 'react-select';
import SimpleTable from '../../Tables/SimpleTable';
import { useMemo } from 'react';
import Paginate from '../../Tables/Paginate';
import { getReservationListPaginado } from '../../../helpers/marina/slipReservation';
import DialogMain from '../../Common/DialogMain';
import { numberFormat } from '../../../utils/numberFormat';
import { useRef } from 'react';
import SimpleLoad from '../../Loader/SimpleLoad';
import SelectAsync from '../../Common/SelectAsync';
import { getBracaletListPaginado } from '../../../helpers/contabilidad/bracalet';

export default function FormBoardingPass({ cajero = false }) {
	const history = useHistory();
	const dispatch = useDispatch();
	let timer = useRef();

	//info para los filtros de la reserva
	const [client, setClient] = useState(null);
	const [clientOpt, setClientOpt] = useState([]);
	const [boat, setBoat] = useState(null);
	const [boatOpt, setBoatOpt] = useState([]);
	const [slip, setSlip] = useState(null);
	const [slipOpt, setSlipOpt] = useState([]);
	//reservaciones paginado
	const [reservationSelected, setReservationSelected] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
		status: 'CONFIRMED',
		customerId: null,
		boatId: null,
		slipId: null,
	});
	const [itemsReservaciones, setItemsReservaciones] = useState([]);

	//prices
	const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
	//brazaletes
	const [brazaletes, setBrazaletes] = useState(null);

	//request para filtros
	useEffect(() => {
		//clients
		const fetchClientsApi = async () => {
			try {
				const response = await getClientList();
				setClientOpt(
					response.map((c) => ({
						label: `${c.name} ${c.lastName}`,
						name: c.name,
						lastName: c.lastName,
						value: c.id,
					}))
				);
			} catch (error) {}
		};
		fetchClientsApi();

		//boats
		const fetchBoatApi = async () => {
			try {
				const response = await getBoatList();
				setBoatOpt(
					response.map((boat) => ({
						label: boat.name,
						value: boat.id,
					}))
				);
			} catch (error) {
				setBoatOpt([]);
			}
		};
		fetchBoatApi();

		//slips
		const fetchSlipsApi = async () => {
			try {
				const response = await getSlipList();
				setSlipOpt(
					response
						.filter((it) => it.status === 'RESERVED')
						.map((slip) => ({ label: slip.code, value: slip.id }))
				);
			} catch (error) {
				setSlipOpt([]);
			}
		};
		fetchSlipsApi();
	}, []);

	const formik = useFormik({
		initialValues: {
			amount: 0,
			pax: 0,
			reservation: {
				id: '',
			},
			bracelets: [],
		},
		validationSchema: Yup.object({
			amount: Yup.number().required(FIELD_REQUIRED),
			pax: Yup.number()
				.integer(FIELD_INTEGER)
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			reservation: Yup.object().shape({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			bracelets: Yup.array()
				.of(
					Yup.object().shape({
						id: Yup.number().required(FIELD_REQUIRED),
					})
				)
				.min(1, 'Al menos debe escoger 1 brazalete'),
		}),
		onSubmit: async (values) => {
			//console.log(values);
			try {
				let response = await saveBoardingPass(values);
				if (response) {
					dispatch(
						addMessage({
							type: 'success',
							message: SAVE_SUCCESS,
						})
					);
					if (cajero) {
						formik.resetForm({
							amount: 0,
							pax: 0,
							reservation: {
								id: '',
							},
							bracelets: [],
						});
						setBoat(null);
						setClient(null);
						setSlip(null);
					} else {
						history.push('/boardingpass');
					}
				} else {
					dispatch(
						addMessage({
							type: 'error',
							message: ERROR_SERVER,
						})
					);
				}
			} catch (error) {
				//console.log('entro aqui');
				let message = ERROR_SERVER;
				message = extractMeaningfulMessage(error, message);
				dispatch(
					addMessage({
						type: 'error',
						message: message,
					})
				);
			}
		},
	});

	const buscar = async () => {
		setLoading(true);
		let q = Object.keys(query)
			.filter((key) => query[key] !== null)
			.map((key) => `${key}=${query[key]}`)
			.join('&');
		try {
			const response = await getReservationListPaginado(`?${q}`);
			setItemsReservaciones(response.list);
			setTotalPaginas(response.pagination.totalPages);
			setTotalRegistros(response.pagination.totalCount);
			setLoading(false);
			setOpenModal(true);
		} catch (error) {
			setItemsReservaciones([]);
			setTotalPaginas(0);
			setTotalRegistros(10);
			setLoading(false);
		}
	};
	const columns = useMemo(
		() => [
			{
				id: 'acciones',
				Header: '',
				Cell: ({ row }) => (
					<>
						<Input
							name="reserva"
							type="radio"
							checked={
								formik.values.reservation.id == row.original.id
							}
							onChange={(e) => {
								formik.setFieldValue(
									'reservation.id',
									row.original.id
								);
								setReservationSelected(row.original);
							}}
						/>
					</>
				),
				style: {
					width: '5%',
				},
			},
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '20%',
				},
			},
			{
				Header: 'Slip',
				accessor: 'slip.code',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Cliente',
				accessor: 'customer.name',
				style: {
					width: '35%',
				},
				Cell: ({ row, value }) =>
					`${value} ${row.original.customer.lastName}`,
			},
			{
				Header: 'Embarcación',
				accessor: 'boat.name',
				style: {
					width: '25%',
				},
			},
		],
		[formik.values.reservation.id]
	);
	const handlePageClick = (page) => {
		setQuery((prev) => ({
			...prev,
			page: page,
		}));
	};

	const handleChangeLimit = (limit) => {
		setQuery((prev) => ({
			...prev,
			max: limit,
			page: 1,
		}));
	};

	//componente para listado de reservaciones
	const contentReservacionesList = (
		<>
			<Row>
				<Col xs="12" md="12">
					<SimpleTable columns={columns} data={itemsReservaciones} />
				</Col>
				{itemsReservaciones.length > 0 && (
					<Paginate
						page={query.page}
						totalPaginas={totalPaginas}
						totalRegistros={totalRegistros}
						handlePageClick={handlePageClick}
						limit={query.limite}
						handleChangeLimit={handleChangeLimit}
					/>
				)}
			</Row>
			<hr />
			<div className="d-flex">
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => {
						setOpenModal(false);
					}}
					disabled={!formik.values.reservation.id}
				>
					Aceptar
				</button>
				<button
					type="button"
					className="btn btn-light ms-2"
					onClick={() => {
						formik.setFieldValue('reservation.id', '');
						setReservationSelected(null);
						setOpenModal(false);
					}}
				>
					Cerrar
				</button>
			</div>
		</>
	);
	//console.log(formik.values);
	const calcularPrice = async (pax) => {
		setIsCalculatingPrice(true);
		try {
			const reservationId = formik.values.reservation.id;
			const q = `?pax=${pax}`;
			const response = await getBoardingPassPrice(reservationId, q);
			formik.setFieldValue('amount', response.price);
			setIsCalculatingPrice(false);
		} catch (error) {
			//console.log(error);
			setIsCalculatingPrice(false);
			formik.setFieldValue('amount', 0);
		}
	};

	//console.log(formik.isValid);

	return (
		<>
			<Form
				className="needs-validation"
				id="tooltipForm"
				onSubmit={(e) => {
					e.preventDefault();
					formik.handleSubmit();
					return false;
				}}
			>
				<Row>
					<Col xs="12" md="12">
						<Label className="mb-2">Buscar reserva</Label>

						<Row>
							<Col xs="12" md="3">
								<Select
									value={client}
									onChange={(value) => {
										setClient(value);
										setQuery((prev) => ({
											...prev,
											customerId: value?.value ?? null,
										}));
									}}
									options={clientOpt}
									classNamePrefix="select2-selection"
									placeholder={'Seleccionar cliente'}
									isClearable
								/>
							</Col>
							<Col xs="12" md="3">
								<Select
									value={boat}
									onChange={(value) => {
										setBoat(value);
										setQuery((prev) => ({
											...prev,
											boatId: value?.value ?? null,
										}));
									}}
									options={boatOpt}
									classNamePrefix="select2-selection"
									placeholder={'Seleccionar Embarcación'}
									isClearable
								/>
							</Col>
							<Col xs="12" md="3">
								<Select
									value={slip}
									onChange={(value) => {
										setSlip(value);
										setQuery((prev) => ({
											...prev,
											slipId: value?.value ?? null,
										}));
									}}
									options={slipOpt}
									classNamePrefix="select2-selection"
									placeholder={'Seleccionar Slip'}
									isClearable
								/>
							</Col>
							<Col xs="12" md={{ size: 2, offset: 1 }}>
								{loading ? (
									<Button
										disabled
										color="primary"
										type="button"
										block
									>
										<i className="bx bx-loader bx-spin font-size-16 align-middle" />{' '}
										Buscar
									</Button>
								) : (
									<Button
										color="primary"
										block
										type="button"
										disabled={!client && !boat && !slip}
										onClick={buscar}
									>
										Buscar
									</Button>
								)}
							</Col>
						</Row>
					</Col>
				</Row>
				{!openModal && formik.values.reservation.id && (
					<div className="bg-light py-3 px-2 my-3 border">
						<Row>
							<Col xs="12" md="12">
								<div className="fw-bold border-bottom py-2 mb-3 text-primary">
									<span className="me-4">
										{reservationSelected?.code}
									</span>
									<span className="me-4">
										{reservationSelected?.slip?.code}
									</span>
									<span className="me-4">
										{reservationSelected?.customer?.name ??
											''}{' '}
										{reservationSelected?.customer
											?.lastName ?? ''}
									</span>
									<span className="me-4">
										{reservationSelected?.boat?.name}
									</span>
								</div>
							</Col>
						</Row>
						<Row>
							<Col xs="12" md="3">
								<Label htmlFor="pax" className="mb-0">
									Pax
								</Label>
								<Input
									id="pax"
									name="pax"
									className={`form-control ${
										formik.errors.pax ? 'is-invalid' : ''
									}`}
									onChange={(e) => {
										formik.setFieldValue(
											'pax',
											parseInt(e.target.value) ?? 0
										);
										clearTimeout(timer.current);
										timer.current = setTimeout(() => {
											calcularPrice(e.target.value);
										}, 600);
									}}
									value={formik.values.pax}
								/>
								{formik.errors.pax && (
									<div className="invalid-tooltip">
										{formik.errors.pax}
									</div>
								)}
							</Col>
							<Col xs="12" md="3">
								<Label htmlFor="amount" className="mb-0">
									Total
								</Label>
								<div className="form-control bg-light text-success fw-bold">
									{numberFormat(formik.values?.amount ?? 0)}{' '}
								</div>
								{isCalculatingPrice && (
									<SimpleLoad
										text={'Cargando precio'}
										extraClass="text-secondary"
									/>
								)}
								{formik.errors.amount && (
									<div className="invalid-tooltip">
										{formik.errors.amount}
									</div>
								)}
							</Col>
						</Row>
						<Row>
							<Col>
								<Col xs="12" md="12">
									<Label htmlFor="amount" className="mb-0">
										Brazaletes
									</Label>
									<SelectAsync
										fnFilter={getBracaletListPaginado}
										query={'?page=1&max=10'}
										keyCompare={'code'}
										keyProperty={'code'}
										label={['color', 'code']}
										isClearable
										value={brazaletes}
										onChange={(value) => {
											console.log(value);
											setBrazaletes(value);
											formik.setFieldValue(
												'bracelets',
												value.map((it) => ({
													id: it.value,
												}))
											);
										}}
										isMulti={true}
									/>
									{formik.errors.bracelets && (
										<div className="invalid-tooltip d-block">
											{formik.errors.bracelets}
										</div>
									)}
								</Col>
							</Col>
						</Row>
					</div>
				)}

				<hr />
				{formik.isSubmitting ? (
					<ButtonsDisabled
						buttons={[
							{
								text: 'Guardar',
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
						{formik.isValid && formik.values.reservation.id ? (
							<Button
								color="primary"
								type="submit"
								className="me-2"
							>
								Guardar
							</Button>
						) : (
							<Button
								color="primary"
								type="button"
								className="me-2"
								disabled
							>
								Guardar
							</Button>
						)}

						<Link to="/boardingpass" className="btn btn-danger">
							Cancelar
						</Link>
					</div>
				)}
			</Form>
			<DialogMain
				open={openModal}
				setOpen={setOpenModal}
				title={'Seleccionar'}
				size="lg"
				children={contentReservacionesList}
			/>
		</>
	);
}
