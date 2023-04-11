import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getDocumentTypeList = () => get(`${url.documentType}/all`)
const getDocumentType = (id) => get(`${url.documentType}/${id}`)
const getDocumentTypeListPaginado = query => get(`${url.documentType}${query}`)
const saveDocumentType = (data) => post(url.documentType, data)
const updateDocumentType = (id, data) => put(`${url.documentType}/${id}`, data)
const deleteDocumentType = (id) => del(`${url.documentType}/${id}`)

export {
     getDocumentTypeList,
     getDocumentType,
     getDocumentTypeListPaginado,
     saveDocumentType,
     updateDocumentType,
     deleteDocumentType
}