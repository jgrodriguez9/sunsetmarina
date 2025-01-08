import { del, get, post, put } from '../api';
import * as url from '../url';

//get listado paginado
const getSlipReservationByClient = (id, query) =>
	get(`${url.slipReservation}/findAllByCustomer/${id}${query}`);
const getSlipReservationPriceAndValid = (query) =>
	post(`${url.slipReservation}/calculatePrice/${query}`);
const getReservation = (id) => get(`${url.slipReservation}/${id}`);
const getReservationListPaginado = (query) =>
	get(`${url.slipReservation}${query}`);
const saveReservation = (data) => post(url.slipReservation, data);
const updateReservation = (id, data) =>
	put(`${url.slipReservation}/${id}`, data);
const deleteReservation = (id) => del(`${url.slipReservation}/${id}`);
const cancelReservation = (query) =>
	post(`${url.slipReservation}/cancelReservationWithDeb?${query}`, {});
const cancelReservationUser = (id) =>
	post(`${url.slipReservation}/cancelReservation/${id}`, {});
const swapSlip = (data) => post(`${url.slipReservation}/swapLocation`, data);

export {
	getSlipReservationByClient,
	getSlipReservationPriceAndValid,
	saveReservation,
	updateReservation,
	getReservationListPaginado,
	deleteReservation,
	getReservation,
	cancelReservation,
	cancelReservationUser,
	swapSlip,
};
