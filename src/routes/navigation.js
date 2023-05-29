import { existsRole } from "../utils/roles";

export const navigations = [
    {
        id: 'inicio',
        label: 'Inicio',
        classIcon: 'bx bx-home-circle me-2',
        route: '/dashboard',
        show: existsRole(sessionStorage.getItem('roles'), null),
        items: []
    },
    {
        id: 'seguridad',
        label: 'Seguridad',
        classIcon: 'fas fa-shield-alt me-2',
        route: '/#',
        show: existsRole(sessionStorage.getItem('roles'), ['ROLE_ADMIN', 'ROLE_COMPANY_ADMIN']),
        items: [
            {
                id: 'logs',
                label: 'Bitácora',
                route: '/logs',
                classIcon: null,
            },
        ]
    },
    {
        id: 'catalogo',
        label: 'Catálogo',
        classIcon: 'fas fa-th me-2',
        route: '/#',
        show: existsRole(sessionStorage.getItem('roles'), ['ROLE_ADMIN', 'ROLE_COMPANY_ADMIN']),
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
            }
        ]
    },
    {
        id: 'marina',
        label: 'Marina',
        classIcon: 'fas fa-ship me-2',
        route: '/#',
        show: existsRole(sessionStorage.getItem('roles'), ['ROLE_ADMIN', 'ROLE_COMPANY_ADMIN']),
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
            }
        ]
    }
]