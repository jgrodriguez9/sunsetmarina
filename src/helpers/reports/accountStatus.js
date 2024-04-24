import { get } from '../api';
import * as url from '../url';

const getAccountStatusList = (query) =>
	get(`${url.account}/reportAccount${query}`);
const reportDocktaxBill = (query) =>
	get(`${url.account}/reportBoardingPass${query}`);
const reportCobranza = (query) => get(`${url.account}/reportIncome${query}`);

export { getAccountStatusList, reportDocktaxBill, reportCobranza };
