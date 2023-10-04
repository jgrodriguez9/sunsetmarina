import { get, post } from '../api';
import * as url from '../url';

//get listado paginado
const getCashRegisterControl = (id) => get(`${url.cashRegisterControl}/${id}`);
const getCashRegisterControlListPaginado = (query) =>
	get(`${url.cashRegisterControl}${query}`);
const openCashRegisterControl = (data) => post(url.cashRegisterControl, data);
const closeCashRegisterControl = (id) =>
	post(`${url.cashRegisterControl}/close/${id}`);
const approveCloseCashRegisterControl = (id) =>
	post(`${url.cashRegisterControl}/approve/${id}`);
const getCashMovement = (id) =>
	get(`${url.cashRegisterControl}/listMovement/${id}`);
const getCashSummary = (id) =>
	get(`${url.cashRegisterControl}/listSummary/${id}`);

export {
	getCashRegisterControl,
	getCashRegisterControlListPaginado,
	openCashRegisterControl,
	approveCloseCashRegisterControl,
	closeCashRegisterControl,
	getCashMovement,
	getCashSummary,
};
