import 'date-fns';
import React, { Component } from 'react';
import {
	Paper,
	TextField,
	MenuItem,
	Radio,
	RadioGroup,
	FormControlLabel,
	CircularProgress,
	FormControl,
	FormLabel,
	Checkbox,
	InputAdornment,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Icon
} from '@material-ui/core';
import { FusePageCarded, FuseChipSelect, FuseAnimate } from '@fuse';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { format } from 'date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../../catalogue/store/actions';
import reducer from '../../catalogue/store/reducers';
import withReducer from 'app/store/withReducer';
import { withRouter } from 'react-router-dom';

const styles = () => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400
	},
	input: {
		marginLeft: 8,
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4
	},
	circle: {
		width: 12,
		height: 12,
		margin: 2,
		borderRadius: '50%'
	},
	selected: {
		backgroundColor: '#E6E6E6',
		padding: '6px 12px',
		borderRadius: 3,
		marginRight: 8
	}
});
const customerGrps = [
	{ id: 1, name: 'Abandoned checkouts' },
	{ id: 2, name: 'Email subscribers' },
	{ id: 3, name: 'Returning' },
	{ id: 4, name: 'Mobile list-121' },
	{ id: 5, name: 'Mobile list - 202' },
	{ id: 6, name: 'Mobile list - 109' }
];

class CreateDiscount extends Component {
	state = {
		active: false,
		discountCode: '',

		discountType: 'Percentage',
		percentage: '',
		fixedAmount: '',
		freeShipping: false,

		appliesTo: 'Entire Order',

		openCollections: false,
		selectedCollections: [],

		openProducts: false,
		selectedProducts: [],

		minimumRequirement: 'none',
		minimumPurchaseAmnt: '',
		minimumItemsQty: '',

		customerEligibility: 'Everyone',
		selectedCustomerGrps: [],
		openCustomerGrps: false,

		usageLimit: 'limit-one',
		limitNoOfTimes: '',

		startDate: Date.now(),
		endDate: Date.now(),
		setEndDate: false
	};
	handleChange = (e) => {
		if (!this.state.active) {
			this.setState({ active: true });
		}
		if (e.target.type === 'checkbox') {
			this.setState({ [e.target.name]: e.target.checked });
		} else {
			if (e.target.name === 'discountCode') {
				this.setState({ [e.target.name]: e.target.value.toUpperCase() });
			} else {
				this.setState({ [e.target.name]: e.target.value });
			}
		}
	};
	codeGenerate = () => {
		this.setState({ discountCode: 'WX05MFY9E9RH' });
	};

	handleCollectionOpen = () => {
		this.setState({ openCollections: true });
		if (!this.props.collections) {
			this.props.setCollectionsLoader(true);
			this.props.getCollections();
		}
	};
	handleCollectionClick = (collection) => {
		let { selectedCollections } = this.state;
		let val = this.checkCollectionId(collection.id);
		if (val) {
			let filtered = selectedCollections.filter((item) => {
				return item.id !== collection.id;
			});
			this.setState({ selectedCollections: filtered });
		} else {
			selectedCollections.push(collection);
			this.setState({ selectedCollections });
		}
	};
	checkCollectionId = (id) => {
		let { selectedCollections } = this.state;
		let ind = selectedCollections.findIndex((item) => {
			return item.id === id;
		});
		if (ind >= 0) return true;
		return false;
	};

	handleProductsOpen = () => {
		this.setState({ openProducts: true });
	};
	handleSearch = (inputValue) => {
		if (inputValue !== '' && inputValue.length > 2) {
			this.props.setSearchedProductsLoader(true);
			this.props.getSearchedProducts(inputValue);
		}
	};
	handleProductClick = (value) => {
		if (value.length > 0) {
			let selectedProducts = [];
			for (let i = 0; i < value.length; i++) {
				let obj = value[i];
				let objData = {
					name: obj.label,
					id: obj.value
				};
				selectedProducts.push(objData);
			}
			this.setState({ selectedProducts });
		} else {
			this.setState({ selectedProducts: [] });
		}
	};
	checkProductId = (id) => {
		let { selectedProducts } = this.state;
		let ind = selectedProducts.findIndex((item) => {
			return item.id === id;
		});
		if (ind >= 0) return true;
		return false;
	};

