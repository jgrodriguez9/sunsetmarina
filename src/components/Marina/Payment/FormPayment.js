import { useDispatch } from 'react-redux';
import { updatePayment } from '../../../helpers/marina/payment';
import { addMessage } from '../../../redux/messageSlice';
import { ERROR_SERVER, UPDATE_SUCCESS } from '../../../constants/messages';
import extractMeaningfulMessage from '../../../utils/extractMeaningfulMessage';
import { Button, Col, Input, Label, Row } from 'reactstrap';
import { useEffect, useState } from 'react';
import jsFormatNumber from '../../../utils/jsFormatNumber';

const FormPayment = ({ item, setOpenModalAdd }) => {
	const dispatch = useDispatch();
	const [payments, setPayments] = useState(item)
	const [indexLoad, setIndexLoad] = useState(-1)

	useEffect(() => {
		setPayments(item.map(it => ({id: it.id, total: `${jsFormatNumber(it.amount)} ${it.currency}`, reference: it.reference, concept: it.concept})))
	}, [item])
	

	const onHandleChange = (value, index, type) => {
		const copyPayments = [...payments]
		copyPayments[index][type] = value
		setPayments(copyPayments)
	}

	const handleUpdate = async (index) => {
		const data = {
			concept: payments[index].concept ?? '',
			reference: payments[index].reference ?? '',
		}
		setIndexLoad(index)
		try {
			let response = await updatePayment(payments[index].id, data);
			if (response) {
				dispatch(
					addMessage({
						type: 'success',
						message: UPDATE_SUCCESS,
					})
				);
				setIndexLoad(-1)
			} else {
				setIndexLoad(-1)
				dispatch(
					addMessage({
						type: 'error',
						message: ERROR_SERVER,
					})
				);
			}
		} catch (error) {
			setIndexLoad(-1)
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

	return (
		<div className="needs-validation mb-3" id="tooltipForm">
			{
				payments.map((payment, index) => (
					<Row key={`editpayment-${payment.id}`}>
						<Col xs="12" lg="3">
							<Label htmlFor="total" className="mb-0">
								Total
							</Label>
							<Input
								id="total"
								name="total"
								className={`form-control`}								
								defaultValue={payment.total}
								disabled
							/>
						</Col>
						<Col xs="12" md="4">
							<Label htmlFor="concept" className="mb-0">
								Concepto
							</Label>
							<Input
								id="concept"
								name="concept"
								className={`form-control`}
								onChange={(e) => {
									onHandleChange(e.target.value, index, 'concept')
								}}
								value={payment.concept}
							/>
						</Col>
						<Col xs="12" md="4">
							<Label htmlFor="reference" className="mb-0">
								Referencia
							</Label>
							<Input
								id="reference"
								name="reference"
								className={`form-control`}
								onChange={(e) => {
									onHandleChange(e.target.value, index, 'reference')
								}}
								value={payment.reference}
							/>
						</Col>
						<Col xs="12" md="1">
						<Label className="mb-0 opacity-0">
								Referencia
							</Label>
							<Button color="primary" onClick={() => handleUpdate(index)}>
								{indexLoad === index && <i className="bx bx-loader bx-spin font-size-16 align-middle" />}
								{indexLoad !== index && <i className="bx bx-check font-size-16 align-middle" />}
							</Button>	
						</Col>
					</Row>
				))
			}	
			<hr />
			<Button
				color="danger"
				type="button"
				className="me-2"
				onClick={() => setOpenModalAdd(false)}
			>
				Cancelar
			</Button>	
		</div>
	);
};

export default FormPayment;
