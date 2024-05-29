import { del, get, post } from '../api';
import * as url from '../url';

const getBoardingPassListPaginado = (query) =>
	get(`${url.boardingPass}${query}`);
const saveBoardingPass = (data) => post(url.boardingPass, data);
const deleteBoardingPass = (id) => del(`${url.boardingPass}/${id}`);
const getBoardingPassPrice = (id, query) =>
	get(`${url.boardingPass}/getPriceByPax/${id}${query}`);
const hasCashRegisterAssign = () =>
	get(`${url.boardingPass}/canCreateBoardingPass`);

export {
	getBoardingPassListPaginado,
	saveBoardingPass,
	deleteBoardingPass,
	getBoardingPassPrice,
	hasCashRegisterAssign,
};
