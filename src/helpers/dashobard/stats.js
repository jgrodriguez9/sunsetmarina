import { get } from '../api';
import * as url from '../url';

// Login Method
const getCustomerWithDebts = (query) =>
	get(`${url.dashboard}/customerWithDebts${query}`);

const getBrazaletsStatics = () => get(`${url.dashboard}/braceletsAnalytics`);

const slipAnalytics = (query) => get(`${url.dashboard}/slipAnalytics${query}`);
const paymentAnalytics = (query) =>
	get(`${url.dashboard}/paymentAnalytics${query}`);

export {
	getCustomerWithDebts,
	getBrazaletsStatics,
	slipAnalytics,
	paymentAnalytics,
};
