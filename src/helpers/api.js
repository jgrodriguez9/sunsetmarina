import axios from "axios";

//pass new generated access token here
const token = localStorage.getItem("sunsetadmiralauth") ? `Bearer ${JSON.parse(localStorage.getItem("sunsetadmiralauth")).token}` : "";
//apply base url for axios
const API_URL = 'https://33ac-2806-2f0-8000-6b4c-e971-5613-1838-7867.ngrok.io/api';

const axiosApi = axios.create({
    baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = token;
axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data"

axiosApi.interceptors.response.use(
    response => response,
    error => {
        console.log(error)
        if(error.response === undefined){
            alert("Seems there are some issue with his internet, check your conextion please")
        }else if(error.response.status===403){
            window.localStorage.removeItem('sunsetadmiralauth');
            window.location.reload();
        }else{
            return Promise.reject(error);
        }        
    }
);

export async function get(url, config = {}) {
    return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url, data, config = {}) {
    return axiosApi
      .post(url, { ...data }, { ...config })
      .then(response => response.data);
}

export async function put(url, data, config = {}) {
    return axiosApi
      .put(url, { ...data }, { ...config })
      .then(response => response.data);
}

export async function del(url, config = {}) {
    return await axiosApi
      .delete(url, { ...config })
      .then(response => response.data);
}

export async function postFile(url, data, config = {}) {
    console.log('entro')
    return axiosApi
      .post(url, { ...data }, { 
            headers: {
                "Content-Type": "multipart/form-data"
            }
       })
      .then(response => response.data);
}