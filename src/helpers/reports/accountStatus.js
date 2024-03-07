import { get } from '../api';
import * as url from '../url';

const getAccountStatusList = (query) =>
	get(`${url.account}/reportAccount${query}`);
const reportBoardingPass = (query) =>
	get(`${url.account}/reportBoardingPass${query}`);

export { getAccountStatusList, reportBoardingPass };
