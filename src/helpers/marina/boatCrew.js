import { del, get, post, put } from "../api";
import * as url from "../url";

//get listado paginado
const getBoatCrewList= () => get(`${url.boatCrew}/all`)
const getBoatCrew= (id) => get(`${url.boatCrew}/${id}`)
const getBoatCrewListPaginado = query => get(`${url.boatCrew}${query}`)
const saveBoatCrew = (data) => post(url.boatCrew, data)
const updateBoatCrew = (id, data) => put(`${url.boatCrew}/${id}`, data)
const deleteBoatCrew = (id) => del(`${url.boatCrew}/${id}`)
const getBoatCrewByBoat = id => get(`${url.boatCrew}/findAllByBoat/${id}`)

export {
    getBoatCrewList,
     getBoatCrew,
     getBoatCrewListPaginado,
     saveBoatCrew,
     updateBoatCrew,
     deleteBoatCrew,
     getBoatCrewByBoat
}