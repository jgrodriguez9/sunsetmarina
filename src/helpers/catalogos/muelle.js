import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getMuelle = (id) => get(`${url.muelle}/${id}`)
const getMuelleListPaginado = query => get(`${url.muelle}${query}`)
const saveMuelle = (data) => post(url.muelle, data)
const updateMuelle = (id, data) => put(`${url.muelle}/${id}`, data)
const deleteMuelle = (id) => del(`${url.muelle}/${id}`)

export {
     getMuelle,
     getMuelleListPaginado,
     saveMuelle,
     updateMuelle,
     deleteMuelle
}