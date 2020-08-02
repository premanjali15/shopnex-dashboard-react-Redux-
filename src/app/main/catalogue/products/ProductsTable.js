import React, { Component } from 'react';
import {
	Icon,
	Table,
	TableBody,
	TableCell,
	withStyles,
	TableRow,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import ProductsTableHead from './ProductsTableHead';
import * as Actions from '../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { Link } from 'react-router-dom';

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

class ProductsTable extends Component {
	state = {
		order: 'asc',
		orderBy: null,
		selected: [],
		rowsPerPage: 2,
		loadingData: false,
		data: null,
		prdctTypes: null,
		loadingPT: false,
		searchText: ''
	};

	componentDidMount() {
		this.props.setLoader(true);
		this.props.getProducts('');
	}

	componentDidUpdate(prevProps) {
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.props.setSearchText('');
			this.componentDidMount();
		}

		if (this.props.enterPressed && this.props.searchText !== this.state.searchText) {
			let searchText = this.props.searchText;
			this.setState({ searchText });
			this.props.setSearchLoader(true);
			this.props.getProducts(searchText);
		} else {
			this.props.closeHandleEnter();
		}

		if (this.props.searchingProducts === 'searched') {
			this.props.setSearchLoader(false);
			this.props.closeHandleEnter();
		}

		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (
			(this.props.prdctTypes && !this.state.prdctTypes) ||
			!_.isEqual(this.props.prdctTypes, prevProps.prdctTypes)
		) {
			this.setState({ prdctTypes: this.props.prdctTypes });
		}
		if (prevProps.openPrdctType !== this.props.openPrdctType && this.props.openPrdctType === true) {
			this.props.setProductTypesLoader(true);
			this.props.getProductTypes();
		}
	}

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

	handleSelectAllClick = (event) => {
		if (event.target.checked) {
			this.setState((state) => ({ selected: this.state.data.map((n) => n.id) }));
			return;
		}
		this.setState({ selected: [] });
	};

	handleClick = (item) => {
		this.props.history.push('/app/products/productinfo/' + item.id);
	};

	handleCheck = (event, id) => {
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		this.setState({ selected: newSelected });
	};

	setPaginationLoader = (value) => {
		this.setState({ loadingData: value });
	};

	setPaginationData = (data) => {
		this.setState({ data });
	};

	handlePropsClose = () => {
		this.props.closePrdctTypeDialog();
	};

	handlePrdctTypeClick = (type) => {
		this.props.history.push('/app/products/product/' + type.id + '/new');
	};

	render() {
		const { order, orderBy, data, loadingData, prdctTypes, loadingPT, searchText } = this.state;
		const { classes, openPrdctType, loadingPrdctTypes, searchingProducts } = this.props;
		let currentUrl =
			settingsConfig.host_url +
			'product/?fields=id,name,slug,price,category,top_image,stock,available,category_name,sku&search=' +
			searchText;

		return (
			<div className="w-full flex flex-col">
				{((loadingData && loadingData !== 'loaded') || searchingProducts) && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}
				{this.props.loading && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!this.props.loading &&
				data !== undefined &&
				data !== null && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<ProductsTableHead
									order={order}
									orderBy={orderBy}
									onSelectAllClick={this.handleSelectAllClick}
									onRequestSort={this.handleRequestSort}
									rowCount={data.results.length}
								/>

								<TableBody>
									{_.orderBy(
										data.results,
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
									).map((n) => {
										return (
											<TableRow
												className="h-64 cursor-pointer"
												hover
												role="checkbox"
												tabIndex={-1}
												key={n.id}
												onClick={() => this.handleClick(n)}
											>
												<TableCell component="th" scope="row" align="left">
													{n.id}
												</TableCell>

												<TableCell
													className="w-52"
													component="th"
													scope="row"
													padding="none"
													align="left"
												>
													{n.top_image ? (
														<img
															className="w-full block rounded"
															src={n.top_image}
															alt={n.name}
														/>
													) : (
														<img
															className="w-full block rounded"
															src="assets/images/ecommerce/product-image-placeholder.png"
															alt={n.name}
														/>
													)}
												</TableCell>

												<TableCell component="th" scope="row" align="left">
													{n.name}
												</TableCell>

												<TableCell className="truncate" component="th" scope="row" align="left">
													{n.category_name}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{n.sku}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													<span>₹</span>
													{n.price}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{n.stock}
													<i
														className={classNames(
															'inline-block w-8 h-8 rounded ml-8',
															n.stock <= 5 && 'bg-red',
															n.stock > 5 && n.stock <= 25 && 'bg-orange',
															n.stock > 25 && 'bg-green'
														)}
													/>
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{n.available ? (
														<Icon className="text-green text-20">check_circle</Icon>
													) : (
														<Icon className="text-red text-20">remove_circle</Icon>
													)}
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</FuseScrollbars>

						{data &&
						data.results &&
						data.results.length > 0 && (
							<Pagination
								data={data}
								setPaginationLoader={this.setPaginationLoader}
								setPaginationData={this.setPaginationData}
								openPrdctType={openPrdctType}
								currentUrl={currentUrl}
							/>
						)}
					</div>
				)}
				<Dialog
					open={openPrdctType}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					maxWidth={'sm'}
					fullWidth={true}
				>
					{loadingPT &&
					loadingPT !== 'loaded' && (
						<div className={classes.overlay} style={{ position: 'absolute !important' }}>
							<div className={classes.overlayContent}>
								<CircularProgress color="secondary" />
							</div>
						</div>
					)}
					<DialogTitle id="alert-dialog-title">Select Product Type</DialogTitle>
					<DialogContent>
						{loadingPrdctTypes && (
							<div className="text-center py-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loadingPrdctTypes &&
						prdctTypes && (
							<div>
								{prdctTypes.length > 0 ? (
									<Table className="min-w-sm" aria-labelledby="tableTitle">
										<TableBody>
											{prdctTypes.map((productType) => {
												return (
													<TableRow
														className="h-64 cursor-pointer"
														hover
														role="checkbox"
														tabIndex={-1}
														key={productType.id}
														onClick={(event) => this.handlePrdctTypeClick(productType)}
													>
														<TableCell component="th" scope="row" align="center">
															{productType.name}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								) : (
									<div className="w-full text-center my-8">
										<p className="text-16 font-500">There are no product types</p>
										<Button
											className="mt-12"
											color="primary"
											variant="contained"
											component={Link}
											to="/app/configuration/producttypes"
										>
											Create Now
										</Button>
									</div>
								)}
							</div>
						)}
					</DialogContent>
					<DialogActions>
						<Button color="primary" onClick={this.handlePropsClose}>
							Cancel
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
			getProducts: Actions.getProducts,
			setLoader: Actions.setLoader,
			setProductTypesLoader: Actions.setProductTypesLoader,
			getProductTypes: Actions.getProductTypes,
			setSearchLoader: Actions.setSearchLoader,
			setSearchText: Actions.setProductsSearchText
		},
		dispatch
	);
}

function mapStateToProps({ productsApp }) {
	return {
		data: productsApp.products.data,
		searchText: productsApp.products.searchText,
		loading: productsApp.products.loading,
		searchingProducts: productsApp.products.searchingProducts,
		loadingPrdctTypes: productsApp.producttypes.loading,
		prdctTypes: productsApp.producttypes.data
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductsTable))
);
