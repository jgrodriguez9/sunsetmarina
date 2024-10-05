import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_INTEGER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import {
	saveCompania,
	updateCompania,
} from '../../../helpers/catalogos/compania';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { SELECT_OPTION } from '../../../constants/messages';
import { Country, State, City } from 'country-state-city';
import { useState, useEffect } from 'react';
import ButtonsDisabled from '../../Common/ButtonsDisabled';

export default function FormCompania({ item, btnTextSubmit = 'Aceptar' }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const countryOpt = Country.getCountryByCode('MX');
	const [countryDefault, setCountryDefault] = useState(
		item ? { label: item?.country, value: item?.country } : null
	);
	const [statesOpt, setStatesOpt] = useState([]);
	const [statesDefault, setStatesDefault] = useState(
		item ? { label: item?.state, value: item?.state } : null
	);
	const [citiesOpt, setCitiesOpt] = useState([]);
	const [citiesDefault, setCitiesDefault] = useState(
		item ? { label: item?.city, value: item?.city } : null
	);
	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			name: item?.name ?? '',
			phone: item?.phone ?? '',
			state: item?.state ?? '',
			city: item?.city ?? '',
			country: item?.country ?? '',
			address: item?.address ?? '',
			website: item?.website ?? '',
			enabled: item?.enabled ?? true,
			braceletInventoryLeft: item?.braceletInventoryLeft ?? 0,
			boardingPassPrice: item?.boardingPassPrice ?? 5,
			interestPercentage: item?.interestPercentage ?? 10,
			boardingPassExchange: item?.boardingPassExchange ?? 0,
		},
		validationSchema: Yup.object({
			name: Yup.string().required(FIELD_REQUIRED),
			boardingPassPrice: Yup.number().required(FIELD_REQUIRED),
			braceletInventoryLeft: Yup.number(),
			interestPercentage: Yup.number()
				.integer(FIELD_INTEGER)
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED)
				.max(100, 'Campo no puede ser mayor a 100')
				.min(0, 'Campo no puede ser menor a 0'),
			boardingPassExchange: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED)
				.min(0, 'Campo no puede ser menor a 0'),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			if (values.id) {
				//update
				try {
					let response = await updateCompania(values.id, values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						navigate('/company');
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
					let response = await saveCompania(values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						navigate('/company');
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

	useEffect(() => {
		if (countryDefault) {
			setStatesOpt(State.getStatesOfCountry(countryDefault.value));
		} else {
			setStatesOpt([]);
			setCitiesOpt([]);
		}
	}, [countryDefault]);

	useEffect(() => {
		if (statesDefault) {
			setCitiesOpt(
				City.getCitiesOfState(countryDefault.value, statesDefault.value)
			);
		} else {
			setCitiesOpt([]);
		}
	}, [statesDefault]);

	return (
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
				<Col xs="12" md="4">
					<Label htmlFor="name" className="mb-0">
						Nombre
					</Label>
					<Input
						id="name"
						name="name"
						className={`form-control ${
							formik.errors.name ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.name}
					/>
					{formik.errors.name && (
						<div className="invalid-tooltip">
							{formik.errors.name}
						</div>
					)}
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="website" className="mb-0">
						Sitio web
					</Label>
					<Input
						id="website"
						name="website"
						className={`form-control ${
							formik.errors.website ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.website}
					/>
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="phone" className="mb-0">
						Teléfono
					</Label>
					<Input
						id="phone"
						name="phone"
						className={`form-control ${
							formik.errors.phone ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.phone}
					/>
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="braceletInventoryLeft" className="mb-0">
						Alerta inventario brazaletes
					</Label>
					<Input
						id="braceletInventoryLeft"
						name="braceletInventoryLeft"
						className={`form-control ${
							formik.errors.braceletInventoryLeft
								? 'is-invalid'
								: ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.braceletInventoryLeft}
					/>
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="boardingPassPrice" className="mb-0">
						Impuesto de muelle
					</Label>
					<Input
						id="boardingPassPrice"
						name="boardingPassPrice"
						className={`form-control ${
							formik.errors.boardingPassPrice ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.boardingPassPrice}
					/>
					{formik.errors.boardingPassPrice && (
						<div className="invalid-tooltip">
							{formik.errors.boardingPassPrice}
						</div>
					)}
				</Col>
				<Col xs="12" md="4">
					<Label className="mb-0 opacity-0 d-block">Habilitado</Label>
					<Input
						id="enabled"
						name="enabled"
						type="checkbox"
						className={`form-check-Input form-check-input`}
						onChange={formik.handleChange}
						checked={formik.values.enabled || false}
					/>
					<Label htmlFor={`enabled`} className="mb-0 ms-2">
						Habilitado
					</Label>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="4">
					<Label htmlFor="country" className="mb-0">
						País
					</Label>
					<Select
						value={countryDefault}
						onChange={(value) => {
							setCountryDefault(value);
							formik.setFieldValue('country', value?.label ?? '');
							setStatesDefault(null);
							setCitiesDefault(null);
						}}
						options={[
							{
								label: countryOpt.name,
								value: countryOpt.isoCode,
							},
						]}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="state" className="mb-0">
						Estado
					</Label>
					<Select
						value={statesDefault}
						onChange={(value) => {
							setStatesDefault(value);
							formik.setFieldValue('state', value?.label ?? '');
							setCitiesDefault(null);
						}}
						options={statesOpt.map((s) => ({
							label: s.name,
							value: s.isoCode,
						}))}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="city" className="mb-0">
						Ciudad
					</Label>
					<Select
						value={citiesDefault}
						onChange={(value) => {
							setCitiesDefault(value);
							formik.setFieldValue('city', value?.label ?? '');
						}}
						options={citiesOpt.map((c) => ({
							label: c.name,
							value: c.isoCode,
						}))}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="8">
					<Label htmlFor="address" className="mb-0">
						Dirección
					</Label>
					<Input
						id="address"
						name="address"
						className={`form-control ${
							formik.errors.address ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.address}
					/>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="boardingPassPrice" className="mb-0">
						Porcentaje de interés
					</Label>
					<Input
						id="interestPercentage"
						name="interestPercentage"
						className={`form-control ${
							formik.errors.interestPercentage ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.interestPercentage}
					/>
					{formik.errors.interestPercentage && (
						<div className="invalid-tooltip">
							{formik.errors.interestPercentage}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="boardingPassPrice" className="mb-0">
						Tipo cambio (Brazaletes)
					</Label>
					<Input
						id="boardingPassExchange"
						name="boardingPassExchange"
						className={`form-control ${
							formik.errors.boardingPassExchange
								? 'is-invalid'
								: ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.boardingPassExchange}
					/>
					{formik.errors.boardingPassExchange && (
						<div className="invalid-tooltip">
							{formik.errors.boardingPassExchange}
						</div>
					)}
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
					<Link to="/company" className="btn btn-danger">
						Cancelar
					</Link>
				</div>
			)}
		</Form>
	);
}
