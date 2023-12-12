export const existsRole = (roles, rolesToCheck) => {
	if (!rolesToCheck) return true;
	if (!roles) return true;

	return roles.every((r) => {
		if (rolesToCheck.includes(r)) {
			return true;
		}
		return false;
	});
};
