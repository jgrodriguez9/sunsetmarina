import { del, get, post, put } from '../api';
import * as url from '../url';

//get listado paginado
const getClientList = () => get(`${url.client}/all`);
const getClient = (id) => get(`${url.client}/${id}`);
const getClientListPaginado = (query) => get(`${url.client}${query}`);
const saveClient = (data, config) => post(url.client, data, config);
const updateClient = (id, data, config) =>
	put(`${url.client}/${id}`, data, config);
const deleteClient = (id) => del(`${url.client}/${id}`);
const getClientShowAllData = (id) => get(`${url.client}/getAllInfo/${id}`);

export {
	getClientList,
	getClient,
	getClientListPaginado,
	saveClient,
	updateClient,
	deleteClient,
	getClientShowAllData,
};
