import { get } from '../api';
import * as url from '../url';

const getAccountStatusList = (query) =>
	get(`${url.account}/reportAccount${query}`);

export { getAccountStatusList };
