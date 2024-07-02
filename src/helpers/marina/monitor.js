import { get } from '../api';
import * as url from '../url';

const monitorDailyChargeJob = () => get(`${url.account}/monitorDailyChargeJob`);
const runManuallyDailyChargeJob = () =>
	get(`${url.charge}/runManuallyDailyChargeJob`);

export { monitorDailyChargeJob, runManuallyDailyChargeJob };
