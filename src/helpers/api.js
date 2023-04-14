import axios from "axios";

//pass new generated access token here
const token = sessionStorage.getItem("sunsetadmiralauth") ? `${JSON.parse(sessionStorage.getItem("sunsetadmiralauth")).access_token}` : "";
//apply base url for axios
const API_URL = 'https://apiadmiral.plan-nex.com/api';

const axiosApi = axios.create({
    baseURL: API_URL,
});

axiosApi.defaults.headers.common["X-Auth-Token"] = token;
axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data"

axiosApi.interceptors.response.use(
    response => response,
    error => {
        if(error.response === undefined){
            window.sessionStorage.removeItem('sunsetadmiralauth');
            window.location.reload();
            //return Promise.reject(error);
        }else if(error.response.status===403 || error.response.status===401){
            window.sessionStorage.removeItem('sunsetadmiralauth');
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