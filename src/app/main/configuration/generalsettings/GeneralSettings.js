import React, { Component } from 'react';
import { FuseAnimate, FusePageCarded } from '@fuse';
import {
	Typography,
	Icon,
	TextField,
	InputAdornment,
	Button,
	CircularProgress,
	Paper,
	Divider
} from '@material-ui/core';
import { FuseAnimateGroup } from '@fuse';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from '../store/reducers';
import * as Actions from '../store/actions';

class GeneralSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: null,
			updateType: null,
			care_info: null,
			store_address: null

			// for payment options
			// seceret_cc_access_code_s: null,
			// seceret_cc_api_access_code_s: null,
			// seceret_cc_env: null,
			// seceret_cc_merchant_id_s: null,
			// seceret_cc_working_key_s: null
		};
	}

	componentDidMount() {
		this.props.setGeneralSettingsLoader(true);
		this.props.getGeneralSettings();
	}

	componentDidUpdate(prevProps) {
		if (
			(this.props.generalSettings && !this.state.form) ||
			this.props.generalSettings !== prevProps.generalSettings
		) {
			this.setState({ form: this.props.generalSettings });

			// for care info
			let care_info = null;
			if (this.props.generalSettings.care_info) {
				let customerCareArr = this.props.generalSettings.care_info.split('\n');
				care_info = {
					mobile: customerCareArr[0] ? customerCareArr[0] : null,
					email: customerCareArr[1] ? customerCareArr[1] : null,
					time: customerCareArr[2] ? customerCareArr[2] : null
				};
			} else {
				care_info = {
					mobile: null,
					email: null,
					time: null
				};
			}
			this.setState({ care_info });

			// for store address
			let store_address = null;
			if (this.props.generalSettings.store_address) {
				let storeAdrsArr = this.props.generalSettings.store_address.split('\n');
				let obj = [ '', '' ];
				if (storeAdrsArr[3]) {
					obj = storeAdrsArr[3].split(' - ');
				}
				store_address = {
					name: storeAdrsArr[0] ? storeAdrsArr[0] : null,
					line1: storeAdrsArr[1] ? storeAdrsArr[1] : null,
					line2: storeAdrsArr[2] ? storeAdrsArr[2] : null,
					city: obj[0] ? obj[0] : null,
					pincode: obj[1] ? obj[1] : null,
					state: storeAdrsArr[4] ? storeAdrsArr[4] : null
				};
			} else {
				store_address = {
					name: null,
					line1: null,
					line2: null,
					city: null,
					pincode: null,
					state: null
				};
			}
			this.setState({ store_address });

			// // for payment options
			// let data = this.props.generalSettings;
			// if (data && data.cc_access_code_s && data.cc_access_code_s !== '') {
			// 	this.setState({ seceret_cc_access_code_s: true });
			// }
			// if (data && data.cc_api_access_code_s && data.cc_api_access_code_s !== '') {
			// 	this.setState({ seceret_cc_api_access_code_s: true });
			// }
			// if (data && data.cc_env && data.cc_env !== '') {
			// 	this.setState({ seceret_cc_env: true });
			// }
			// if (data && data.cc_merchant_id_s && data.cc_merchant_id_s !== '') {
			// 	this.setState({ seceret_cc_merchant_id_s: true });
			// }
			// if (data && data.cc_working_key_s && data.cc_working_key_s !== '') {
			// 	this.setState({ seceret_cc_working_key_s: true });
			// }
		}
		if (this.props.updating === 'updated') {
			this.props.setSettingsUpdateLoader(false);
			this.setState({ updateType: null });
		}
	}

	handleChange = (event) => {
		this.setState({
			form: _.set({ ...this.state.form }, event.target.name, event.target.value)
		});
	};

	// for payment options
	// handleFocus = (event) => {
	// 	if (event.target.name === 'cc_access_code_s' && this.state.seceret_cc_access_code_s) {
	// 		this.setState({
	// 			form: _.set({ ...this.state.form }, event.target.name, ''),
	// 			seceret_cc_access_code_s: false
	// 		});
	// 	}
	// 	if (event.target.name === 'cc_api_access_code_s' && this.state.seceret_cc_api_access_code_s) {
	// 		this.setState({
	// 			form: _.set({ ...this.state.form }, event.target.name, ''),
	// 			seceret_cc_api_access_code_s: false
	// 		});
	// 	}
	// 	if (event.target.name === 'cc_env' && this.state.seceret_cc_env) {
	// 		this.setState({
	// 			form: _.set({ ...this.state.form }, event.target.name, ''),
	// 			seceret_cc_env: false
	// 		});
	// 	}
	// 	if (event.target.name === 'cc_merchant_id_s' && this.state.seceret_cc_merchant_id_s) {
	// 		this.setState({
	// 			form: _.set({ ...this.state.form }, event.target.name, ''),
	// 			seceret_cc_merchant_id_s: false
	// 		});
	// 	}
	// 	if (event.target.name === 'cc_working_key_s' && this.state.seceret_cc_working_key_s) {
	// 		this.setState({
	// 			form: _.set({ ...this.state.form }, event.target.name, ''),
	// 			seceret_cc_working_key_s: false
	// 		});
	// 	}
	// };

	handleCustomerCareChange = (event) => {
		this.setState({
			care_info: _.set({ ...this.state.care_info }, event.target.name, event.target.value)
		});
	};

	handleStoreAddrsChange = (event) => {
		this.setState({
			store_address: _.set({ ...this.state.store_address }, event.target.name, event.target.value)
		});
	};

	handleUpdate = (type) => {
		this.setState({ updateType: type });
		let value;
		if (type === 'care_info') {
			let care_info = this.state.care_info;
			let str = care_info.mobile + '\n' + care_info.email + '\n' + care_info.time;
			value = str;
		} else if (type === 'store_address') {
			let store_address = this.state.store_address;
			let str =
				store_address.name +
				'\n' +
				store_address.line1 +
				'\n' +
				store_address.line2 +
				'\n' +
				store_address.city +
				' - ' +
				store_address.pincode +
				'\n' +
				store_address.state;
			value = str;
		} else {
			value = this.state.form[type];
		}
		let obj = {
			[type]: value
		};
		this.props.setSettingsUpdateLoader(true);
		this.props.updateGeneralSettings(obj);
	};

	handleLogoClick = () => {
		this.refs.logoInput.click();
	};

	handleSignatureClick = () => {
		this.refs.signatureInput.click();
	};

	handleLogoChange = (e) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		reader.onloadend = () => {
			this.setState({
				form: _.set({ ...this.state.form }, 'logo', reader.result)
			});
		};
		reader.readAsDataURL(file);
	};

	handleSignatureChange = (e) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		reader.onloadend = () => {
			this.setState({
				form: _.set({ ...this.state.form }, 'signature', reader.result)
			});
		};
		reader.readAsDataURL(file);
	};

	canBeSubmittedCareInfo() {
		const { care_info } = this.state;
		let showSave;
		if (!care_info) {
			showSave = false;
		} else {
			const { time, mobile, email } = care_info;
			if (time && time !== '' && mobile && mobile !== '' && email && email !== '') showSave = true;
			else showSave = false;
		}
		return showSave;
	}

	canBeSubmittedStoreAddrs() {
		const { store_address } = this.state;
		let showSave;
		if (!store_address) {
			showSave = false;
		} else {
			const { name, line1, line2, city, pincode, state } = store_address;
			if (
				name &&
				name !== '' &&
				line1 &&
				line1 !== '' &&
				line2 &&
				line2 !== '' &&
				city &&
				city !== '' &&
				pincode &&
				pincode !== '' &&
				state &&
				state !== ''
			)
				showSave = true;
			else showSave = false;
		}
		return showSave;
	}

	render() {
		const {
			form,
			updateType,
			care_info,
			store_address
			// for payment otions
			// seceret_cc_access_code_s,
			// seceret_cc_api_access_code_s,
			// seceret_cc_env,
			// seceret_cc_merchant_id_s,
			// seceret_cc_working_key_s
		} = this.state;
		const { loading, updating } = this.props;

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex items-center">
							<FuseAnimate animation="transition.expandIn" delay={300}>
								<Icon className="text-32 mr-0 sm:mr-12">shopping_basket</Icon>
							</FuseAnimate>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="hidden sm:flex" variant="h6">
									General Settings
								</Typography>
							</FuseAnimate>
						</div>
					</div>
				}
				content={
					<div className="flex flex-col justify-center items-center">
						{loading && (
							<div className="text-center py-32 w-full">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loading &&
						form !== undefined &&
						form !== null && (
							<div className="w-full p-32">
								<FuseAnimateGroup
									enter={{
										animation: 'transition.slideUpBigIn'
									}}
								>
									<div className="flex flex-col">
										<div className="flex">
											<div className="md:w-1/2 w-full mr-16">
												<Paper>
													<div className="p-16">
														<p className="text-24 m-0">Site Settings</p>
													</div>
													<Divider />

													<div className="w-full p-16">
														<input
															type="file"
															onChange={this.handleLogoChange}
															ref="logoInput"
															style={{ display: 'none' }}
														/>
														<input
															type="file"
															onChange={this.handleSignatureChange}
															ref="signatureInput"
															style={{ display: 'none' }}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Title"
															name="title"
															helperText="Used in Site Title, Email Send to Customers and Invoices"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.title ||
																				form.title === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() => this.handleUpdate('title')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'title' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.title !== null ? form.title : ''}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															className="mt-8 mb-16"
															id="description"
															name="description"
															onChange={this.handleChange}
															label="Description"
															type="text"
															value={form.description ? form.description : ''}
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.description ||
																				form.description === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() =>
																				this.handleUpdate('description')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'description' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															multiline
															rows={5}
															variant="outlined"
															fullWidth
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="number"
															label="Admin Mobile"
															name="admin_mobile"
															helperText="To send notifications to admin"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.admin_mobile ||
																				form.admin_mobile === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() =>
																				this.handleUpdate('admin_mobile')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'admin_mobile' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.admin_mobile !== null ? form.admin_mobile : ''}
															onChange={(e) => this.handleChange(e)}
														/>

														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Domain"
															name="domain"
															helperText="Used in payment gateway integration and Emails to Customers"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.domain ||
																				form.domain === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() => this.handleUpdate('domain')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'domain' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.domain !== null ? form.domain : ''}
															onChange={(e) => this.handleChange(e)}
														/>
														<div className="flex w-full mt-20 mb-12 justify-between">
															<div className="flex flex-col w-full md:w-1/2">
																<p className="text-16 font-600">Logo</p>
																{form.logo !== undefined && form.logo !== null ? (
																	<Paper style={{ width: '200px' }} className="my-8">
																		<img
																			src={form.logo}
																			style={{ width: '100%' }}
																			alt=""
																		/>
																	</Paper>
																) : (
																	<Paper
																		className="my-8 flex items-center justify-center"
																		style={{ width: '200px', height: '150px' }}
																	>
																		No logo
																	</Paper>
																)}
																<div>
																	<Button
																		variant="contained"
																		size="small"
																		color="secondary"
																		className="mr-12"
																		onClick={this.handleLogoClick}
																	>
																		{form.logo !== undefined &&
																		form.logo !== null ? (
																			'Change'
																		) : (
																			'Add'
																		)}
																	</Button>
																	<Button
																		variant="contained"
																		size="small"
																		color="primary"
																		disabled={
																			!form.logo ||
																			(updating && updating !== 'updated')
																		}
																		onClick={() => this.handleUpdate('logo')}
																	>
																		{updating &&
																		updating !== 'updated' &&
																		updateType === 'logo' ? (
																			'Updating...'
																		) : (
																			'Update'
																		)}
																	</Button>
																</div>
															</div>
															<div className="flex flex-col w-full md:w-1/2">
																<p className="text-16 font-600">Signature</p>
																{form.signature !== undefined &&
																form.signature !== null ? (
																	<Paper style={{ width: '200px' }} className="my-8">
																		<img
																			src={form.signature}
																			style={{ width: '100%' }}
																			alt=""
																		/>
																	</Paper>
																) : (
																	<Paper
																		className="my-8 flex items-center justify-center"
																		style={{ width: '200px', height: '150px' }}
																	>
																		No signature
																	</Paper>
																)}
																<div>
																	<Button
																		variant="contained"
																		size="small"
																		color="secondary"
																		className="mr-12"
																		onClick={this.handleSignatureClick}
																	>
																		{form.signature !== undefined &&
																		form.signature !== null ? (
																			'Change'
																		) : (
																			'Add'
																		)}
																	</Button>
																	<Button
																		variant="contained"
																		size="small"
																		color="primary"
																		disabled={
																			!form.signature ||
																			(updating && updating !== 'updated')
																		}
																		onClick={() => this.handleUpdate('signature')}
																	>
																		{updating &&
																		updating !== 'updated' &&
																		updateType === 'signature' ? (
																			'Updating...'
																		) : (
																			'Update'
																		)}
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</Paper>

												<Paper className="mt-32">
													<div className="p-16">
														<p className="text-24 m-0">Social Links</p>
													</div>
													<Divider />
													<div className="w-full p-16">
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Facebook Link"
															name="facebook"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.facebook ||
																				form.facebook === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() =>
																				this.handleUpdate('facebook')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'facebook' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.facebook !== null ? form.facebook : ''}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Instagram Link"
															name="instagram"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.instagram ||
																				form.instagram === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() =>
																				this.handleUpdate('instagram')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'instagram' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.instagram !== null ? form.instagram : ''}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Youtube Link"
															name="youtube"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.youtube ||
																				form.youtube === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() => this.handleUpdate('youtube')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'youtube' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.youtube !== null ? form.youtube : ''}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Twitter Link"
															name="twitter"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.twitter ||
																				form.twitter === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() => this.handleUpdate('twitter')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'twitter' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.twitter !== null ? form.twitter : ''}
															onChange={(e) => this.handleChange(e)}
														/>
													</div>
												</Paper>
											</div>

											<div className="flex flex-col md:w-1/2 ml-16">
												<Paper>
													<div className="flex items-center justify-between p-16">
														<p className="text-24">Customer Care Info</p>
														<Button
															variant="contained"
															color="primary"
															size="small"
															disabled={
																!this.canBeSubmittedCareInfo() ||
																(updating && updating !== 'updated')
															}
															onClick={() => this.handleUpdate('care_info')}
														>
															{updating &&
															updating !== 'updated' &&
															updateType === 'care_info' ? (
																'Updating...'
															) : (
																'Update'
															)}
														</Button>
													</div>
													<Divider />
													<div className="flex flex-col items-center justify-center w-full p-16">
														<TextField
															id="outlined-adornment-password"
															className="my-12"
															variant="outlined"
															type="text"
															label="Phone Number"
															name="mobile"
															placeholder="+(91)-01-234567789"
															fullWidth
															value={care_info.mobile !== null ? care_info.mobile : ''}
															onChange={(e) => this.handleCustomerCareChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-12"
															variant="outlined"
															type="text"
															label="Support Email"
															name="email"
															fullWidth
															value={care_info.email !== null ? care_info.email : ''}
															placeholder="Customer support email ID"
															onChange={(e) => this.handleCustomerCareChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-12"
															variant="outlined"
															type="text"
															label="Timings"
															name="time"
															fullWidth
															placeholder="MON - SAT - 9:00 AM to 6:00 PM"
															value={care_info.time !== null ? care_info.time : ''}
															onChange={(e) => this.handleCustomerCareChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
													</div>
												</Paper>

												<Paper className="mt-32">
													<div className="flex items-center justify-between  p-16">
														<p className="text-24">Store Address</p>
														<Button
															variant="contained"
															color="primary"
															size="small"
															disabled={
																!this.canBeSubmittedStoreAddrs() ||
																(updating && updating !== 'updated')
															}
															onClick={() => this.handleUpdate('store_address')}
														>
															{updating &&
															updating !== 'updated' &&
															updateType === 'store_address' ? (
																'Updating...'
															) : (
																'Update'
															)}
														</Button>
													</div>
													<Divider />
													<div className="flex flex-col items-center justify-center w-full p-16">
														<TextField
															id="outlined-adornment-password"
															className="my-12"
															variant="outlined"
															type="text"
															label="Business Name"
															name="name"
															placeholder="Business Name"
															fullWidth
															value={
																store_address.name !== null ? store_address.name : ''
															}
															onChange={(e) => this.handleStoreAddrsChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-12"
															variant="outlined"
															type="text"
															label="Address Line1"
															name="line1"
															fullWidth
															value={
																store_address.line1 !== null ? store_address.line1 : ''
															}
															placeholder="Door No 1-2-345/678/A,"
															onChange={(e) => this.handleStoreAddrsChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-12"
															variant="outlined"
															type="text"
															label="Address Line2"
															name="line2"
															fullWidth
															value={
																store_address.line2 !== null ? store_address.line2 : ''
															}
															placeholder="Street Name"
															onChange={(e) => this.handleStoreAddrsChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
														<div className="flex w-full">
															<TextField
																id="outlined-adornment-password"
																className="my-12 mr-8"
																variant="outlined"
																type="text"
																label="City"
																name="city"
																fullWidth
																placeholder="City"
																value={
																	store_address.city !== null ? (
																		store_address.city
																	) : (
																		''
																	)
																}
																onChange={(e) => this.handleStoreAddrsChange(e)}
																InputLabelProps={{
																	shrink: true
																}}
															/>
															<TextField
																id="outlined-adornment-password"
																className="my-12 ml-8"
																variant="outlined"
																type="number"
																label="Pincode"
																name="pincode"
																fullWidth
																placeholder="Pincode"
																value={
																	store_address.pincode !== null ? (
																		store_address.pincode
																	) : (
																		''
																	)
																}
																onChange={(e) => this.handleStoreAddrsChange(e)}
																InputLabelProps={{
																	shrink: true
																}}
															/>
														</div>
														<TextField
															id="outlined-adornment-password"
															className="mt-12"
															variant="outlined"
															type="text"
															label="State"
															name="state"
															fullWidth
															value={
																store_address.state !== null ? store_address.state : ''
															}
															placeholder="State"
															onChange={(e) => this.handleStoreAddrsChange(e)}
															InputLabelProps={{
																shrink: true
															}}
														/>
													</div>
												</Paper>

												<Paper className="mt-32">
													<div className="flex items-start flex-col  p-16">
														<p className="text-24">Outgoing Email IDs</p>
														<p>Should be verified Domain or Email by Shopnex</p>
													</div>
													<Divider />
													<div className="flex flex-col items-center justify-center w-full p-16">
														<TextField
															id="outlined-adornment-password"
															className="mt-8 mb-16"
															variant="outlined"
															type="text"
															label="Orders Related"
															name="order_placed_mail"
															helperText="Required for sending order related emails"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.order_placed_mail ||
																				form.order_placed_mail === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() =>
																				this.handleUpdate('order_placed_mail')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'order_placed_mail' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={
																form.order_placed_mail !== null ? (
																	form.order_placed_mail
																) : (
																	''
																)
															}
															onChange={(e) => this.handleChange(e)}
														/>

														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="Accounts Related"
															name="other_mail"
															helperText="Required for sending user account related emails (account activation and password reset links)"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.other_mail ||
																				form.other_mail === '' ||
																				(updating && updating !== 'updated')
																			}
																			onClick={() =>
																				this.handleUpdate('other_mail')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'other_mail' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={form.other_mail !== null ? form.other_mail : ''}
															onChange={(e) => this.handleChange(e)}
														/>
													</div>
												</Paper>

												{/* for payment options */}
												{/* <Paper className="mt-32">
													<div className="p-16">
														<p className="text-24 m-0">Payment Settings</p>
													</div>
													<Divider />
													<div className="w-full p-16">
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="CC Access Code"
															name="cc_access_code_s"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.cc_access_code_s ||
																				form.cc_access_code_s === '' ||
																				(updating && updating !== 'updated') ||
																				seceret_cc_access_code_s
																			}
																			onClick={() =>
																				this.handleUpdate('cc_access_code_s')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'cc_access_code_s' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={
																form.cc_access_code_s !== null ? (
																	(seceret_cc_access_code_s ? '*****' : '') +
																	form.cc_access_code_s
																) : (
																	''
																)
															}
															onFocus={(e) => this.handleFocus(e)}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="CC API Access Code"
															name="cc_api_access_code_s"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.cc_api_access_code_s ||
																				form.cc_api_access_code_s === '' ||
																				(updating && updating !== 'updated') ||
																				seceret_cc_api_access_code_s
																			}
																			onClick={() =>
																				this.handleUpdate(
																					'cc_api_access_code_s'
																				)}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'cc_api_access_code_s' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={
																form.cc_api_access_code_s !== null ? (
																	(seceret_cc_api_access_code_s ? '*****' : '') +
																	form.cc_api_access_code_s
																) : (
																	''
																)
															}
															onFocus={(e) => this.handleFocus(e)}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="CC Env"
															name="cc_env"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.cc_env ||
																				form.cc_env === '' ||
																				(updating && updating !== 'updated') ||
																				seceret_cc_env
																			}
																			onClick={() => this.handleUpdate('cc_env')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'cc_env' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={
																form.cc_env !== null ? (
																	(seceret_cc_env ? '*****' : '') + form.cc_env
																) : (
																	''
																)
															}
															onFocus={(e) => this.handleFocus(e)}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="CC Merchant ID"
															name="cc_merchant_id_s"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.cc_merchant_id_s ||
																				form.cc_merchant_id_s === '' ||
																				(updating && updating !== 'updated') ||
																				seceret_cc_merchant_id_s
																			}
																			onClick={() =>
																				this.handleUpdate('cc_merchant_id_s')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'cc_merchant_id_s' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={
																form.cc_merchant_id_s !== null ? (
																	(seceret_cc_merchant_id_s ? '*****' : '') +
																	form.cc_merchant_id_s
																) : (
																	''
																)
															}
															onFocus={(e) => this.handleFocus(e)}
															onChange={(e) => this.handleChange(e)}
														/>
														<TextField
															id="outlined-adornment-password"
															className="my-16"
															variant="outlined"
															type="text"
															label="CC Working Key"
															name="cc_working_key_s"
															InputProps={{
																endAdornment: (
																	<InputAdornment position="end">
																		<Button
																			variant="contained"
																			color="primary"
																			size="small"
																			disabled={
																				!form.cc_working_key_s ||
																				form.cc_working_key_s === '' ||
																				(updating && updating !== 'updated') ||
																				seceret_cc_working_key_s
																			}
																			onClick={() =>
																				this.handleUpdate('cc_working_key_s')}
																		>
																			{updating &&
																			updating !== 'updated' &&
																			updateType === 'cc_working_key_s' ? (
																				'Updating...'
																			) : (
																				'Update'
																			)}
																		</Button>
																	</InputAdornment>
																)
															}}
															fullWidth
															value={
																form.cc_working_key_s !== null ? (
																	(seceret_cc_working_key_s ? '*****' : '') +
																	form.cc_working_key_s
																) : (
																	''
																)
															}
															onFocus={(e) => this.handleFocus(e)}
															onChange={(e) => this.handleChange(e)}
														/>
													</div>
												</Paper>
											 */}
											</div>
										</div>
									</div>
								</FuseAnimateGroup>
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
			getGeneralSettings: Actions.getGeneralSettings,
			updateGeneralSettings: Actions.updateGeneralSettings,
			setGeneralSettingsLoader: Actions.setGeneralSettingsLoader,
			setSettingsUpdateLoader: Actions.setSettingsUpdateLoader
		},
		dispatch
	);
}

function mapStateToProps({ generalSettingsApp }) {
	return {
		generalSettings: generalSettingsApp.generalSettings.generalSettings,
		loading: generalSettingsApp.generalSettings.loading,
		updating: generalSettingsApp.generalSettings.updating
	};
}
export default withReducer('generalSettingsApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(GeneralSettings))
);
