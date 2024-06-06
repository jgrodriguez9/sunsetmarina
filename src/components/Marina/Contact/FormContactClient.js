import { useFormik } from 'formik';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	CORREO_VALID,
	ERROR_SERVER,
	FIELD_REQUIRED,
	SAVE_SUCCESS,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { saveContact, updateContact } from '../../../helpers/marina/contact';
import Select from 'react-select';
import { parentesco } from '../../../data/parentesco';

export default function FormContactClient({
	item,
	setOpenModalAdd,
	setRefetch,
}) {
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			name: item?.name ?? '',
			description: item.description,
			phone: item.phone,
			email: item.email,
			customer: item?.customer ?? { id: '' },
		},
		validationSchema: Yup.object({
			name: Yup.string().required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			if (values.id) {
				//update
				try {
					let response = await updateContact(values.id, values);
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
					let response = await saveContact(values);
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
					<Label htmlFor="boatType" className="mb-0">
						Parentesco
					</Label>
					<Select
						value={
							formik.values.description
								? {
										label: formik.values.description,
										value: formik.values.description,
								  }
								: null
						}
						onChange={(value) => {
							formik.setFieldValue(
								'description',
								value?.value ?? ''
							);
						}}
						options={parentesco}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
				</Col>
				<Col xs="12" md="4">
					<Label htmlFor="email" className="mb-0">
						Correo electrónico
					</Label>
					<Input
						id="email"
						name="email"
						className={`form-control ${
							formik.errors.email ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.email}
					/>
					{formik.errors.email && (
						<div className="invalid-tooltip">
							{formik.errors.email}
						</div>
					)}
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
					{formik.errors.phone && (
						<div className="invalid-tooltip">
							{formik.errors.phone}
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