	handleCustomerGrpsOpen = () => {
		this.setState({ openCustomerGrps: true });
	};
	handleGroupClick = (group) => {
		let { selectedCustomerGrps } = this.state;
		let val = this.checkGroupId(group.id);
		if (val) {
			let filtered = selectedCustomerGrps.filter((item) => {
				return item.id !== group.id;
			});
			this.setState({ selectedCustomerGrps: filtered });
		} else {
			selectedCustomerGrps.push(group);
			this.setState({ selectedCustomerGrps });
		}
	};
	checkGroupId = (id) => {
		let { selectedCustomerGrps } = this.state;
		let ind = selectedCustomerGrps.findIndex((item) => {
			return item.id === id;
		});
		if (ind >= 0) return true;
		return false;
	};

	handleClose = () => {
		this.setState({ openCollections: false, openProducts: false, openCustomerGrps: false });
	};

	handleStartDateChange = (date) => {
		if (!this.state.active) {
			this.setState({ active: true });
		}
		this.setState({ startDate: date });
	};
	handleEndDateChange = (date) => {
		if (!this.state.active) {
			this.setState({ active: true });
		}
		this.setState({ endDate: date });
	};

	render() {
		const { classes, collections, loadingCollections, loadingProducts, products } = this.props;
		const {
			active,
			discountCode,
			discountType,
			percentage,
			fixedAmount,
			freeShipping,
			appliesTo,
			openCollections,
			selectedCollections,
			openProducts,
			selectedProducts,

			minimumRequirement,
			minimumPurchaseAmnt,
			minimumItemsQty,

			customerEligibility,
			selectedCustomerGrps,
			openCustomerGrps,

			usageLimit,
			limitNoOfTimes,

			startDate,
			setEndDate,
			endDate
		} = this.state;

		let prdctOptions = [];
		let selectedPrdcts = [];
		if (products && products.results && products.results.length > 0) {
			for (let i = 0; i < products.results.length; i++) {
				let obj = products.results[i];
				let objData = {
					label: obj.name,
					value: obj.id
				};
				prdctOptions.push(objData);
			}
		}
		if (selectedProducts && selectedProducts.length > 0) {
			for (let i = 0; i < selectedProducts.length; i++) {
				let obj = selectedProducts[i];
				let objData = {
					label: obj.name,
					value: obj.id
				};
				selectedPrdcts.push(objData);
			}
		}

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-52'
				}}
				header={
					<div className="w-full p-24 flex items-center justify-between">
						<div>
							<h1 className="text-20 font-600 mb-12">Create Discounts</h1>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/app/discounts"
								>
									<Icon className="mr-4 text-20">arrow_back</Icon>
									Discounts
								</Typography>
							</FuseAnimate>
						</div>
						<Button className="whitespace-no-wrap" variant="contained" component={Link} to="/app/discounts">
							Save
						</Button>
					</div>
				}
				content={
					<div style={{ backgroundColor: '#EAEEF1' }}>
						<div className="flex flex-row pt-24 px-12">
							<div className="flex flex-col w-full sm:w-2/3 m-16">
								<Paper className="w-full p-16" elevation={1}>
									<div className="flex flex-row justify-between">
										<h5>Discount code</h5>
										<p onClick={this.codeGenerate} className="cursor-pointer">
											Generate code
										</p>
									</div>
									<TextField
										id="outlined-name"
										placeholder="Discount Code"
										name="discountCode"
										className="w-full"
										value={discountCode}
										onChange={(e) => this.handleChange(e)}
										margin="normal"
										variant="outlined"
										InputProps={{
											style: {
												height: 52
											}
										}}
									/>
								</Paper>
								<Paper className="w-full p-20 mt-28" elevation={1}>
									<h4>Options</h4>
									<div className="w-full flex flex-row items-center pt-12">
										<div className="w-1/2">
											<p className="text-14 mb-6">Discount types</p>
											<TextField
												value={discountType}
												select
												name="discountType"
												onChange={(e) => this.handleChange(e)}
												variant="outlined"
												fullWidth
												InputProps={{
													style: {
														height: 52
													}
												}}
											>
												<MenuItem value="Percentage">Percentage</MenuItem>
												<MenuItem value="Fixed amount">Fixed amount</MenuItem>
												<MenuItem value="Free Shipping">Free Shipping</MenuItem>
											</TextField>
										</div>
										<div className="w-1/2 ml-16">
											{discountType === 'Percentage' && (
												<React.Fragment>
													<p className="text-14 mb-6">Percentage</p>
													<TextField
														className={classNames(classes.margin, classes.textField)}
														variant="outlined"
														name="percentage"
														value={percentage}
														onChange={(e) => this.handleChange(e)}
														InputProps={{
															endAdornment: (
																<InputAdornment position="end">%</InputAdornment>
															),
															style: {
																height: 52
															}
														}}
														fullWidth
													/>
												</React.Fragment>
											)}
											{discountType === 'Fixed amount' && (
												<React.Fragment>
													<p className="text-14 mb-6">Amount</p>
													<TextField
														className={classNames(classes.margin, classes.textField)}
														variant="outlined"
														type="number"
														name="fixedAmount"
														value={fixedAmount}
														onChange={(e) => this.handleChange(e)}
														InputProps={{
															endAdornment: (
																<InputAdornment position="end">₹</InputAdornment>
															),
															style: {
																height: 52
															}
														}}
														fullWidth
													/>
												</React.Fragment>
											)}
										</div>
									</div>
								</Paper>
								<Paper className="w-full p-20 mt-28">
									<div className="mt-8">
										<FormControl component="fieldset" className="">
											<FormLabel component="legend">Applies To</FormLabel>
											<RadioGroup
												aria-label=""
												name="appliesTo"
												className={classes.group}
												value={appliesTo}
												onChange={(e) => {
													this.handleChange(e);
												}}
											>
												<FormControlLabel
													value="Entire Order"
													control={<Radio />}
													label="Entire Order"
												/>
												<FormControlLabel
													value="Specific Collections"
													control={<Radio />}
													label="Specific Collections"
												/>
												{appliesTo === 'Specific Collections' && (
													<div className="mt-4 mb-12 flex flex-row flex-wrap items-center">
														{selectedCollections &&
															selectedCollections.map((item, index) => (
																<div key={index} className={classes.selected}>
																	<p>{item.name}</p>
																</div>
															))}
														<Button
															variant="outlined"
															size="small"
															className="ml-12"
															onClick={this.handleCollectionOpen}
														>
															Browse
														</Button>
													</div>
												)}
												<FormControlLabel
													value="Specific Products"
													control={<Radio />}
													label="Specific Products"
												/>
												{appliesTo === 'Specific Products' && (
													<div className="mt-4 mb-12 flex flex-row flex-wrap items-center">
														{selectedProducts &&
															selectedProducts.map((item, index) => (
																<div key={index} className={classes.selected}>
																	<p>{item.name}</p>
																</div>
															))}
														<Button
															variant="outlined"
															size="small"
															className="ml-12"
															onClick={this.handleProductsOpen}
														>
															Browse
														</Button>
													</div>
												)}
											</RadioGroup>
										</FormControl>
									</div>
								</Paper>
								<Paper className="w-full p-20 mt-28">
									<div className="mt-8">
										<FormControl component="fieldset" className="">
											<FormLabel component="legend">Minimum requirement</FormLabel>
											<RadioGroup
												aria-label=""
												name="minimumRequirement"
												className={classes.group}
												value={minimumRequirement}
												onChange={(e) => {
													this.handleChange(e);
												}}
											>
												<FormControlLabel value="none" control={<Radio />} label="none" />
												<FormControlLabel
													value="Minimum Purchase amount"
													control={<Radio />}
													label="Minimum Purchase amount"
												/>
												{minimumRequirement === 'Minimum Purchase amount' && (
													<div className="mt-4 mb-8">
														<TextField
															variant="outlined"
															name="minimumPurchaseAmnt"
															value={minimumPurchaseAmnt}
															onChange={this.handleChange}
															placeholder="Rs"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">₹</InputAdornment>
																),
																style: {
																	height: 48,
																	width: 280
																}
															}}
														/>
													</div>
												)}
												<FormControlLabel
													value="Minimum Quntity of items"
													control={<Radio />}
													label="Minimum Quntity of items"
												/>
												{minimumRequirement === 'Minimum Quntity of items' && (
													<div className="mt-4 mb-6">
														<TextField
															variant="outlined"
															type="number"
															name="minimumItemsQty"
															value={minimumItemsQty}
															onChange={this.handleChange}
															placeholder="Quantity of items"
															InputProps={{
																style: {
																	height: 48,
																	width: 280
																}
															}}
														/>
													</div>
												)}
											</RadioGroup>
										</FormControl>
									</div>
								</Paper>
								<Paper className="w-full p-20 mt-28">
									<div className="mt-8">
										<FormControl component="fieldset" className="">
											<FormLabel component="legend">Customer Eligibility</FormLabel>
											<RadioGroup
												aria-label=""
												name="customerEligibility"
												className={classes.group}
												value={customerEligibility}
												onChange={(e) => {
													this.handleChange(e);
												}}
											>
												<FormControlLabel
													value="Everyone"
													control={<Radio />}
													label="Everyone"
												/>
												<FormControlLabel
													value="Specific group of customers"
													control={<Radio />}
													label="Specific group of customers"
												/>
												{customerEligibility === 'Specific group of customers' && (
													<div className="mt-4 mb-12 flex flex-row flex-wrap items-center">
														{selectedCustomerGrps &&
															selectedCustomerGrps.map((item, index) => (
																<div key={index} className={classes.selected}>
																	<p>{item.name}</p>
																</div>
															))}
														<Button
															variant="outlined"
															size="small"
															className="ml-12"
															onClick={this.handleCustomerGrpsOpen}
														>
															Browse
														</Button>
													</div>
												)}
												<FormControlLabel
													value="Specific Customers"
													control={<Radio />}
													label="Specific Customers"
												/>
											</RadioGroup>
										</FormControl>
									</div>
								</Paper>
								<Paper className="w-full p-20 mt-28">
									<div className="mt-8">
										<FormControl component="fieldset" className="">
											<FormLabel component="legend">Usage limits</FormLabel>
											<RadioGroup
												aria-label=""
												name="usageLimit"
												value={usageLimit}
												onChange={(e) => {
													this.handleChange(e);
												}}
											>
												<FormControlLabel
													value="limit-one"
													control={<Radio />}
													label="Limit to one use per customer"
												/>
												<FormControlLabel
													value="limit-no-of"
													control={<Radio />}
													label="Limit number of times this discount can be used in total"
												/>
												{usageLimit === 'limit-no-of' && (
													<div className="mt-4 mb-8">
														<TextField
															variant="outlined"
															type="number"
															name="limitNoOfTimes"
															value={limitNoOfTimes}
															onChange={this.handleChange}
															placeholder="Enter limit"
															InputProps={{
																style: {
																	height: 48,
																	width: 280
																}
															}}
														/>
													</div>
												)}
											</RadioGroup>
										</FormControl>
									</div>
								</Paper>
								<Paper className="w-full p-20 py-24 my-28">
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<h4 className="pb-20 ml-12">Active dates</h4>
										<div className="w-full flex flex-row">
											<div className="w-1/2">
												<div className="pr-20 pl-8 py-4">
													<DatePicker
														variant="outlined"
														label="Start date"
														value={startDate}
														onChange={this.handleStartDateChange}
														fullWidth
													/>
												</div>
											</div>
											<div className="w-1/2">
												<div className="pl-20 pr-8 py-4">
													<TimePicker
														variant="outlined"
														label="Start time"
														value={startDate}
														onChange={this.handleStartDateChange}
														fullWidth
													/>
												</div>
											</div>
										</div>

										<div className="px-12 my-12">
											<FormControlLabel
												control={
													<Checkbox
														checked={setEndDate}
														onChange={() => {
															this.setState({ setEndDate: !setEndDate });
														}}
													/>
												}
												label="Set end Date"
											/>
										</div>

										{setEndDate && (
											<div className="w-full flex flex-row py-6">
												<div className="w-1/2">
													<div className="pr-20 pl-8 py-4">
														<DatePicker
															variant="outlined"
															label="End date"
															value={endDate}
															onChange={this.handleEndDateChange}
															fullWidth
														/>
													</div>
												</div>
												<div className="w-1/2">
													<div className="pl-20 pr-8 py-4">
														<TimePicker
															variant="outlined"
															label="End time"
															value={endDate}
															onChange={this.handleEndDateChange}
															fullWidth
														/>
													</div>
												</div>
											</div>
										)}
									</MuiPickersUtilsProvider>
								</Paper>
							</div>

							<div className="flex flex-col w-full sm:w-1/3 m-16">
								<Paper>
									{/* summary */}
									<div style={{ borderBottom: '1px solid rgb(230, 224, 224)' }} className="p-16">
										<h4 className="my-16 ml-8">Summary</h4>
										<p className="my-12 ml-8 border-bottom">
											{discountCode !== '' ? discountCode : 'No information entered yet'}
										</p>
									</div>

									{/* performances */}
									<div className="px-16">
										<h4 className="mt-16 ml-8">Performances</h4>
										{active ? (
											<ul className="px-16 pb-8">
												{discountType === 'Percentage' &&
												percentage !== '' && (
													<li className="my-16 ml-8 border-bottom">
														{percentage}% off on {appliesTo}
													</li>
												)}
												{discountType === 'Fixed amount' &&
												fixedAmount !== '' && (
													<li className="my-16 ml-8 border-bottom">
														{fixedAmount}₹ off on {appliesTo}
													</li>
												)}
												{discountType === 'Free Shipping' &&
												freeShipping && (
													<li className="my-16 ml-8 border-bottom">
														Free shipping on {appliesTo}
													</li>
												)}

												{minimumRequirement === 'none' && (
													<li className="my-16 ml-8 border-bottom">No minimum requirement</li>
												)}
												{minimumRequirement === 'Minimum Purchase amount' &&
												minimumPurchaseAmnt !== '' && (
													<li className="my-16 ml-8 border-bottom">
														Minimum purchase amount is ₹{minimumPurchaseAmnt}
													</li>
												)}
												{minimumRequirement === 'Minimum Quntity of items' &&
												minimumItemsQty !== '' && (
													<li className="my-16 ml-8 border-bottom">
														Minimum quantity of items is {minimumItemsQty}
													</li>
												)}

												{customerEligibility === 'Everyone' && (
													<li className="my-16 ml-8 border-bottom">Eligible for everyone</li>
												)}
												{customerEligibility === 'Specific group of customers' && (
													<li className="my-16 ml-8 border-bottom">
														Eligible for {selectedCustomerGrps.length} groups of customers
													</li>
												)}
												{customerEligibility === 'Specific Customers' && (
													<li className="my-16 ml-8 border-bottom">
														Eligible for specific customers
													</li>
												)}

												{usageLimit === 'limit-one' && (
													<li className="my-16 ml-8 border-bottom">
														Limit to one use per customer
													</li>
												)}
												{usageLimit === 'limit-no-of' &&
												limitNoOfTimes !== '' && (
													<li className="my-16 ml-8 border-bottom">
														Limit of {limitNoOfTimes} uses
													</li>
												)}
												{startDate && (
													<li className="my-16 ml-8 border-bottom">
														Active from{' '}
														{format(new Date(startDate), "ha', 'MMMM dd', 'yyyy")}.
													</li>
												)}
												{setEndDate && (
													<li className="my-16 ml-8 border-bottom">
														Ends in {format(new Date(endDate), "ha', 'MMMM dd', 'yyyy")}.
													</li>
												)}
											</ul>
										) : (
											<p className="my-16 ml-8 border-bottom">discount is not active yet</p>
										)}
									</div>
								</Paper>

								<Paper className="my-28 p-20">
									<h4 className="my-16 ml-8">CAN’T COMBINE WITH OTHER AUTOMATIC DISCOUNTS</h4>
									<p className="my-16 ml-8 border-bottom">
										Customers won’t be able to enter a code if an automatic discount is already
										applied at checkout.
									</p>
								</Paper>
							</div>
						</div>

						<Dialog
							open={openCollections || openProducts || openCustomerGrps}
							onClose={this.handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
							maxWidth="md"
							fullWidth={true}
						>
							<DialogTitle id="alert-dialog-title">
								{openProducts && 'Add Products'}
								{openCollections && 'Add collections'}
								{openCustomerGrps && 'Add customer groups'}
							</DialogTitle>

							{openCollections && (
								<DialogContent>
									{loadingCollections ? (
										<div className="w-full flex justify-center py-24">
											<CircularProgress />
										</div>
									) : (
										<div className="w-full flex flex-row flex-wrap py-12">
											{collections &&
												collections.results &&
												collections.results.map((collection, index) => (
													<div className="w-1/4" key={index}>
														<Paper
															className="w-full rounded-none cursor-pointer"
															onClick={() => this.handleCollectionClick(collection)}
														>
															<div
																className="w-full flex items-center justify-center py-36"
																style={{ borderBottom: '1px solid #f1f1f1' }}
															>
																<p className="text-18">{collection.name}</p>
															</div>
															<div className="w-full flex items-center justify-end p-6">
																<div
																	style={{
																		border: this.checkCollectionId(collection.id)
																			? '2px solid #1F3943'
																			: '2px solid #707070',
																		borderRadius: '50%'
																	}}
																>
																	<div
																		className={classes.circle}
																		style={{
																			backgroundColor: this.checkCollectionId(
																				collection.id
																			)
																				? '#1F3943'
																				: '#fff'
																		}}
																	/>
																</div>
															</div>
														</Paper>
													</div>
												))}
										</div>
									)}
								</DialogContent>
							)}
							{openProducts && (
								<DialogContent>
									<div className="p-20" style={{ minHeight: '24rem' }}>
										<FuseChipSelect
											className="w-full"
											isClearable={false}
											value={selectedPrdcts}
											isLoading={loadingProducts}
											onInputChange={this.handleSearch}
											onChange={this.handleProductClick}
											placeholder="Search Products"
											textFieldProps={{
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={prdctOptions}
											isMulti
										/>
										{selectedProducts && (
											<div className="w-full flex flex-row flex-wrap py-12">
												{selectedProducts.map((product, index) => (
													<div className="w-1/4" key={index}>
														<div className="p-4">
															<Paper className="w-full rounded-none cursor-pointer">
																<div
																	className="w-full flex items-center justify-center py-36"
																	style={{ borderBottom: '1px solid #f1f1f1' }}
																>
																	<p className="text-18">{product.name}</p>
																</div>
																<div className="w-full flex items-center justify-end p-6">
																	<div
																		style={{
																			border: this.checkProductId(product.id)
																				? '2px solid #1F3943'
																				: '2px solid #707070',
																			borderRadius: '50%'
																		}}
																	>
																		<div
																			className={classes.circle}
																			style={{
																				backgroundColor: this.checkProductId(
																					product.id
																				)
																					? '#1F3943'
																					: '#fff'
																			}}
																		/>
																	</div>
																</div>
															</Paper>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</DialogContent>
							)}
							{openCustomerGrps && (
								<DialogContent>
									<div className="w-full flex flex-row flex-wrap p-16">
										{customerGrps &&
											customerGrps.map((group, index) => (
												<div className="w-1/3" key={index}>
													<div className="p-12">
														<Paper
															className="w-full rounded-none cursor-pointer"
															onClick={() => this.handleGroupClick(group)}
														>
															<div
																className="w-full flex items-center justify-center py-36"
																style={{ borderBottom: '1px solid #f1f1f1' }}
															>
																<p className="text-18">{group.name}</p>
															</div>
															<div className="w-full flex items-center justify-end p-6">
																<div
																	style={{
																		border: this.checkGroupId(group.id)
																			? '2px solid #1F3943'
																			: '2px solid #707070',
																		borderRadius: '50%'
																	}}
																>
																	<div
																		className={classes.circle}
																		style={{
																			backgroundColor: this.checkGroupId(group.id)
																				? '#1F3943'
																				: '#fff'
																		}}
																	/>
																</div>
															</div>
														</Paper>
													</div>
												</div>
											))}
									</div>
								</DialogContent>
							)}

							<DialogActions>
								<Button color="primary" onClick={this.handleClose}>
									cancel
								</Button>
								<Button color="primary" onClick={this.handleClose}>
									Add
								</Button>
							</DialogActions>
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
			getCollections: Actions.getCollections,
			setCollectionsLoader: Actions.setCollectionsLoader,

			getSearchedProducts: Actions.getSearchedProducts,
			setSearchedProductsLoader: Actions.setSearchedProductsLoader
		},
		dispatch
	);
}

function mapStateToProps({ collectionsApp }) {
	return {
		collections: collectionsApp.collections.collections,
		loadingCollections: collectionsApp.collections.loading,

		products: collectionsApp.collection.searchedProducts,
		loadingProducts: collectionsApp.collection.loadingSearchPrdcts
	};
}

export default withReducer('collectionsApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateDiscount)))
);
