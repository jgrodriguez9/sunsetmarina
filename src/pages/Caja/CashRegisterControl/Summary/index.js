import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCashSummary } from '../../../../helpers/caja/cashRegisterControl';
import { numberFormat } from '../../../../utils/numberFormat';
import { Col, Container, Row } from 'reactstrap';
import TableLoader from '../../../../components/Loader/TablaLoader';
import SimpleTable from '../../../../components/Tables/SimpleTable';
import Breadcrumbs from '../../../../components/Common/Breadcrumbs';
import CardMain from '../../../../components/Common/CardMain';
import { ERROR_SERVER } from '../../../../constants/messages';
import extractMeaningfulMessage from '../../../../utils/extractMeaningfulMessage';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../../../redux/messageSlice';

const CashSummary = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [itemsByPaymentType, setItemsByPaymentType] = useState([]);
	const [itemsByConcept, setItemsByConcept] = useState([]);

	useEffect(() => {
		setLoading(true);
		const fetchApi = async () => {
			try {
				const response = await getCashSummary(id);
				console.log(response);
				setItemsByPaymentType(response.cashMovementsPaymentType);
				setItemsByConcept(response.cashMovementsConcept);
				setLoading(false);
			} catch (error) {
				let message = ERROR_SERVER;
				message = extractMeaningfulMessage(error, message);
				dispatch(
					addMessage({
						message: message,
						type: 'error',
					})
				);
				setItemsByPaymentType([]);
				setItemsByConcept([]);
				setLoading(false);
			}
		};
		fetchApi();
	}, [id, dispatch]);

	const columnsPaymentType = useMemo(
		() => [
			{
				Header: 'Concepto',
				accessor: 'description',
				style: {
					width: '50%',
				},
			},
			{
				Header: 'Tipo operación',
				accessor: 'typeOperation',
				style: {
					width: '30%',
				},
				Cell: ({ value }) => (value === 'IN' ? 'Entrada' : 'Salida'),
			},
			{
				Header: 'Monto',
				accessor: 'amount',
				style: {
					width: '20%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
		],
		[]
	);

	const totalPaymentType = useMemo(() => {
		return itemsByPaymentType.reduce(
			(acc, current) => acc + current.amount,
			0
		);
	}, [itemsByPaymentType]);

	const tFooterPaymentType = (
		<tfoot>
			<tr>
				<th colSpan={2}>Total</th>
				<th>{numberFormat(totalPaymentType)}</th>
			</tr>
		</tfoot>
	);

	const cardHandleListPaymentType = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Concepto', width: '50%' },
						{ name: 'Tipo operación', width: '30%' },
						{ name: 'Monto', width: '20%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<SimpleTable
					columns={columnsPaymentType}
					data={itemsByPaymentType}
					footer={tFooterPaymentType}
				/>
			</Col>
		</Row>
	);

	const totalConcept = useMemo(() => {
		return itemsByConcept.reduce((acc, current) => acc + current.amount, 0);
	}, [itemsByConcept]);
	const tFooterConcept = (
		<tfoot>
			<tr>
				<th colSpan={2}>Total</th>
				<th>{numberFormat(totalConcept)}</th>
			</tr>
		</tfoot>
	);
	const cardHandleListConcept = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Concepto', width: '50%' },
						{ name: 'Tipo operación', width: '30%' },
						{ name: 'Monto', width: '20%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<SimpleTable
					columns={columnsPaymentType}
					data={itemsByConcept}
					footer={tFooterConcept}
				/>
			</Col>
		</Row>
	);

	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Resumen de caja'}
						breadcrumbItem={'Resumen de caja'}
					/>

					<Row className="pb-5">
						<Col lg="12">
							<CardMain
								title="Listado de movimientos por tipo de pago"
								children={cardHandleListPaymentType}
							/>
						</Col>
						<Col lg="12">
							<CardMain
								title="Listado de movimientos por concepto"
								children={cardHandleListConcept}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default CashSummary;
