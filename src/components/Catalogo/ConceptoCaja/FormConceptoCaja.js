import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
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
import { useEffect } from 'react';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import {
	saveCashConcept,
	updateCashConcept,
} from '../../../helpers/catalogos/cashConcept';
import { typeOperation } from '../../../data/typeOperation';

export default function FormConceptoCaja({ item, btnTextSubmit = 'Aceptar' }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const formik = useFormik({
		initialValues: {
			id: item?.id ?? '',
			typeOperation: item?.typeOperation ?? 'IN',
			accountNumber: item?.accountNumber ?? '',
			description: item?.description ?? '',
			enabled: item?.enabled ?? true,
		},
		validationSchema: Yup.object({
			description: Yup.string().required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			if (values.id) {
				//update
				try {
					let response = await updateCashConcept(values.id, values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: UPDATE_SUCCESS,
							})
						);
						navigate('/cashconcept');
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
					let response = await saveCashConcept(values);
					if (response) {
						dispatch(
							addMessage({
								type: 'success',
								message: SAVE_SUCCESS,
							})
						);
						navigate('/cashconcept');
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
				<Col xs="12" md="3">
					<Label htmlFor="description" className="mb-0">
						Descripción
					</Label>
					<Input
						id="description"
						name="description"
						className={`form-control ${
							formik.errors.description ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.description}
					/>
					{formik.errors.description && (
						<div className="invalid-tooltip">
							{formik.errors.description}
						</div>
					)}
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="accountNumber" className="mb-0">
						No. cuenta
					</Label>
					<Input
						id="accountNumber"
						name="accountNumber"
						className={`form-control ${
							formik.errors.accountNumber ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.accountNumber}
					/>
				</Col>
				<Col xs="12" md="3">
					<Label htmlFor="country" className="mb-0">
						Tipo de operación
					</Label>
					<Select
						value={
							formik.values.typeOperation
								? {
										value: formik.values.typeOperation,
										label: typeOperation.find(
											(it) =>
												it.value ===
												formik.values.typeOperation
										).label,
								  }
								: null
						}
						onChange={(value) => {
							formik.setFieldValue(
								'typeOperation',
								value?.value ?? ''
							);
						}}
						options={typeOperation}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
				</Col>
				<Col xs="12" md="3">
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
					<Link to="/cashconcept" className="btn btn-danger">
						Cancelar
					</Link>
				</div>
			)}
		</Form>
	);
}
