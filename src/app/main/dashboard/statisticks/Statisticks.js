import React, { Component } from 'react';
// import { FuseAnimate } from '@fuse';
import { Card, Icon, Typography } from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import lightBlue from '@material-ui/core/colors/lightBlue';
import red from '@material-ui/core/colors/red';

class Statisticks extends Component {
	render() {
		const conversionData = {
			conversion: {
				value: 492,
				ofTarget: 13
			},
			chartType: 'bar',
			datasets: [
				{
					label: 'Conversion',
					data: [ 221, 428, 492, 471, 413, 344, 294 ]
				}
			],
			labels: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
			options: {
				spanGaps: false,
				legend: {
					display: false
				},
				maintainAspectRatio: false,
				layout: {
					padding: {
						top: 24,
						left: 16,
						right: 16,
						bottom: 16
					}
				},
				scales: {
					xAxes: [
						{
							display: false
						}
					],
					yAxes: [
						{
							display: false,
							ticks: {
								min: 100,
								max: 500
							}
						}
					]
				}
			}
		};

		const impressionsData = {
			impressions: {
				value: '87k',
				ofTarget: 12
			},
			chartType: 'line',
			datasets: [
				{
					label: 'Impression',
					data: [
						67000,
						54000,
						82000,
						57000,
						72000,
						57000,
						87000,
						72000,
						89000,
						98700,
						112000,
						136000,
						110000,
						149000,
						98000
					],
					fill: false
				}
			],
			labels: [
				'Jan 1',
				'Jan 2',
				'Jan 3',
				'Jan 4',
				'Jan 5',
				'Jan 6',
				'Jan 7',
				'Jan 8',
				'Jan 9',
				'Jan 10',
				'Jan 11',
				'Jan 12',
				'Jan 13',
				'Jan 14',
				'Jan 15'
			],
			options: {
				spanGaps: false,
				legend: {
					display: false
				},
				maintainAspectRatio: false,
				elements: {
					point: {
						radius: 2,
						borderWidth: 1,
						hoverRadius: 2,
						hoverBorderWidth: 1
					},
					line: {
						tension: 0
					}
				},
				layout: {
					padding: {
						top: 24,
						left: 16,
						right: 16,
						bottom: 16
					}
				},
				scales: {
					xAxes: [
						{
							display: false
						}
					],
					yAxes: [
						{
							display: false,
							ticks: {
								// min: 100,
								// max: 500
							}
						}
					]
				}
			}
		};

		const visitsData = {
			visits: {
				value: 882,
				ofTarget: -9
			},
			chartType: 'bar',
			datasets: [
				{
					label: 'Visits',
					data: [ 432, 428, 327, 363, 456, 267, 231 ]
				}
			],
			labels: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
			options: {
				spanGaps: false,
				legend: {
					display: false
				},
				maintainAspectRatio: false,
				layout: {
					padding: {
						top: 24,
						left: 16,
						right: 16,
						bottom: 16
					}
				},
				scales: {
					xAxes: [
						{
							display: false
						}
					],
					yAxes: [
						{
							display: false,
							ticks: {
								min: 150,
								max: 500
							}
						}
					]
				}
			}
		};

		const conversionDataWithColors = conversionData.datasets.map((obj) => ({
			...obj,
			borderColor: lightBlue[600],
			backgroundColor: lightBlue[400]
		}));

		const impressionDataWithColors = impressionsData.datasets.map((obj) => ({
			...obj,
			borderColor: lightBlue[600]
		}));

		const visitsDataWithColors = visitsData.datasets.map((obj) => ({
			...obj,
			borderColor: red[600],
			backgroundColor: red[600]
		}));

		return (
			<div className="flex flex-col md:flex-row sm:p-8 container">
				<div className="flex flex-1 flex-col min-w-0">
					{/* <FuseAnimate delay={600}>
						<Typography className="p-16 pb-8 text-18 font-300">
							How are your active users trending over time?
						</Typography>
					</FuseAnimate> */}
					<div className="flex flex-col sm:flex sm:flex-row pb-32">
						<div className="widget flex w-full sm:w-1/3 p-16">
							<Card className="w-full rounded-8 shadow-none border-1">
								<div className="p-16 pb-0 flex flex-row flex-wrap items-end">
									<div className="pr-16">
										<Typography className="h3" color="textSecondary">
											Conversion
										</Typography>
										<Typography className="text-56 font-300 leading-none mt-8">
											{conversionData.conversion.value}
										</Typography>
									</div>

									<div className="py-4 text-16 flex flex-row items-center">
										<div className="flex flex-row items-center">
											{conversionData.conversion.ofTarget > 0 && (
												<Icon className="text-green mr-4">trending_up</Icon>
											)}
											{conversionData.conversion.ofTarget < 0 && (
												<Icon className="text-red mr-4">trending_down</Icon>
											)}
											<Typography>{conversionData.conversion.ofTarget}%</Typography>
										</div>
										<Typography className="ml-4 whitespace-no-wrap">of target</Typography>
									</div>
								</div>

								<div className="h-96 w-100-p">
									<Bar
										data={{
											labels: conversionData.labels,
											datasets: conversionDataWithColors
										}}
										options={conversionData.options}
									/>
								</div>
							</Card>
						</div>
						<div className="widget flex w-full sm:w-1/3 p-16">
							<Card className="w-full rounded-8 shadow-none border-1">
								<div className="p-16 pb-0 flex flex-row items-end flex-wrap">
									<div className="pr-16">
										<Typography className="h3" color="textSecondary">
											Impressions
										</Typography>
										<Typography className="text-56 font-300 leading-none mt-8">
											{impressionsData.impressions.value}
										</Typography>
									</div>

									<div className="py-4 text-16 flex flex-row items-center">
										<div className="flex flex-row items-center">
											{impressionsData.impressions.ofTarget > 0 && (
												<Icon className="text-green mr-4">trending_up</Icon>
											)}
											{impressionsData.impressions.ofTarget < 0 && (
												<Icon className="text-red mr-4">trending_down</Icon>
											)}
											<Typography>{impressionsData.impressions.ofTarget}%</Typography>
										</div>
										<Typography className="ml-4 whitespace-no-wrap">of target</Typography>
									</div>
								</div>

								<div className="h-96 w-100-p">
									<Line
										data={{
											labels: impressionsData.labels,
											datasets: impressionDataWithColors
										}}
										options={impressionsData.options}
									/>
								</div>
							</Card>
						</div>
						<div className="widget w-full sm:w-1/3 p-16">
							<Card className="w-full rounded-8 shadow-none border-1">
								<div className="p-16 pb-0 flex flex-row items-end flex-wrap">
									<div className="pr-16">
										<Typography className="h3" color="textSecondary">
											Visits
										</Typography>
										<Typography className="text-56 font-300 leading-none mt-8">
											{visitsData.visits.value}
										</Typography>
									</div>

									<div className="py-4 text-16 flex flex-row items-center">
										<div className="flex flex-row items-center">
											{visitsData.visits.ofTarget > 0 && (
												<Icon className="text-green mr-4">trending_up</Icon>
											)}
											{visitsData.visits.ofTarget < 0 && (
												<Icon className="text-red mr-4">trending_down</Icon>
											)}
											<Typography>{visitsData.visits.ofTarget}%</Typography>
										</div>
										<Typography className="ml-4 whitespace-no-wrap">of target</Typography>
									</div>
								</div>

								<div className="h-96 w-100-p">
									<Bar
										data={{
											labels: visitsData.labels,
											datasets: visitsDataWithColors
										}}
										options={visitsData.options}
									/>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default Statisticks;
