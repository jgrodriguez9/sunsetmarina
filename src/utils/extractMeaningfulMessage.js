const extractMeaningfulMessage = (error, message) => {
    if(!error) return message;
    let returnMessage = message;
    console.log(error)
    if(error.response === undefined){
        returnMessage = "Por favor revisar su conexión a internet"
    }else if(error.response?.data){
        returnMessage = error.response?.data?.message;
    }else{
        switch(error.response.status){
            case 401:
                returnMessage = "No tiene autorización";
                break;
            case 500:
                returnMessage = "Error interno del servidor. Contacte con el administrador";
                break;
            default: 
                break;
        }
    }
    
    return returnMessage;
}

export default extractMeaningfulMessage