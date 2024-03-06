import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_REQUIRED,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { Button, Col, Label, Row } from 'reactstrap';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import Select from 'react-select';
import { getCashRegisterListPaginado } from '../../../helpers/caja/cashRegister';
import { updateUser } from '../../../helpers/seguridad/users';

export default function FormCashRegisterAssign({
	item,
	setOpenModalAdd,
	refetch,
}) {
	const dispatch = useDispatch();
	const [cashRegisterOpt, setCashRegisterOpt] = useState([]);

	useEffect(() => {
		const fetchApi = async () => {
			try {
				const response = await getCashRegisterListPaginado(
					`?max=1000&page=1`
				);
				setCashRegisterOpt(
					response.list.map((item) => ({
						label: item.description,
						value: item.id,
					}))
				);
			} catch (error) {
				setCashRegisterOpt([]);
			}
		};
		fetchApi();
	}, []);

	const formik = useFormik({
		initialValues: {
			id: item.id,
			cashRegister: { id: item.cashRegister?.id ?? '' },
		},
		validationSchema: Yup.object({
			cashRegister: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			//save
			try {
				let response = await updateUser(values.id, values);
				if (response) {
					dispatch(
						addMessage({
							type: 'success',
							message: UPDATE_SUCCESS,
						})
					);
					setOpenModalAdd(false);
					refetch();
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
		},
	});

	return (
		<div className="needs-validation">
			<Row>
				<Col xs="12" md="12">
					<Label htmlFor="caja" className="mb-0">
						Caja
					</Label>
					<Select
						value={
							formik.values.cashRegister?.id
								? {
										value: formik.values.cashRegister.id,
										label:
											cashRegisterOpt.find(
												(itm) =>
													itm.value ===
													formik.values.cashRegister
														?.id
											)?.label ?? '',
								  }
								: null
						}
						onChange={(value) => {
							formik.setFieldValue(
								'cashRegister.id',
								value?.value ?? ''
							);
						}}
						options={cashRegisterOpt}
						classNamePrefix="select2-selection"
						placeholder={SELECT_OPTION}
					/>
					{formik.errors.cashRegister?.id && (
						<div className="invalid-tooltip d-block">
							{formik.errors.cashRegister.id}
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
					Aceptar
				</Button>
			)}
		</div>
	);
}
