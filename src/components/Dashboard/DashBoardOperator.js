import { Col, Row } from 'reactstrap';
import WelcomeCard from './WelcomeCard';
import IndicadorTop from './IndicadorTop';
import ChartGanancias from './ChartGanancias';
import ChartAnalisisRenta from './ChartAnalisisVenta';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { paymentAnalytics, slipAnalytics } from '../../helpers/dashobard/stats';
import { numberFormat } from '../../utils/numberFormat';
import { defaultOpt } from '../../constants/chartOptions';
import jsFormatNumber from '../../utils/jsFormatNumber';

const DashBoardOperator = () => {
	const [indicator, setIndicator] = useState({
		data: null,
		loading: true,
	});

	useEffect(() => {
		const fecthSlipAnalyticsApi = async () => {
			try {
				let q = `?monthNumber=${moment().format(
					'MM'
				)}&yearNumber=${moment().format('YYYY')}`;
				const response = await slipAnalytics(q);
				const data = {
					ind1: {
						title: 'Total de slip',
						number: response.totalSlip,
						iconClass: 'far fa-map font-size-24',
					},
					ind2: {
						title: 'Slip Rentados',
						number:
							response.listStatus.find(
								(it) => it.status === 'RESERVED'
							)?.total ?? null,
						iconClass: 'fas fa-ship font-size-24',
					},
					ind3: {
						title: 'Slip Disponibles',
						number:
							response.listStatus.find(
								(it) => it.status === 'AVAILABLE'
							)?.total ?? null,
						iconClass: 'fas fa-align-justify font-size-24',
					},
				};
				setIndicator((prev) => ({
					...prev,
					loading: false,
					data: data,
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

	//ganancias
	const [revenueFilter, setRevenueFilter] = useState({
		monthNumber: 8,
		yearNumber: 2023,
	});
	const [salesData, setSalesData] = useState({
		currentRevenue: null,
		lastMonthRevenue: null,
		percentageDifference: null,
		series: [{ name: 'Ganancia (MXN)', data: [] }],
		options: defaultOpt,
	});

	useEffect(() => {
		const fecthGananciaAnalyticsApi = async () => {
			try {
				let q = `?monthNumber=${revenueFilter.monthNumber}&yearNumber=${revenueFilter.yearNumber}`;
				const response = await paymentAnalytics(q);
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
					currentRevenue: response.currentRevenue,
					lastMonthRevenue: response.lastMonthRevenue,
					percentageDifference: response.percentageDifference,
					series: [
						{
							name: 'Ganancia (MXN)',
							data: [...amountSeries],
						},
					],
					options: opt,
				});
			} catch (error) {
				setIndicator((prev) => ({
					...prev,
					loading: true,
					data: null,
				}));
			}
		};
		fecthGananciaAnalyticsApi();
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
				<Col xl="4">
					<ChartAnalisisRenta title={'Analisis de Renta'} />
				</Col>
				<Col xl="8">
					<ChartGanancias
						salesData={salesData}
						revenueFilter={revenueFilter}
						setRevenueFilter={setRevenueFilter}
					/>
				</Col>
			</Row>
		</>
	);
};

export default DashBoardOperator;
