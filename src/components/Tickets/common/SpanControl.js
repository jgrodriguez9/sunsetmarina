const SpanControl = ({
	text,
	style = {
		fontSize: '14px',
		color: '#333',
		fontWeight: 600,
	},
}) => {
	return (
		<span
			style={{
				color: '#333',
				fontWeight: 600,
				...style,
			}}
		>
			{text}
		</span>
	);
};

export default SpanControl;
