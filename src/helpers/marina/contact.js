import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getContact= (id) => get(`${url.contact}/${id}`)
const getContactListPaginado = query => get(`${url.contact}${query}`)
const saveContact = (data) => post(url.contact, data)
const updateContact = (id, data) => put(`${url.contact}/${id}`, data)
const deleteContact = (id) => del(`${url.contact}/${id}`)
const getContactByClient = id => get(`${url.contact}/findAllByCustomer/${id}`)

export {
     getContact,
     getContactListPaginado,
     saveContact,
     updateContact,
     deleteContact,
     getContactByClient
}