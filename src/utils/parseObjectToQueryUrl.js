const parseObjectToQueryUrl = (query) => {
	return Object.keys(query)
		.filter((key) => query[key] !== '')
		.map((key) => `${key}=${query[key]}`)
		.join('&');
};

export default parseObjectToQueryUrl;
