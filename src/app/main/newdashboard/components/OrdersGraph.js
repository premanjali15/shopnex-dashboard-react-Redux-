import React, { Component } from 'react';
import { Card, Icon, Typography, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';

const styles = {
	graphIconStyle: {
		background: '#F0F5F6',
		display: 'flex',
		padding: '6px',
		color: '#707070',
		cursor: 'pointer'
	},
	circle: {
		width: '16px',
		height: '16px',
		background: '#3B3E85',
		borderRadius: '50%'
	},
	innerCircle: {
		width: '10px',
		height: '10px',
		borderRadius: '50%'
	},
	bgWhite: {
		background: 'white'
	},
	bgBlue: {
		background: '#3B3E85'
	}
};

class OrdersGraph extends Component {
	state = {
		isRoute: false,
		dataset: 'thisYear'
	};
	componentDidMount() {
		if (this.props.match !== undefined && this.props.match !== null) {
			this.setState({ isRoute: true });
		}
	}
	changeData = (value) => {
		this.setState({ dataset: value });
	};
	render() {
		const { classes } = this.props;
		const { isRoute, dataset } = this.state;

		const orderData = {
			datasets: {
				lastYear: [
					{
						label: 'Orders',
						fillColor: [ 'rgba(220,220,220,0.5)', 'navy', 'red', 'orange' ],
						data: [ 121, 328, 292, 371, 313, 244, 194, 245, 421, 328, 392, 371 ],
						backgroundColor: '#3D4086'
					}
				],
				thisYear: [
					{
						label: 'Orders',
						fillColor: [ 'rgba(220,220,220,0.5)', 'navy', 'red', 'orange' ],
						data: [ 221, 428, 492, 371, 413, 344, 294, 345, 221, 428, 492, 471 ],
						backgroundColor: '#3D4086'
					}
				]
			},
			labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
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
							display: true,
							gridLines: {
								display: false
							},
							maxBarThickness: 10,
							scaleLabel: {
								display: true,
								labelString: 'Months'
							}
						}
					],
					yAxes: [
						{
							display: true,
							gridLines: {
								display: true
							},
							ticks: {
								min: 0,
								max: 500,
								stepSize: 100
							},
							scaleLabel: {
								display: true,
								labelString: 'Number Of Orders'
							}
						}
					]
				}
			}
		};

		const orderDataWithColors = orderData.datasets[dataset].map((obj) => ({
			...obj,
			borderColor: obj.backgroundColor,
			backgroundColor: obj.backgroundColor
		}));

		return (
			<div className={classNames('flex flex-row', isRoute && 'mt-20')}>
				<div className="widget w-full p-16 pb-32">
					<Card className="w-full rounded-8 shadow-none border-1">
						<div className="relative p-24 flex flex-row justify-between">
							<div className="flex items-center">
								{isRoute && (
									<Link to={'/app/newdashboard'} className="mr-16">
										<div className={classes.graphIconStyle}>
											<Icon className="text-24">arrow_back</Icon>
										</div>
									</Link>
								)}
								<div className="flex flex-col">
									<Typography className="h1 sm:h2">Order Graph</Typography>
								</div>
							</div>
							<div className="flex flex-row items-center">
								<div className="flex items-center mx-24" onClick={() => this.changeData('lastYear')}>
									<div className={classNames(classes.circle, 'flex items-center justify-center')}>
										<div
											className={classNames(
												classes.innerCircle,
												dataset === 'lastYear' ? classes.bgBlue : classes.bgWhite
											)}
										/>
									</div>
									<p className="mx-4 text-16">Last Year</p>
								</div>
								<div className="flex items-center mx-24" onClick={() => this.changeData('thisYear')}>
									<div className={classNames(classes.circle, 'flex items-center justify-center')}>
										<div
											className={classNames(
												classes.innerCircle,
												dataset === 'thisYear' ? classes.bgBlue : classes.bgWhite
											)}
										/>
									</div>
									<p className="mx-4 text-16">This Year</p>
								</div>
								{!isRoute && (
									<Link to={'/app/newdashboard/orders-graph'} className="mt-4">
										<div className={classes.graphIconStyle}>
											<Icon className="text-24">bar_chart</Icon>
										</div>
									</Link>
								)}
							</div>
						</div>

						<Typography className="relative h-200 sm:h-320 sm:pb-16">
							<Bar
								data={{
									labels: orderData.labels,
									datasets: orderDataWithColors
								}}
								options={orderData.options}
							/>
						</Typography>
					</Card>
				</div>
			</div>
		);
	}
}
export default withStyles(styles, { withTheme: true })(OrdersGraph);
