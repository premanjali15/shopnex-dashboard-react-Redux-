import React, { Component } from 'react';
import { FuseAnimate, FusePageCarded } from '@fuse';
import {
	Typography,
	Icon,
	TextField,
	Button,
	Paper,
	CircularProgress,
	Slide,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControlLabel,
	Switch,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton
} from '@material-ui/core';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from '../../store/reducers';
import * as Actions from '../../store/actions';
import { Link } from 'react-router-dom';
import { FuseChipSelect } from '@fuse';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

class ShippingZone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: null,
			updateType: null,
			rateForm: null,
			openRateDialog: false,
			saveType: null,
			prevStates: []
		};
	}

	componentDidMount() {
		this.props.getShippingStates();
		this.props.setShippingStatesLoader(true);
		this.props.setShippingZoneLoader(true);
		this.props.getShippingZone(this.props.match.params.zoneId);
	}

	componentDidUpdate(prevProps) {
		if (this.props.data && !this.state.form) {
			this.setState({ form: this.props.data, prevStates: this.props.data.states });
		}
		if (prevProps.data !== this.props.data) {
			this.setState({ form: this.props.data });
		}
		if (this.props.savingZone === 'saved') {
			this.props.setSaveShippingZoneLoader(false);
		}
		if (this.props.match.params.zoneId === 'new' && this.props.savingZone === 'saved') {
			this.props.setSaveShippingZoneLoader(false);
			let data = this.props.data;
			this.props.history.push('/app/shippingzones/' + data.id);
		}
	}

	handleChange = (event) => {
		this.setState({
			form: _.set({ ...this.state.form }, event.target.name, event.target.value)
		});
	};

	handleChipChange = (value) => {
		let states = _.clone(this.state.form.states);
		if (value.length > states.length) {
			let option = value[value.length - 1];
			let obj = { geoname_id: option.id, name: option.label };
			states.push(obj);

			let data = {
				id: this.state.form.id,
				states: states
			};
			this.props.setModifyShippingZoneStatesLoader(true);
			this.props.modifyShippingZoneStates(data);
			// this.setState({ form: { ...this.state.form, states } });
		}
		if (value.length < states.length) {
			for (let i = 0; i < states.length; i++) {
				let count = 0;
				for (let j = 0; j < value.length; j++) {
					if (states[i].geoname_id === value[j].id) {
						break;
					} else count++;
				}
				if (count === value.length) {
					var filtered = states.filter(function(state) {
						return state.geoname_id !== states[i].geoname_id;
					});
					let data = {
						id: this.state.form.id,
						states: filtered
					};
					this.props.setModifyShippingZoneStatesLoader(true);
					this.props.modifyShippingZoneStates(data);
					// this.setState({ form: { ...this.state.form, states: filtered } });
					break;
				}
			}
		}
	};

	handleRateBtnClick = (type) => {
		let rateForm = {
			charge: null,
			freeshipping: false,
			min_value: null,
			max_value: null,
			name: '',
			type: type
		};
		this.setState({ rateForm, openRateDialog: true, saveType: 'new' });
	};

	closeRateDialog = () => {
		this.setState({ rateForm: null, openRateDialog: false, saveType: null });
	};

	handleChangeMethodForm = (event) => {
		this.setState({
			rateForm: _.set(
				{ ...this.state.rateForm },
				event.target.name,
				event.target.type === 'checkbox' ? event.target.checked : event.target.value
			)
		});
	};

	canBeSubmitted() {
		const { name, charge, min_value } = this.state.rateForm;
		let showSave;
		if (
			name &&
			name !== '' &&
			charge &&
			charge !== '' &&
			min_value &&
			min_value !== '' &&
			min_value !== '0' &&
			parseFloat(min_value) > 0
		)
			showSave = true;
		else showSave = false;

		return showSave;
	}

	saveMethod = () => {
		let { saveType } = this.state;
		let rateForm = _.clone(this.state.rateForm);
		let { methods } = this.state.form;
		if (saveType === 'new') {
			rateForm['ID'] = (methods.length + 1).toString();
			if (rateForm.max_value === '') rateForm['max_value'] = null;
			methods.push(rateForm);
			this.setState({
				form: { ...this.state.form, methods }
			});
		} else if (saveType === 'update') {
			if (rateForm.id) {
				let ind = methods.findIndex((mthd) => {
					return mthd.id === rateForm.id;
				});
				methods[ind] = rateForm;
			} else if (rateForm.ID) {
				let ind = methods.findIndex((mthd) => {
					return mthd.ID === rateForm.ID;
				});
				methods[ind] = rateForm;
			}
			this.setState({
				form: { ...this.state.form, methods }
			});
		}
		this.closeRateDialog();
	};

	handleEditMethod = (method) => {
		this.setState({ rateForm: method, openRateDialog: true, saveType: 'update' });
	};

	handleDelteMethod = (method) => {
		let { methods } = this.state.form;
		let filtered;
		if (method.id) {
			filtered = methods.filter(function(mthd) {
				return mthd.id !== method.id;
			});
		} else if (method.ID) {
			filtered = methods.filter(function(mthd) {
				return mthd.ID !== method.ID;
			});
		}
		this.setState({
			form: { ...this.state.form, methods: filtered }
		});
	};

	saveShippingZone = () => {
		let { form } = this.state;
		if (form && form.title) {
			this.props.setSaveShippingZoneLoader(true);
			this.props.saveShippingZone(form);
		}
	};

	render() {
		const { loading, loadingShippingStates, shippingStates, savingZone, modifyingStates } = this.props;
		const { form, rateForm, openRateDialog, prevStates } = this.state;

		let prevSts = {};
		prevStates.forEach(function(item) {
			prevSts[item.geoname_id] = true;
		});

		let states = [];
		let disabledOptions = [];
		if (shippingStates !== undefined && shippingStates !== null) {
			disabledOptions = shippingStates.disable;
			states = shippingStates.states.map((item) => ({
				value: item.name_ascii,
				label: item.name_ascii,
				id: item.geoname_id,
				disabled: disabledOptions[item.geoname_id] && (prevSts.length === 0 || !prevSts[item.geoname_id])
			}));
		}

		let selectedStates = [];
		if (form !== undefined && form !== null && form.states) {
			selectedStates = form.states.map((item) => ({
				value: item.name,
				label: item.name,
				id: item.geoname_id,
				disabled: disabledOptions[item.geoname_id]
			}));
		}

		let priceMethods = [];
		let weightMethods = [];
		if (form && form.methods) {
			priceMethods = _.filter(form.methods, [ 'type', 'pb' ]);
			weightMethods = _.filter(form.methods, [ 'type', 'wb' ]);
		}

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					!loading &&
					form && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to={'/app/shippingzones'}
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Shipping Zones
									</Typography>
								</FuseAnimate>
								<div className="flex items-center max-w-full">
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{form.type === 'new' ? 'New Zone' : form.title}
											</Typography>
										</FuseAnimate>
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography variant="caption">Shipping Zone Detail</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									disabled={
										!form.title || form.title === '' || (savingZone !== 'saved' && savingZone)
									}
									onClick={this.saveShippingZone}
								>
									{savingZone !== 'saved' && savingZone ? 'Saving...' : 'Save'}
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
						{!loading &&
						form && (
							<div className="flex flex-col justify-center items-center p-32">
								<div className="flex w-full items-center justify-center">
									<div className="md:w-4/5 xl:w-2/3">
										<Paper className="rounded-4 p-16">
											<p className="text-20">Zone name</p>
											<TextField
												className="mt-16 mb-8"
												label="Zone name"
												id="title"
												name="title"
												value={form.title}
												onChange={this.handleChange}
												variant="outlined"
												fullWidth
												required
											/>
										</Paper>
										{this.props.match.params.zoneId !== 'new' && (
											<React.Fragment>
												<Paper className="my-28 rounded-4 p-16">
													<p className="text-20">States</p>
													<FuseChipSelect
														className="w-full mt-16 mb-8"
														isClearable={false}
														isLoading={loadingShippingStates || modifyingStates}
														value={selectedStates}
														onChange={this.handleChipChange}
														placeholder="Select States"
														variant="fixed"
														onInputChange={this.searchedProducts}
														textFieldProps={{
															label: 'States',
															InputLabelProps: {
																shrink: true
															},
															variant: 'outlined',
															value: this.state.searchText
														}}
														options={states}
														isMulti
													/>
												</Paper>
												<Paper className="rounded-4 p-16 my-28">
													<div className="flex justify-between items-center my-8">
														<p className="text-20">Price based rates</p>
														<Button
															variant="outlined"
															color="secondary"
															onClick={() => this.handleRateBtnClick('pb')}
														>
															Add rate
														</Button>
													</div>
													{priceMethods &&
													priceMethods.length > 0 && (
														<Table className="simple invoice-table mb-16">
															<TableHead>
																<TableRow className="h-64">
																	<TableCell className="text-center text-14">
																		Name
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Charge
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Min Value
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Max Value
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Free Shipping
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Actions
																	</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{priceMethods.map((method, index) => {
																	return (
																		<TableRow key={index}>
																			<TableCell className="text-center">
																				{method.name}
																			</TableCell>
																			<TableCell className="text-center">
																				{method.charge}
																			</TableCell>
																			<TableCell className="text-center">
																				{method.min_value}
																			</TableCell>
																			<TableCell className="text-center">
																				{method.max_value ? (
																					method.max_value
																				) : (
																					'-'
																				)}
																			</TableCell>
																			<TableCell scope="row" align="center">
																				{method.freeshipping ? (
																					<Icon className="text-green text-20">
																						check_circle
																					</Icon>
																				) : (
																					<Icon className="text-red text-20">
																						remove_circle
																					</Icon>
																				)}
																			</TableCell>
																			<TableCell className="text-center">
																				<IconButton
																					onClick={() => {
																						this.handleEditMethod(method);
																					}}
																				>
																					<Icon className="text-20">
																						edit
																					</Icon>
																				</IconButton>
																				<IconButton
																					onClick={() => {
																						this.handleDelteMethod(method);
																					}}
																				>
																					<Icon className="text-20">
																						delete
																					</Icon>
																				</IconButton>
																			</TableCell>
																		</TableRow>
																	);
																})}
															</TableBody>
														</Table>
													)}
												</Paper>
												<Paper className="rounded-4 p-16 my-28">
													<div className="flex justify-between items-center my-8">
														<p className="text-20">Weight based rates</p>
														<Button
															variant="outlined"
															color="secondary"
															onClick={() => this.handleRateBtnClick('wb')}
														>
															Add rate
														</Button>
													</div>
													{weightMethods &&
													weightMethods.length > 0 && (
														<Table className="simple invoice-table mb-16">
															<TableHead>
																<TableRow className="h-64">
																	<TableCell className="text-center text-14">
																		Name
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Charge
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Min Value
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Max Value
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Free Shipping
																	</TableCell>
																	<TableCell className="text-center text-14">
																		Actions
																	</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{weightMethods.map((method, index) => {
																	return (
																		<TableRow key={index}>
																			<TableCell className="text-center">
																				{method.name}
																			</TableCell>
																			<TableCell className="text-center">
																				{method.charge}
																			</TableCell>
																			<TableCell className="text-center">
																				{method.min_value}
																			</TableCell>
																			<TableCell className="text-center">
																				{method.max_value ? (
																					method.max_value
																				) : (
																					'-'
																				)}
																			</TableCell>
																			<TableCell scope="row" align="center">
																				{method.freeshipping ? (
																					<Icon className="text-green text-20">
																						check_circle
																					</Icon>
																				) : (
																					<Icon className="text-red text-20">
																						remove_circle
																					</Icon>
																				)}
																			</TableCell>
																			<TableCell className="text-center">
																				<IconButton
																					onClick={() => {
																						this.handleEditMethod(method);
																					}}
																				>
																					<Icon className="text-20">
																						edit
																					</Icon>
																				</IconButton>
																				<IconButton
																					onClick={() => {
																						this.handleDelteMethod(method);
																					}}
																				>
																					<Icon className="text-20">
																						delete
																					</Icon>
																				</IconButton>
																			</TableCell>
																		</TableRow>
																	);
																})}
															</TableBody>
														</Table>
													)}
												</Paper>
											</React.Fragment>
										)}
									</div>
								</div>
								{rateForm && (
									<Dialog
										open={openRateDialog}
										TransitionComponent={Transition}
										keepMounted
										aria-labelledby="alert-dialog-slide-title"
										aria-describedby="alert-dialog-slide-description"
										maxWidth={'sm'}
										fullWidth={true}
									>
										<DialogTitle id="reate-form-dialog">
											{rateForm.type === 'pb' ? 'Price based method' : 'Weight based method'}
										</DialogTitle>
										<DialogContent>
											<div>
												<TextField
													className="mt-16"
													label="Name"
													id="name"
													name="name"
													value={rateForm.name}
													onChange={this.handleChangeMethodForm}
													variant="outlined"
													fullWidth
													required
												/>
												<TextField
													className="mt-16"
													label="Charge"
													id="charge"
													name="charge"
													type="number"
													value={rateForm.charge ? rateForm.charge : ''}
													onChange={this.handleChangeMethodForm}
													variant="outlined"
													fullWidth
													required
												/>
												<TextField
													className="mt-16"
													label="Min Value"
													id="min_value"
													name="min_value"
													type="number"
													value={rateForm.min_value ? rateForm.min_value : ''}
													onChange={this.handleChangeMethodForm}
													variant="outlined"
													fullWidth
													required
												/>
												<TextField
													className="mt-16"
													label="Max Value"
													id="max_value"
													name="max_value"
													type="number"
													value={rateForm.max_value ? rateForm.max_value : ''}
													onChange={this.handleChangeMethodForm}
													variant="outlined"
													fullWidth
												/>
												<FormControlLabel
													value="freeshipping"
													control={
														<Switch
															color="secondary"
															onChange={this.handleChangeMethodForm}
															checked={rateForm.freeshipping}
															id="freeshipping"
															name="freeshipping"
														/>
													}
													label="Free Shipping"
													labelPlacement="start"
													className="ml-4 mt-8"
												/>
											</div>
										</DialogContent>
										<DialogActions>
											<Button onClick={this.closeRateDialog} color="primary">
												Cancel
											</Button>
											<Button
												onClick={this.saveMethod}
												color="primary"
												disabled={!this.canBeSubmitted()}
											>
												Save
											</Button>
										</DialogActions>
									</Dialog>
								)}
							</div>
						)}
					</div>
				}
			/>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setShippingZoneLoader: Actions.setShippingZoneLoader,
			getShippingZone: Actions.getShippingZone,
			setShippingStatesLoader: Actions.setShippingStatesLoader,
			getShippingStates: Actions.getShippingStates,
			setSaveShippingZoneLoader: Actions.setSaveShippingZoneLoader,
			saveShippingZone: Actions.saveShippingZone,
			setModifyShippingZoneStatesLoader: Actions.setModifyShippingZoneStatesLoader,
			modifyShippingZoneStates: Actions.modifyShippingZoneStates
		},
		dispatch
	);
}

function mapStateToProps({ shippingZoneApp }) {
	return {
		data: shippingZoneApp.shippingzone.shippingZone,
		loading: shippingZoneApp.shippingzone.loadingShippingZone,
		shippingStates: shippingZoneApp.shippingzone.shippingStates,
		loadingShippingStates: shippingZoneApp.shippingzone.loadingShippingStates,
		savingZone: shippingZoneApp.shippingzone.savingZone,
		modifyingStates: shippingZoneApp.shippingzone.modifyingStates
	};
}
export default withReducer('shippingZoneApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(ShippingZone))
);
