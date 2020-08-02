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
	bgGreen: {
		background: '#DFF8E9'
	},
	bgRed: {
		background: '#FDECF0'
	},
	innerCircle: {
		width: 13,
		height: 13,
		borderRadius: '50%'
	}
};

class ConversionRate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isRoute: false,
			ordersData: null
		};
	}

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

		let barData = null;
		let barDataWithColors = null;

		if (ordersData) {
			barData = {
				datasets: [
					{ data: ordersData.data.reached_checkout, label: 'Reached Checkout', backgroundColor: '#FFB100' },
					{ data: ordersData.data.purchased, label: 'Purchased', backgroundColor: '#1FB54B' }
				],
				labels: ordersData.labels,
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
								maxBarThickness: 10
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
									stepSize:
										Math.floor(ordersData.total_orders / 7) > 1
											? Math.floor(ordersData.total_orders) / 7
											: 1
								}
							}
						]
					}
				}
			};
			barDataWithColors = barData.datasets.map((obj) => ({
				...obj,
				borderColor: obj.backgroundColor,
				backgroundColor: obj.backgroundColor
			}));
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
								<Typography className="h2 sm:h2">Conversation rate</Typography>
								<Typography className="h1 sm:h2">201</Typography>
							</div>
						</div>
						<div>
							{/* <div className="flex justify-between my-4">
								<div className="flex items-center">
									<div
										className={classNames(
											'flex items-center justify-center',
											classes.circle,
											classes.bgOrange
										)}
									>
										<div className={classes.innerCircle} />
									</div>
									<p className="ml-4 mr-12">Added to Cart</p>
								</div>
								<div className="flex items-center">
									<p>6.21%</p>
									<div className={classNames('flex flex-row items-center ml-16', classes.bgRed)}>
										<Icon className="text-red mr-4 text-12">arrow_downward</Icon>
										<Typography className="text-red text-12">0.3 %</Typography>
									</div>
								</div>
							</div> */}
							<div className="flex justify-between my-4">
								<div className="flex items-center">
									<div
										className={classNames(
											'flex items-center justify-center',
											classes.circle,
											classes.bgLightRed
										)}
									>
										<div className={classes.innerCircle} style={{ backgroundColor: '#FFB100' }} />
									</div>
									<p className="ml-4 mr-12">Reached Checkout</p>
								</div>
								<div className="flex items-center">
									{/* <p>3.21%</p>
									<div className={classNames('flex flex-row items-center ml-16', classes.bgGreen)}>
										<Icon className="text-green mr-4 text-12">arrow_upward</Icon>
										<Typography className="text-green text-12">0.8 %</Typography>
									</div> */}
								</div>
							</div>
							<div className="flex justify-between my-4">
								<div className="flex items-center">
									<div
										className={classNames(
											'flex items-center justify-center',
											classes.circle,
											classes.bgLightGreen
										)}
									>
										<div className={classes.innerCircle} style={{ backgroundColor: '#1FB54B' }} />
									</div>
									<p className="ml-4 mr-12">Purchased</p>
								</div>
								<div className="flex items-center">
									{/* <p>2.21%</p>
									<div className={classNames('flex flex-row items-center ml-16', classes.bgGreen)}>
										<Icon className="text-green mr-4 text-12">arrow_upward</Icon>
										<Typography className="text-green text-12">1.5 %</Typography>
									</div> */}
								</div>
							</div>
						</div>
						{!isRoute && (
							<div className="mt-4">
								<div
									className={classes.graphIconStyle}
									onClick={() =>
										this.props.history.push({
											pathname: '/app/dashboard/conversation',
											ordersData: ordersData
										})}
								>
									<Icon className="text-24">bar_chart</Icon>
								</div>
							</div>
						)}
					</div>

					<Typography className="relative h-200 sm:h-320 sm:pb-16">
						{barData &&
						barDataWithColors && (
							<Bar
								data={{
									labels: barData.labels,
									datasets: barDataWithColors
								}}
								options={barData.options}
							/>
						)}
					</Typography>
				</Card>
			</div>
		);
	}
}
export default withStyles(styles, { withTheme: true })(ConversionRate);
