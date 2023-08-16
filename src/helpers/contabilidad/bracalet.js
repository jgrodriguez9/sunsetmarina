import { get, post } from "../api";
import * as url from "../url";

//get listado paginado
const getBracalet = (id) => get(`${url.bracalet}/${id}`);
const getBracaletListPaginado = (query) => get(`${url.bracalet}${query}`);
const saveBracalet = (data) => post(url.bracalet, data);
const saveBracaletLote = (data) => post(`${url.bracalet}/saveLot`, data);
const deleteBracaletLote = (data) => post(`${url.bracalet}/deleteLot`, data);

export {
  getBracalet,
  getBracaletListPaginado,
  saveBracalet,
  saveBracaletLote,
  deleteBracaletLote,
};
