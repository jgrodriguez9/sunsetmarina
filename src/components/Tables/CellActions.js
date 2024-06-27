import TooltipDescription from '../Common/TooltipDescription';

export default function CellActions({
	edit,
	row,
	del = null,
	report,
	charge = null,
	cancel = null,
	cancelReservation = null,
}) {
	return (
		<>
			{edit?.allow && (
				<span
					onClick={() => edit.action(row)}
					className="pe-2"
					id="btn-span-editar"
				>
					<i className="fas fa-edit text-info" />
					<TooltipDescription text="Editar" id="btn-span-editar" />
				</span>
			)}
			{del?.allow && (
				<span
					onClick={() => del.action(row)}
					className="pe-2"
					id="btn-span-eliminar"
				>
					<i className="far fa-trash-alt text-danger" />
					<TooltipDescription
						text="Eliminar"
						id="btn-span-eliminar"
					/>
				</span>
			)}
			{report?.allow && (
				<span
					onClick={() => report.action(row)}
					className="pe-2"
					id="btn-span-report"
				>
					<i className="far fa-file-pdf text-dark" />
					<TooltipDescription text="Reporte" id="btn-span-report" />
				</span>
			)}
			{charge?.allow && (
				<span
					onClick={() => charge.action(row)}
					id="btn-span-charges"
					className="pe-2"
				>
					<i className="fas fa-file-invoice-dollar text-success" />
					<TooltipDescription text="Cargos" id="btn-span-charges" />
				</span>
			)}
			{cancel?.allow && (
				<span
					onClick={() => cancel.action(row)}
					id="btn-span-cancel"
					className="pe-2"
				>
					<i className="mdi mdi-close-circle text-danger" />
					<TooltipDescription text="Cancelar" id="btn-span-cancel" />
				</span>
			)}
			{cancelReservation?.allow && (
				<span
					onClick={() => cancelReservation.action(row)}
					id="btn-span-cancel-reservation"
				>
					<i className="mdi mdi-lock text-warning" />
					<TooltipDescription
						text="Cancelar reservación"
						id="btn-span-cancel-reservation"
					/>
				</span>
			)}
		</>
	);
}
