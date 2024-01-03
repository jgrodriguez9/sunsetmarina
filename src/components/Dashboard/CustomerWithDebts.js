import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { lastTransaction } from '../../data/testData';
import SimpleTable from '../Tables/SimpleTable';
import { numberFormat } from '../../utils/numberFormat';
import TableLoader from '../Loader/TablaLoader';
import { getCustomerWithDebts } from '../../helpers/dashobard/stats';
import Paginate from '../Tables/Paginate';
import { Link } from 'react-router-dom';

export default function CustomerWithDebts() {
	const [items, setItems] = useState(lastTransaction);
	const [loading, setLoading] = useState(false);
	const [totalPaginas, setTotalPaginas] = useState(0);
	const [totalRegistros, setTotalRegistros] = useState(10);
	const [query, setQuery] = useState({
		max: totalRegistros,
		page: 1,
	});

	const columns = useMemo(
		() => [
			{
				Header: 'Cod. cliente',
				accessor: 'customer.code',
				style: {
					width: '15%',
				},
				Cell: ({ row, value }) => (
					<Link to={`/client/edit/${row.original.customer?.id}`}>
						{value}
					</Link>
				),
			},
			{
				Header: 'Cliente',
				accessor: 'customer.name',
				style: {
					width: '40%',
				},
				Cell: ({ row, value }) =>
					`${row.original?.customer?.name} ${row.original?.customer?.lastName}`,
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
				let q = Object.keys(query)
					.map((key) => `${key}=${query[key]}`)
					.join('&');
				const response = await getCustomerWithDebts(`?${q}`);
				// console.log(response);
				setTotalPaginas(response.pagination.totalPages);
				setTotalRegistros(response.pagination.totalCount);
				setItems(response.list);
				setLoading(false);
			} catch (error) {
				setTotalPaginas(0);
				setTotalRegistros(10);
				setItems([]);
				setLoading(false);
			}
		};
		setLoading(true);
		fecthApi();
	}, [query]);

	const handlePageClick = (page) => {
		setQuery((prev) => ({
			...prev,
			page: page,
		}));
	};
	const handleChangeLimit = (limit) => {
		setQuery((prev) => ({
			...prev,
			max: limit,
			page: 1,
		}));
	};

	return (
		<>
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
						<Row>
							<Col xs="12" md="12">
								<SimpleTable columns={columns} data={items} />
							</Col>
							{items.length > 0 && (
								<Paginate
									page={query.page}
									totalPaginas={totalPaginas}
									totalRegistros={totalRegistros}
									handlePageClick={handlePageClick}
									limit={query.limite}
									handleChangeLimit={handleChangeLimit}
								/>
							)}
						</Row>
					)}
				</CardBody>
			</Card>
		</>
	);
}
