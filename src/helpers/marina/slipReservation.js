import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getSlipReservationByClient = (id, query) => get(`${url.slipReservation}/findAllByCustomer/${id}${query}`)
const getSlipReservationPriceAndValid = query => post(`${url.slipReservation}/calculatePrice/${query}`)
// const getBoatList= () => get(`${url.boat}/all`)
// const getBoat= (id) => get(`${url.boat}/${id}`)
// const getBoatListPaginado = query => get(`${url.boat}${query}`)
const saveReservation = (data) => post(url.slipReservation, data)
const updateReservation = (id, data) => put(`${url.slipReservation}/${id}`, data)
// const deleteBoat = (id) => del(`${url.boat}/${id}`)


export {
     getSlipReservationByClient,
     getSlipReservationPriceAndValid,
     saveReservation,
     updateReservation
     // getBoatList,
     // getBoat,
     // getBoatListPaginado,
     // deleteBoat     
}