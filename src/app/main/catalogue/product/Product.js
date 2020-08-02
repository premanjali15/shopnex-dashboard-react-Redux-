import React, { Component } from 'react';
import {
	withStyles,
	Button,
	TextField,
	InputAdornment,
	Icon,
	Typography,
	Dialog,
	DialogContent
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FuseChipSelect } from '@fuse';
import reducer from '../store/reducers';

const styles = () => ({});

class Product extends Component {
	state = {
		form: null,
		open: false,
		productId: this.props.match.params.productId,
		typeId: this.props.match.params.typeId,
		openDialog: false
	};

	componentDidMount() {
		this.props.setPrdctRelatedDataLoader(true);
		this.props.getProductRelatedData(this.state.typeId);
		this.updateProductState();
		this.props.setProductSavedValue(false);
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(this.props.location, prevProps.location)) {
			this.updateProductState();
		}
		if (
			(this.props.product.data && !this.state.form) ||
			(this.props.product.data && this.state.form && this.props.product.data.id !== this.state.form.id)
		) {
			this.updateFormState();
		}
		if (this.props.productSaved === 'saved') {
			this.props.setProductSavedValue(false);
			let data = this.props.product.data;
			this.props.history.push('/app/products/productinfo/' + data.id);
		}
		if (this.props.match.params.productId === 'new' && this.props.productSaved === 'saved') {
			this.props.setProductSavedValue(false);
			let data = this.props.product.data;
			// this.props.history.push('/app/products/product/' + this.state.typeId + '/' + data.id);
			this.props.history.push('/app/products/productinfo/' + data.id);
		}
		if (
			!this.props.loadingPrdctRelatedData &&
			this.props.prdctRelatedData &&
			(!this.props.prdctRelatedData.categories || this.props.prdctRelatedData.categories.length === 0) &&
			!this.state.openDialog
		) {
			this.setState({ openDialog: true });
		}
	}

	updateFormState = () => {
		this.setState({
			form: this.props.product.data
		});
	};

	updateProductState = () => {
		const params = this.props.match.params;
		const { productId } = params;
		this.props.setLoader(true);
		if (productId === 'new') {
			this.props.newProduct();
		} else {
			this.props.getProduct(this.props.match.params.productId);
		}
	};

	handleChangeTab = (event, tabValue) => {
		this.setState({ tabValue });
	};

	handleChange = (event) => {
		this.setState({
			form: _.set(
				{ ...this.state.form },
				event.target.name,
				event.target.type === 'checkbox' ? event.target.checked : event.target.value
			)
		});
	};

	saveProduct = () => {
		let form = _.clone(this.state.form);
		if (!form.weight && form.weight === '') {
			form.weight = null;
		}
		this.props.setProductSavedValue(true);
		this.props.saveProduct(form, this.state.typeId);
	};

	canBeSubmitted() {
		const { name, description, category, price, variants } = this.state.form;
		let { prdctRelatedData } = this.props;
		let showSave;
		if (name.length > 0 && description.length > 0 && category && category !== '' && price !== '') showSave = true;
		else showSave = false;
		if (
			prdctRelatedData &&
			!prdctRelatedData.has_variants &&
			(!variants ||
				variants.length === 0 ||
				(!variants[0].sku || variants[0].sku === '') ||
				(!variants[0].quantity || variants[0].quantity === ''))
		) {
			showSave = false;
		}

		return showSave;
	}

	handleChipChange = (value) => {
		let { collections } = this.state.form;
		if (value.length > collections.length) {
			collections.push(value[value.length - 1].id);
			this.setState({ form: { ...this.state.form, collections } });
		}
		if (value.length < collections.length) {
			for (let i = 0; i < collections.length; i++) {
				let count = 0;
				for (let j = 0; j < value.length; j++) {
					if (collections[i] === value[j].id) {
						break;
					} else count++;
				}
				if (count === value.length) {
					var filtered = collections.filter(function(clc) {
						return clc !== collections[i];
					});

					this.setState({ form: { ...this.state.form, collections: filtered } });
					break;
				}
			}
		}
	};

	handleAttrsChange = (event, atr_id) => {
		let attributes = this.state.form.attributes ? this.state.form.attributes : {};
		if (event.target.value === null) {
			delete attributes[atr_id];
		} else {
			let key = atr_id.toString();
			attributes[key] = event.target.value.toString();
		}
		this.setState({ form: { ...this.state.form, attributes } });
	};

	handleChangeVariants = (event) => {
		let variants = this.state.form.variants;
		let obj = variants[0] ? variants[0] : {};
		obj[event.target.name] = event.target.value;
		variants[0] = obj;
		this.setState({ form: { ...this.state.form, variants } });
	};

	render() {
		const { classes, loading, productSaved, loadingPrdctRelatedData, prdctRelatedData } = this.props;
		const { form, openDialog } = this.state;

		let collections = [];
		if (prdctRelatedData !== undefined && prdctRelatedData !== null) {
			collections = prdctRelatedData.collections.map((item) => ({
				value: item.name,
				label: item.name,
				id: item.id
			}));
		}

		let selectedClcs = [];
		if (form && form.collections && prdctRelatedData && prdctRelatedData.collections) {
			let clcns = form.collections;
			for (let i = 0; i < clcns.length; i++) {
				let ind = prdctRelatedData.collections.findIndex((cat) => {
					return cat.id === clcns[i];
				});
				let item = prdctRelatedData.collections[ind];
				let obj = {
					value: item.name,
					label: item.name,
					id: item.id
				};
				selectedClcs.push(obj);
			}
		}

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					form &&
					!loading && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									{this.props.match.params.productId === 'new' ? (
										<Typography
											className="normal-case flex items-center sm:mb-12"
											component={Link}
											role="button"
											to={'/app/products'}
										>
											<Icon className="mr-4 text-20">arrow_back</Icon>
											Products
										</Typography>
									) : (
										<Typography
											className="normal-case flex items-center sm:mb-12"
											component={Link}
											role="button"
											to={'/app/products/productinfo/' + this.props.match.params.productId}
										>
											<Icon className="mr-4 text-20">arrow_back</Icon>
											Go to product
										</Typography>
									)}
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<FuseAnimate animation="transition.expandIn" delay={300}>
										{form.top_image ? (
											<img
												className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
												src={form.top_image}
												alt={form.name}
											/>
										) : (
											<img
												className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
												src="assets/images/ecommerce/product-image-placeholder.png"
												alt={form.name}
											/>
										)}
									</FuseAnimate>
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{form.name ? form.name : 'New Product'}
											</Typography>
										</FuseAnimate>
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography variant="caption">Product Detail</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									disabled={!this.canBeSubmitted() || (productSaved !== 'saved' && productSaved)}
									onClick={this.saveProduct}
								>
									{productSaved !== 'saved' && productSaved ? 'Saving...' : 'Save'}
								</Button>
							</FuseAnimate>
						</div>
					)
				}
				content={
					<div>
						{loading && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{form &&
						!loading && (
							<div className="px-16 pt-40">
								<div className="flex flex-col sm:flex sm:flex-row">
									<div className="flex w-full flex-col md:w-3/5 px-16">
										<TextField
											className="mt-8 mb-16"
											label="Name"
											id="name"
											name="name"
											value={form.name}
											onChange={this.handleChange}
											variant="outlined"
											fullWidth
											required
										/>
										<TextField
											className="mt-8 mb-16"
											id="description"
											name="description"
											onChange={this.handleChange}
											label="Description"
											type="text"
											value={form.description}
											multiline
											rows={5}
											variant="outlined"
											fullWidth
											required
										/>
										{!loadingPrdctRelatedData &&
										prdctRelatedData &&
										!prdctRelatedData.has_variants && (
											<div className="flex flex-row">
												<TextField
													required
													className="mt-8 mb-16 mr-8"
													label="SKU"
													id="sku"
													name="sku"
													value={
														form.variants && form.variants[0] && form.variants[0].sku ? (
															form.variants[0].sku
														) : (
															''
														)
													}
													onChange={this.handleChangeVariants}
													variant="outlined"
													fullWidth
												/>
												<TextField
													className="mt-8 mb-16 ml-8"
													label="Quantity"
													id="quantity"
													name="quantity"
													value={
														form.variants &&
														form.variants[0] &&
														form.variants[0].quantity ? (
															form.variants[0].quantity
														) : (
															''
														)
													}
													onChange={this.handleChangeVariants}
													variant="outlined"
													type="number"
													fullWidth
													required
												/>
											</div>
										)}
										<FuseChipSelect
											className={'w-full my-16'}
											isClearable={false}
											isLoading={loadingPrdctRelatedData}
											value={selectedClcs}
											onChange={this.handleChipChange}
											placeholder="Select Collections"
											textFieldProps={{
												label: 'Collections (optional)',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={collections}
											isMulti
										/>
									</div>
									<div className="flex flex-col w-full md:w-2/5 px-16">
										<TextField
											className="mt-8 mb-16"
											label="Selling Price (Included all Taxes)"
											id="price"
											name="price"
											value={form.price}
											onChange={this.handleChange}
											InputProps={{
												startAdornment: <InputAdornment position="start">₹</InputAdornment>
											}}
											type="number"
											variant="outlined"
											fullWidth
											required
										/>
										<TextField
											className={classNames('mt-8 mb-16', classes.textField)}
											name="category"
											id="category"
											select
											label="Select Category"
											value={form.category ? form.category : ''}
											onChange={this.handleChange}
											SelectProps={{
												MenuProps: {
													className: classes.menu
												}
											}}
											margin="normal"
											variant="outlined"
											fullWidth
											required
										>
											{loadingPrdctRelatedData && <MenuItem>Loading...</MenuItem>}
											{!loadingPrdctRelatedData &&
											prdctRelatedData &&
											prdctRelatedData.categories &&
											prdctRelatedData.categories.length > 0 ? (
												prdctRelatedData.categories.map((option) => (
													<MenuItem key={option.id} value={option.id}>
														{option.name}
													</MenuItem>
												))
											) : (
												<MenuItem value={null}>No Options</MenuItem>
											)}
										</TextField>

										<TextField
											className="mt-8 mb-16"
											label="Weight in Grams (optional)"
											id="weight"
											name="weight"
											value={form.weight ? form.weight : ''}
											onChange={this.handleChange}
											variant="outlined"
											fullWidth
											type="number"
										/>
										{loadingPrdctRelatedData && (
											<div className="text-center pt-28">
												<CircularProgress color="secondary" />
											</div>
										)}
										{!loadingPrdctRelatedData &&
										prdctRelatedData && (
											<Typography className="mt-8 mb-16 text-16 self-center">
												Product Type:{' '}
												<span className="text-blue text-18">
													{prdctRelatedData.product_type}
												</span>
											</Typography>
										)}
										{!loadingPrdctRelatedData &&
										prdctRelatedData &&
										prdctRelatedData.product_attributes && (
											<React.Fragment>
												{prdctRelatedData.product_attributes.map((attr, index) => {
													return (
														<TextField
															key={index}
															className={classNames('mt-8 mb-16', classes.textField)}
															name="attributes"
															id="attributes"
															select
															label={'Select ' + attr.name}
															value={
																form.attributes && form.attributes[attr.id] ? (
																	form.attributes[attr.id]
																) : (
																	''
																)
															}
															onChange={(e) => this.handleAttrsChange(e, attr.id)}
															SelectProps={{
																MenuProps: {
																	className: classes.menu
																}
															}}
															margin="normal"
															variant="outlined"
															fullWidth
														>
															{attr.values.length > 0 && (
																<MenuItem value={null}>None</MenuItem>
															)}
															{attr.values.length > 0 ? (
																attr.values.map((option) => (
																	<MenuItem key={option.id} value={option.id}>
																		{option.name}
																	</MenuItem>
																))
															) : (
																<MenuItem>No Options</MenuItem>
															)}
														</TextField>
													);
												})}
											</React.Fragment>
										)}
									</div>
								</div>
							</div>
						)}

						<Dialog
							open={openDialog}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
							maxWidth={'sm'}
							fullWidth={true}
						>
							<DialogContent>
								<div className="w-full text-center my-40">
									<p className="text-24 font-500 mb-16">You must create atleast one Category</p>
									<Button
										className="mt-12"
										color="primary"
										variant="contained"
										component={Link}
										to="/app/categories"
									>
										Create Now
									</Button>
								</div>
							</DialogContent>
						</Dialog>
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
			getProduct: Actions.getProduct,
			newProduct: Actions.newProduct,
			saveProduct: Actions.saveProduct,
			setLoader: Actions.setLoader,
			setProductSavedValue: Actions.setProductSavedValue,
			getProductRelatedData: Actions.getProductRelatedData,
			setPrdctRelatedDataLoader: Actions.setPrdctRelatedDataLoader
		},
		dispatch
	);
}

function mapStateToProps({ productsApp }) {
	return {
		product: productsApp.product,
		imageSaved: productsApp.product.imageSaved,
		productSaved: productsApp.product.productSaved,
		loading: productsApp.product.loading,
		prdctRelatedData: productsApp.product.prdctRelatedData,
		loadingPrdctRelatedData: productsApp.product.loadingPrdctRelatedData
	};
}

export default withReducer('productsApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Product)))
);
