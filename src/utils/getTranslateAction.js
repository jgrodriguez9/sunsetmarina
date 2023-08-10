export const getTranslateAction = (action) => {
  const objAction = {
    UPDATE: "Actualizado",
    CREATE: "Creado",
    DELETE: "Eliminado",
  };

  return objAction[action] || action;
};
