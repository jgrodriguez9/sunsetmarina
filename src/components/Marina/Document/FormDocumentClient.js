import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import SimpleDate from '../../DatePicker/SimpleDate';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import moment from 'moment';
import getObjectValid from '../../../utils/getObjectValid';
import { saveDocument, updateDocument } from '../../../helpers/marina/document';
import { getDocumentTypeList } from '../../../helpers/catalogos/documentType';
import Select from 'react-select';
import { getBoatByClient } from '../../../helpers/marina/boat';

export default function FormDocumentClient({
	clientId,
	item,
	setOpenModalAdd,
	setRefetch,
}) {
	const dispatch = useDispatch();
	const [boatOpt, setBoatOpt] = useState([]);
	const [fileSelected, setFileSelected] = useState(null);
	const [fecha, setFecha] = useState(
		item?.reminderDate
			? moment(item?.reminderDate, 'YYYY-MM-DD').toDate()
			: null
	);

	const [documentTypeOpt, setDocumentTypeOpt] = useState([]);
	const fetchDoumentTypeAllApi = async () => {
		try {
			const response = await getDocumentTypeList();
			setDocumentTypeOpt(
				response
					.filter((e) => e.enabled)
					.map((boat) => ({
						label: boat.description,
						value: boat.id,
					}))
			);
		} catch (error) {
			setDocumentTypeOpt([]);
		}
	};
	const fetchBoatsByClientApi = async () => {
		try {
			const response = await getBoatByClient(clientId);
			setBoatOpt(
				response.list.map((boat) => ({
					label: boat.name,
					value: boat.id,
				}))
			);
		} catch (error) {
			setBoatOpt([]);
		}
	};

	useEffect(() => {
		fetchDoumentTypeAllApi();
		fetchBoatsByClientApi();
	}, []);

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			comments: item?.comments ?? '',
			reminderDate: item?.reminderDate ?? '',
			customer: item?.customer?.id ?? '',
			documentType: item?.documentType?.id ?? '',
			fileToUpload: '',
			boat: item?.boat ?? {
				id: '',
			},
		},
		validationSchema: Yup.object({
			fileToUpload: Yup.string().when([], {
				is: () => !fileSelected,
				then: Yup.string().required(FIELD_REQUIRED),
				otherwise: Yup.string().notRequired(),
			}),
			documentType: Yup.number().required(FIELD_REQUIRED),
			boat: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			let formData = new FormData();
			if (fileSelected) {
				formData['file'] = fileSelected;
			}
			Object.entries(getObjectValid(values)).forEach((entry) => {
				const [key, value] = entry;
				if (key === 'reminderDate') {
					formData[key] = moment(values.reminderDate).format(
						'YYYY-MM-DD'
					);
				} else if (key === 'boat') {
					formData['boatId'] = values.boat.id;
				} else {
					formData[key] = value;
				}
			});
			if (values.id) {
				//update
				try {
					let response = await updateDocument(values.id, formData, {
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
					let response = await saveDocument(formData, {
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
				<Col xs="12" md="5">
					<Row>
						<Col xs="12" md="12">
							<div className="mb-3">
								<Label htmlFor="boatType" className="mb-0">
									Tipo de documento
								</Label>
								<Select
									value={
										formik.values.documentType
											? {
													value: formik.values
														.documentType,
													label:
														documentTypeOpt.find(
															(it) =>
																it.value ===
																formik.values
																	.documentType
														).label ?? '',
											  }
											: null
									}
									onChange={(value) => {
										formik.setFieldValue(
											'documentType',
											value?.value ?? ''
										);
									}}
									options={documentTypeOpt}
									classNamePrefix="select2-selection"
									placeholder={SELECT_OPTION}
								/>
								{formik.errors.documentType && (
									<div className="invalid-tooltip d-block">
										{formik.errors.documentType}
									</div>
								)}
							</div>
						</Col>
						<Col xs="12" md="12">
							<div className="mb-3">
								<Label htmlFor="file" className="mb-0">
									Archivo
								</Label>
								<Input
									className="form-control"
									type="file"
									id="file"
									onChange={(e) => {
										setFileSelected(e.target.files[0]);
									}}
								/>
								{formik.errors.fileToUpload && (
									<div className="invalid-tooltip d-block">
										{formik.errors.fileToUpload}
									</div>
								)}
							</div>
						</Col>
						<Col xs="12" md="12">
							<Label htmlFor="reminderDate" className="mb-0">
								Fecha recordatorio (opcional)
							</Label>
							<SimpleDate
								date={fecha}
								setDate={(value) => {
									setFecha(value[0]);
									if (value.length > 0) {
										formik.setFieldValue(
											`reminderDate`,
											value[0]
										);
									} else {
										formik.setFieldValue(
											`reminderDate`,
											null
										);
									}
								}}
								placeholder="dd-MM-YYYY"
								options={{
									minDate: moment().format('YYYY-MM-DD'),
								}}
							/>
							<span className="text-muted">
								Escoger una fecha si desea una notificación de
								recordatorio para ese día
							</span>
						</Col>
					</Row>
				</Col>
				<Col xs="12" md="7">
					<Row>
						<Col xs="12" md="12">
							<div className="mb-3">
								<Label htmlFor="boat" className="mb-0">
									Embarcación
								</Label>
								<Select
									value={
										formik.values.boat?.id
											? {
													value: formik.values.boat
														.id,
													label: formik.values.boat
														.name,
											  }
											: null
									}
									onChange={(value) => {
										formik.setFieldValue(
											'boat.id',
											value?.value ?? ''
										);
										formik.setFieldValue(
											'boat.name',
											value?.label ?? ''
										);
									}}
									options={boatOpt}
									classNamePrefix="select2-selection"
									placeholder={SELECT_OPTION}
								/>
								{formik.errors.boatOpt?.id && (
									<div className="invalid-tooltip d-block">
										{formik.errors.boatOpt.id}
									</div>
								)}
							</div>
						</Col>
						<Col xs="12" md="12">
							<Label htmlFor="comments" className="mb-0">
								Nota
							</Label>
							<textarea
								id="comments"
								name="comments"
								className={`form-control ${
									formik.errors.comments ? 'is-invalid' : ''
								}`}
								onChange={formik.handleChange}
								value={formik.values.comments}
								rows={5}
							/>
							{formik.errors.comments && (
								<div className="invalid-tooltip">
									{formik.errors.comments}
								</div>
							)}
						</Col>
					</Row>
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
