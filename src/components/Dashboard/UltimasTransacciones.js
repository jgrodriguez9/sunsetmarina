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
import CellDate from '../Tables/CellDate';
import jsFormatNumber from '../../utils/jsFormatNumber';

export default function UltimasTransacciones() {
	const [items, setItems] = useState(lastTransaction);
	const [loading, setLoading] = useState(false);

	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '10%',
				},
			},
			{
				Header: 'Fecha',
				accessor: 'dateCreated',
				style: {
					width: '10%',
				},
				Cell: CellDate,
			},
			{
				Header: 'Tipo de pago',
				accessor: 'systemPayment',
				style: {
					width: '15%',
				},
				Cell: ({ value }) => getTipoPago(value),
			},
			{
				Header: 'Total',
				id: 'total',
				style: {
					width: '10%',
					textAlign: 'center',
				},
				Cell: ({ row }) => {
					if(row.original.systemPayment === 'BALANCE_BP'){
						const selectCurrency = row.original.payments && row.original.payments.length > 0 ? row.original.payments[0].currency : 'USD'
						const result =  row.original.payments?.reduce((acc, curr) => {
							if(selectCurrency === 'MXN'){
								acc += curr.amount
							}else{	
								acc += curr.amountUSD
							}
							return acc;
						}, 0)
						return `${jsFormatNumber(result)} (${selectCurrency})`
					}else{
						const result =  row.original.payments?.reduce((acc, curr) => acc+curr.amount, 0)
						return `${jsFormatNumber(result)} (MXN)`
					}
				},
			},				
			{
				Header: 'Detalle',
				accessor: 'payments',
				style: {
					width: '40%',
				},
				Cell: ({ row, value }) => {
					return (
						<table className="mb-0 font-size-12" style={{ width: '100%'}}>
							<thead>
								<tr>
									<th className='border-0 fw-semibold'>Monto</th>
									<th className='border-0 fw-semibold'>C/E</th>
									<th className='border-0 fw-semibold'>Forma de pago</th>
									<th className='border-0 fw-semibold'>Concepto</th>
									<th className='border-0 fw-semibold'>Referencia</th>
								</tr>
							</thead>
							<tbody>
								{
									(value ?? []).map((item) => (
										<tr key={item.id}>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '20%'}}>{numberFormat(item.currency === 'MXN' ? item.amount :  item.amountUSD)} ({item.currency})</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '10%'}}>{numberFormat(item.currencyExchange, 4, 4)}</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '20%'}}>{getFormaPago(item.paymentForm)}</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '30%'}}>{item.concept}</td>
											<td className='border-top-0 border-end-0 border-start-0' style={{ width: '30%'}}>{item.reference}</td>
										</tr>
									))
								}
							</tbody>
						</table>
					)
				}
			},
			{
				Header: 'Estado',
				id: 'status',
				style: {
					width: '5%',
				},
				Cell: ({ row }) => {
					const firStatus = row?.original?.payments && row?.original?.payments.length > 0 ? row?.original?.payments[0]?.status : 'NA'
					if (firStatus === 'PENDING') {
						return <Badge color="warning">Pendiente</Badge>;
					} else if (firStatus === 'APPROVED') {
						return <Badge color="success">Aprobado</Badge>;
					} else if(firStatus === 'CANCELLED'){
						return <Badge color="danger">Cancelado</Badge>;
					}else {
						return <Badge color="light">No disponible</Badge>;
					}
				},
			},
		],
		[]
	);

	useEffect(() => {
		const fecthApiPaymentForClient = async () => {
			try {
				let q = `?page=1&max=10`;
				const response = await getPaymentListPaginado(q);
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
		fecthApiPaymentForClient();
	}, []);

	return (
		<>
			{/* <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} /> */}
			<Card className="shadow-sm">
				<CardBody>
					<div className="mb-4 h4 card-title">
						Ultimas 10 Transacciones
					</div>
					{loading ? (
						<TableLoader
							columns={[
								{ name: 'Código', width: '15%' },
								{ name: 'Referencia', width: '25%' },
								{ name: 'Fecha', with: '15%' },
								{ name: 'Monto', width: '10%' },
								{ name: 'Forma de pago', width: '10%' },
								{ name: 'Tipo de pago', width: '15%' },
								{ name: 'Estado', width: '10%' },
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
