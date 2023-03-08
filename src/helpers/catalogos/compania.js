import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getCompania = (id) => get(`${url.compania}/${id}`)
const getCompaniaListPaginado = query => get(`${url.compania}${query}`)
const saveCompania = (data) => post(url.compania, data)
const updateCompania = (id, data) => put(`${url.compania}/${id}`, data)
const deleteCompania = (id) => del(`${url.compania}/${id}`)

export {
     getCompania,
     getCompaniaListPaginado,
     saveCompania,
     updateCompania,
     deleteCompania
}