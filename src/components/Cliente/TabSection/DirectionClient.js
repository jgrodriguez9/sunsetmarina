import { useEffect, useState } from 'react';
import { Col, Input, Label, Row } from 'reactstrap';
import { Country, State, City } from 'country-state-city';
import { SELECT_OPTION } from '../../../constants/messages';
import Select from 'react-select';

export default function DirectionClient({ formik, item }) {
	const countryOpt = Country.getAllCountries().map((it) => ({
		label: it.name,
		value: it.isoCode,
	}));
	const [countryDefault, setCountryDefault] = useState(
		item ? { label: item?.country, value: item?.country } : null
	);
	const [statesOpt, setStatesOpt] = useState([]);
	const [statesDefault, setStatesDefault] = useState(
		item ? { label: item?.state, value: item?.state } : null
	);
	const [citiesOpt, setCitiesOpt] = useState([]);
	const [citiesDefault, setCitiesDefault] = useState(
		item ? { label: item?.city, value: item?.city } : null
	);

	useEffect(() => {
		if (countryDefault) {
			setStatesOpt(State.getStatesOfCountry(countryDefault.value));
		} else {
			setStatesOpt([]);
			setCitiesOpt([]);
		}
	}, [countryDefault]);

	useEffect(() => {
		if (statesDefault) {
			setCitiesOpt(
				City.getCitiesOfState(countryDefault.value, statesDefault.value)
			);
		} else {
			setCitiesOpt([]);
		}
	}, [statesDefault]);

	return (
		<Row>
			<Col xs="12" md="9">
				<Label htmlFor="address" className="mb-0">
					Dirección
				</Label>
				<Input
					id="address"
					name="address"
					className={`form-control ${
						formik.errors.address ? 'is-invalid' : ''
					}`}
					onChange={formik.handleChange}
					value={formik.values.address}
				/>
				{formik.errors.address && (
					<div className="invalid-tooltip">
						{formik.errors.address}
					</div>
				)}
			</Col>
			<Col xs="12" md="3"></Col>
			<Col xs="12" md="3">
				<Label htmlFor="country" className="mb-0">
					País
				</Label>
				<Select
					value={countryDefault}
					onChange={(value) => {
						setCountryDefault(value);
						formik.setFieldValue('country', value?.label ?? '');
						setStatesDefault(null);
						setCitiesDefault(null);
					}}
					options={countryOpt}
					classNamePrefix="select2-selection"
					placeholder={SELECT_OPTION}
				/>
			</Col>
			<Col xs="12" md="3">
				<Label htmlFor="state" className="mb-0">
					Estado
				</Label>
				<Select
					value={statesDefault}
					onChange={(value) => {
						setStatesDefault(value);
						formik.setFieldValue('state', value?.label ?? '');
						setCitiesDefault(null);
					}}
					options={statesOpt.map((s) => ({
						label: s.name,
						value: s.isoCode,
					}))}
					classNamePrefix="select2-selection"
					placeholder={SELECT_OPTION}
				/>
			</Col>
			<Col xs="12" md="3">
				<Label htmlFor="city" className="mb-0">
					Ciudad
				</Label>
				<Select
					value={citiesDefault}
					onChange={(value) => {
						setCitiesDefault(value);
						formik.setFieldValue('city', value?.label ?? '');
					}}
					options={citiesOpt.map((c) => ({
						label: c.name,
						value: c.isoCode,
					}))}
					classNamePrefix="select2-selection"
					placeholder={SELECT_OPTION}
				/>
			</Col>
		</Row>
	);
}
