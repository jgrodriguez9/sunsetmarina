import { get, put } from "../api";
import * as url from "../url";

const getMyNotifcations = () => get(`${url.mynotification}`)
const getNotifcation = (id) => get(`${url.notification}/${id}`)
const updateNotification = (id, data) => put(`${url.notification}/${id}`, data)

export {
    getMyNotifcations,
    getNotifcation,
    updateNotification
}