export default function SimpleLoad({
	text = 'Cargando',
	extraClass = 'text-center my-3 text-success',
}) {
	return (
		<div className={extraClass}>
			<i className="bx bx-loader bx-spin font-size-18 align-middle me-2" />
			{text}
		</div>
	);
}
