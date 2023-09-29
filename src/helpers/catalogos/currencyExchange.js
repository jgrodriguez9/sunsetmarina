import { get, post, put } from '../api';
import * as url from '../url';

//get listado paginado
const getCurrencyExchange = (id) => get(`${url.currency}/${id}`);
const getCurrencyExchangeListPaginado = (query) =>
	get(`${url.currency}${query}`);
const saveCurrencyExchange = (data) => post(url.currency, data);
const updateCurrencyExchange = (id, data) => put(`${url.currency}/${id}`, data);

export {
	getCurrencyExchange,
	getCurrencyExchangeListPaginado,
	saveCurrencyExchange,
	updateCurrencyExchange,
};
