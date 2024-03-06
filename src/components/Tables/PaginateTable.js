import { usePagination, useTable } from 'react-table';
import {
	Col,
	Pagination,
	PaginationItem,
	PaginationLink,
	Row,
} from 'reactstrap';

export default function PaginateTable({ columns, data, initialState }) {
	const limites = [10, 20, 30, 40, 50];
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
	} = useTable({ columns, data, initialState }, usePagination);

	const getPageIndexOptions = (maxNumberOfOptions, pageSize, pageI) => {
		const options = [];
		const pivot = Math.ceil(maxNumberOfOptions / 2);
		const lastPageIndex = pageSize;

		if (lastPageIndex <= maxNumberOfOptions) {
			while (options.length < lastPageIndex)
				options.push(options.length + 1);
		} else if (pageI < pivot) {
			while (options.length < maxNumberOfOptions)
				options.push(options.length + 1);
		} else if (pageI > lastPageIndex - pivot) {
			while (options.length < maxNumberOfOptions)
				options.unshift(lastPageIndex - options.length + 1);
		} else {
			for (
				var i = pageI - (pivot - 1);
				options.length < maxNumberOfOptions;
				i++
			) {
				options.push(i + 1);
			}
		}
		return options;
	};
	return (
		<Row>
			<Col>
				<div className="table-rep-plugin">
					<div className="table-responsive">
						<table
							{...getTableProps()}
							className="table align-middle table-bordered table-hover responsiveTable"
						>
							<thead className="table-light">
								{headerGroups.map((headerGroup) => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map((column) => (
											<th
												{...column.getHeaderProps({
													style: column.style || {},
												})}
											>
												{column.render('Header')}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()}>
								{rows.length > 0 ? (
									page.map((row) => {
										prepareRow(row);
										return (
											<tr {...row.getRowProps()}>
												{row.cells.map((cell) => {
													return (
														<td
															{...cell.getCellProps()}
														>
															{cell.render(
																'Cell'
															)}
														</td>
													);
												})}
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={columns.length}>
											No hay información disponible
										</td>
									</tr>
								)}
							</tbody>
						</table>
						<div className="d-flex align-items-center">
							<div className="me-auto">
								<span className="text-muted fs-08">
									Total de registros:
									<select
										className="mx-1"
										style={{
											borderColor: '#ccc',
											color: '#74788d',
										}}
										value={pageSize}
										onChange={(e) =>
											setPageSize(Number(e.target.value))
										}
									>
										{rows.length < 10 ? (
											<option value={rows.length}>
												{rows.length}
											</option>
										) : (
											limites.map((item) => (
												<option value={item} key={item}>
													{item}
												</option>
											))
										)}
									</select>{' '}
									de {rows.length}
								</span>
							</div>
							<div>
								<Pagination className="pagination pagination-rounded justify-content-end paginate-margin-ul-none">
									<PaginationItem disabled={!canPreviousPage}>
										<PaginationLink
											previous
											href="#"
											onClick={() => previousPage()}
										/>
									</PaginationItem>
									{getPageIndexOptions(
										5,
										pageOptions.length,
										pageCount
									).map((item, i) => (
										<PaginationItem
											active={item === pageIndex + 1}
											key={i}
										>
											<PaginationLink
												onClick={() => {
													gotoPage(item - 1);
												}}
												href="#"
											>
												{item}
											</PaginationLink>
										</PaginationItem>
									))}
									<PaginationItem disabled={!canNextPage}>
										<PaginationLink
											next
											href="#"
											onClick={() => nextPage()}
										/>
									</PaginationItem>
								</Pagination>
							</div>
						</div>
					</div>
				</div>
			</Col>
		</Row>
	);
}
