import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCashMovement } from '../../../../helpers/caja/cashRegisterControl';
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

const CashMovement = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);

	useEffect(() => {
		setLoading(true);
		const fetchApi = async () => {
			try {
				const response = await getCashMovement(id);
				setItems(response.list);
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
				setItems([]);
				setLoading(false);
			}
		};
		fetchApi();
	}, [id, dispatch]);

	const columns = useMemo(
		() => [
			{
				Header: 'Caja',
				accessor: 'cashRegister.description',
				style: {
					width: '40%',
				},
			},
			{
				Header: 'Concepto',
				accessor: 'cashConcept.description',
				style: {
					width: '30%',
				},
			},
			{
				Header: 'Tipo operación',
				accessor: 'cashConcept.operation',
				style: {
					width: '15%',
				},
				Cell: ({ value }) => (value === 'IN' ? 'Entrada' : 'Salida'),
			},
			{
				Header: 'Monto',
				accessor: 'amount',
				style: {
					width: '15%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
		],
		[]
	);

	const cardHandleList = loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Caja', width: '40%' },
						{ name: 'Concepto', width: '30%' },
						{ name: 'Tipo operación', width: '15%' },
						{ name: 'Monto', width: '15%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<SimpleTable columns={columns} data={items} />
			</Col>
		</Row>
	);

	return (
		<>
			<div className="page-content">
				<Container fluid>
					{/* Render Breadcrumb */}
					<Breadcrumbs
						title={'Movimiento de caja'}
						breadcrumbItem={'Movimiento de caja'}
					/>

					<Row className="pb-5">
						<Col lg="12">
							<CardMain
								title="Listado"
								children={cardHandleList}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default CashMovement;
