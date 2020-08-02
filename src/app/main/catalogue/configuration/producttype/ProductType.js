import React, { Component } from 'react';
import { withStyles, Button, TextField, Icon, Typography, FormControlLabel, Switch } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FuseChipSelect } from '@fuse';
import reducer from '../../store/reducers';

const styles = (theme) => ({});

class ProductType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: null,
			productTypeId: this.props.match.params.id,
			freePrdctAttrs: null,
			selectedPrdctAttrs: null,
			selectedAttrs: null
		};
	}

	componentDidMount() {
		this.updateProductTypeState();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!_.isEqual(this.props.location, prevProps.location)) {
			this.updateProductTypeState();
		}
		if (
			(this.props.productType && !this.state.form) ||
			(this.props.productType && this.state.form && this.props.productType.id !== this.state.form.id)
		) {
			this.updateFormState();
		}

		if (this.props.match.params.id === 'new' && this.props.savingProductType === 'saved') {
			this.props.setProductTypeSaveLoader(false);
			let data = this.props.productType;
			this.props.history.replace('/app/configuration/producttypes/' + data.id);
			this.setState({ productTypeId: data.id });
		}

		if (this.props.freePrdctAttrs && !this.state.freePrdctAttrs) {
			this.setState({ freePrdctAttrs: this.props.freePrdctAttrs });
		}

		if (prevProps.freePrdctAttrs !== this.props.freePrdctAttrs) {
			this.setState({ freePrdctAttrs: this.props.freePrdctAttrs });
		}

		if (prevProps.productType !== this.props.productType) {
			this.updateFormState();
		}

		if (this.props.addingPrdctAttr === 'added') {
			this.props.setAddProductAttributeLoader(false);
		}
		if (this.props.deletingPrdctAttr === 'deleted') {
			this.props.setDeleteProductAttributeLoader(false);
		}
		if (this.props.addingAttr === 'added') {
			this.props.setAddAttributeLoader(false);
		}
		if (this.props.deletingAttr === 'deleted') {
			this.props.setDeleteAttributeLoader(false);
		}
	}

	updateProductTypeState = () => {
		const params = this.props.match.params;
		const { id } = params;
		this.props.setProductTypeLoader(true);
		if (id === 'new') {
			this.props.newProductType();
		} else {
			this.props.getProductType(id);
		}
	};

	updateFormState = () => {
		this.setState({
			form: this.props.productType,
			selectedPrdctAttrs: this.props.productType.product_attributes,
			selectedAttrs: this.props.productType.variant_attributes
		});
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

	handleToggle = (event) => {
		this.setState({
			form: _.set({ ...this.state.form }, event.target.name, event.target.checked)
		});
		let form = { ...this.state.form, has_variants: event.target.checked };
		this.props.setProductTypeSaveLoader(true);
		this.props.saveProductType(form);
	};

	canBeSubmitted() {
		const { name, weight } = this.state.form;
		let showSave;
		if (name.length > 0 && weight !== 0 && weight !== undefined && weight !== null && weight !== '')
			showSave = true;
		else showSave = false;
		return showSave && !_.isEqual(this.props.productType, this.state.form);
	}

	saveProductType = () => {
		this.props.setProductTypeSaveLoader(true);
		this.props.saveProductType(this.state.form);
	};

	getFreeProductAttrs = () => {
		this.props.setFreeProductAttrsLoader(true);
		this.props.getFreeProductAttrs();
	};

	modifyProductAttribute = (value) => {
		if (this.props.addingPrdctAttr !== true && this.props.deletingPrdctAttr !== true) {
			let { selectedPrdctAttrs } = this.state;
			if (value.length > selectedPrdctAttrs.length) {
				let obj = {
					id: value[value.length - 1].value,
					product_type: this.state.productTypeId,
					product_variant_type: null,
					type: 'add_product_specific_attribute'
				};
				this.props.setAddProductAttributeLoader(true);
				this.props.modifyProductAttribute(obj);
			} else if (value.length < selectedPrdctAttrs.length) {
				for (let i = 0; i < selectedPrdctAttrs.length; i++) {
					let count = 0;
					for (let j = 0; j < value.length; j++) {
						if (selectedPrdctAttrs[i].id === value[j].id) {
							break;
						} else count++;
					}
					if (count === value.length) {
						let obj = {
							id: selectedPrdctAttrs[i].id,
							product_type: null,
							product_variant_type: null,
							type: 'delete_product_specific_attribute'
						};
						this.props.setDeleteProductAttributeLoader(true);
						this.props.modifyProductAttribute(obj);
						break;
					}
				}
			}
		}
	};

	modifyAttributeValues = (value) => {
		if (this.props.addingAttr !== true && this.props.deletingAttr !== true) {
			let { selectedAttrs } = this.state;
			if (value.length > selectedAttrs.length) {
				let obj = {
					id: value[value.length - 1].value,
					product_type: null,
					product_variant_type: this.state.productTypeId,
					type: 'add_attribute_specific_value'
				};
				this.props.setAddAttributeLoader(true);
				this.props.modifyProductAttribute(obj);
			} else if (value.length < selectedAttrs.length) {
				for (let i = 0; i < selectedAttrs.length; i++) {
					let count = 0;
					for (let j = 0; j < value.length; j++) {
						if (selectedAttrs[i].id === value[j].id) {
							break;
						} else count++;
					}
					if (count === value.length) {
						let obj = {
							id: selectedAttrs[i].id,
							product_type: null,
							product_variant_type: null,
							type: 'delete_specific_attribute'
						};
						this.props.setDeleteAttributeLoader(true);
						this.props.modifyProductAttribute(obj);
						break;
					}
				}
			}
		}
	};

	render() {
		const {
			loading,
			savingProductType,
			loadingFreePrdctAttrs,
			deletingPrdctAttr,
			addingPrdctAttr,
			addingAttr,
			deletingAttr
		} = this.props;
		const { form, productTypeId, selectedPrdctAttrs, selectedAttrs, freePrdctAttrs } = this.state;

		let selectedPrdctAttrsValues = [];
		let selectedAttrsValues = [];
		let freePrdctAttrValues = [];

		if (form && productTypeId !== 'new' && selectedPrdctAttrs.length > 0) {
			selectedPrdctAttrsValues = selectedPrdctAttrs.map((item) => ({
				value: item.id,
				label: item.name
			}));
		}

		if (form && productTypeId !== 'new' && selectedAttrs.length > 0) {
			selectedAttrsValues = selectedAttrs.map((item) => ({
				value: item.id,
				label: item.name
			}));
		}

		if (form && productTypeId !== 'new' && freePrdctAttrs && freePrdctAttrs.length > 0) {
			freePrdctAttrValues = freePrdctAttrs.map((item) => ({
				value: item.id,
				label: item.name
			}));
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
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/configuration/producttypes"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Product Types
									</Typography>
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{form.name ? form.name : 'New Product Type'}
											</Typography>
										</FuseAnimate>
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography variant="caption">Product Type Detail</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									disabled={
										!this.canBeSubmitted() || (savingProductType && savingProductType !== 'saved')
									}
									onClick={this.saveProductType}
								>
									{savingProductType && savingProductType !== 'saved' ? 'Saving...' : 'Save'}
								</Button>
							</FuseAnimate>
						</div>
					)
				}
				content={
					<div className="p-16 sm:p-24">
						{loading && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loading &&
						form && (
							<div>
								<TextField
									className="mt-8 mb-16"
									required
									label="Name"
									autoFocus
									id="name"
									name="name"
									variant="outlined"
									fullWidth
									value={form.name}
									onChange={(e) => this.handleChange(e)}
								/>
								<TextField
									className="mt-8 mb-16"
									type="number"
									required
									label="Weight"
									id="weight"
									name="weight"
									variant="outlined"
									fullWidth
									value={form.weight}
									onChange={(e) => this.handleChange(e)}
								/>

								{productTypeId !== 'new' && (
									<FuseChipSelect
										className={classNames('w-full mt-24')}
										isClearable={false}
										isLoading={
											loadingFreePrdctAttrs ||
											(addingPrdctAttr && addingPrdctAttr !== 'added') ||
											(deletingPrdctAttr && deletingPrdctAttr !== 'deleted')
										}
										value={selectedPrdctAttrsValues}
										onChange={this.modifyProductAttribute}
										placeholder="Product Specific Attributes"
										textFieldProps={{
											label: 'Product Specific Attributes',
											InputLabelProps: {
												shrink: true
											},
											variant: 'outlined'
										}}
										isMulti
										options={freePrdctAttrValues}
										onFocus={this.getFreeProductAttrs}
									/>
								)}

								<div className="flex mt-16">
									{productTypeId !== 'new' && (
										<FuseChipSelect
											className={classNames('w-full my-16')}
											isClearable={false}
											isLoading={
												loadingFreePrdctAttrs ||
												(addingAttr && addingAttr !== 'added') ||
												(deletingAttr && deletingAttr !== 'deleted')
											}
											value={selectedAttrsValues}
											onChange={this.modifyAttributeValues}
											placeholder="Variant Specific Attributes"
											textFieldProps={{
												label: 'Variant Specific Attributes',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={freePrdctAttrValues}
											isMulti
											onFocus={this.getFreeProductAttrs}
											isDisabled={form.has_variants === false}
										/>
									)}
									<FormControlLabel
										style={{ width: '180px' }}
										className="ml-4"
										label="Has Variants"
										labelPlacement="start"
										control={
											<Switch
												checked={form.has_variants}
												onChange={(e) => this.handleToggle(e)}
												name="has_variants"
												disabled={selectedAttrsValues.length > 0}
											/>
										}
									/>
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
			getProductType: Actions.getProductType,
			newProductType: Actions.newProductType,
			saveProductType: Actions.saveProductType,
			getFreeProductAttrs: Actions.getFreeProductAttrs,
			modifyProductAttribute: Actions.modifyProductAttribute,
			setProductTypeLoader: Actions.setProductTypeLoader,
			setProductTypeSaveLoader: Actions.setProductTypeSaveLoader,
			setFreeProductAttrsLoader: Actions.setFreeProductAttrsLoader,
			setAddProductAttributeLoader: Actions.setAddProductAttributeLoader,
			setDeleteProductAttributeLoader: Actions.setDeleteProductAttributeLoader,
			setAddAttributeLoader: Actions.setAddAttributeLoader,
			setDeleteAttributeLoader: Actions.setDeleteAttributeLoader
		},
		dispatch
	);
}

function mapStateToProps({ productTypeApp }) {
	return {
		productType: productTypeApp.producttype.data,
		loading: productTypeApp.producttype.loading,
		savingProductType: productTypeApp.producttype.savingProductType,
		freePrdctAttrs: productTypeApp.producttype.freePrdctAttrs,
		loadingFreePrdctAttrs: productTypeApp.producttype.loadingFreePrdctAttrs,
		addingPrdctAttr: productTypeApp.producttype.addingPrdctAttr,
		deletingPrdctAttr: productTypeApp.producttype.deletingPrdctAttr,
		addingAttr: productTypeApp.producttype.addingAttr,
		deletingAttr: productTypeApp.producttype.deletingAttr
	};
}

export default withReducer('productTypeApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductType)))
);
