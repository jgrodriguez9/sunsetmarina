import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getAmarreList = () => get(`${url.amarre}/all`)
const getAmarre = (id) => get(`${url.amarre}/${id}`)
const getAmarreListPaginado = query => get(`${url.amarre}${query}`)
const saveAmarre = (data) => post(url.amarre, data)
const updateAmarre = (id, data) => put(`${url.amarre}/${id}`, data)
const deleteAmarre = (id) => del(`${url.amarre}/${id}`)

export {
     getAmarreList,
     getAmarre,
     getAmarreListPaginado,
     saveAmarre,
     updateAmarre,
     deleteAmarre
}