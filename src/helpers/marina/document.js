import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getDocument= (id) => get(`${url.document}/${id}`)
const getDocumentListPaginado = query => get(`${url.document}${query}`)
const saveDocument = (data, config) => post(url.document, data, config)
const updateDocument = (id, data, config) => put(`${url.document}/${id}`, data, config)
const deleteDocument = (id) => del(`${url.document}/${id}`)
const getDocumentByClient = id => get(`${url.document}/findAllByCustomer/${id}`)

export {
     getDocument,
     getDocumentListPaginado,
     saveDocument,
     updateDocument,
     deleteDocument,
     getDocumentByClient
}