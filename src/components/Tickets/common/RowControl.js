import SpanControl from './SpanControl';

const RowControl = ({ title = null, text = null, titleStyle, textStyle }) => {
	return (
		<div>
			<div className="d-flex flex-row">
				{title && (
					<div
						style={{
							padding: '4px 8px',
							backgroundColor: '#90cff1',
							...titleStyle,
						}}
					>
						<SpanControl
							text={title}
							style={{
								color: '#004a8f',
							}}
						/>
					</div>
				)}
				{text && (
					<SpanControl
						text={text}
						style={{
							padding: '4px 8px',
							...textStyle,
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default RowControl;
