import React, { Component } from 'react';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { Table, TableBody, TableCell, withStyles, TableRow, Icon, CircularProgress } from '@material-ui/core';
import { FuseScrollbars, FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import OrdersTableHead from './OrdersTableHead';
import * as Actions from '../store/actions';

import Pagination from '../../components/pagination/Pagination';

const styles = () => ({
	overlay: {
		position: 'fixed',
		display: 'block',
		width: '100%',
		height: '100%',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.2)',
		zIndex: 2,
		userSelect: 'none'
	},
	overlayContent: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		fontSize: 50,
		color: 'white',
		userSelect: 'none',
		transform: 'translate(-50%,-50%)'
	}
});

class OrdersTable extends Component {
	state = {
		order: 'asc',
		orderBy: '',
		data: null,
		loadingData: false,
		type: null
	};

	componentDidMount() {
		if (
			this.props.match.params.type === undefined ||
			this.props.match.params.type === null ||
			this.props.match.params.type === ''
		) {
			this.setState({ type: 'created' });
			this.props.history.replace('/app/orders/created');
		} else {
			this.props.setLoader(true);
			this.setState({ type: this.props.match.params.type });
			this.props.getOrders(this.props.match.params.type);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
			this.setState({ type: this.props.match.params.type });
		}
		if (this.props.match.params.type !== prevProps.match.params.type) {
			this.props.setLoader(true);
			this.props.getOrders(this.props.match.params.type);
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
	}

	getFilteredArray = (data, searchText) => {
		if (searchText.length === 0) {
			return data;
		}
		return FuseUtils.filterArrayByString(data, searchText);
	};

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		this.setState({
			order,
			orderBy
		});
	};

	handleClick = (item) => {
		this.props.history.push('/app/orders/order/' + item.id);
	};

	setPaginationLoader = (value) => {
		this.setState({ loadingData: value });
	};

	setPaginationData = (data) => {
		this.setState({ data });
	};

	render() {
		const { order, orderBy, data, loadingData, type } = this.state;
		const { classes, loading } = this.props;

		return (
			<div className="w-full flex flex-col">
				{loadingData &&
				loadingData !== 'loaded' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}
				{loading && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!loading &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<OrdersTableHead
									order={order}
									orderBy={orderBy}
									onRequestSort={this.handleRequestSort}
									rowCount={data.results.length}
								/>

								<TableBody>
									{_.orderBy(
										data.results,
										[
											(o) => {
												switch (orderBy) {
													case 'id': {
														return parseInt(o.id, 10);
													}
													case 'status': {
														return o.status;
													}
													case 'customer': {
														return o.email;
													}
													case 'placed-on': {
														return o.email;
													}
													case 'paid': {
														return o.paid;
													}
													case 'total': {
														return parseInt(o.order_total);
													}
													default: {
														return o[orderBy];
													}
												}
											}
										],
										[ order ]
									).map((n, index) => {
										return (
											<TableRow
												className="h-64 cursor-pointer"
												hover
												tabIndex={-1}
												key={index}
												onClick={() => this.handleClick(n)}
											>
												<TableCell component="th" scope="row" align="left">
													{n.id}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{n.status}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{n.email}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{n.created.substring(0, 10) + ' ' + n.created.substring(11, 19)}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{n.paid ? (
														<Icon className="text-green text-20">check_circle</Icon>
													) : (
														<Icon className="text-red text-20">remove_circle</Icon>
													)}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													<span>₹</span>
													{n.order_total}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
							{type !== 'pending' &&
							data.results &&
							data.results.length > 0 && (
								<Pagination
									data={data}
									setPaginationLoader={this.setPaginationLoader}
									setPaginationData={this.setPaginationData}
									currentUrl={
										settingsConfig.host_url +
										'order/' +
										type +
										'/list?fields=id,status,email,created,paid,order_total'
									}
								/>
							)}
						</FuseScrollbars>
					</div>
				)}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getOrders: Actions.getOrders,
			setLoader: Actions.setLoader
		},
		dispatch
	);
}

function mapStateToProps({ ordersApp }) {
	return {
		data: ordersApp.orders.data,
		searchText: ordersApp.orders.searchText,
		loading: ordersApp.orders.loading
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(OrdersTable))
);
