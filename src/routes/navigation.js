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
                label: 'Amarre',
                route: '/sliptype',
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
                label: 'Muelle',
                route: '/muelle',
                classIcon: null,
            },
            {
                id: 'client',
                label: 'Cliente',
                route: '/client',
                classIcon: null,
            }
        ]
    }
]