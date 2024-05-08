import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
} from '@react-pdf/renderer';
import moment from 'moment';
import { getFormaPago } from '../../utils/getFormaPago';
import logo from '../../assets/images/logo.png';

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
		image: {
			marginVertical: 15,
			marginHorizontal: 150,
			width: '200px',
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
			width: '70%',
		},
		row2: {
			width: '30%',
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
	return (
		<Document>
			<Page size="A4" style={styles.body}>
				<Image style={styles.image} src={logo} />
				<View style={[styles.containerFlexCenter, styles.flexCenter]}>
					<Text style={{ fontSize: 14, margin: 'auto' }}>
						{ticket?.reservation?.boat?.name ?? ''}
					</Text>
					<Text
						style={{ fontSize: 12, margin: 'auto', marginTop: 10 }}
					>
						FOLIO: {ticket.code}
					</Text>
					<Text
						style={{
							fontSize: 9,
							margin: 'auto',
							marginTop: 10,
							textTransform: 'uppercase',
						}}
					>
						FORMA DE PAGO: {getFormaPago(ticket.paymentForm)}
					</Text>
					<Text
						style={{
							fontSize: 9,
							margin: 'auto',
							marginTop: 3,
							textTransform: 'uppercase',
						}}
					>
						Salida:{' '}
						{moment(
							ticket.departureDate,
							'YYYY-MM-DDTHH:mm'
						).format('DD-MM-YYYY HH:mm')}
					</Text>
				</View>

				<View style={{ marginTop: 35, textAlign: 'center' }}>
					<Text style={{ fontSize: 12 }}>
						* * * * * * * * * * * * * * * * * * * * * * * * * * * *
						* * * * * * * * *
					</Text>
					<Text
						style={{ fontSize: 12, marginTop: 5, marginBottom: 10 }}
					>
						RECIBO DE PAGO
					</Text>
					<Text style={{ fontSize: 12 }}>
						* * * * * * * * * * * * * * * * * * * * * * * * * * * *
						* * * * * * * * *
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
						<Text style={stylesTable.row1}>Descripción</Text>
						<Text style={stylesTable.row2}>Pago</Text>
					</View>
					<View style={stylesTable.row} wrap={false}>
						<View style={stylesTable.row1}>
							<Text>{`Brazaletes: ${ticket.pax}`}</Text>
						</View>
						<View style={stylesTable.row2}></View>
					</View>
					<View style={stylesTable.row} wrap={false}>
						<View style={stylesTable.row1}>
							<Text>{`Precio x Pax (USD)`}</Text>
						</View>
						<View style={stylesTable.row2}>
							<Text>{formatNumber(ticket.priceUSD)}</Text>
						</View>
					</View>
					<View style={stylesTable.row} wrap={false}>
						<View style={stylesTable.row1}>
							<Text>{`Total (USD)`}</Text>
						</View>
						<View style={stylesTable.row2}>
							<Text>{formatNumber(ticket.amountUSD)}</Text>
						</View>
					</View>
					<View style={stylesTable.row} wrap={false}>
						<View style={stylesTable.row1}>
							<Text>{`Precio x Pax (MXN)`}</Text>
						</View>
						<View style={stylesTable.row2}>
							<Text>{formatNumber(ticket.price)}</Text>
						</View>
					</View>
					<View style={stylesTable.row} wrap={false}>
						<View style={stylesTable.row1}>
							<Text>{`Total (MXN)`}</Text>
						</View>
						<View style={stylesTable.row2}>
							<Text>{formatNumber(ticket.amount)}</Text>
						</View>
					</View>
					<View style={stylesTable.row} wrap={false}>
						<View style={stylesTable.row1}>
							<Text>{`Tipo de cambio`}</Text>
						</View>
						<View style={stylesTable.row2}>
							<Text>{formatNumber(ticket.currencyExchange)}</Text>
						</View>
					</View>

					<Text style={{ fontSize: 12, marginTop: 20 }}>
						* * * * * * * * * * * * * * * * * * * * * * * * * * * *
						* * * * * * * * *
					</Text>
				</View>
				<View style={{ marginTop: 35, textAlign: 'center' }}>
					<Text style={{ fontSize: 12, marginBottom: 5 }}>
						{moment(ticket.dateCreated, 'YYYY-MM-DDTHH:mm').format(
							'DD-MM-YYYY'
						)}
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
