export const existsRole = (roles, rolesToCheck) => {
	if (!rolesToCheck) return false;
	if (!roles) return false;
	let found = false;
	roles.forEach((r) => {
		if (rolesToCheck.includes(r)) {
			found = true;
		}
	});
	return found;
};
