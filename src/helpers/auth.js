import { get, post } from './api';
import { postSign } from './apiSign';
import * as url from './url';

// Login Method
const postJwtLogin = (data) => post(url.POST_LOGIN, data);

//get user logued
const getUserLogued = () => get(url.GET_USER_LOGUED);

const getUserLoguedInfo = () => get(`${url.GET_USER_LOGUED}/info`);

//loginf sign para soportec
const postSignInSoportec = (data) => postSign(url.POST_LOGIN, data);

export { postJwtLogin, getUserLogued, postSignInSoportec, getUserLoguedInfo };
