import axios from 'axios';
import { store } from '../redux/store';
import { addMessage } from '../redux/messageSlice';
import { redirect } from 'react-router-dom';

const { dispatch } = store;
const API_URL = 'https://apiadmiral.sunset.com.mx/sign';

const axiosApi = axios.create({
	baseURL: API_URL,
});

axiosApi.defaults.headers.common['Content-Type'] = 'application/json';

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
			return Promise.reject(error);
		} else {
			return Promise.reject(error);
		}
	}
);

export async function postSign(url, data, config = {}) {
	return axiosApi
		.post(url, { ...data }, { ...config })
		.then((response) => response.data);
}
