import { get, put } from '../api';
import * as url from '../url';

//get listado paginado
const getUserList = () => get(`${url.user}/listAllUserExcludeCurrentLogin`);
const updateUser = (id, data) => put(`${url.user}/${id}`, data);

export { getUserList, updateUser };
