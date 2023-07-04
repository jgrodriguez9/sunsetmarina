import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import logo from '../../assets/images/logo.png'

function ReportAccountStatus({pdfData}){
    const styles = StyleSheet.create({
        body: {
            paddingTop: 30,
            paddingBottom: 30,
            paddingHorizontal: 30,
        },
        logo: {
            width: 100,
            height: 80,
        },
        containerFlex: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
   		flexRow: {
          display: 'flex',
          flexDirection: 'row',
        }
    });
    const stylesTable = StyleSheet.create({
        table: {
          width: '100%',
          fontSize: 9.5
        },
        row: {
          display: 'flex',
          flexDirection: 'row',
          borderTop: '1px solid #777',
          paddingTop: 8,
          paddingBottom: 8,
        },
        header: {
          borderTop: 'none',
        },
        bold: {
          fontWeight: 'bold',
        },
        // So Declarative and unDRY 👌
        row1: {
          width: '20%',
        },
        row2: {
          width: '50%',
        },
        row3: {
          width: '15%',
        },
        row4: {
          width: '15%',
        },
    })

    return (
        <Document>
            <Page size="A4" style={styles.body}>
                <View style={{...styles.containerFlex}}>              
                    <View style={{display: 'block', paddingTop: 35}}>
                        <Text style={{fontSize: 16}}>ADMIRAL YACHT CLUB & MARINA</Text> 
                        <Text style={{paddingRight: 5, fontSize: 11, marginTop: 5}}>Cliente: Alain Nescolarde</Text>
                        
                    </View>
                    <Image
                        style={styles.logo}
                        src={logo}
                    />              
                </View>        
                
                <View>
                    <Text style={{fontSize: 13, backgroundColor: '#cae6ff', padding: 5}}>Estado de cuenta</Text>
                    <View style={{fontSize: 10, padding: 5, border: '1px solid #999', borderTop: 0}}>
                    <View style={styles.flexRow}>
                        <View style={{paddingRight: 80}}>
                            <Text>RESUMEN DEL PERIODO</Text>
                            <View style={{marginTop: 10}}>
                            <Text style={{width: 150}}>Saldo inicial</Text>
                            <Text></Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 150}}>Cargos del periodo</Text>
                            <Text>$20,488.00</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 150}}>Interés moratorio mensual</Text>
                            <Text>$348.00</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 150}}>IVA de intereses moratorio</Text>
                            <Text></Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 150}}>Pagos y abonos</Text>
                            <Text>$6,960.00</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 150}}>Salgo al corte</Text>
                            <Text style={{color: 'red'}}>$13,160.00</Text>
                            </View>
                        </View>
                        <View>
                            <View style={[styles.flexRow, {marginTop: 18}]}>
                            <Text style={{width: 120}}>Rango de fecha</Text>
                            <Text>01/04/2023 al 01/05/2023</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 120}}>Días del periodo</Text>
                            <Text>65</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 120}}>Fecha de corte</Text>
                            <Text>05/05/2023</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 120}}>No. slip</Text>
                            <Text>25,26</Text>
                            </View>
                            <View style={[styles.flexRow, {marginTop: 5}]}>
                            <Text style={{width: 120}}>Forma de pago</Text>
                            <Text>Transferencia</Text>
                            </View>
                        </View>
                    </View>
                    </View>
                </View>
                
                
                <View style={{marginTop: 10}}>
                    <Text style={{fontSize: 12, backgroundColor: '#d7dade', padding: 5}}>No. slip 25</Text>
                    <View style={{fontSize: 10, padding: 5, border: '1px solid #999', borderTop: 0}}>
                    <Text>Embarcación: Susy</Text>
                    
                    <View style={[stylesTable.table, {marginTop: 10}]}>
                        <View style={[stylesTable.row, stylesTable.bold, stylesTable.header]}>
                            <Text style={stylesTable.row1}>Fecha</Text>
                            <Text style={stylesTable.row2}>Concepto</Text>
                            <Text style={stylesTable.row3}>Cargo</Text>
                            <Text style={stylesTable.row4}>Abono</Text>
                        </View>
                        <View style={stylesTable.row} wrap={false}>
                            <Text style={stylesTable.row1}>
                                <Text style={stylesTable.bold}>01/04/2023</Text>
                            </Text>
                            <View style={stylesTable.row2}>
                                <Text>Renta de abril</Text>
                            </View>
                            <View style={stylesTable.row3}>
                            <Text>$6,960.00</Text>
                            </View>
                            <View style={stylesTable.row4}>
                                <Text></Text>
                            </View>
                        </View>

                        <View style={stylesTable.row} wrap={false}>
                            <Text style={stylesTable.row1}>
                                <Text style={stylesTable.bold}>01/05/2023</Text>
                            </Text>
                            <View style={stylesTable.row2}>
                                <Text>Pago renta de abril</Text>
                            </View>
                            <View style={stylesTable.row3}>
                            <Text></Text>
                            </View>
                            <View style={stylesTable.row4}>
                                <Text>$6,960.00</Text>
                            </View>
                        </View>
                    </View>
                    </View>  
                </View>
                
                    <View style={{marginTop: 10}}>
                    <Text style={{fontSize: 12, backgroundColor: '#d7dade', padding: 5}}>No. slip 26</Text>
                    <View style={{fontSize: 10, padding: 5, border: '1px solid #999', borderTop: 0}}>
                    <Text>Embarcación: Lucy</Text>
                    
                    <View style={[stylesTable.table, {marginTop: 10}]}>
                        <View style={[stylesTable.row, stylesTable.bold, stylesTable.header]}>
                            <Text style={stylesTable.row1}>Fecha</Text>
                            <Text style={stylesTable.row2}>Concepto</Text>
                            <Text style={stylesTable.row3}>Cargo</Text>
                            <Text style={stylesTable.row4}>Abono</Text>
                        </View>
                        <View style={stylesTable.row} wrap={false}>
                            <Text style={stylesTable.row1}>
                                <Text style={stylesTable.bold}>01/04/2023</Text>
                            </Text>
                            <View style={stylesTable.row2}>
                                <Text>Renta de abril</Text>
                            </View>
                            <View style={stylesTable.row3}>
                            <Text>$6,960.00</Text>
                            </View>
                            <View style={stylesTable.row4}>
                                <Text></Text>
                            </View>
                        </View>

                        <View style={stylesTable.row} wrap={false}>
                            <Text style={stylesTable.row1}>
                                <Text style={stylesTable.bold}>01/05/2023</Text>
                            </Text>
                            <View style={stylesTable.row2}>
                                <Text>Pago renta de abril</Text>
                            </View>
                            <View style={stylesTable.row3}>
                            <Text></Text>
                            </View>
                            <View style={stylesTable.row4}>
                                <Text>$6,960.00</Text>
                            </View>
                        </View>
                    </View>
                    </View>  
                </View>
            </Page>
        </Document>
    )
}

export default ReportAccountStatus