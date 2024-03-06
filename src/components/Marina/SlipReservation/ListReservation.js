import moment from 'moment';
import { useMemo } from 'react';
import { numberFormat } from '../../../utils/numberFormat';
import { Badge, Col, Row } from 'reactstrap';
import TableLoader from '../../Loader/TablaLoader';
import SimpleTable from '../../Tables/SimpleTable';
import { Link } from 'react-router-dom';

function ListReservation({ loading = false, reservations = [] }) {
	const columns = useMemo(
		() => [
			{
				Header: 'Código',
				accessor: 'code',
				style: {
					width: '13%',
				},
				Cell: ({ row, value }) => (
					<Link to={`/reservation/edit/${row.original.id}`}>
						{value}
					</Link>
				),
			},
			{
				Header: 'Cliente',
				accessor: 'customer.name',
				style: {
					width: '20%',
				},
				Cell: ({ row, value }) =>
					`${value} ${row.original.customer.lastName}`,
			},
			{
				Header: 'Embarcación',
				accessor: 'boat.name',
				style: {
					width: '15%',
				},
			},
			{
				Header: 'Fecha llegada',
				accessor: 'arrivalDate',
				style: {
					width: '10%',
				},
				Cell: ({ row, value }) =>
					moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY'),
			},
			{
				Header: 'Fecha salida',
				accessor: 'departureDate',
				style: {
					width: '10%',
				},
				Cell: ({ row, value }) =>
					moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY'),
			},
			{
				Header: 'Precio diario',
				accessor: 'price',
				style: {
					width: '10%',
				},
				Cell: ({ value }) => numberFormat(value),
			},
			{
				Header: 'Deuda',
				accessor: 'debt',
				style: {
					width: '7%',
				},
				Cell: ({ row, value }) =>
					row.original.status === 'CONFIRMED' ? (
						<span
							className={
								value > 0 ? 'text-danger' : 'text-success'
							}
						>
							{numberFormat(value)}
						</span>
					) : (
						numberFormat(value)
					),
			},
			{
				Header: 'Estado',
				accessor: 'status',
				style: {
					width: '8%',
				},
				Cell: ({ value }) => {
					if (value === 'PENDING') {
						return <Badge color="warning">Pendiente</Badge>;
					} else if (value === 'CONFIRMED') {
						return <Badge color="success">Confirmada</Badge>;
					} else {
						return <Badge color="danger">Cancelada</Badge>;
					}
				},
			},
		],
		[]
	);

	return loading ? (
		<Row>
			<Col xs="12" xl="12">
				<TableLoader
					columns={[
						{ name: 'Código', width: '13%' },
						{ name: 'Slip', width: '8%' },
						{ name: 'Cliente', width: '15%' },
						{ name: 'Embarcación', width: '12%' },
						{ name: 'Fecha llegada', width: '10%' },
						{ name: 'Fecha salida', width: '10%' },
						{ name: 'Precio diario', width: '10%' },
						{ name: 'Deuda', width: '7%' },
						{ name: 'Estado', width: '8%' },
						{ name: 'Acciones', width: '7%' },
					]}
				/>
			</Col>
		</Row>
	) : (
		<Row>
			<Col xl="12">
				<SimpleTable columns={columns} data={reservations} />
			</Col>
		</Row>
	);
}

export default ListReservation;
