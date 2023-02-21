import { get } from "../api";
import * as url from "../url";

//get listado paginado
const getBoadTypeListPaginado = query => get(`${url.boatType}${query}`)

// //get case
// const getUser = id => get(`${url.USER}/${id}`)

// //save stage
// const postUser = data => post(url.USER, data)

// //update stage
// const putUser = (id, data) => put(`${url.USER}/${id}`, data)



export {
     getBoadTypeListPaginado,
//     getUser,
//     postUser,
//     putUser,
}