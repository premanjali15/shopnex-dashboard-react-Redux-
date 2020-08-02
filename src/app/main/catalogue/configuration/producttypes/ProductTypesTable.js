import React, { Component } from 'react';
import { Table, TableBody, TableCell, withStyles, TableRow } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import ProductTypesTableHead from './ProductTypesTableHead';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';

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

class ProductTypesTable extends Component {
	state = {
		order: 'asc',
		orderBy: null,
		selected: [],
		data: null,
		loadingData: false
	};

	componentDidMount() {
		this.props.setProductTypesLoader(true);
		this.props.getProductTypes();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (
			(this.props.data && !this.state.data) ||
			!_.isEqual(this.props.data, prevProps.data) ||
			!_.isEqual(this.props.searchText, prevProps.searchText)
		) {
			const data = this.getFilteredArray(this.props.data, this.props.searchText);
			this.setState({ data });
		}
	}

	getFilteredArray = (data, searchText) => {
		if (searchText.length === 0) {
			return data;
		}
		return _.filter(data, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
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
		this.props.history.push('/app/configuration/producttypes/' + item.id);
	};

	render() {
		const { order, orderBy, data, loadingData } = this.state;
		const { loading, classes } = this.props;

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
								<ProductTypesTableHead
									order={order}
									orderBy={orderBy}
									onSelectAllClick={this.handleSelectAllClick}
									onRequestSort={this.handleRequestSort}
									rowCount={data.length}
								/>

								<TableBody>
									{_.orderBy(
										data,
										[
											(o) => {
												if (orderBy === 'price') {
													return parseInt(o[orderBy]);
												} else {
													return o[orderBy];
												}
											}
										],
										[ order ]
									).map((productType) => {
										return (
											<TableRow
												className="h-64 cursor-pointer"
												hover
												role="checkbox"
												tabIndex={-1}
												key={productType.id}
												onClick={(event) => this.handleClick(productType)}
											>
												<TableCell component="th" scope="row" align="left">
													{productType.id}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{productType.name}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{productType.product_attributes.length > 0 ? (
														<React.Fragment>
															{productType.product_attributes.map((patr, index) => {
																return (
																	<React.Fragment key={index}>
																		{index !==
																		productType.product_attributes.length - 1 ? (
																			patr.name + ', '
																		) : (
																			patr.name
																		)}
																	</React.Fragment>
																);
															})}
														</React.Fragment>
													) : (
														<p>NA</p>
													)}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{productType.variant_attributes.length > 0 ? (
														<React.Fragment>
															{productType.variant_attributes.map((vatr, index) => {
																return (
																	<React.Fragment key={index}>
																		{index !==
																		productType.variant_attributes.length - 1 ? (
																			vatr.name + ', '
																		) : (
																			vatr.name
																		)}
																	</React.Fragment>
																);
															})}
														</React.Fragment>
													) : (
														<p>NA</p>
													)}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
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
			getProductTypes: Actions.getProductTypes,
			setProductTypesLoader: Actions.setProductTypesLoader
		},
		dispatch
	);
}

function mapStateToProps({ productTypesApp }) {
	return {
		data: productTypesApp.producttypes.data,
		searchText: productTypesApp.producttypes.searchText,
		loading: productTypesApp.producttypes.loading
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductTypesTable))
);
