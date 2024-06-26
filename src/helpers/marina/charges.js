import { get, post } from '../api';
import * as url from '../url';

//get listado paginado
const getChargeList = () => get(`${url.charge}/all`);
const getChargeByReservation = (id) =>
	get(`${url.charge}/findAllByReservation/${id}`);
const getChargeByClient = (id) => get(`${url.charge}/findAllByCustomer/${id}`);
const getCharge = (id) => get(`${url.charge}/${id}`);
const getChargeListPaginado = (query) => get(`${url.charge}${query}`);
const getTotalChargeUpdated = (data) =>
	post(`${url.payment}/calculatePaymentTotalAmount`, data);

export {
	getChargeList,
	getCharge,
	getChargeListPaginado,
	getChargeByReservation,
	getChargeByClient,
	getTotalChargeUpdated,
};
