const translateUtils = (texto) => {
  const obj = {
    AVAILABLE: "Disponible",
    RESERVED: "Reservado",
    BLOCKED: "Bloqueado",
    PENDING: "Pendiente",
    PAYED: "Pagado",
    CONFIRMED: "Confirmada",
    CANCELLED: "Cancelada",
  };

  return obj[texto] || texto;
};

export default translateUtils;
