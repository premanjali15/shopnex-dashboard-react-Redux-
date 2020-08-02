import React, { Component } from 'react';
import classNames from 'classnames';
import { Card, Icon, Typography, withStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

const styles = {
	graphIconStyle: {
		background: '#F0F5F6',
		display: 'flex',
		padding: '6px',
		color: '#707070',
		cursor: 'pointer'
	}
};

class TotalOrders extends Component {
	state = {
		isRoute: false,
		ordersData: null
	};
	componentDidMount() {
		if (this.props.match !== undefined && this.props.match !== null) {
			this.setState({ isRoute: true, ordersData: this.props.location.ordersData });
		} else {
			this.setState({ isRoute: false, ordersData: this.props.ordersData });
		}
	}

	render() {
		const { classes } = this.props;
		const { isRoute, ordersData } = this.state;

		let weeklyData = {};
		let data = null;
		let dataWithColors = null;

		if (ordersData !== undefined && ordersData !== null) {
			weeklyData['lables'] = ordersData.labels;
			weeklyData['data'] = ordersData.data ? ordersData.data.purchased : [];
			weeklyData['avg'] =
				Math.floor(ordersData.total_orders / 7) > 1 ? Math.floor(ordersData.total_orders / 7) : 1;

			data = {
				chartType: 'line',
				datasets: [
					{
						label: 'Orders',
						data: weeklyData.data,
						fill: 'start'
					}
				],
				labels: weeklyData.lables,
				options: {
					spanGaps: false,
					legend: {
						display: false
					},
					maintainAspectRatio: false,
					tooltips: {
						position: 'nearest',
						mode: 'index',
						intersect: false
					},
					layout: {
						padding: {
							left: 24,
							right: 32
						}
					},
					elements: {
						point: {
							radius: 4,
							borderWidth: 2,
							hoverRadius: 4,
							hoverBorderWidth: 2
						}
					},
					scales: {
						xAxes: [
							{
								gridLines: {
									display: false
								},
								ticks: {
									fontColor: 'rgba(0,0,0,0.54)'
								}
							}
						],
						yAxes: [
							{
								gridLines: {
									tickMarkLength: 16
								},
								ticks: {
									// minStepSize:1
									min: 0,
									stepSize: Math.floor(weeklyData.avg)
								},
								scaleLabel: {
									display: true,
									labelString: 'Number Of Orders'
								}
							}
						]
					},
					plugins: {
						filler: {
							propagate: false
						}
					}
				}
			};
			dataWithColors = data.datasets.map((obj, index) => {
				return {
					...obj,
					borderColor: '#38c172',
					backgroundColor: '#B6E583'
				};
			});
		}

		return (
			<div className={classNames('widget w-full p-16 pb-32 pt-0', !isRoute ? 'sm:w-1/2' : 'mt-40')}>
				<Card className="w-full rounded-8 shadow-none border-1">
					<div className="relative p-24 flex flex-row justify-between">
						<div className="flex mb-6 items-center">
							{isRoute && (
								<Link to={'/app/dashboard'} className="mr-16">
									<div className={classes.graphIconStyle}>
										<Icon className="text-24">arrow_back</Icon>
									</div>
								</Link>
							)}
							<div className="flex flex-col">
								<Typography className="h2 sm:h2">Total Orders</Typography>
								<Typography className="h1 sm:h1">
									{ordersData && ordersData.total_orders ? ordersData.total_orders : 'NA'}
								</Typography>
							</div>
						</div>
						{!isRoute && (
							<div className="mt-4">
								<div
									className={classes.graphIconStyle}
									onClick={() =>
										this.props.history.push({
											pathname: '/app/dashboard/total-orders',
											ordersData: ordersData
										})}
								>
									<Icon className="text-24">bar_chart</Icon>
								</div>
							</div>
						)}
					</div>

					<Typography className="relative h-200 sm:h-320 sm:pb-16">
						{data &&
						dataWithColors && (
							<Line
								data={{
									labels: data.labels,
									datasets: dataWithColors
								}}
								options={data.options}
							/>
						)}
					</Typography>
				</Card>
			</div>
		);
	}
}
export default withStyles(styles, { withTheme: true })(TotalOrders);
