const useUser = () => {
	const user = sessionStorage.getItem('sunsetadmiralauth');
	if (!user) {
		return null;
	} else {
		return {
			...JSON.parse(user),
		};
	}
};

export default useUser;
