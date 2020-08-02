import React, { Component } from 'react';
import classNames from 'classnames';
import { Typography, CircularProgress, Card, Icon, withStyles, Button } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';

import TotalOrders from './components/TotalOrders';
import ConversionRate from './components/ConversionRate';
import OrdersGraph from './components/OrdersGraph';
import TopFive from './components/TopFive';
import CategoryProducts from './components/CategoryProducts';

import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from './store/actions';

const styles = {
	percentage: {
		padding: '0px 12px',
		borderRadius: '5px',
		display: 'flex',
		flexDirection: 'column'
	},
	bgGreen: {
		background: '#DFF8E9'
	},
	bgRed: {
		background: '#FDECF0'
	}
};

class NewDashboard extends Component {
	componentDidMount() {
		this.props.setStatisticsLoader(true);
		this.props.getStatistics();
	}

	handleRefresh = () => {
		this.componentDidMount();
	};

	render() {
		const { classes, statistics, loadingStatistics } = this.props;

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Typography className="hidden sm:flex" variant="h6">
								Dashboard
							</Typography>
						</FuseAnimate>

						<div className="flex flex-1" />

						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button className="whitespace-no-wrap" variant="contained" onClick={this.handleRefresh}>
								<span className="hidden sm:flex">Refresh</span>
								<span className="flex sm:hidden">Refresh</span>
							</Button>
						</FuseAnimate>
					</div>
				}
				content={
					<div>
						{loadingStatistics && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loadingStatistics &&
						statistics !== undefined &&
						statistics !== null && (
							<div>
								{/* first row */}
								<div className="flex flex-col md:flex-row sm:p-8 container">
									<div className="flex flex-1 flex-col min-w-0">
										<div className="flex flex-col sm:flex sm:flex-row pb-32">
											{/* Total Visitors */}
											<div className="widget flex w-full sm:w-1/3 p-16">
												<Card className="w-full shadow-none border-1 rounded-2">
													<div className="p-16 flex flex-row flex-wrap items-center justify-between">
														<div>
															<div className="py-4 text-16 flex flex-row items-center">
																<Typography className="h3" color="textSecondary">
																	Unique Visitors / Total Visits
																</Typography>
															</div>
															{statistics.visitors !== undefined &&
															statistics.visitors !== null ? (
																<Typography className="text-32 font-300 leading-none mt-8">
																	{statistics.visitors.unique +
																		' / ' +
																		statistics.visitors.total}
																</Typography>
															) : (
																<Typography className="text-32 font-300 leading-none mt-8">
																	NA / NA
																</Typography>
															)}
														</div>
														{statistics.visitors !== undefined &&
														statistics.visitors !== null && (
															<div
																className={classNames(
																	'items-center',
																	classes.percentage,
																	classes.bgGreen
																)}
															>
																<Icon className="text-green mr-4">arrow_upward</Icon>
																<Typography className="text-green">
																	{(statistics.visitors.unique *
																		100 /
																		statistics.visitors.total).toFixed(2)}{' '}
																	%
																</Typography>
															</div>
														)}
													</div>
												</Card>
											</div>

											{/* Revenue Per Visitor */}
											<div className="widget flex w-full sm:w-1/3 p-16">
												<Card className="w-full shadow-none border-1 rounded-2">
													<div className="p-16 flex flex-row flex-wrap items-end">
														<div className="pr-16">
															<div className="py-4 text-16 flex flex-row items-center">
																<Typography className="h3" color="textSecondary">
																	Total orders today
																</Typography>
																{/* <div
																	className={classNames(
																		'items-center ml-16',
																		classes.percentage,
																		classes.bgGreen
																	)}
																>
																	<Icon className="text-green mr-4">
																		arrow_upward
																	</Icon>
																	<Typography className="text-green">
																		5.3 %
																	</Typography>
																</div> */}
															</div>
															<Typography className="text-36 font-300 leading-none mt-8">
																{statistics.todays_paid ? (
																	statistics.todays_paid.total_orders
																) : (
																	0
																)}
															</Typography>
														</div>
													</div>
												</Card>
											</div>

											{/* Average Order Value */}
											<div className="widget flex w-full sm:w-1/3 p-16">
												<Card className="w-full shadow-none border-1 rounded-2">
													<div className="p-16 flex flex-row flex-wrap items-end">
														<div className="pr-16">
															<div className="py-4 text-16 flex flex-row items-center">
																<Typography className="h3" color="textSecondary">
																	Sales today
																</Typography>
																{/* <div
																	className={classNames(
																		'items-center ml-16',
																		classes.percentage,
																		classes.bgRed
																	)}
																>
																	<Icon className="text-red mr-4">
																		arrow_downward
																	</Icon>
																	<Typography className="text-red">0.3 %</Typography>
																</div> */}
															</div>
															<Typography className="text-36 font-300 leading-none mt-8">
																₹{' '}
																{statistics.todays_paid ? (
																	statistics.todays_paid.total_amount
																) : (
																	0
																)}
															</Typography>
														</div>
													</div>
												</Card>
											</div>
										</div>
									</div>
								</div>

								{/* second row */}
								{statistics.last_7_day_orders && (
									<div className="flex flex-col sm:flex sm:flex-row pb-32">
										<TotalOrders
											ordersData={statistics.last_7_day_orders}
											history={this.props.history}
										/>

										<ConversionRate
											ordersData={statistics.last_7_day_orders}
											history={this.props.history}
										/>
									</div>
								)}

								{/* Remove this div(hidden) later*/}
								{statistics.top5 && <TopFive top5Data={statistics.top5} />}
								<div className="hidden">
									<OrdersGraph />
									<CategoryProducts />
								</div>
							</div>
						)}
					</div>
				}
				innerScroll
			/>
		);
	}
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getStatistics: Actions.getStatistics,
			setStatisticsLoader: Actions.setStatisticsLoader
		},
		dispatch
	);
}

function mapStateToProps({ newDashboardApp }) {
	return {
		statistics: newDashboardApp.newdashboard.statistics,
		loadingStatistics: newDashboardApp.newdashboard.loadingStatistics
	};
}
export default withReducer('newDashboardApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(NewDashboard)))
);
