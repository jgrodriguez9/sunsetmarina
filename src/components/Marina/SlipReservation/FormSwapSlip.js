import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Label, Row } from 'reactstrap';
import * as Yup from 'yup';
import {
	ERROR_SERVER,
	FIELD_REQUIRED,
	SELECT_OPTION,
	UPDATE_SUCCESS,
} from '../../../constants/messages';
import Select from 'react-select';
import ButtonsDisabled from '../../Common/ButtonsDisabled';
import { getSlip, getSlipList } from '../../../helpers/marina/slip';
import { useDispatch } from 'react-redux';
import { swapSlip } from '../../../helpers/marina/slipReservation';
import { addMessage } from '../../../redux/messageSlice';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import SpinLoader from '../../Loader/SpinLoader';
import { slipStatus } from '../../../constants/constants';

const FormSwapSlip = ({ reservationId, handleRefetch }) => {
	const dispatch = useDispatch();
	const [slipOpt, setSlipOpt] = useState([]);
	const [slipModel, setSlipModel] = useState(null);
	const [selectedSlip, setSelectedSlip] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchSlips = async () => {
			try {
				const response = await getSlipList();
				setSlipOpt(
					response.map((slip) => ({
						label: slip.code,
						value: slip.id,
						code: slip.code,
					}))
				);
			} catch (error) {
				setSlipOpt([]);
			}
		};
		fetchSlips();
	}, []);

	useEffect(() => {
		const fetchItem = async () => {
			try {
				setLoading(true);
				const response = await getSlip(slipModel.value);
				setLoading(false);
				setSelectedSlip({
					status: response.status,
					reservation:
						response.status === 'RESERVED'
							? response.reservations[
									response.reservations.length - 1
							  ]
							: null,
				});
			} catch (error) {
				setLoading(false);
				let message = ERROR_SERVER;
				message = extractMeaningfulMessage(error, message);
				dispatch(
					addMessage({
						type: 'error',
						message: message,
					})
				);
			}
		};
		if (slipModel) {
			fetchItem();
		}
	}, [slipModel, dispatch]);

	const formik = useFormik({
		initialValues: {
			reservationId: reservationId,
			destinySlipId: '',
		},
		validationSchema: Yup.object({
			destinySlipId: Yup.number().required(FIELD_REQUIRED),
		}),
		enableReinitialize: true,
		onSubmit: async (values) => {
			//validaciones antes de enviarl
			try {
				await swapSlip(values);
				dispatch(
					addMessage({
						type: 'success',
						message: UPDATE_SUCCESS,
					})
				);
				handleRefetch();
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
					<div className="mb-3">
						<Label htmlFor="slip" className="mb-0">
							Slip
						</Label>
						<Select
							value={slipModel}
							onChange={(value) => {
								formik.setFieldValue(
									'destinySlipId',
									value?.value ?? ''
								);
								setSlipModel(value);
							}}
							options={slipOpt}
							classNamePrefix="select2-selection"
							placeholder={SELECT_OPTION}
						/>

						{formik.errors.destinySlipId && (
							<div className="invalid-tooltip d-block">
								{formik.errors.destinySlipId}
							</div>
						)}
					</div>
				</Col>
				<Col xs="12" md="12">
					{loading && <SpinLoader />}
					{!loading && selectedSlip && (
						<Alert color={'info'}>
							<ul className="list-unstyled">
								<li>
									<strong>Estado: </strong>{' '}
									{slipStatus(selectedSlip.status)}
								</li>
								<li>
									<strong>Propietario: </strong>{' '}
									{`${
										selectedSlip.reservation?.customer
											?.name ?? '-'
									} ${
										selectedSlip.reservation?.customer
											?.lastName ?? ''
									}`}
								</li>
								<li>
									<strong>Embarcación: </strong>{' '}
									{`${
										selectedSlip.reservation?.boat?.name ??
										'-'
									}`}
								</li>
							</ul>
						</Alert>
					)}
				</Col>

				<Col xs="12" md="12">
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
						<div className="d-flex">
							<Button
								color="primary"
								type="submit"
								className="me-2"
							>
								Aceptar
							</Button>
						</div>
					)}
				</Col>
			</Row>
		</Form>
	);
};

export default FormSwapSlip;
