import { get } from "../api";
import * as url from "../url";

const getMyNotifcations = () => get(`${url.mynotification}`)

export {
    getMyNotifcations,
}