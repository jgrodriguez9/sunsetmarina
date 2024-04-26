import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import { months } from '../../constants/dates';
import { getFormaPago } from '../../utils/getFormaPago';

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
						FOLIO: 000001
					</Text>
					<Text
						style={{
							fontSize: 9,
							margin: 'auto',
							marginTop: 10,
							textTransform: 'uppercase',
						}}
					>
						FORMA DE PAGO: CASH
					</Text>
				</View>
			</Page>
		</Document>
	);
}

export default TicketPayment;
