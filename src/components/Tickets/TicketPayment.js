import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { getFormaPago } from '../../utils/getFormaPago';
import { months } from '../../constants/dates';

function TicketPayment({ ticket }) {
	const styles = StyleSheet.create({
		body: {
			paddingTop: 35,
			paddingBottom: 65,
			paddingHorizontal: 35,
		},
		logoSantander: {
			width: 100,
			height: 50,
		},
		logoCotrep: {
			width: 100,
			height: 45,
		},
		containerFlex: {
			display: 'flex',
			flexDirection: 'row',
		},
		flexCenter: {
			justifyContent: 'center',
		},
	});
	const stylesTable = StyleSheet.create({
		table: {
			width: '100%',
			fontSize: 9.5,
		},
		row: {
			display: 'flex',
			flexDirection: 'row',
			paddingTop: 4,
			paddingBottom: 4,
		},
		header: {
			borderTop: 'none',
		},
		bold: {
			fontWeight: 'bold',
		},
		// So Declarative and unDRY 👌
		row1: {
			width: '80%',
		},
		row2: {
			width: '20%',
		},
	});

	const formatNumber = (number) => {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		});
		if (number) return formatter.format(number);
		return '$0.00';
	};
	const getConcept = (monthYear) => {
		try {
			const monthYears = monthYear.split('-');
			const m = months.find((it) => it.value === parseInt(monthYears[1]));
			return `${m.label}-${monthYears[0]}`;
		} catch (error) {
			return '';
		}
	};
	return (
		<Document>
			<Page size="A4" style={styles.body}>
				<View style={[styles.containerFlexCenter, styles.flexCenter]}>
					<Text style={{ fontSize: 14, margin: 'auto' }}>
						Sunset Admiral
					</Text>
					<Text
						style={{ fontSize: 12, margin: 'auto', marginTop: 10 }}
					>
						FOLIO: {ticket.payment.code}
					</Text>
					<Text
						style={{
							fontSize: 9,
							margin: 'auto',
							marginTop: 10,
							textTransform: 'uppercase',
						}}
					>
						FORMA DE PAGO:{' '}
						{getFormaPago(ticket.payment.paymentForm)}
					</Text>
				</View>

				<View style={{ marginTop: 35, textAlign: 'center' }}>
					<Text style={{ fontSize: 12 }}>
						* * * * * * * * * * * * * * * * * * * * * * * * * * * *
					</Text>
					<Text
						style={{ fontSize: 12, marginTop: 5, marginBottom: 10 }}
					>
						RECIBO DE PAGO
					</Text>
					<Text style={{ fontSize: 12 }}>
						* * * * * * * * * * * * * * * * * * * * * * * * * * * *
					</Text>
				</View>

				<View
					style={[
						stylesTable.table,
						{
							marginTop: 20,
							width: 300,
							display: 'block',
							marginLeft: 'auto',
							marginRight: 'auto',
						},
					]}
				>
					<View
						style={[
							stylesTable.row,
							stylesTable.bold,
							stylesTable.header,
						]}
					>
						<Text style={stylesTable.row1}>Concepto</Text>
						<Text style={stylesTable.row2}>Pago</Text>
					</View>
					{ticket.chargesSuccess.map((it, idx) => (
						<View
							style={stylesTable.row}
							wrap={false}
							key={`charge-${idx}`}
						>
							<View style={stylesTable.row1}>
								<Text>{getConcept(it.monthYear)}</Text>
							</View>
							<View style={stylesTable.row2}>
								<Text>
									{it.fullMonth
										? formatNumber(it.totalMonth)
										: formatNumber(it.amount)}
								</Text>
								<Text>
									{it.interest === 0
										? '$0.00'
										: formatNumber(it.interest)}
								</Text>
							</View>
						</View>
					))}
					<Text style={{ fontSize: 12, marginTop: 20 }}>
						* * * * * * * * * * * * * * * * * * * * * * * * * * * *
						* * * * * * * * *
					</Text>
					<View
						style={[stylesTable.row, { margintTop: 20 }]}
						wrap={false}
					>
						<View style={stylesTable.row1}>
							<Text>Total</Text>
						</View>
						<View style={stylesTable.row2}>
							<Text>{formatNumber(ticket.payment.amount)}</Text>
						</View>
					</View>
				</View>
				<View style={{ marginTop: 35, textAlign: 'center' }}>
					<Text style={{ fontSize: 12, marginBottom: 5 }}>
						{moment(
							ticket.payment.dateCreated,
							'YYYY-MM-DDTHH:mm'
						).format('DD-MM-YYYY')}
					</Text>
					<Text style={{ fontSize: 12, marginBottom: 5 }}>
						Gracias
					</Text>
				</View>
			</Page>
		</Document>
	);
}

export default TicketPayment;
