import { useEffect, useState } from 'react';
import { hasCashRegisterAssign } from '../helpers/caja/boardingPass';

const useHasCheckAssigned = (isRefetching = true) => {
	const [refetch, setRefetch] = useState(isRefetching);
	const [checkCaja, setCheckCaja] = useState({
		loading: true,
		hasCaja: false,
	});

	useEffect(() => {
		const checkCajaApi = async () => {
			try {
				await hasCashRegisterAssign();
				setCheckCaja({
					loading: false,
					hasCaja: true,
				});
			} catch (error) {
				setCheckCaja({
					loading: false,
					hasCaja: false,
				});
			}
		};
		if (refetch) {
			checkCajaApi();
			setRefetch(false);
		}
	}, [refetch]);

	return checkCaja;
};

export default useHasCheckAssigned;
