import { existsRole } from '../utils/roles';

export const navigations = [
	{
		id: 'inicio',
		label: 'Inicio',
		classIcon: 'bx bx-home-circle me-2',
		route: '/dashboard',
		show: existsRole(sessionStorage.getItem('roles'), [
			'ROLE_Administracion',
			'ROLE_COMPANY_ADMIN',
		]),
		items: [],
	},
	{
		id: 'seguridad',
		label: 'Seguridad',
		classIcon: 'fas fa-shield-alt me-2',
		route: '/#',
		show: existsRole(sessionStorage.getItem('roles'), [
			'ROLE_Administracion',
			'ROLE_COMPANY_ADMIN',
		]),
		items: [
			{
				id: 'logs',
				label: 'Bitácora',
				route: '/logs',
				classIcon: null,
			},
			{
				id: 'users',
				label: 'Usuarios',
				route: '/users',
				classIcon: null,
			},
		],
	},
	{
		id: 'catalogo',
		label: 'Catálogo',
		classIcon: 'fas fa-th me-2',
		route: '/#',
		show: existsRole(sessionStorage.getItem('roles'), [
			'ROLE_Administracion',
			'ROLE_COMPANY_ADMIN',
		]),
		items: [
			{
				id: 'tipoDeEmbarcacion',
				label: 'Tipo de embarcación',
				route: '/boadtype',
				classIcon: null,
			},
			{
				id: 'compania',
				label: 'Compañía',
				route: '/company',
				classIcon: null,
			},
			{
				id: 'muelle',
				label: 'Muelle',
				route: '/pier',
				classIcon: null,
			},
			{
				id: 'amarre',
				label: 'Tipo de Slip',
				route: '/sliptype',
				classIcon: null,
			},
			{
				id: 'tipoDeDocumento',
				label: 'Tipo de documento',
				route: '/documenttype',
				classIcon: null,
			},
			{
				id: 'categoriaCliente',
				label: 'Categoría de cliente',
				route: '/clientcategory',
				classIcon: null,
			},
			{
				id: 'conceptoCaja',
				label: 'Concepto de caja',
				route: '/cashconcept',
				classIcon: null,
			},
			{
				id: 'currencyExchange',
				label: 'Moneda',
				route: '/currencyexchange',
				classIcon: null,
			},
		],
	},
	{
		id: 'marina',
		label: 'Marina',
		classIcon: 'fas fa-ship me-2',
		route: '/#',
		show: existsRole(sessionStorage.getItem('roles'), [
			'ROLE_Administracion',
			'ROLE_COMPANY_ADMIN',
		]),
		items: [
			{
				id: 'dock',
				label: 'Mapa de Muelle',
				route: '/map',
				classIcon: null,
			},
			{
				id: 'slip',
				label: 'Slip',
				route: '/slip',
				classIcon: null,
			},
			{
				id: 'client',
				label: 'Cliente',
				route: '/client',
				classIcon: null,
			},
			{
				id: 'boat',
				label: 'Barco',
				route: '/boat',
				classIcon: null,
			},
			{
				id: 'boatCrew',
				label: 'Tripulación',
				route: '/boatcrew',
				classIcon: null,
			},
			{
				id: 'reservation',
				label: 'Reservas',
				route: '/reservation',
				classIcon: null,
			},
		],
	},
	{
		id: 'contabilidad',
		label: 'Contabilidad',
		classIcon: 'bx bx-line-chart me-2',
		route: '/#',
		show: existsRole(sessionStorage.getItem('roles'), [
			'ROLE_Administracion',
			'ROLE_COMPANY_ADMIN',
		]),
		items: [
			{
				id: 'estadoCuenta',
				label: 'Estado de cuenta',
				route: '/accountstatus',
				classIcon: null,
			},
			{
				id: 'cobranza',
				label: 'Reporte de cobranza',
				route: '/billreport',
				classIcon: null,
			},
			{
				id: 'ingresos',
				label: 'Reporte de ingresos',
				route: '/incomereport',
				classIcon: null,
			},
			{
				id: 'inpuestoMuelle',
				label: 'Cobranza impuesto de muelle',
				route: '/docktaxbill',
				classIcon: null,
			},
			{
				id: 'brazaletes',
				label: 'Brazaletes',
				route: '/bracelet',
				classIcon: null,
			},
		],
	},
	{
		id: 'caja',
		label: 'Caja',
		classIcon: 'fas fa-cash-register me-2',
		route: '/#',
		show: existsRole(sessionStorage.getItem('roles'), [
			'ROLE_Administracion',
			'ROLE_COMPANY_ADMIN',
		]),
		items: [
			{
				id: 'boardingPass',
				label: 'Pase de salida',
				route: '/boardingpass',
				classIcon: null,
			},
			{
				id: 'cashRegister',
				label: 'Registro de cajas',
				route: '/cashregister',
				classIcon: null,
			},
			{
				id: 'cashRegisterControl',
				label: 'Control de cajas',
				route: '/cashregistercontrol',
				classIcon: null,
			},
		],
	},
];
