import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Col, Row } from 'reactstrap';

export default function EditableTable({ columns, data, updateFn }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			updateData: (id: number, columnId: string, value: string) => {
				updateFn(id, columnId, value);
			},
		},
	});

	return (
		<Row>
			<Col>
				<div className="table-rep-plugin">
					<div className="table-responsive">
						<table className="table align-middle table-bordered table-hover responsiveTable">
							<thead className="table-light">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<th key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column
																.columnDef
																.header,
															header.getContext()
													  )}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Col>
		</Row>
	);
}
