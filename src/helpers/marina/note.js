import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getNote= (id) => get(`${url.note}/${id}`)
const getNoteListPaginado = query => get(`${url.note}${query}`)
const saveNote = (data) => post(url.note, data)
const updateNote = (id, data) => put(`${url.note}/${id}`, data)
const deleteNote = (id) => del(`${url.note}/${id}`)
const getNoteByClient = id => get(`${url.note}/findAllByCustomer/${id}`)

export {
     getNote,
     getNoteListPaginado,
     saveNote,
     updateNote,
     deleteNote,
     getNoteByClient
}