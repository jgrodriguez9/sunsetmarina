import { get } from '../api';
import * as url from '../url';

const getAccountStatusList = (query) =>
	get(`${url.account}/reportAccount${query}`);
const reportDocktaxBill = (query) =>
	get(`${url.account}/reportBoardingPass${query}`);
const reportCobranza = (query) => get(`${url.account}/reportIncome${query}`);
const reportCollection = (query) =>
	get(`${url.account}/reportCollection${query}`);
const reportDailySummary = (query) =>
	get(`${url.account}/reportDailyResume${query}`);

export {
	getAccountStatusList,
	reportDocktaxBill,
	reportCobranza,
	reportCollection,
	reportDailySummary,
};
