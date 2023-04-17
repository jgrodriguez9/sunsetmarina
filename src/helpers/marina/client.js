import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getClientList = () => get(`${url.client}/all`)
const getClient = (id) => get(`${url.client}/${id}`)
const getClientListPaginado = query => get(`${url.client}${query}`)
const saveClient = (data) => post(url.client, data)
const updateClient = (id, data) => put(`${url.client}/${id}`, data)
const deleteClient = (id) => del(`${url.client}/${id}`)

export {
     getClientList,
     getClient,
     getClientListPaginado,
     saveClient,
     updateClient,
     deleteClient
}