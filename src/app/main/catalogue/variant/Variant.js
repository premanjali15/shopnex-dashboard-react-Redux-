import React, { Component } from 'react';
import { withStyles, Button, TextField, InputAdornment, Icon, Typography } from '@material-ui/core';
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
import reducer from '../store/reducers';

const styles = () => ({});

class Variant extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: null,
			productType: null
		};
	}

	componentDidMount() {
		let stateData = this.props.location.state;
		if (stateData !== undefined && stateData !== null && stateData.product_type) {
			this.setState({ productType: stateData.product_type });
			this.props.setPrdctRelatedDataLoader(true);
			this.props.getProductRelatedData(stateData.product_type);
			this.updateVariantState();
		} else {
			this.props.history.replace('/app/products/productinfo/' + this.props.match.params.productId);
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!_.isEqual(this.props.location, prevProps.location)) {
			this.updateVariantState();
		}
		if (
			(this.props.data && !this.state.form) ||
			(this.props.data && this.state.form && this.props.data.id !== this.state.form.id)
		) {
			this.updateFormState();
		}
		if (this.props.match.params.variantId === 'new' && this.props.savingVariant === 'saved') {
			this.props.setVariantLoader(false);
			let data = this.props.data;
			this.props.history.replace('/app/products/variant/' + this.props.match.params.productId + '/' + data.id, {
				product_type: this.state.productType
			});
		}
	}

	updateFormState = () => {
		this.setState({
			form: this.props.data
		});
	};

	updateVariantState = () => {
		const params = this.props.match.params;
		const { variantId } = params;
		this.props.setVariantLoader(true);
		if (variantId === 'new') {
			this.props.newVariant(this.props.match.params.productId);
		} else {
			this.props.getVariant(this.props.match.params.variantId);
		}
	};

	handleChange = (event, type) => {
		this.setState({
			form: _.set(
				{ ...this.state.form },
				event.target.name,
				event.target.type === 'checkbox' ? event.target.checked : event.target.value
			)
		});
	};

	saveVariant = () => {
		let form = _.clone(this.state.form);
		if (!form.weight || form.weight === '') {
			form.weight = null;
		}
		if (!form.price_override || form.price_override === '') {
			form.price_override = null;
		}
		if (!form.cost_price || form.cost_price === '') {
			form.cost_price = null;
		}
		this.props.setVariantSaveValue(true);
		this.props.saveVariant(form);
	};

	canBeSubmitted() {
		const { sku, quantity } = this.state.form;
		let showSave;
		if (sku && sku !== '' && quantity && quantity !== '') showSave = true;
		else showSave = false;
		return showSave;
	}

	handleAttrsChange = (event, atr_id) => {
		if (event.target.value !== undefined) {
			let attributes = this.state.form.attributes ? this.state.form.attributes : {};
			if (event.target.value === null) {
				delete attributes[atr_id];
			} else {
				let key = atr_id.toString();
				attributes[key] = event.target.value.toString();
			}
			this.setState({ form: { ...this.state.form, attributes } });
		}
	};

	render() {
		const { classes, loading, loadingPrdctRelatedData, prdctRelatedData, savingVariant } = this.props;
		const { form } = this.state;

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
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to={'/app/products/productinfo/' + this.props.match.params.productId}
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Go to product
									</Typography>
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
												{form.name ? form.name : 'New Variant'}
											</Typography>
										</FuseAnimate>
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography variant="caption">Variant Detail</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									disabled={!this.canBeSubmitted() || (savingVariant !== 'saved' && savingVariant)}
									onClick={this.saveVariant}
								>
									{savingVariant !== 'saved' && savingVariant ? 'Saving...' : 'Save'}
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
							<div className="p-16 sm:p-24">
								<div className="flex flex-col sm:flex sm:flex-row">
									<div className="flex w-full flex-col md:w-3/5 px-16">
										{loadingPrdctRelatedData && (
											<div className="text-center pt-28">
												<CircularProgress color="secondary" />
											</div>
										)}
										{!loadingPrdctRelatedData &&
										prdctRelatedData &&
										prdctRelatedData.variant_attributes && (
											<React.Fragment>
												{prdctRelatedData.variant_attributes.map((attr, index) => {
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
									<div className="flex flex-col w-full md:w-2/5 px-16">
										<TextField
											required
											className="mt-8 mb-16"
											label="SKU"
											id="sku"
											name="sku"
											value={form.sku ? form.sku : ''}
											onChange={this.handleChange}
											variant="outlined"
											fullWidth
										/>
										<TextField
											required
											className="mt-8 mb-16"
											label="Quantity"
											id="quantity"
											name="quantity"
											value={form.quantity ? form.quantity : ''}
											onChange={this.handleChange}
											variant="outlined"
											fullWidth
											type="number"
										/>
										<TextField
											className="mt-8 mb-16"
											label="Weight (optional)"
											id="weight"
											name="weight"
											value={form.weight ? form.weight : ''}
											onChange={this.handleChange}
											variant="outlined"
											fullWidth
											type="number"
										/>
										<TextField
											className="mt-8 mb-16"
											label="Selling Price (optional)"
											id="price_override"
											name="price_override"
											value={form.price_override ? form.price_override : ''}
											onChange={this.handleChange}
											InputProps={{
												startAdornment: <InputAdornment position="start">₹</InputAdornment>
											}}
											variant="outlined"
											fullWidth
											helperText="If not provided product price displayed."
										/>
										<TextField
											className="mt-8 mb-16"
											label="Cost Price (optional)"
											id="cost_price"
											name="cost_price"
											value={form.cost_price ? form.cost_price : ''}
											onChange={this.handleChange}
											InputProps={{
												startAdornment: <InputAdornment position="start">₹</InputAdornment>
											}}
											variant="outlined"
											fullWidth
										/>
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
			getProductRelatedData: Actions.getProductRelatedData,
			setPrdctRelatedDataLoader: Actions.setPrdctRelatedDataLoader,
			newVariant: Actions.newVariant,
			setVariantLoader: Actions.setVariantLoader,
			getVariant: Actions.getVariant,
			saveVariant: Actions.saveVariant,
			setVariantSaveValue: Actions.setVariantSaveValue
		},
		dispatch
	);
}

function mapStateToProps({ variantApp }) {
	return {
		prdctRelatedData: variantApp.product.prdctRelatedData,
		loadingPrdctRelatedData: variantApp.product.loadingPrdctRelatedData,
		data: variantApp.variant.data,
		loading: variantApp.variant.loading,
		savingVariant: variantApp.variant.savingVariant
	};
}

export default withReducer('variantApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Variant)))
);
