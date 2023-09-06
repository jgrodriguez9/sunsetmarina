import { get } from '../api';
import * as url from '../url';

// Login Method
const getCustomerWithDebts = (query) =>
	get(`${url.dashboard}/customerWithDebts${query}`);

const getBrazaletsStatics = (query) =>
	get(`${url.dashboard}/braceletsAnalytics${query}`);

const slipAnalytics = () => get(`${url.dashboard}/slipAnalytics`);
const paymentAnalytics = (query) =>
	get(`${url.dashboard}/paymentAnalytics${query}`);

export {
	getCustomerWithDebts,
	getBrazaletsStatics,
	slipAnalytics,
	paymentAnalytics,
};
