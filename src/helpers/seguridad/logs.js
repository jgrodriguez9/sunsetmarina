import { get } from "../api";
import * as url from "../url";

//get listado paginado
const getLogsListPaginado = query => get(`${url.logs}${query}`)

export {
     getLogsListPaginado
}