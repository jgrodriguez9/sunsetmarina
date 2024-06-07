import {
	ROLE_ADMINISTRACION,
	ROLE_CAJA,
	ROLE_COMPANIA,
	ROLE_CONTABILIDAD,
	ROLE_MUELLE,
	ROLE_OPERACIONES,
} from '../constants/roles';
import { existsRole } from '../utils/roles';

const roles = JSON.parse(sessionStorage.getItem('sunsetadmiralauth'))?.roles;
export const navigations = [
	{
		id: 'inicio',
		label: 'Inicio',
		classIcon: 'bx bx-home-circle me-2',
		route: '/dashboard',
		show: existsRole(roles, [
			ROLE_ADMINISTRACION,
			ROLE_COMPANIA,
			ROLE_OPERACIONES,
			ROLE_CONTABILIDAD,
			ROLE_CAJA,
			ROLE_MUELLE,
		]),
		items: [],
	},
	{
		id: 'seguridad',
		label: 'Seguridad',
		classIcon: 'fas fa-shield-alt me-2',
		route: '/#',
		show: existsRole(roles, [
			ROLE_ADMINISTRACION,
			ROLE_COMPANIA,
			ROLE_OPERACIONES,
			ROLE_CONTABILIDAD,
		]),
		items: [
			{
				id: 'logs',
				label: 'Bitácora',
				route: '/logs',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'users',
				label: 'Usuarios',
				route: '/users',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION]),
			},
		],
	},
	{
		id: 'catalogo',
		label: 'Catálogo',
		classIcon: 'fas fa-th me-2',
		route: '/#',
		show: existsRole(roles, [
			ROLE_ADMINISTRACION,
			ROLE_COMPANIA,
			ROLE_CONTABILIDAD,
		]),
		items: [
			{
				id: 'tipoDeEmbarcacion',
				label: 'Tipo de embarcación',
				route: '/boadtype',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION, ROLE_COMPANIA]),
			},
			{
				id: 'compania',
				label: 'Compañía',
				route: '/company',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'muelle',
				label: 'Muelle',
				route: '/pier',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION, ROLE_COMPANIA]),
			},
			{
				id: 'amarre',
				label: 'Tipo de Slip',
				route: '/sliptype',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION, ROLE_COMPANIA]),
			},
			{
				id: 'tipoDeDocumento',
				label: 'Tipo de documento',
				route: '/documenttype',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION, ROLE_COMPANIA]),
			},
			{
				id: 'categoriaCliente',
				label: 'Categoría de cliente',
				route: '/clientcategory',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION, ROLE_COMPANIA]),
			},
			{
				id: 'conceptoCaja',
				label: 'Concepto de caja',
				route: '/cashconcept',
				classIcon: null,
				show: existsRole(roles, [ROLE_ADMINISTRACION, ROLE_COMPANIA]),
			},
			{
				id: 'currencyExchange',
				label: 'Moneda',
				route: '/currencyexchange',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
				]),
			},
		],
	},
	{
		id: 'marina',
		label: 'Marina',
		classIcon: 'fas fa-ship me-2',
		route: '/#',
		show: existsRole(roles, [
			ROLE_ADMINISTRACION,
			ROLE_COMPANIA,
			ROLE_OPERACIONES,
			ROLE_CONTABILIDAD,
		]),
		items: [
			{
				id: 'dock',
				label: 'Mapa de Muelle',
				route: '/map',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'slip',
				label: 'Slip',
				route: '/slip',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'client',
				label: 'Cliente',
				route: '/client',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'boat',
				label: 'Barco',
				route: '/boat',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'boatCrew',
				label: 'Tripulación',
				route: '/boatcrew',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'reservation',
				label: 'Reservas',
				route: '/reservation',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
		],
	},
	{
		id: 'contabilidad',
		label: 'Contabilidad',
		classIcon: 'bx bx-line-chart me-2',
		route: '/#',
		show: existsRole(roles, [
			ROLE_ADMINISTRACION,
			ROLE_COMPANIA,
			ROLE_OPERACIONES,
			ROLE_CONTABILIDAD,
		]),
		items: [
			{
				id: 'estadoCuenta',
				label: 'Estado de cuenta',
				route: '/accountstatus',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_OPERACIONES,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'cobranza',
				label: 'Reporte de contratos',
				route: '/billreport',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'ingresos',
				label: 'Reporte de ingresos',
				route: '/incomereport',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'inpuestoMuelle',
				label: 'Cobranza impuesto de muelle',
				route: '/docktaxbill',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'brazaletes',
				label: 'Brazaletes',
				route: '/bracelet',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
				]),
			},
		],
	},
	{
		id: 'caja',
		label: 'Caja',
		classIcon: 'fas fa-cash-register me-2',
		route: '/#',
		show: existsRole(roles, [
			ROLE_ADMINISTRACION,
			ROLE_COMPANIA,
			ROLE_CONTABILIDAD,
			ROLE_CAJA,
		]),
		items: [
			{
				id: 'boardingPass',
				label: 'Pase de salida',
				route: '/boardingpass',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
					ROLE_CAJA,
				]),
			},
			{
				id: 'cashRegister',
				label: 'Registro de cajas',
				route: '/cashregister',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
				]),
			},
			{
				id: 'cashRegisterControl',
				label: 'Control de cajas',
				route: '/cashregistercontrol',
				classIcon: null,
				show: existsRole(roles, [
					ROLE_ADMINISTRACION,
					ROLE_COMPANIA,
					ROLE_CONTABILIDAD,
					ROLE_CAJA,
				]),
			},
		],
	},
];
