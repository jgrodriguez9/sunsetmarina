import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getClientCategoryList = () => get(`${url.clientCategory}/all`)
const getClientCategory = (id) => get(`${url.clientCategory}/${id}`)
const getClientCategoryListPaginado = query => get(`${url.clientCategory}${query}`)
const saveClientCategory = (data) => post(url.clientCategory, data)
const updateClientCategory = (id, data) => put(`${url.clientCategory}/${id}`, data)
const deleteClientCategory = (id) => del(`${url.clientCategory}/${id}`)

export {
     getClientCategoryList,
     getClientCategory,
     getClientCategoryListPaginado,
     saveClientCategory,
     updateClientCategory,
     deleteClientCategory
}