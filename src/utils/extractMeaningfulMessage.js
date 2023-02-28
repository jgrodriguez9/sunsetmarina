const extractMeaningfulMessage = (error, message) => {
    if(!error) return message;
    let returnMessage = message;
    console.log(error)
    if(error.response?.data?.message){
        returnMessage = error.response?.data?.message;
    }
    return returnMessage;
}

export default extractMeaningfulMessage