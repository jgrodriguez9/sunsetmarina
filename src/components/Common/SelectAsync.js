import AsyncSelect from 'react-select/async';
import React, { useRef } from 'react';

const MESSAGE = {
	initial: 'Buscar...',
	noOption: 'No opciones, intente otra búsqueda',
	networkError: 'Error de red, intente más tarde',
};

const SelectAsync = ({
	fnFilter,
	query,
	keyCompare,
	placeholder = 'Seleccionar opción',
	isClearable = true,
	isMulti = false,
	defaultOptions = true,
	keyProperty = 'name',
	label = null,
	...props
}) => {
	const messageRef = useRef(MESSAGE.noOption);
	let timer = useRef();
	const loadOptionsWithDebounce = (keyword, callback) => {
		clearTimeout(timer.current);
		// debounce 300ms
		timer.current = setTimeout(() => {
			fnFilter(`${query}&${keyCompare}=${keyword}`)
				.then((options) => {
					if (!options.list?.length) {
						messageRef.current = MESSAGE.noOption;
					}
					callback(
						options.list.map((it) => ({
							label: label
								? label.map((l) => it[l]).join(' - ')
								: it[keyProperty],
							value: it.id,
						}))
					);
				})
				.catch((err) => {
					messageRef.current = MESSAGE.networkError;
					callback([]);
				});
		}, 300);
	};

	return (
		<AsyncSelect
			{...props}
			noOptionsMessage={({ inputValue }) =>
				inputValue ? messageRef.current : MESSAGE.initial
			}
			cacheOptions
			loadOptions={loadOptionsWithDebounce}
			defaultOptions={defaultOptions}
			loadingMessage={() => (
				<div role="status" className="spinner-border text-primary fs-6">
					<span className="visually-hidden">Buscando...</span>
				</div>
			)}
			placeholder={placeholder}
			isClearable={isClearable}
			isMulti={isMulti}
		/>
	);
};

export default SelectAsync;
