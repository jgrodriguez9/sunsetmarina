export const getTranslateModel = (model) => {
    const objModel = {
        boat: "Embarcación",
        boatCrew: 'Tripulación de embarcación',
        boatType: 'Tipo de embarcación',
        company: 'Compañía',
        contact: 'Contacto',
        customer: 'Cliente',
        customerCategory: 'Categoría de cliente',
        logHistory: 'Bitácora',
        requestMap: 'Solicitud de mapa',
        restAuthenticationtoken: 'Solicitud de autenticación por token',
        role: 'Rol',
        user: 'Usuario',
        userRole: 'Rol de usuario'

    }
    return objModel[model] || model;
}