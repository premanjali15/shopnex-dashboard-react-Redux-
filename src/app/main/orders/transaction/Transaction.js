import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import withReducer from 'app/store/withReducer';

import { FuseAnimate, FusePageCarded } from '@fuse';
import { Icon, Tab, Tabs, Typography, CircularProgress, Paper } from '@material-ui/core';

import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import { withRouter } from 'react-router-dom';

class Transaction extends Component {
	componentDidMount() {
		let txrnId = this.props.match.params.txrnId;
		this.props.setTransactionDetailsLoader(true);
		this.props.getTransactionDetails(txrnId);
	}
	render() {
		const { transaction, loadingDetails } = this.props;

		return (
			<div>
				<FusePageCarded
					classes={{
						content: 'flex',
						header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
					}}
					header={
						transaction && (
							<div className="flex flex-1 w-full items-center justify-between">
								<div className="flex flex-1 flex-col items-center sm:items-start">
									<FuseAnimate animation="transition.slideRightIn" delay={300}>
										<Typography
											className="normal-case flex items-center sm:mb-12"
											role="button"
											onClick={() => {
												window.history.back();
											}}
										>
											<Icon className="mr-4 text-20">arrow_back</Icon>
											Back
										</Typography>
									</FuseAnimate>

									<div className="flex flex-col min-w-0 items-center sm:items-start">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{'Transaction ' + transaction.id}
											</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
						)
					}
					contentToolbar={
						<Tabs
							value={0}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64' }}
						>
							<Tab className="h-64 normal-case" label="Transaction Details" />
						</Tabs>
					}
					content={
						<div className="w-full min-h-512">
							{loadingDetails && (
								<div className="text-center pt-60" style={{ height: 500 }}>
									<CircularProgress color="secondary" />
								</div>
							)}
							{!loadingDetails &&
							transaction && (
								<div className="p-16 sm:p-24 max-w-2xl w-full">
									<div className="pb-48">
										<div className="pb-16 flex items-center">
											{/* <Icon className="mr-16" color="action">
												access_time
											</Icon> */}
											<Typography className="h2" color="textSecondary">
												Transaction Status
											</Typography>
										</div>

										<div className="table-responsive">
											<table className="simple">
												<tbody>
													<tr>
														<td>Amount</td>
														<td>
															{transaction.amount !== null &&
															transaction.amount !== '' ? (
																transaction.amount
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Bank Reference Number</td>
														<td>
															{transaction.bank_ref_no !== null &&
															transaction.bank_ref_no !== '' ? (
																transaction.bank_ref_no
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Billing Notes</td>
														<td>
															{transaction.billing_notes !== null &&
															transaction.billing_notes !== '' ? (
																transaction.billing_notes
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Card Name</td>
														<td>
															{transaction.card_name !== null &&
															transaction.card_name !== '' ? (
																transaction.card_name
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Created On</td>
														<td>
															{transaction.created.substring(0, 10) +
																' ' +
																transaction.created.substring(11, 19)}
														</td>
													</tr>
													<tr>
														<td>Currency</td>
														<td>{transaction.currency}</td>
													</tr>
													<tr>
														<td>Discount Value</td>
														<td>
															{transaction.discount_value !== null &&
															transaction.discount_value !== '' ? (
																transaction.discount_value
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>ECI Value</td>
														<td>
															{transaction.eci_value !== null &&
															transaction.eci_value !== '' ? (
																transaction.eci_value
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Failure Message</td>
														<td>
															{transaction.failure_message !== null &&
															transaction.failure_message !== '' ? (
																transaction.failure_message
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Merchant Amount</td>
														<td>
															{transaction.mer_amount !== null &&
															transaction.mer_amount !== '' ? (
																transaction.mer_amount
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Offer Code</td>
														<td>
															{transaction.offer_code !== null &&
															transaction.offer_code !== '' ? (
																transaction.offer_code
															) : (
																'NA'
															)}
														</td>
													</tr>

													<tr>
														<td>Offer Type</td>
														<td>
															{transaction.offer_type !== null &&
															transaction.offer_type !== '' ? (
																transaction.offer_type
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Order Status</td>
														<td>
															{transaction.order_status !== null &&
															transaction.order_status !== '' ? (
																transaction.order_status
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Payment Mode</td>
														<td>
															{transaction.payment_mode !== null &&
															transaction.payment_mode !== '' ? (
																transaction.payment_mode
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Response Code</td>
														<td>
															{transaction.response_code !== null &&
															transaction.response_code !== '' ? (
																transaction.response_code
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>retry</td>
														<td>
															{transaction.retry !== null && transaction.retry !== '' ? (
																transaction.retry
															) : (
																'NA'
															)}
														</td>
													</tr>

													<tr>
														<td>Status Code</td>
														<td>
															{transaction.status_code !== null &&
															transaction.status_code !== '' ? (
																transaction.status_code
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Status Message</td>
														<td>
															{transaction.status_message !== null &&
															transaction.status_message !== '' ? (
																transaction.status_message
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Tracking ID</td>
														<td>
															{transaction.tracking_id !== null &&
															transaction.tracking_id !== '' ? (
																transaction.tracking_id
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Transaction Date</td>
														<td>
															{transaction.trans_date !== null &&
															transaction.trans_date !== '' ? (
																transaction.trans_date
															) : (
																'NA'
															)}
														</td>
													</tr>
													<tr>
														<td>Updated On</td>
														<td>
															{transaction.updated.substring(0, 10) +
																' ' +
																transaction.updated.substring(11, 19)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>

									{/* raw response */}
									<div className="pb-48">
										<div className="pb-16 flex items-center">
											<Typography className="h2" color="textSecondary">
												Raw Response
											</Typography>
										</div>
										<Paper className="w-full rounded-8 p-16 md:p-24 text-16" elevation={1}>
											<div
												style={{ wordBreak: 'break-word' }}
												dangerouslySetInnerHTML={{
													__html: transaction.raw_response
												}}
											/>
										</Paper>
									</div>
								</div>
							)}
						</div>
					}
				/>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getTransactionDetails: Actions.getTransactionDetails,
			setTransactionDetailsLoader: Actions.setTransactionDetailsLoader
		},
		dispatch
	);
}

function mapStateToProps({ transactionApp }) {
	return {
		transaction: transactionApp.transaction.data,
		loadingDetails: transactionApp.transaction.loadingDetails
	};
}

export default withReducer('transactionApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(Transaction))
);
