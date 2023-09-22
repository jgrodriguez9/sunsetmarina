import { del, get, post, put } from '../api';
import * as url from '../url';

//get listado paginado
const getCashConcept = (id) => get(`${url.cashConcept}/${id}`);
const getCashConceptListPaginado = (query) => get(`${url.cashConcept}${query}`);
const saveCashConcept = (data) => post(url.cashConcept, data);
const updateCashConcept = (id, data) => put(`${url.cashConcept}/${id}`, data);
const deleteCashConcept = (id) => del(`${url.cashConcept}/${id}`);

export {
	getCashConcept,
	getCashConceptListPaginado,
	saveCashConcept,
	updateCashConcept,
	deleteCashConcept,
};
