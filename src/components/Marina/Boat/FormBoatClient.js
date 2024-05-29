import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { getBoadTypeAll } from '../../../helpers/catalogos/boadType';
import Select from 'react-select';
import SimpleDate from '../../DatePicker/SimpleDate';
import { saveBoat, updateBoat } from '../../../helpers/marina/boat';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import moment from 'moment';

export default function FormBoatClient({ item, setOpenModalAdd, setRefetch }) {
	const dispatch = useDispatch();
	const [fecha, setFecha] = useState(
		item?.insuranceExpirationDate
			? moment(item?.insuranceExpirationDate, 'YYYY-MM-DD').toDate()
			: null
	);
	const [boatTypeOpt, setBoatTypeOpt] = useState([]);
	const fetchBoatTypeAllApi = async () => {
		try {
			const response = await getBoadTypeAll();
			setBoatTypeOpt(
				response.map((boat) => ({
					label: boat.description,
					value: boat.id,
				}))
			);
		} catch (error) {
			setBoatTypeOpt([]);
		}
	};

	useEffect(() => {
		fetchBoatTypeAllApi();
	}, []);

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			name: item?.name ?? '',
			registrationNumber: item?.registrationNumber ?? '',
			length: item?.length ?? '',
			beam: item?.beam ?? '',
			draught: item?.draught ?? '',
			tonnage: item?.tonnage ?? '',
			markEngine: item?.markEngine ?? '',
			nauticalTouristic: item?.nauticalTouristic ?? false,
			insuranceCompany: item?.insuranceCompany ?? '',
			insuranceNumber: item?.insuranceNumber ?? '',
			insurancePhone: item?.insurancePhone ?? '',
			insuranceExpirationDate: item?.insuranceExpirationDate ?? '',
			mark: item?.mark ?? '',
			model: item?.model ?? '',
			flag: item?.flag ?? '',
			hullMaterial: item?.hullMaterial ?? '',
			customer: item?.customer ?? { id: '' },
			boatType: item?.boatType ?? { id: '' },
		},
		validationSchema: Yup.object({
			name: Yup.string().required(FIELD_REQUIRED),
			boatType: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			length: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			tonnage: Yup.number().typeError(FIELD_NUMERIC),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			if (values.id) {
				//update
				try {
					const date = values.insuranceExpirationDate
						? moment(values.insuranceExpirationDate).format(
								'YYYY-MM-DD'
						  )
						: null;
					values.insuranceExpirationDate = date;
					let response = await updateBoat(values.id, values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						setOpenModalAdd(false);
						setRefetch(true);
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
					const date = values.insuranceExpirationDate
						? moment(values.insuranceExpirationDate).format(
								'YYYY-MM-DD'
						  )
						: null;
					values.insuranceExpirationDate = date;
					let response = await saveBoat(values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						setOpenModalAdd(false);
						setRefetch(true);
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
		<div className="needs-validation">
			<Row>
				<Col xs="12" md="3">
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
				<Col xs="12" md="3">
					<Label htmlFor="registrationNumber" className="mb-0">
						Número registro
					</Label>
					<Input
						id="registrationNumber"
						name="registrationNumber"
						className={`form-control ${
							formik.errors.registrationNumber ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.registrationNumber}
					/>
					{formik.errors.registrationNumber && (
						<div className="invalid-tooltip">
							{formik.errors.registrationNumber}
						</div>
					)}
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="insuranceCompany" className="mb-0">
						Compañía de seguro
					</Label>
					<Input
						id="insuranceCompany"
						name="insuranceCompany"
						className={`form-control ${
							formik.errors.insuranceCompany ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.insuranceCompany}
					/>
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="insuranceNumber" className="mb-0">
						Número de poliza
					</Label>
					<Input
						id="insuranceNumber"
						name="insuranceNumber"
						className={`form-control ${
							formik.errors.insuranceNumber ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.insuranceNumber}
					/>
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="insurancePhone" className="mb-0">
						Teléfono compañía seguro
					</Label>
					<Input
						id="insurancePhone"
						name="insurancePhone"
						className={`form-control ${
							formik.errors.insurancePhone ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.insurancePhone}
					/>
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="insuranceExpirationDate" className="mb-0">
						Fecha expiración seguro
					</Label>
					<SimpleDate
						date={fecha}
						setDate={(value) => {
							setFecha(value[0]);
							if (value.length > 0) {
								formik.setFieldValue(
									`insuranceExpirationDate`,
									value[0]
								);
							} else {
								formik.setFieldValue(
									`insuranceExpirationDate`,
									''
								);
							}
						}}
						placeholder="dd-MM-YYYY"
					/>
					{formik.errors.insuranceExpirationDate && (
						<div className="invalid-tooltip d-block">
							{formik.errors.insuranceExpirationDate}
						</div>
					)}
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="boatType" className="mb-0">
						Tipo de barco
					</Label>
					<Select
						value={
							formik.values.boatType?.id
								? {
										label: formik.values.boatType
											.description,
										value: formik.values.boatType.id,
								  }
								: null
						}
						onChange={(value) => {
							formik.setFieldValue(
								'boatType.id',
								value?.value ?? ''
							);
							formik.setFieldValue(
								'boatType.description',
								value?.label ?? ''
							);
						}}
						options={boatTypeOpt}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
					{formik.errors.boatType && (
						<div className="invalid-tooltip d-block">
							{formik.errors.boatType?.id}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label className="mb-0 opacity-0 d-block">
						Es turistico
					</Label>
					<Input
						id="nauticalTouristic"
						name="nauticalTouristic"
						type="checkbox"
						className={`form-check-Input form-check-input`}
						onChange={formik.handleChange}
						checked={formik.values.nauticalTouristic || false}
					/>
					<Label htmlFor={`nauticalTouristic`} className="mb-0 ms-2">
						Es turístico
					</Label>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="mark" className="mb-0">
						Marca
					</Label>
					<Input
						id="mark"
						name="mark"
						className={`form-control ${
							formik.errors.mark ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.mark}
					/>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="model" className="mb-0">
						Modelo
					</Label>
					<Input
						id="model"
						name="model"
						className={`form-control ${
							formik.errors.model ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.model}
					/>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="markEngine" className="mb-0">
						Marca del motor
					</Label>
					<Input
						id="markEngine"
						name="markEngine"
						className={`form-control ${
							formik.errors.markEngine ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.markEngine}
					/>
					{formik.errors.markEngine && (
						<div className="invalid-tooltip">
							{formik.errors.markEngine}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="flag" className="mb-0">
						Bandera
					</Label>
					<Input
						id="flag"
						name="flag"
						className={`form-control ${
							formik.errors.flag ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.flag}
					/>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="hullMaterial" className="mb-0">
						Material casco
					</Label>
					<Input
						id="hullMaterial"
						name="hullMaterial"
						className={`form-control ${
							formik.errors.hullMaterial ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.hullMaterial}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="2">
					<Label htmlFor="length" className="mb-0">
						Longitud
					</Label>
					<Input
						id="length"
						name="length"
						className={`form-control ${
							formik.errors.length ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.length}
					/>
					{formik.errors.length && (
						<div className="invalid-tooltip">
							{formik.errors.length}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="beam" className="mb-0">
						Manga
					</Label>
					<Input
						id="beam"
						name="beam"
						className={`form-control ${
							formik.errors.beam ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.beam}
					/>
					{formik.errors.beam && (
						<div className="invalid-tooltip">
							{formik.errors.beam}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="draught" className="mb-0">
						Calado
					</Label>
					<Input
						id="draught"
						name="draught"
						className={`form-control ${
							formik.errors.draught ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.draught}
					/>
					{formik.errors.draught && (
						<div className="invalid-tooltip">
							{formik.errors.draught}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="tonnage" className="mb-0">
						Tonelaje
					</Label>
					<Input
						id="tonnage"
						name="tonnage"
						className={`form-control ${
							formik.errors.tonnage ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.tonnage}
					/>
					{formik.errors.tonnage && (
						<div className="invalid-tooltip">
							{formik.errors.tonnage}
						</div>
					)}
				</Col>
			</Row>
			<hr />
			{formik.isSubmitting ? (
				<ButtonsDisabled
					buttons={[
						{
							text: 'Aceptar',
							color: 'primary',
							className: '',
							loader: true,
						},
					]}
				/>
			) : (
				<Button
					color="primary"
					type="button"
					className="me-2"
					onClick={() => formik.handleSubmit()}
				>
					{formik.values.id ? 'Actualizar' : 'Aceptar'}
				</Button>
			)}
		</div>
	);
}
