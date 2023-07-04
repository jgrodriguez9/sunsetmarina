export const testItemsColegiatura = [
    {
        noDocumento: 2,
        mes: 'Octubre',
        monto: '$3,612.00',
        beca: '$612.00',
        interes: '$20.00',
        totalPagar: '$3020.00',
        estatus: 'Vencida'
    },
    {
        noDocumento: 3,
        mes: 'Octubre',
        monto: '$3,612.00',
        beca: '$612.00',
        interes: '$20.00',
        totalPagar: '$3020.00',
        estatus: 'Vencida'
    },
    {
        noDocumento: 4,
        mes: 'Octubre',
        monto: '$3,612.00',
        beca: '$612.00',
        interes: '$20.00',
        totalPagar: '$3020.00',
        estatus: 'Vencida'
    },
    {
        noDocumento: 5,
        mes: 'Octubre',
        monto: '$3,612.00',
        beca: '$612.00',
        interes: '$20.00',
        totalPagar: '$3020.00',
        estatus: 'Vencida'
    }
]

export const testItemsCicloEscolar = [
    {
        mes: '12',
        fechaLimitePago: '25/10/2022',
        interes: '0',
    },
    {
        mes: '2',
        fechaLimitePago: '25/10/2022',
        interes: '0',
    },
    {
        mes: '4',
        fechaLimitePago: '25/10/2022',
        interes: '0',
    },
    {
        mes: '5',
        fechaLimitePago: '25/10/2022',
        interes: '0',
    },
]

export const testItemsConcepto = [
    {
        nombre: 'Libros',
        precio: '$300.00',
    },
    {
        nombre: 'Uniforme',
        precio: '$200.00',
    },
    {
        nombre: 'Chamarra',
        precio: '$350.00',
    },
    {
        nombre: 'Mantenimiento',
        precio: '$70.00',
    },
]

export const testItemsDocumentos = [
    {
        mes: 'Agosto',
        conceptoPago: '1007569800052',
        monto: '$4,250.00',
        fechaLimitePago: '25/10/2022',
    },
    {
        mes: 'Septiembre',
        conceptoPago: '1007569800052',
        monto: '$4,250.00',
        fechaLimitePago: '25/10/2022',
    },
    {
        mes: 'Octubre',
        conceptoPago: '1007569800052',
        monto: '$4,250.00',
        fechaLimitePago: '25/10/2022',
    },
    {
        mes: 'Julio',
        conceptoPago: '1007569800052',
        monto: '$4,250.00',
        fechaLimitePago: '25/10/2022',
    },
]

export const testItemsCobranza = [
    {
        noDocumento: 2,
        familia: '101',
        mes: 'Octubre',
        monto: '$3,612.00',
        fechaVencimiento: '25/09/2022',
        documentoSAP: '500021',
        estatus: 'Activa'
    },
    {
        noDocumento: 3,
        familia: '101',
        mes: 'Octubre',
        monto: '$3,612.00',
        fechaVencimiento: '25/09/2022',
        documentoSAP: '500021',
        estatus: 'Vencida'
    },
    {
        noDocumento: 5,
        familia: '101',
        mes: 'Octubre',
        monto: '$3,612.00',
        fechaVencimiento: '25/09/2022',
        documentoSAP: '500021',
        estatus: 'Vencida'
    },
    {
        noDocumento: 6,
        familia: '101',
        mes: 'Octubre',
        monto: '$3,612.00',
        fechaVencimiento: '25/09/2022',
        documentoSAP: '500021',
        estatus: 'Activa'
    },
    {
        noDocumento: 3,
        familia: '101',
        mes: 'Octubre',
        monto: '$3,612.00',
        fechaVencimiento: '25/09/2022',
        documentoSAP: '500021',
        estatus: 'Vencida'
    },
    {
        noDocumento: 23,
        familia: '101',
        mes: 'Octubre',
        monto: '$3,612.00',
        fechaVencimiento: '25/09/2022',
        documentoSAP: '500021',
        estatus: 'Vencida'
    },
]

export const lastTransaction = [
    {
        slip: 'Slip #42',
        nombre: 'Jhon Doe',
        fecha: '25/09/2022',
        total: 3612,        
        estado_pago: 'pagado',
    },
    {
        slip: 'Slip #46',
        nombre: 'Jhon Doe',
        fecha: '25/09/2022',
        total: 3612,        
        estado_pago: 'cancelado',
    },
    {
        slip: 'Slip #13',
        nombre: 'Jhon Doe',
        fecha: '05/06/2022',
        total: 3612,        
        estado_pago: 'pagado',
    },
    {
        slip: 'Slip #22',
        nombre: 'Jhon Doe',
        fecha: '25/09/2022',
        total: 3612,        
        estado_pago: 'pagado',
    },
    {
        slip: 'Slip #07',
        nombre: 'Jhon Doe',
        fecha: '25/09/2022',
        total: 3612,        
        estado_pago: 'pendiente',
    }
]

export const listClientAccounsStatus = [
    {
        slip: 'Slip #42',
        boat: {
            name: 'Lucy',
        },
        paymentsList: [
            {
                fecha: '01/04/023',
                concepto: 'Renta Abril',
                adeudo: 6960,
                pago: 6960,
            }
        ],
        moratorio: 0
    },
    {
        slip: 'Slip #25',
        boat: {
            name: 'Susy',
        },
        paymentsList: [
            {
                fecha: '01/06/023',
                concepto: 'Renta Junio',
                adeudo: 6960,
                pago: 0,
            }
        ],
        moratorio: 348
    }
]