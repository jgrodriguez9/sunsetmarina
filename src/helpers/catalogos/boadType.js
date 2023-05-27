import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getBoadTypeAll = () => get(`${url.boatType}/all`)
const getBoadType = (id) => get(`${url.boatType}/${id}`)
const getBoadTypeListPaginado = query => get(`${url.boatType}${query}`)
const saveBoadType = (data) => post(url.boatType, data)
const updateBoadType = (id, data) => put(`${url.boatType}/${id}`, data)
const deleteBoadType = (id) => del(`${url.boatType}/${id}`)

export {
     getBoadTypeAll,
     getBoadType,
     getBoadTypeListPaginado,
     saveBoadType,
     updateBoadType,
     deleteBoadType
}