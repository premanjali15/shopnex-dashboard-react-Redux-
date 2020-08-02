import React, { Component } from 'react';
import {
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Icon,
	Typography,
	CircularProgress,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	withStyles,
	Switch,
	FormControlLabel
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { withRouter } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import withReducer from 'app/store/withReducer';
import OrdersStatus from './OrdersStatus';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import classNames from 'classnames';

const styles = (theme) => ({
	confirmBtn: {
		background: 'green',
		'&:hover': {
			background: 'green !important'
		}
	},
	cancelBtn: {
		background: 'red',
		'&:hover': {
			background: 'red !important'
		}
	},
	refundBtn: {
		background: '#ff7b00',
		'&:hover': {
			background: '#ff7b00 !important'
		}
	}
});
class Order extends Component {
	state = {
		tabValue: 0,
		form: null,
		map: 'shipping',
		openEditStatusDialog: false,
		openEditTracingDialog: false,
		selectedOrder: null,
		selectedStatus: '',
		selectedTrckId: '',
		selectedTrckUrl: '',
		selectedTrxn: null,
		paymentAmountDialog: false,
		paymentAmount: '',
		paymentMethodType: '',
		enable: false
	};

	componentDidMount() {
		this.props.setOrderLoader(true);
		this.props.setOrderTransactionsLoader(true);
		this.props.setOrderTransactions(null);
		this.props.getOrder(this.props.match.params.orderId);
	}

	componentDidUpdate() {
		if (this.props.updatingOrder === 'updated') {
			this.props.setUpdateOrderLoader(false);
			this.closeEditDialog();
		}
		if (this.props.confirmingPayment === 'confirmed') {
			this.closePaymentDialog();
			this.props.setConfirmPaymentLoader(false);
			this.componentDidMount();
		}
		if (this.props.cancelingPayment === 'canceled') {
			this.closePaymentDialog();
			this.props.setCancelPaymentLoader(false);
			this.componentDidMount();
		}
		if (this.props.refundingPayment === 'refunded') {
			this.closePaymentDialog();
			this.props.setRefundPaymentLoader(false);
			// this.componentDidMount();
		}
	}

	handleClick = (txrn) => {
		this.props.history.push('/app/orders/txrn/' + txrn.id);
	};

	handleEditStatus = (order) => {
		this.setState({ openEditStatusDialog: true, selectedOrder: order, selectedStatus: order.status });
	};
	handleEditTracking = (order) => {
		this.setState({
			openEditTracingDialog: true,
			selectedOrder: order,
			selectedTrckId: order.tracking_id,
			selectedTrckUrl: order.tracking_url
		});
	};

	updateStatus = (value) => {
		let obj;
		if (value === 'status') {
			obj = { id: this.state.selectedOrder.id, status: this.state.selectedStatus };
		} else if (value === 'trck') {
			obj = {
				id: this.state.selectedOrder.id,
				tracking_id: this.state.selectedTrckId,
				tracking_url: this.state.selectedTrckUrl
			};
		}
		this.props.setUpdateOrderLoader(true);
		this.props.updateOrder(obj);
	};
	closeEditDialog = () => {
		this.props.setUpdateOrderLoader(false);
		this.setState({
			openEditStatusDialog: false,
			openEditTracingDialog: false,
			selectedStatus: '',
			selectedOrder: null
		});
	};
	// confirmPayment = (trxn) => {
	// 	this.props.setConfirmPaymentLoader(true);
	// 	this.props.confirmPayment(trxn);
	// };

	// cancelPayment = (trxn) => {
	// 	this.props.setCancelPaymentLoader(true);
	// 	this.props.cancelPayment(trxn);
	// };

	// refundPayment = (trxn) => {
	// this.props.setRefundPaymentLoader(true);
	// this.props.refundPayment(trxn);
	// };

	openPaymentDialog = (type, trxn) => {
		if (type === 'Refund') {
			this.props.setRefundsDataLoader(true);
			this.props.getRefundsData(trxn.id);
		}
		this.setState({
			paymentMethodType: type,
			paymentAmountDialog: true,
			selectedTrxn: trxn,
			paymentAmount: trxn.amount,
			enable: false
		});
	};

	closePaymentDialog = () => {
		this.setState({
			paymentMethodType: '',
			paymentAmountDialog: false,
			paymentAmount: '',
			selectedTrxn: null,
			enable: false
		});
	};

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
		});
	};

	handlePaymentMethod = () => {
		if (this.state.paymentAmount !== '' && this.state.paymentMethodType !== '') {
			let obj = {
				id: this.state.selectedTrxn.id,
				amount: this.state.paymentAmount
			};
			if (this.state.paymentMethodType === 'Confirm') {
				this.props.setConfirmPaymentLoader(true);
				this.props.confirmPayment(obj);
			} else if (this.state.paymentMethodType === 'Cancel') {
				this.props.setCancelPaymentLoader(true);
				this.props.cancelPayment(obj);
			} else if (this.state.paymentMethodType === 'Refund') {
				this.props.setRefundPaymentLoader(true);
				this.props.refundPayment(obj);
			}
		}
	};

	goBack = () => {
		window.history.back();
	};

	render() {
		const {
			order,
			loadingOrder,
			updatingOrder,
			confirmingPayment,
			cancelingPayment,
			refundingPayment,
			loadingRefundsData,
			refundsData,
			classes
		} = this.props;
		const { paymentAmount, enable } = this.state;
		return (
			<div>
				<FusePageCarded
					classes={{
						content: 'flex',
						header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
					}}
					header={
						order &&
						!loadingOrder && (
							<div className="flex flex-1 w-full items-center justify-between">
								<div className="flex flex-1 flex-col items-center sm:items-start">
									<FuseAnimate animation="transition.slideRightIn" delay={300}>
										<Typography
											className="normal-case flex items-center sm:mb-12"
											role="button"
											onClick={this.goBack}
										>
											<Icon className="mr-4 text-20">arrow_back</Icon>
											Orders
										</Typography>
									</FuseAnimate>

									<div className="flex flex-col min-w-0 items-center sm:items-start">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{'Order ' + order.id}
											</Typography>
										</FuseAnimate>

										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography variant="caption">
												{'From ' + order.first_name + ' ' + order.last_name}
											</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
						)
					}
					content={
						<div className="w-full min-h-512">
							{loadingOrder && (
								<div className="text-center pt-60" style={{ height: 500 }}>
									<CircularProgress color="secondary" />
								</div>
							)}
							{!loadingOrder &&
							order && (
								<div className="p-16 sm:p-24 max-w-2xl w-full">
									<div>
										<div className="pb-48">
											<div className="pb-16 flex items-center">
												<Icon className="mr-16" color="action">
													account_circle
												</Icon>
												<Typography className="h2" color="textSecondary">
													Customer
												</Typography>
											</div>

											<div className="mb-24">
												<div className="table-responsive mb-16">
													<table className="simple">
														<thead>
															<tr>
																<th>Name</th>
																<th>Email</th>
																<th>Phone</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	<div className="flex items-center">
																		{/* <Avatar
																						className="mr-8"
																						src={order.customer.avatar}
																					/> */}
																		<Typography className="truncate">
																			{order.first_name + ' ' + order.last_name}
																		</Typography>
																	</div>
																</td>
																<td>
																	<Typography className="truncate">
																		{order.email}
																	</Typography>
																</td>
																<td>
																	<Typography className="truncate">
																		{order.mobile}
																	</Typography>
																</td>
															</tr>
														</tbody>
													</table>
												</div>

												<ExpansionPanel
													elevation={1}
													expanded={this.state.map === 'shipping'}
													onChange={() =>
														this.setState({
															map: this.state.map !== 'shipping' ? 'shipping' : false
														})}
												>
													<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
														<Typography className="font-600">Shipping Address</Typography>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails className="flex flex-col md:flex-row">
														<Typography className="w-full md:max-w-256 mb-16 md:mb-0">
															{order.first_name + ' ' + order.last_name}
															<br />
															{order.line1},{order.line2}
															<br /> {order.pincode},{order.city},{order.state}
															<br /> {order.notes}
														</Typography>
													</ExpansionPanelDetails>
												</ExpansionPanel>

												<ExpansionPanel
													elevation={1}
													expanded={this.state.map === 'invoice'}
													onChange={() =>
														this.setState({
															map: this.state.map !== 'invoice' ? 'invoice' : false
														})}
												>
													<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
														<Typography className="font-600">Billing Address</Typography>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails className="flex flex-col md:flex-row">
														{order.bill_pincode !== undefined &&
														order.bill_pincode !== null && (
															<Typography className="w-full md:max-w-256 mb-16 md:mb-0">
																{order.bill_first_name + ' ' + order.bill_last_name}
																<br />
																{order.bill_line1},{order.bill_line2}
																<br /> {order.bill_pincode},{order.bill_city},{order.bill_state}
															</Typography>
														)}
														{(order.bill_pincode === undefined ||
															order.bill_pincode === null) && (
															<Typography className="w-full md:max-w-256 mb-16 md:mb-0">
																Same as Shipping Address
															</Typography>
														)}
													</ExpansionPanelDetails>
												</ExpansionPanel>
											</div>
										</div>

										<div className="mt-12 pb-60">
											<table className="simple invoice-table">
												<thead>
													<tr>
														<th className="text-left">ID</th>
														<th className="text-center">IMAGE</th>
														<th className="text-center">NAME</th>
														<th className="text-center">PRICE</th>
														<th className="text-center">QUANTITY</th>
														<th className="text-center">TOTAL</th>
													</tr>
												</thead>
												<tbody>
													{order.items.map((product) => (
														<tr key={product.id}>
															<td className="text-left">
																<Typography variant="subtitle1">
																	{product.id}
																</Typography>
															</td>
															<td className="text-center w-80">
																<img
																	className="product-image"
																	src={product.image}
																	alt={product.name}
																/>
															</td>
															<td className="text-center">{product.name}</td>
															<td className="text-center">₹{product.price}</td>
															<td className="text-center">{product.quantity}</td>
															<td className="text-center">
																{(product.quantity * product.price).toFixed(2)}
															</td>
														</tr>
													))}
												</tbody>
											</table>

											<table className="simple mt-16">
												<tbody>
													<tr>
														<td>
															<Typography
																className="font-medium"
																variant="subtitle1"
																color="textSecondary"
															>
																SUBTOTAL
															</Typography>
														</td>
														<td className="text-right">
															<Typography
																className="font-medium"
																variant="subtitle1"
																color="textSecondary"
															>
																{order.order_total && order.shipping ? (
																	(order.order_total - order.shipping).toFixed(2)
																) : (
																	'NA'
																)}
															</Typography>
														</td>
													</tr>
													<tr>
														<td>
															<Typography
																className="font-medium"
																variant="subtitle1"
																color="textSecondary"
															>
																SHIPPING
															</Typography>
														</td>
														<td className="text-right">
															<Typography
																className="font-medium"
																variant="subtitle1"
																color="textSecondary"
															>
																{order && order.shipping ? order.shipping : 'NA'}
															</Typography>
														</td>
													</tr>
													<tr>
														<td>
															<Typography
																className="font-light"
																variant="h4"
																color="textSecondary"
															>
																TOTAL
															</Typography>
														</td>
														<td className="text-right">
															<Typography
																className="font-light"
																variant="h4"
																color="textSecondary"
															>
																{order && order.order_total ? order.order_total : 'NA'}
															</Typography>
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										<div className="pb-48">
											<div className="pb-16 flex items-center">
												<Icon className="mr-16" color="action">
													access_time
												</Icon>
												<Typography className="h2" color="textSecondary">
													Order Status
												</Typography>
											</div>

											<div className="table-responsive">
												<table className="simple">
													<thead>
														<tr>
															<th>Status</th>
															<th>Updated On</th>
															<th>Change Status</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>
																<OrdersStatus name={order.status} />
															</td>
															<td>
																{order.updated.substring(0, 10) +
																	' ' +
																	order.updated.substring(11, 19)}
															</td>
															<td>
																{order.status !== 'created' && (
																	<Button
																		className="whitespace-no-wrap"
																		variant="contained"
																		onClick={() => {
																			this.handleEditStatus(order);
																		}}
																	>
																		<span>Update</span>
																	</Button>
																)}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>

										<div className="pb-48">
											<div className="pb-16 flex items-center">
												<Icon className="mr-16" color="action">
													local_shipping
												</Icon>
												<Typography className="h2" color="textSecondary">
													Shipping
												</Typography>
											</div>

											<div className="table-responsive">
												<table className="simple">
													<thead>
														<tr>
															<th>Tracking Id</th>
															<th>Tracking URL</th>
															<th>Weight</th>
															<th>Fee</th>
															<th>Update</th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td>
																<span className="truncate">{order.tracking_id}</span>
															</td>
															<td>
																<span className="truncate">{order.tracking_url}</span>
															</td>
															<td>
																<span className="truncate">{order.weight}</span>
															</td>
															<td>
																<span className="truncate">{order.shipping}</span>
															</td>
															<td>
																<Button
																	className="whitespace-no-wrap"
																	variant="contained"
																	onClick={() => {
																		this.handleEditTracking(order);
																	}}
																>
																	<span>Update</span>
																</Button>
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>

										{order.trxns !== undefined &&
										order.trxns !== null &&
										order.trxns.length > 0 && (
											<div className="pb-48">
												<div className="pb-16 flex items-center">
													<Icon className="mr-16" color="action">
														credit_card
													</Icon>
													<Typography className="h2" color="textSecondary">
														Transactions
													</Typography>
												</div>

												<div className="table-responsive">
													<table className="simple">
														<thead>
															<tr>
																<th>ID</th>
																<th>Tracking ID</th>
																<th>Order Status</th>
																<th>Card Name</th>
																<th>Transaction Date</th>
																<th>Amount</th>
																<th>Actions</th>
															</tr>
														</thead>
														<tbody>
															{order.trxns.map((txn, index) => {
																return (
																	<tr key={index}>
																		<td>
																			<span className="truncate">{txn.id}</span>
																		</td>
																		<td>
																			<span className="truncate">
																				{txn.tracking_id}
																			</span>
																		</td>
																		<td>
																			<span className="truncate">
																				{txn.order_status}
																			</span>
																		</td>
																		<td>
																			<span className="truncate">
																				{txn.card_name}
																			</span>
																		</td>
																		<td>
																			<span className="truncate">
																				{txn.trans_date ? (
																					txn.trans_date.substring(0, 10) +
																					' ' +
																					txn.trans_date.substring(11, 19)
																				) : (
																					'null'
																				)}
																			</span>
																		</td>
																		<td>
																			<span className="truncate">
																				{txn.amount}
																			</span>
																		</td>
																		<td>
																			{txn.order_status === 'Success' && (
																				<React.Fragment>
																					{order.status === 'placed' && (
																						<React.Fragment>
																							<Button
																								className={classNames(
																									'whitespace-no-wrap ml-8',
																									classes.confirmBtn
																								)}
																								variant="contained"
																								color="primary"
																								size="small"
																								onClick={() =>
																									this.openPaymentDialog(
																										'Confirm',
																										txn
																									)}
																							>
																								Confirm
																							</Button>
																							<Button
																								className={classNames(
																									'whitespace-no-wrap ml-8',
																									classes.cancelBtn
																								)}
																								variant="contained"
																								size="small"
																								color="secondary"
																								onClick={() =>
																									this.openPaymentDialog(
																										'Cancel',
																										txn
																									)}
																							>
																								Cancel
																							</Button>
																						</React.Fragment>
																					)}
																					{(order.status === 'confirmed' ||
																						order.status === 'shipped' ||
																						order.status ===
																							'delivered') && (
																						<Button
																							className={classNames(
																								'whitespace-no-wrap ml-8',
																								classes.refundBtn
																							)}
																							color="secondary"
																							variant="contained"
																							size="small"
																							onClick={() =>
																								this.openPaymentDialog(
																									'Refund',
																									txn
																								)}
																						>
																							Refund
																						</Button>
																					)}
																				</React.Fragment>
																			)}
																			<Button
																				className="whitespace-no-wrap ml-8"
																				variant="contained"
																				size="small"
																				onClick={() =>
																					this.props.history.push(
																						'/app/orders/txrn/' + txn.id
																					)}
																			>
																				<span>View</span>
																			</Button>
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					}
					innerScroll
				/>

				<Dialog
					open={this.state.openEditStatusDialog || this.state.openEditTracingDialog}
					aria-labelledby="form-dialog-title"
					fullWidth
				>
					<DialogTitle id="form-dialog-title">
						{this.state.openEditStatusDialog ? 'Update Status' : 'Update Details'}
					</DialogTitle>
					<DialogContent>
						{this.state.openEditStatusDialog && (
							<FormControl className="w-full">
								<Select
									value={this.state.selectedStatus}
									onChange={(e) => {
										this.setState({ selectedStatus: e.target.value });
									}}
								>
									<MenuItem value="placed">Placed</MenuItem>
									<MenuItem value="confirmed">Confirmed</MenuItem>
									<MenuItem value="shipped">Shipped</MenuItem>
									<MenuItem value="delivered">Delivered</MenuItem>
									<MenuItem value="canceled">Canceled</MenuItem>
								</Select>
							</FormControl>
						)}
						{this.state.openEditTracingDialog && (
							<div>
								<TextField
									className="mx-6"
									autoFocus
									margin="dense"
									id="name"
									label="Tracking ID"
									name="name"
									value={this.state.selectedTrckId}
									onChange={(e) => {
										this.setState({ selectedTrckId: e.target.value });
									}}
									fullWidth
								/>
								<TextField
									className="mx-6"
									margin="dense"
									id="value"
									label="Tracking URL"
									name="link"
									value={this.state.selectedTrckUrl}
									onChange={(e) => {
										this.setState({ selectedTrckUrl: e.target.value });
									}}
									fullWidth
								/>
							</div>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={this.closeEditDialog} color="primary">
							Cancel
						</Button>
						{this.state.openEditStatusDialog && (
							<Button
								onClick={() => {
									this.updateStatus('status');
								}}
								color="primary"
								disabled={updatingOrder !== 'updated' && updatingOrder}
							>
								{updatingOrder ? 'Updating...' : 'Update'}
							</Button>
						)}
						{this.state.openEditTracingDialog && (
							<Button
								onClick={() => {
									this.updateStatus('trck');
								}}
								color="primary"
								disabled={updatingOrder !== 'updated' && updatingOrder}
							>
								{updatingOrder ? 'Updating...' : 'Update'}
							</Button>
						)}
					</DialogActions>
				</Dialog>

				<Dialog open={this.state.paymentAmountDialog} aria-labelledby="form-dialog-title" fullWidth>
					<DialogTitle id="form-dialog-title">Enter {this.state.paymentMethodType} Amount</DialogTitle>
					<DialogContent>
						{this.state.paymentMethodType === 'Refund' && (
							<React.Fragment>
								{loadingRefundsData && (
									<div className="text-center pt-20 pb-40">
										<CircularProgress color="secondary" />
									</div>
								)}
								{!loadingRefundsData && (
									<React.Fragment>
										{refundsData !== undefined &&
										refundsData !== null && (
											<div>
												<table className="simple invoice-table mb-16">
													<thead>
														<tr>
															<th className="text-left">
																<Typography
																	className="font-small"
																	variant="subtitle1"
																	color="textSecondary"
																>
																	Total Amount
																</Typography>
															</th>
															<th className="text-center">
																<Typography
																	className="font-small"
																	variant="subtitle1"
																	color="textSecondary"
																>
																	Refuned Amount
																</Typography>
															</th>
															<th className="text-right">
																<Typography
																	className="font-small"
																	variant="subtitle1"
																	color="textSecondary"
																>
																	Allowed Amount
																</Typography>
															</th>
														</tr>
													</thead>
													<tbody>
														<tr key="refunded">
															<td className="text-left">{refundsData.amount}</td>
															<td className="text-center">
																{refundsData.refunded_amount}
															</td>
															<td className="text-right">
																{(refundsData.amount -
																	refundsData.refunded_amount).toFixed(2)}
															</td>
														</tr>
													</tbody>
												</table>
												{refundsData.refunds !== undefined &&
												refundsData.refunds !== null &&
												refundsData.refunds.length > 0 && (
													<table className="simple invoice-table mb-20">
														<thead>
															<tr>
																<th className="text-left">
																	<Typography
																		className="font-small"
																		variant="subtitle1"
																		color="textSecondary"
																	>
																		ID
																	</Typography>
																</th>
																<th className="text-center">
																	<Typography
																		className="font-small"
																		variant="subtitle1"
																		color="textSecondary"
																	>
																		Reference ID
																	</Typography>
																</th>
																<th className="text-center">
																	<Typography
																		className="font-small"
																		variant="subtitle1"
																		color="textSecondary"
																	>
																		Amount
																	</Typography>
																</th>
																<th className="text-right">
																	<Typography
																		className="font-small"
																		variant="subtitle1"
																		color="textSecondary"
																	>
																		CREATED
																	</Typography>
																</th>
															</tr>
														</thead>
														<tbody>
															{refundsData.refunds.map((refund, index) => {
																return (
																	<tr key={index}>
																		<td className="text-left">{refund.id}</td>
																		<td className="text-center">{refund.ref_id}</td>
																		<td className="text-center">{refund.amount}</td>
																		<td className="text-right">
																			{refund.created.substring(0, 10) +
																				' ' +
																				refund.created.substring(11, 16)}
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
												)}
											</div>
										)}
									</React.Fragment>
								)}
							</React.Fragment>
						)}
						<div className="flex justify-between w-full items-center">
							<TextField
								className="mx-6"
								autoFocus
								margin="dense"
								id="name"
								label="Amount"
								type="number"
								variant="outlined"
								name="paymentAmount"
								value={paymentAmount}
								disabled={!enable}
								fullWidth
								onChange={(e) => {
									this.handleChange(e);
								}}
							/>
							<div>
								<FormControlLabel
									control={
										<Switch
											disabled={
												this.state.paymentMethodType === 'Refund' &&
												refundsData !== undefined &&
												refundsData !== null &&
												(refundsData.amount - refundsData.refunded_amount).toFixed(2) <= 0
											}
											checked={enable}
											value="enable"
											color="primary"
											onChange={(e) => {
												this.handleChange(e);
											}}
											name="enable"
										/>
									}
									style={{ width: '135px', marginLeft: '10px', marginRight: '0px' }}
									label="Enable Edit"
								/>
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<Button color="primary" onClick={this.closePaymentDialog}>
							Cancel
						</Button>
						<Button
							color="primary"
							disabled={
								paymentAmount === undefined ||
								paymentAmount === null ||
								paymentAmount === '' ||
								(confirmingPayment && confirmingPayment !== 'confirmed') ||
								(cancelingPayment && cancelingPayment !== 'canceled') ||
								(refundingPayment && refundingPayment !== 'refunded') ||
								(this.state.paymentMethodType === 'Refund' &&
									refundsData !== undefined &&
									refundsData !== null &&
									(refundsData.amount - refundsData.refunded_amount).toFixed(2) <= 0)
							}
							onClick={this.handlePaymentMethod}
						>
							{(confirmingPayment && confirmingPayment !== 'confirmed') ||
							(cancelingPayment && cancelingPayment !== 'canceled') ||
							(refundingPayment && refundingPayment !== 'refunded') ? (
								'Updating...'
							) : (
								<span>Update</span>
							)}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getOrder: Actions.getOrder,
			setOrderLoader: Actions.setOrderLoader,
			// getTransactions: Actions.getTransactions,
			setOrderTransactionsLoader: Actions.setOrderTransactionsLoader,
			setOrderTransactions: Actions.setOrderTransactions,
			updateOrder: Actions.updateOrder,
			setUpdateOrderLoader: Actions.setUpdateOrderLoader,
			confirmPayment: Actions.confirmPayment,
			cancelPayment: Actions.cancelPayment,
			refundPayment: Actions.refundPayment,
			getRefundsData: Actions.getRefundsData,
			setConfirmPaymentLoader: Actions.setConfirmPaymentLoader,
			setCancelPaymentLoader: Actions.setCancelPaymentLoader,
			setRefundPaymentLoader: Actions.setRefundPaymentLoader,
			setRefundsDataLoader: Actions.setRefundsDataLoader
		},
		dispatch
	);
}

function mapStateToProps({ ordersApp }) {
	return {
		order: ordersApp.order.data,
		loadingOrder: ordersApp.order.loadingOrder,
		loadingTransactions: ordersApp.order.loadingTransactions,
		transactions: ordersApp.order.transactions,
		refundsData: ordersApp.order.refundsData,
		updatingOrder: ordersApp.order.updatingOrder,
		confirmingPayment: ordersApp.order.confirmingPayment,
		cancelingPayment: ordersApp.order.cancelingPayment,
		refundingPayment: ordersApp.order.refundingPayment,
		loadingRefundsData: ordersApp.order.loadingRefundsData
	};
}

export default withReducer('ordersApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Order)))
);
