import axios from 'axios';
import { store } from '../redux/store';
import { addMessage } from '../redux/messageSlice';
import { redirect } from 'react-router-dom';

const { dispatch } = store;

//pass new generated access token here
const token = sessionStorage.getItem('sunsetadmiralauth')
	? `${JSON.parse(sessionStorage.getItem('sunsetadmiralauth')).access_token}`
	: '';
//apply base url for axios
//test:
//const API_URL = 'https://apiadmiral.sunset.com.mx/api';
//dirceto alain machine
const API_URL =
	'https://1c6c-2806-2f0-8560-d1eb-50be-9c5f-64a7-62d6.ngrok-free.app/api';
//prod
//const API_URL = 'https://apiadmiral-prod.sunset.com.mx/api';

const axiosApi = axios.create({
	baseURL: API_URL,
});

axiosApi.defaults.headers.common['X-Auth-Token'] = token;
axiosApi.defaults.headers.common['Content-Type'] = 'multipart/form-data';

axiosApi.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.code === 'ERR_NETWORK') {
			dispatch(
				addMessage({
					type: 'error',
					message: 'Ups! no tiene conexión a internet',
				})
			);
			return;
		} else if (
			error.response.status === 403 ||
			error.response.status === 401
		) {
			redirect('/forbiden');
			//window.sessionStorage.removeItem('sunsetadmiralauth');
			//window.location.reload();
			return Promise.reject(error);
		} else {
			return Promise.reject(error);
		}
	}
);

export async function get(url, config = {}) {
	return await axiosApi
		.get(url, { ...config })
		.then((response) => response.data);
}

export async function post(url, data, config = {}) {
	return axiosApi
		.post(url, { ...data }, { ...config })
		.then((response) => response.data);
}

export async function put(url, data, config = {}) {
	return axiosApi
		.put(url, { ...data }, { ...config })
		.then((response) => response.data);
}

export async function del(url, config = {}) {
	return await axiosApi
		.delete(url, { ...config })
		.then((response) => response.data);
}

export async function postFile(url, data, config = {}) {
	return axiosApi
		.post(
			url,
			{ ...data },
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		.then((response) => response.data);
}
