import { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { getMuelleList } from '../../../helpers/catalogos/muelle';
import { useEffect } from 'react';
import Select from 'react-select';
import { saveSlip, updateSlip } from '../../../helpers/marina/slip';
import { getAmarreList } from '../../../helpers/catalogos/amarres';
import translateUtils from '../../../utils/translateUtils';
import { rampTypesOpt } from '../../../constants/rampTypes';

export default function FormSlip({
	item,
	btnTextSubmit = 'Aceptar',
	toggleModalReservation = null,
}) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [tipoSlipOpt, setTipoSlipOpt] = useState([]);
	const [tipoSlipDefault, setTipoSlipDefault] = useState(null);
	const [tipoRampaDefault, setTipoRampaDefault] = useState(null);
	const [muelleOpt, setMuelleOpt] = useState([]);
	const [muelleDefault, setMuelleDefault] = useState(null);
	useEffect(() => {
		if (item && tipoSlipOpt.length > 0) {
			setTipoSlipDefault({
				value: item.slipType?.id ?? null,
				label:
					tipoSlipOpt.find((c) => c.value === item.slipType?.id)
						?.label ?? null,
			});
		}
		if (item && muelleOpt.length > 0) {
			setMuelleDefault({
				value: item.pier.id,
				label: muelleOpt.find((c) => c.value === item.pier.id)?.label,
			});
		}
		if (item) {
			setTipoRampaDefault({
				value: item.rampType,
				label:
					rampTypesOpt.find((c) => c.value === item.rampType)
						?.label ?? null,
			});
		}
	}, [item, tipoSlipOpt, muelleOpt]);

	const fetchTipoSlipApiList = async () => {
		try {
			const response = await getAmarreList();
			setTipoSlipOpt(
				response.map((c) => ({ value: c.id, label: c.description }))
			);
		} catch (error) {
			setTipoSlipOpt([]);
		}
	};
	const fetchMuelleApiList = async () => {
		try {
			const response = await getMuelleList();
			setMuelleOpt(response.map((c) => ({ value: c.id, label: c.name })));
		} catch (error) {
			setMuelleOpt([]);
		}
	};

	useEffect(() => {
		fetchTipoSlipApiList();
		fetchMuelleApiList();
	}, []);

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			code: item?.code ?? '',
			pier: {
				id: item?.pier?.id ?? '',
			},
			slipType: {
				id: item?.slipType?.id ?? '',
			},
			price: item?.price ?? '',
			amperage: item?.amperage ?? '',
			voltage: item?.voltage ?? '',
			observations: item?.observations ?? '',
			xPosition: item?.xPosition ?? '',
			yPosition: item?.yPosition ?? '',
			height: item?.height ?? '',
			width: item?.width ?? '',
			status: item?.status ?? 'AVAILABLE',
			rampType: item?.rampType ?? '',
		},
		validationSchema: Yup.object({
			code: Yup.string().required(FIELD_REQUIRED),
			pier: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			slipType: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			price: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			xPosition: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			yPosition: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			height: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			width: Yup.number()
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			if (values.id) {
				//update
				try {
					let response = await updateSlip(values.id, values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						navigate('/slip');
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
					let response = await saveSlip(values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						navigate('/slip');
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
				<Col xs="12" md="2">
					<Label htmlFor="code" className="mb-0">
						Número
					</Label>
					<Input
						id="code"
						name="code"
						className={`form-control ${
							formik.errors.code ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.code}
					/>
					{formik.errors.code && (
						<div className="invalid-tooltip">
							{formik.errors.code}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="slipType" className="mb-0">
						Tipo de slip
					</Label>
					<Select
						value={tipoSlipDefault}
						onChange={(value) => {
							setTipoSlipDefault(value);
							formik.setFieldValue(
								'slipType.id',
								value?.value ?? ''
							);
						}}
						options={tipoSlipOpt}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
					{formik.errors.slipType && (
						<div className="invalid-tooltip d-block">
							{formik.errors.slipType?.id}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="pier" className="mb-0">
						Muelle
					</Label>
					<Select
						value={muelleDefault}
						onChange={(value) => {
							setMuelleDefault(value);
							formik.setFieldValue('pier.id', value?.value ?? '');
						}}
						options={muelleOpt}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
					{formik.errors.pier && (
						<div className="invalid-tooltip d-block">
							{formik.errors.pier?.id}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="status" className="mb-0">
						Estado
					</Label>
					<div className="form-control bg-light">
						{translateUtils(formik.values?.status ?? 'AVAILABLE')}
					</div>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="slipType" className="mb-0">
						Tipo de rampa
					</Label>
					<Select
						value={tipoRampaDefault}
						onChange={(value) => {
							setTipoRampaDefault(value);
							formik.setFieldValue(
								'rampType',
								value?.value ?? ''
							);
						}}
						options={rampTypesOpt}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
					{formik.errors.slipType && (
						<div className="invalid-tooltip d-block">
							{formik.errors.slipType?.id}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="price" className="mb-0">
						Precio
					</Label>
					<Input
						id="price"
						name="price"
						className={`form-control ${
							formik.errors.price ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.price}
					/>
					{formik.errors.price && (
						<div className="invalid-tooltip">
							{formik.errors.price}
						</div>
					)}
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="2">
					<Label htmlFor="amperage" className="mb-0">
						Amperage
					</Label>
					<Input
						id="amperage"
						name="amperage"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.amperage}
					/>
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="voltage" className="mb-0">
						Voltage
					</Label>
					<Input
						id="voltage"
						name="voltage"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.voltage}
					/>
				</Col>

				<Col xs="12" md="2">
					<Label htmlFor="xPosition" className="mb-0">
						Posición X
					</Label>
					<Input
						id="xPosition"
						name="xPosition"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.xPosition}
						disabled
					/>
					{formik.errors.xPosition && (
						<div className="invalid-tooltip d-block">
							{formik.errors.xPosition}
						</div>
					)}
				</Col>
				<Col xs="12" md="2">
					<Label htmlFor="yPosition" className="mb-0">
						Posición Y
					</Label>
					<Input
						id="yPosition"
						name="yPosition"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.yPosition}
						disabled
					/>
					{formik.errors.yPosition && (
						<div className="invalid-tooltip d-block">
							{formik.errors.yPosition}
						</div>
					)}
				</Col>
				<Col xs="12" md="1">
					<Label htmlFor="yPosition" className="mb-0">
						Altura
					</Label>
					<Input
						id="height"
						name="height"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.height}
						disabled
					/>
					{formik.errors.height && (
						<div className="invalid-tooltip d-block">
							{formik.errors.height}
						</div>
					)}
				</Col>
				<Col xs="12" md="1">
					<Label htmlFor="yPosition" className="mb-0">
						Ancho
					</Label>
					<Input
						id="width"
						name="width"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.width}
						disabled
					/>
					{formik.errors.width && (
						<div className="invalid-tooltip d-block">
							{formik.errors.width}
						</div>
					)}
				</Col>
			</Row>
			<Row>
				<Col xs="12" md="5">
					<Label htmlFor="observations" className="mb-0">
						Observaciones
					</Label>
					<textarea
						id="observations"
						name="observations"
						className={`form-control`}
						onChange={formik.handleChange}
						value={formik.values.observations}
						rows={5}
					/>
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
					<Link to="/slip" className="btn btn-danger me-auto">
						Cancelar
					</Link>
					{toggleModalReservation && (
						<Button
							color="link"
							type="button"
							onClick={toggleModalReservation}
						>
							Historial de reservas
						</Button>
					)}
				</div>
			)}
		</Form>
	);
}
