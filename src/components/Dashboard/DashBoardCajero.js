import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import CajeroPaseSalidaForm from '../Caja/CajeroPaseSalidaForm';
import { useEffect } from 'react';
import {
	getBrazaletsStatics,
	slipAnalytics,
} from '../../helpers/dashobard/stats';
import { useState } from 'react';
import moment from 'moment';
import ChartAnalisisRenta from './ChartAnalisisVenta';
import { defaultOpt } from '../../constants/chartOptions';
import CharBrazaletes from './CharBrazaletes';
import jsFormatNumber from '../../utils/jsFormatNumber';

const DashBoardCajero = () => {
	const [indicator, setIndicator] = useState({
		data: null,
		loading: true,
	});
	//analisis de renta
	const [salesIndicator, setSalesIndicator] = useState({
		series: [],
		options: {
			labels: ['Reservados', 'Disponibles', 'Bloqueados'],
			colors: ['#34c38f', '#f46a6a', '#f1b44c'],
			legend: { show: !1 },
			plotOptions: {
				pie: {
					donut: {
						size: '70%',
					},
				},
			},
		},
	});

	useEffect(() => {
		const fecthSlipAnalyticsApi = async () => {
			try {
				const response = await slipAnalytics();
				const reserved = response.listStatus.find(
					(it) => it.status === 'RESERVED'
				);
				const available = response.listStatus.find(
					(it) => it.status === 'AVAILABLE'
				);
				const bloqueados = response.listStatus.find(
					(it) => it.status === 'BLOCKED'
				);
				const data = {
					ind1: {
						title: 'Total de slip',
						number: response.totalSlip,
						iconClass: 'far fa-map font-size-24',
					},
					ind2: {
						title: 'Slip Rentados',
						number: reserved?.total ?? null,
						iconClass: 'fas fa-ship font-size-24',
					},
					ind3: {
						title: 'Slip Disponibles',
						number: available?.total ?? null,
						iconClass: 'fas fa-align-justify font-size-24',
					},
				};
				setIndicator((prev) => ({
					...prev,
					loading: false,
					data: data,
				}));
				setSalesIndicator((prev) => ({
					...prev,
					series: [
						parseFloat(reserved?.percent?.toFixed(1) ?? 0),
						parseFloat(available?.percent?.toFixed(1) ?? 0),
						parseFloat(bloqueados?.percent?.toFixed(1) ?? 0),
					],
				}));
			} catch (error) {
				setIndicator((prev) => ({
					...prev,
					loading: true,
					data: null,
				}));
			}
		};
		fecthSlipAnalyticsApi();
	}, []);

	const [revenueFilter, setRevenueFilter] = useState({
		monthNumber: 8,
		yearNumber: 2023,
	});
	const [salesData, setSalesData] = useState({
		loading: true,
		series: [{ name: 'Ganancia (MXN)', data: [] }],
		options: defaultOpt,
	});

	useEffect(() => {
		const fecthBrazaltesAnalyticsApi = async () => {
			setSalesData((prev) => ({
				...prev,
				loading: true,
			}));
			try {
				let q = `?monthNumber=${revenueFilter.monthNumber}&yearNumber=${revenueFilter.yearNumber}`;
				const response = await getBrazaletsStatics(q);
				const amountSeries = response.listMonth.map(
					(it) => it.totalAmount
				);
				const daySeries = response.listMonth.map((it) =>
					moment(it.day, 'YYYY-MM-DD').format('DD')
				);
				const opt = {
					...defaultOpt,
					xaxis: {
						categories: daySeries,
					},
					yaxis: {
						labels: {
							formatter: function (value) {
								return jsFormatNumber(value);
							},
						},
					},
				};
				setSalesData({
					loading: false,
					series: [
						{
							name: 'Ganancia (MXN)',
							data: [...amountSeries],
						},
					],
					options: opt,
				});
			} catch (error) {
				setSalesData({
					loading: false,
					series: [{ name: 'Ganancia (MXN)', data: [] }],
					options: defaultOpt,
				});
			}
		};
		fecthBrazaltesAnalyticsApi();
	}, [revenueFilter.monthNumber, revenueFilter.yearNumber]);

	return (
		<>
			<Row>
				<Col xl="4">
					<WelcomeCard />
				</Col>
				<Col xl="8">
					<IndicadorTop indicator={indicator} />
				</Col>
			</Row>
			<Row>
				<Col>
					<CajeroPaseSalidaForm />
				</Col>
			</Row>
			<Row>
				<Col xl="4">
					<ChartAnalisisRenta
						title={'Analisis de Renta'}
						salesIndicator={salesIndicator}
					/>
				</Col>
				<Col xl="8">
					<CharBrazaletes
						salesData={salesData}
						revenueFilter={revenueFilter}
						setRevenueFilter={setRevenueFilter}
					/>
				</Col>
			</Row>
		</>
	);
};

export default DashBoardCajero;
