import { useTable } from 'react-table';
import { Col, Row } from 'reactstrap';

export default function SimpleTable({ columns, data, footer = null }) {
	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
		useTable({ columns, data });
	return (
		<Row>
			<Col>
				<div className="table-rep-plugin">
					<div className="table-responsive">
						<table
							{...getTableProps()}
							className="table align-middle table-bordered table-hover responsiveTable font-size-12"
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
									rows.map((row) => {
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
							{footer}
						</table>
					</div>
				</div>
			</Col>
		</Row>
	);
}
