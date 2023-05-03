import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getSlipList= () => get(`${url.slip}/all`)
const getSlip= (id) => get(`${url.slip}/${id}`)
const getSlipListPaginado = query => get(`${url.slip}${query}`)
const saveSlip = (data) => post(url.slip, data)
const updateSlip = (id, data) => put(`${url.slip}/${id}`, data)
const deleteSlip = (id) => del(`${url.slip}/${id}`)

export {
     getSlipList,
     getSlip,
     getSlipListPaginado,
     saveSlip,
     updateSlip,
     deleteSlip
}