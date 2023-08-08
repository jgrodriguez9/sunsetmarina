export const getTranslateAction = (action) => {
    const objAction = {
        UPDATE: "Actualizado",
        CREATE: 'Creado',
        DELETE: 'Eliminado',
        PAYED:'Pagado'
    }

    return objAction[action] || action;
}