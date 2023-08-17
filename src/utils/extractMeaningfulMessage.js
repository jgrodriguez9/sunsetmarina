const extractMeaningfulMessage = (error, message) => {
	if (!error) return message;
	let returnMessage = message;
	if (error.response) {
		switch (error.response.status) {
			case 500:
				returnMessage =
					'Error interno del servidor. Contacte con el administrador';
				break;
			case 401:
				returnMessage = 'No tiene autorización';
				break;
			case 404:
				returnMessage =
					'No se encuentra el recurso buscado. Contacte con el administrador';
				break;
			case 409:
				returnMessage =
					'No se puede ejecutar la petición para esta selección, puede que ya exista una o este recurso este siendo usado por otra entidad';
				break;
			case 422:
				returnMessage =
					'No se puede procesar la petición, puede que este enviando la información incorrectamente';
				break;
			default:
				if (error.response === undefined) {
					returnMessage = 'Por favor revisar su conexión a internet';
				} else if (error.response?.data) {
					returnMessage = error.response?.data?.message;
				}
				break;
		}
	}
	return returnMessage;
};

export default extractMeaningfulMessage;
