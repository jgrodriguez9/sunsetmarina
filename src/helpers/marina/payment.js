import { get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getPaymentList= () => get(`${url.payment}/all`)
const getPaymentByClient = (id, query) => get(`${url.payment}/findAllByCustomer/${id}${query}`)
const getPayment= (id) => get(`${url.payment}/${id}`)
const getPaymentListPaginado = query => get(`${url.payment}${query}`)
const savePayment = (data) => post(url.payment, data)
const updatePayment = (id, data) => put(`${url.payment}/${id}`, data)


export {
     getPaymentList,
     getPayment,
     getPaymentListPaginado,
     savePayment,
     updatePayment,
     getPaymentByClient
}