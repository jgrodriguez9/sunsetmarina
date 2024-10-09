import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_INTEGER,
	FIELD_NUMERIC,
	FIELD_REQUIRED,
	OPEN_CASH_SUCCESS,
	SELECT_OPTION,
} from '../../../constants/messages';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import Select from 'react-select';
import { openCashRegisterControl } from '../../../helpers/caja/cashRegisterControl';
import { getCashRegisterListPaginado } from '../../../helpers/caja/cashRegister';

export default function FormOpenCashRegisterControl({
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
			cashRegister: { id: '' },
			initialAmount: 0,
			initialAmountUSD: 0,
		},
		validationSchema: Yup.object({
			cashRegister: Yup.object({
				id: Yup.number().required(FIELD_REQUIRED),
			}),
			initialAmount: Yup.number()
				.integer(FIELD_INTEGER)
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
			initialAmountUSD: Yup.number()
				.integer(FIELD_INTEGER)
				.typeError(FIELD_NUMERIC)
				.required(FIELD_REQUIRED),
		}),
		onSubmit: async (values) => {
			//validaciones antes de enviarlo
			//save
			try {
				let response = await openCashRegisterControl(values);
				if (response) {
					dispatch(
						addMessage({
							type: 'success',
							message: OPEN_CASH_SUCCESS,
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
				<Col xs="12" md="12">
					<Label htmlFor="initialAmount" className="mb-0">
						Monto inicial (MXN)
					</Label>
					<Input
						id="initialAmount"
						name="initialAmount"
						className={`form-control ${
							formik.errors.initialAmount ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.initialAmount}
					/>
					{formik.errors.initialAmount && (
						<div className="invalid-tooltip d-block">
							{formik.errors.initialAmount}
						</div>
					)}
				</Col>
				<Col xs="12" md="12">
					<Label htmlFor="initialAmountUSD" className="mb-0">
						Monto inicial (USD)
					</Label>
					<Input
						id="initialAmountUSD"
						name="initialAmountUSD"
						className={`form-control ${
							formik.errors.initialAmountUSD ? 'is-invalid' : ''
						}`}
						onChange={formik.handleChange}
						value={formik.values.initialAmountUSD}
					/>
					{formik.errors.initialAmountUSD && (
						<div className="invalid-tooltip d-block">
							{formik.errors.initialAmountUSD}
						</div>
					)}
				</Col>
			</Row>
			<hr />
			{formik.isSubmitting ? (
				<ButtonsDisabled
					buttons={[
						{
							text: 'Abrir',
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
					Abrir
				</Button>
			)}
		</div>
	);
}
