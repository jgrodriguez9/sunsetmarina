import { del, get, post, put } from '../api';
import * as url from '../url';

//get listado paginado
const getCashRegister = (id) => get(`${url.cashRegister}/${id}`);
const getCashRegisterListPaginado = (query) =>
	get(`${url.cashRegister}${query}`);
const saveCashRegister = (data) => post(url.cashRegister, data);
const updateCashRegister = (id, data) => put(`${url.cashRegister}/${id}`, data);
const deleteCashRegister = (id) => del(`${url.cashRegister}/${id}`);

export {
	getCashRegister,
	getCashRegisterListPaginado,
	saveCashRegister,
	updateCashRegister,
	deleteCashRegister,
};
