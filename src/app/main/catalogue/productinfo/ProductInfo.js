import React, { Component } from 'react';
import {
	withStyles,
	Button,
	Paper,
	Switch,
	FormControlLabel,
	Divider,
	Icon,
	Typography,
	IconButton,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import reducer from '../store/reducers';

import { ShowDialog } from '../../components/showdialog/ShowDialog';

const styles = (theme) => ({
	link: {
		textDecoration: 'none !important'
	}
});

class ProductInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productId: this.props.match.params.productId,
			data: null,
			showDeletePrdctDialog: false,
			showDeleteVariantDialog: false,
			selectedVariant: null
		};
	}

	componentDidMount() {
		this.props.setProductInfoLoader(true);
		this.props.getProductInfo(this.state.productId);
	}

	componentDidUpdate() {
		if (
			(this.props.data && !this.state.data) ||
			(this.props.data &&
				this.state.data &&
				(!_.isEqual(this.props.data.variants, this.state.data.variants) ||
					!_.isEqual(this.props.data.images, this.state.data.images)))
		) {
			this.setState({ data: this.props.data });
		}
		if (this.props.loading === 'loaded') {
			this.props.setProductInfoLoader(false);
			this.setState({ data: this.props.data });
		}
		if (this.props.deletingProduct === 'deleted') {
			this.props.setDeleteProductLoader(false);
			this.props.history.replace('/app/products');
		}
		if (this.props.deletingVariant === 'deleted') {
			this.props.setDeleteVariantLoader(false);
			this.closeDelteVariantDialog();
		}
	}

	handleChange = (event, type) => {
		if (type === 'available') {
			this.setState({
				data: _.set({ ...this.state.data }, 'available', !this.state.data.available)
			});
			let obj = {
				type: 'change_mode',
				value: !this.state.data.available,
				id: this.state.data.id
			};
			this.props.saveProductStatus(obj);
		}
	};

	handleVariantPage = (id) => {
		this.props.history.push('/app/products/variant/' + this.props.match.params.productId + '/' + id, {
			product_type: this.state.data.product_type
		});
	};

	handleRemoveProduct = () => {
		this.setState({ showDeletePrdctDialog: true });
	};

	closeRemovePrdctDialog = () => {
		this.setState({ showDeletePrdctDialog: false });
	};

	deleteProduct = () => {
		this.props.setDeleteProductLoader(true);
		this.props.deleteProduct(this.state.data.id);
	};

	handleRemoveVariant = (variant) => {
		this.setState({ selectedVariant: variant, showDeleteVariantDialog: true });
	};

	closeDelteVariantDialog = () => {
		this.setState({ selectedVariant: null, showDeleteVariantDialog: false });
	};

	deleteVariant = () => {
		if (this.state.selectedVariant) {
			this.props.setDeleteVariantLoader(true);
			this.props.deleteVariant(this.state.selectedVariant.id);
		}
	};

	render() {
		const { loading, classes, deletingProduct, deletingVariant } = this.props;
		const { data, showDeletePrdctDialog, showDeleteVariantDialog } = this.state;
		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					data &&
					loading === false && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/products"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Products
									</Typography>
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<FuseAnimate animation="transition.expandIn" delay={300}>
										{data.top_image ? (
											<img
												className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
												src={data.top_image}
												alt={data.name}
											/>
										) : (
											<img
												className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
												src="assets/images/ecommerce/product-image-placeholder.png"
												alt={data.name}
											/>
										)}
									</FuseAnimate>
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{data.name ? data.name : 'New Product'}
											</Typography>
										</FuseAnimate>
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography variant="caption">Product Detail</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
						</div>
					)
				}
				content={
					<div className="px-16 py-24">
						<ShowDialog
							open={showDeletePrdctDialog}
							closeDeleteDialog={this.closeRemovePrdctDialog}
							deleteDialogFunction={this.deleteProduct}
							deleting={deletingProduct}
							message={
								'On deleting product, all the product related variants and images will also be deleted.'
							}
						/>
						<ShowDialog
							open={showDeleteVariantDialog}
							closeDeleteDialog={this.closeDelteVariantDialog}
							deleteDialogFunction={this.deleteVariant}
							deleting={deletingVariant}
						/>
						{loading &&
						loading !== 'loaded' && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{data &&
						loading === false && (
							<div>
								<div className="flex flex-col sm:flex sm:flex-row">
									<div className="flex w-full flex-col md:w-3/5 sm:w-1/2 px-16">
										<Paper className="pb-16 rounded-none">
											<div className="px-16 pb-8">
												<div className="flex items-center justify-between">
													<p className="text-20">{data.name}</p>
													<FormControlLabel
														control={
															<Switch
																checked={data.available}
																onChange={(e) => this.handleChange(e, 'available')}
																id="available"
																name="available"
															/>
														}
														label="Published"
													/>
												</div>
												{!data.has_variants && (
													<p className="my-8 text-green-light">READY FOR PURCHASE</p>
												)}
												{data.has_variants &&
												data.variants &&
												data.variants.length !== 0 && (
													<p className="my-8 text-green-light">READY FOR PURCHASE</p>
												)}
												{data.has_variants &&
												(!data.variants || data.variants.length === 0) && (
													<p className="my-8 text-red-light">Variants Missing</p>
												)}
												{data.has_variants && (
													<p className="mt-12 mb-8">
														Variants is enabled in this Product Type
													</p>
												)}
												<Typography className="my-12 text-16 self-center">
													Product Type:{' '}
													<span className="text-blue text-18">{data.product_type_name}</span>
												</Typography>
											</div>
											<Divider />
											<div className="mt-8">
												<Link
													to={'/app/products/product/' + data.product_type + '/' + data.id}
													className={classes.link}
												>
													<Button color="secondary" className="ml-8 mr-12">
														Edit Product
													</Button>
												</Link>
												<Button
													color="secondary"
													className="mr-12"
													onClick={this.handleRemoveProduct}
												>
													Remove Product
												</Button>
												<Button color="secondary">View On Site</Button>
											</div>
										</Paper>
									</div>
									<div className="flex w-full flex-col md:w-2/5 sm:w-1/2 px-16">
										<Paper className="rounded-none">
											<div className="px-16 pt-8">
												<p className="text-20 mb-4">Price</p>
												<p className="text-grey-darker">Taxes are charged(standard tax rate)</p>
											</div>
											<Table aria-labelledby="tableTitle" className="mt-4">
												<TableBody>
													<TableRow className="h-40 cursor-pointer" role="checkbox">
														<TableCell component="th" scope="row" align="left">
															Gross sale price
														</TableCell>
														<TableCell component="th" scope="row" align="right">
															{data.price}
														</TableCell>
													</TableRow>
													<TableRow className="h-40 cursor-pointer" role="checkbox">
														<TableCell component="th" scope="row" align="left">
															Gross purchase cost
														</TableCell>
														<TableCell component="th" scope="row" align="right">
															-
														</TableCell>
													</TableRow>
													<TableRow className="h-40 cursor-pointer" role="checkbox">
														<TableCell component="th" scope="row" align="left">
															Margin
														</TableCell>
														<TableCell component="th" scope="row" align="right">
															-
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</Paper>
									</div>
								</div>
								<div className="flex flex-col sm:flex sm:flex-row mt-40">
									{data.has_variants &&
									data.variants && (
										<div className="flex w-full flex-col md:w-3/5 sm:w-1/2 px-16">
											<Paper className="rounded-none">
												<div className="p-16 flex items-center justify-between">
													<p className="text-20">Variant</p>
													<Button
														color="secondary"
														className="ml-8 mr-12"
														onClick={() => this.handleVariantPage('new')}
													>
														ADD
													</Button>
												</div>
												<div className="flex-grow overflow-x-auto">
													{data.variants.length > 0 && (
														<Table aria-labelledby="tableTitle" className="mt-4">
															<TableHead>
																<TableRow className="h-60">
																	<TableCell align="center">SKU</TableCell>
																	<TableCell align="center">Name</TableCell>
																	<TableCell align="center">Quantity</TableCell>
																	<TableCell align="center">Selling price</TableCell>
																	<TableCell align="center" />
																</TableRow>
															</TableHead>
															<TableBody>
																{data.variants.map((variant, index) => {
																	return (
																		<TableRow
																			key={index}
																			className="h-60 cursor-pointer"
																			role="checkbox"
																		>
																			<TableCell
																				component="th"
																				scope="row"
																				align="center"
																			>
																				{variant.sku}
																			</TableCell>
																			<TableCell
																				component="th"
																				scope="row"
																				align="center"
																			>
																				{variant.name ? variant.name : '-'}
																			</TableCell>
																			<TableCell
																				component="th"
																				scope="row"
																				align="center"
																			>
																				{variant.quantity}
																			</TableCell>
																			<TableCell
																				component="th"
																				scope="row"
																				align="center"
																			>
																				{variant.price_override ? (
																					variant.price_override
																				) : (
																					'-'
																				)}
																			</TableCell>
																			<TableCell
																				component="th"
																				scope="row"
																				align="center"
																			>
																				<div className="flex">
																					<IconButton
																						onClick={() =>
																							this.handleVariantPage(
																								variant.id
																							)}
																					>
																						<Icon>edit</Icon>
																					</IconButton>
																					<IconButton
																						onClick={() =>
																							this.handleRemoveVariant(
																								variant
																							)}
																					>
																						<Icon>delete</Icon>
																					</IconButton>
																				</div>
																			</TableCell>
																		</TableRow>
																	);
																})}
															</TableBody>
														</Table>
													)}
												</div>
											</Paper>
										</div>
									)}

									<div className="flex w-full flex-col md:w-2/5 sm:w-1/2 px-16">
										<Paper className="rounded-none">
											<div className="p-16">
												<p className="text-20">Images</p>
												{data.images &&
												data.images.length > 0 && (
													<div className="flex flex-wrap">
														{data.images.map((image, index) => {
															return (
																<div
																	style={{ width: '120px' }}
																	className="m-8"
																	key={index}
																>
																	<img src={image.m_thumb} alt="" />
																</div>
															);
														})}
													</div>
												)}
											</div>
											<Divider />
											<Link to={'/app/products/images/' + data.id} className={classes.link}>
												<Button color="secondary" className="ml-8 mr-12 my-8">
													EDIT IMAGES
												</Button>
											</Link>
										</Paper>
									</div>
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
			saveProductStatus: Actions.saveProductStatus,
			getProductInfo: Actions.getProductInfo,
			setProductInfoLoader: Actions.setProductInfoLoader,
			deleteProduct: Actions.deleteProduct,
			setDeleteProductLoader: Actions.setDeleteProductLoader,
			deleteVariant: Actions.deleteVariant,
			setDeleteVariantLoader: Actions.setDeleteVariantLoader
		},
		dispatch
	);
}

function mapStateToProps({ productInfoApp }) {
	return {
		data: productInfoApp.productInfo.data,
		loading: productInfoApp.productInfo.loading,
		deletingProduct: productInfoApp.productInfo.deletingProduct,
		deletingVariant: productInfoApp.productInfo.deletingVariant
	};
}

export default withReducer('productInfoApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductInfo)))
);
