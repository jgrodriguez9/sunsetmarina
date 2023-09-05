import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { Badge, Card, CardBody } from 'reactstrap';
import { lastTransaction } from '../../data/testData';
import SimpleTable from '../Tables/SimpleTable';
import moment from 'moment';
import { numberFormat } from '../../utils/numberFormat';
import { getFormaPago } from '../../utils/getFormaPago';
import { getTipoPago } from '../../utils/getTipoPago';
import { getPaymentListPaginado } from '../../helpers/marina/payment';
import { ERROR_SERVER } from '../../constants/messages';
import extractMeaningfulMessage from '../../utils/extractMeaningfulMessage';
import TableLoader from '../Loader/TablaLoader';
import { getCustomerWithDebts } from '../../helpers/dashobard/stats';

export default function CustomerWithDebts() {
	const [items, setItems] = useState(lastTransaction);
	const [loading, setLoading] = useState(false);

	const columns = useMemo(
		() => [
			{
				Header: 'Cod. cliente',
				accessor: 'customer.code',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Cliente',
				accessor: 'customer.name',
				style: {
					width: '40%',
				},
				Cell: ({ row, value }) =>
					`${row.original.customer.name} ${row.original.customer.lastName}`,
			},
			{
				Header: 'Teléfono',
				accessor: 'customer.phone',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Deuda',
				accessor: 'amount',
				style: {
					width: '15%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Interés',
				accessor: 'interest',
				style: {
					width: '15%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
		],
		[]
	);

	useEffect(() => {
		const fecthApi = async () => {
			try {
				let q = `?page=1&max=10`;
				const response = await getCustomerWithDebts(q);
				console.log(response);
				setItems(response.list);
				setLoading(false);
			} catch (error) {
				let message = ERROR_SERVER;
				message = extractMeaningfulMessage(error, message);
				setItems([]);
				setLoading(false);
			}
		};
		setLoading(true);
		fecthApi();
	}, []);

	return (
		<>
			{/* <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} /> */}
			<Card className="shadow-sm">
				<CardBody>
					<div className="mb-4 h4 card-title">
						Clientes con deudas
					</div>
					{loading ? (
						<TableLoader
							columns={[
								{ name: 'Cod. cliente', width: '15%' },
								{ name: 'Cliente', width: '40%' },
								{ name: 'Teléfono', width: '15%' },
								{ name: 'Deuda', width: '15%' },
								{ name: 'Interés', width: '15%' },
							]}
						/>
					) : (
						<SimpleTable columns={columns} data={items} />
					)}
				</CardBody>
			</Card>
		</>
	);
}
