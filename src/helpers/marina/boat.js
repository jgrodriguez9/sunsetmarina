import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getBoatList= () => get(`${url.boat}/all`)
const getBoat= (id) => get(`${url.boat}/${id}`)
const getBoatListPaginado = query => get(`${url.boat}${query}`)
const saveBoat = (data) => post(url.boat, data)
const updateBoat = (id, data) => put(`${url.boat}/${id}`, data)
const deleteBoat = (id) => del(`${url.boat}/${id}`)

export {
     getBoatList,
     getBoat,
     getBoatListPaginado,
     saveBoat,
     updateBoat,
     deleteBoat
}