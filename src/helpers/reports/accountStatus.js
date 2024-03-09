import { get } from '../api';
import * as url from '../url';

const getAccountStatusList = (query) =>
	get(`${url.account}/reportAccount${query}`);
const reportDocktaxBill = (query) =>
	get(`${url.account}/reportBoardingPass${query}`);

export { getAccountStatusList, reportDocktaxBill };
