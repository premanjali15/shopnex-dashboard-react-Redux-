import React, { Component } from 'react';
import {
	Button,
	TextField,
	Icon,
	Typography,
	CircularProgress,
	Paper,
	IconButton,
	Slide,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded, FuseChipSelect } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import Switch from 'react-switch';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import { ShowDialog } from '../../components/showdialog/ShowDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

class SeoProduct extends Component {
	state = {
		form: null,
		editProductName: false,
		editProductDesc: false,
		selectedMetaData: null,
		openMetaDataDialog: false,
		openDeleteDialog: false
	};
	componentDidMount() {
		this.props.setSeoProductLoader(true);
		this.props.getSeoProduct(this.props.match.params.productId);
	}
	componentDidUpdate() {
		if (!this.state.form && this.props.data) {
			let additional_tags = [];
			if (this.props.data.additional_tags && this.props.data.additional_tags.length > 0) {
				this.props.data.additional_tags.forEach((tag, index) => {
					let obj = tag;
					obj.id = index;
					additional_tags.push(obj);
				});
			}
			this.setState({ form: { ...this.props.data, additional_tags } });
		}
	}
	handleChange = (event) => {
		this.setState({
			form: _.set({ ...this.state.form }, event.target.name, event.target.value)
		});
	};
	handleChipChange = (value) => {
		let { keywords } = this.state.form;
		if (value.length > keywords.length) {
			keywords.push(value[value.length - 1].value);
			this.setState({ form: { ...this.state.form, keywords } });
		}
		if (value.length < keywords.length) {
			for (let i = 0; i < keywords.length; i++) {
				let count = 0;
				for (let j = 0; j < value.length; j++) {
					if (keywords[i] === value[j].id) {
						break;
					} else count++;
				}
				if (count === value.length) {
					var filtered = keywords.filter(function(item) {
						return item !== keywords[i];
					});
					this.setState({ form: { ...this.state.form, keywords: filtered } });
					break;
				}
			}
		}
	};
	saveSeoProduct = (type, e) => {
		let data = _.clone(this.state.form);
		let obj;
		if (type === 'seo') {
			obj = {
				seo_title: data.seo_title,
				seo_description: data.seo_description,
				keywords: data.keywords,
				id: data.id
			};
		} else if (type === 'product') {
			obj = {
				name: data.name,
				description: data.description,
				id: data.id
			};
		} else if (type === 'additional_tags') {
			let additional_tags = _.clone(data.additional_tags);
			additional_tags.map(function(item) {
				return delete item.id;
			});
			obj = {
				id: data.id,
				additional_tags: additional_tags
			};
		} else if (type === 'marked') {
			obj = {
				id: data.id,
				marked: !this.state.form.marked
			};
			this.setState({ form: { ...this.state.form, marked: !this.state.form.marked } });
		}
		this.props.setSaveSeoProductLoader(true);
		this.props.saveSeoProduct(obj);
	};
	handleAddMetaTag = () => {
		this.setState({ openMetaDataDialog: true, selectedMetaData: { id: 'new', '': '' } });
	};
	handleEditTag = (tag) => {
		this.setState({ openMetaDataDialog: true, selectedMetaData: _.clone(tag) });
	};
	handleCloseMetaDialog = () => {
		this.setState({ openMetaDataDialog: false, selectedMetaData: null });
	};
	handleAddNewPair = () => {
		let { selectedMetaData } = this.state;
		selectedMetaData[''] = '';
		this.setState({ selectedMetaData });
	};
	handleKeyChange = (e, prevkey) => {
		let { selectedMetaData } = this.state;
		var newData = {};
		Object.keys(selectedMetaData).forEach(function(key) {
			var value = selectedMetaData[key];
			if (prevkey === key) {
				newData[e.target.value] = value;
			} else {
				newData[key] = value;
			}
		});
		this.setState({ selectedMetaData: newData });
	};
	handleValueChange = (e, key) => {
		let { selectedMetaData } = this.state;
		selectedMetaData[key] = e.target.value;
		this.setState({ selectedMetaData });
	};
	addUpdateMetaTag = () => {
		let { selectedMetaData } = this.state;
		let { additional_tags } = this.state.form;
		let obj = _.clone(selectedMetaData);
		let id = obj.id;
		delete obj[''];
		if (Object.keys(obj).length > 0) {
			if (id === 'new') {
				delete obj.id;
				obj.id = additional_tags.length + 1;
				additional_tags.push(obj);
			} else {
				let ind = additional_tags.findIndex(function(item) {
					return item.id === id;
				});
				additional_tags[ind] = obj;
			}
			this.setState({
				form: { ...this.state.form, additional_tags },
				openMetaDataDialog: false,
				selectedMetaData: null
			});
		}
	};
	handleDeleteTag = (tag) => {
		this.setState({ openDeleteDialog: true, selectedMetaData: tag });
	};
	handleCloseDeleteTag = () => {
		this.setState({ openDeleteDialog: false, selectedMetaData: null });
	};
	deleteTag = () => {
		let { form, selectedMetaData } = this.state;
		let id = selectedMetaData.id;
		let additional_tags = form.additional_tags.filter(function(item) {
			return item.id !== id;
		});
		this.setState({ openDeleteDialog: false, form: { ...this.state.form, additional_tags } });
	};
	canBeAdded() {
		let { selectedMetaData } = this.state;
		let obj = _.clone(selectedMetaData);
		delete obj.id;
		delete obj[''];
		if (Object.keys(obj).length > 0) {
			return true;
		}
		return false;
	}

	render() {
		const { loadingSeoProduct, savingSeoProduct } = this.props;
		const {
			form,
			editProductName,
			editProductDesc,
			selectedMetaData,
			openMetaDataDialog,
			openDeleteDialog
		} = this.state;
		let selectedKeywords = [];

		if (form && form.keywords) {
			for (let i = 0; i < form.keywords.length; i++) {
				let item = form.keywords[i];
				let obj = {
					value: item,
					label: item,
					id: item
				};
				selectedKeywords.push(obj);
			}
		}
		const getMetaTag = (tag) => {
			let tagobj = _.clone(tag);
			delete tagobj.id;
			let metaTag = '<meta';
			Object.keys(tagobj).forEach((key) => {
				metaTag = `${metaTag} ${key}="${tagobj[key]}"`;
			});
			metaTag = metaTag + ' />';
			return metaTag;
		};

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					form &&
					!loadingSeoProduct && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to={'/app/seodetails'}
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										SEO
									</Typography>
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												ID: {form.id} ({form.name})
											</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
						</div>
					)
				}
				contentToolbar={
					form && (
						<div className="flex w-full items-center justify-end">
							<p className="text-16 mr-8 font-600">Mark</p>
							<Switch
								className="mr-24 sm\:mr-2"
								onChange={() => this.saveSeoProduct('marked')}
								checked={form.marked ? form.marked : false}
								id="marked"
								name="marked"
							/>
						</div>
					)
				}
				content={
					<div className="p-32">
						<ShowDialog
							open={openDeleteDialog}
							closeDeleteDialog={this.handleCloseDeleteTag}
							deleteDialogFunction={this.deleteTag}
							deleting={false}
						/>
						{loadingSeoProduct && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{form &&
						!loadingSeoProduct && (
							<React.Fragment>
								<div className="flex flex-wrap w-full">
									<div className="flex w-1/2">
										<Paper className="mr-20 w-full p-16">
											<div className="flex justify-end mb-8">
												<Button
													className="whitespace-no-wrap"
													variant="contained"
													size="small"
													color="primary"
													disabled={savingSeoProduct !== 'saved' && savingSeoProduct}
													onClick={() => this.saveSeoProduct('seo')}
												>
													{savingSeoProduct !== 'saved' && savingSeoProduct ? (
														'Saving...'
													) : (
														'Save'
													)}
												</Button>
											</div>
											<TextField
												className="mt-8 mb-16"
												label="SEO title"
												id="seo_title"
												name="seo_title"
												value={form.seo_title ? form.seo_title : ''}
												onChange={this.handleChange}
												variant="outlined"
												fullWidth
												type="text"
											/>
											<TextField
												className="mt-8 mb-16"
												id="seo_description"
												name="seo_description"
												onChange={this.handleChange}
												label="SEO Description"
												type="text"
												value={form.seo_description ? form.seo_description : ''}
												multiline
												rows={5}
												variant="outlined"
												fullWidth
												required
											/>
											<FuseChipSelect
												className={'w-full my-16'}
												isClearable={false}
												isLoading={loadingSeoProduct}
												value={selectedKeywords}
												onChange={this.handleChipChange}
												placeholder="Enter Keywords"
												textFieldProps={{
													label: 'Keywords',
													InputLabelProps: {
														shrink: true
													},
													variant: 'outlined'
												}}
												isMulti
											/>
										</Paper>
									</div>

									<div className="flex w-1/2">
										<Paper className="ml-20 w-full p-16">
											<div className="flex justify-end mb-8">
												<Button
													className="whitespace-no-wrap"
													variant="contained"
													size="small"
													color="primary"
													disabled={savingSeoProduct !== 'saved' && savingSeoProduct}
													onClick={() => this.saveSeoProduct('product')}
												>
													{savingSeoProduct !== 'saved' && savingSeoProduct ? (
														'Saving...'
													) : (
														'Save'
													)}
												</Button>
											</div>

											<p
												style={{ color: form.available ? 'green' : 'red' }}
												className="text-16 mb-12 font-600"
											>
												{form.available ? (
													'This product live'
												) : (
													'This product is not displayed on the storefront'
												)}
											</p>

											<div className="flex items-center">
												<TextField
													className="mt-8 mb-16"
													label="Name"
													id="name"
													name="name"
													value={form.name ? form.name : ''}
													onChange={this.handleChange}
													variant="outlined"
													fullWidth
													type="text"
													disabled={!editProductName}
												/>
												<Icon
													className="text-14 ml-12"
													onClick={() => this.setState({ editProductName: !editProductName })}
												>
													edit
												</Icon>
											</div>
											<div className="flex items-center">
												<TextField
													className="mt-8 mb-16"
													id="description"
													name="description"
													onChange={this.handleChange}
													label="Description"
													type="text"
													value={form.description ? form.description : ''}
													multiline
													rows={5}
													variant="outlined"
													fullWidth
													required
													disabled={!editProductDesc}
												/>
												<Icon
													className="text-14 ml-12"
													onClick={() => this.setState({ editProductDesc: !editProductDesc })}
												>
													edit
												</Icon>
											</div>
											<TextField
												className="mt-8 mb-16"
												label="Category"
												id="category"
												name="category"
												value={form.category ? form.category : ''}
												onChange={this.handleChange}
												variant="outlined"
												fullWidth
												type="text"
												disabled
											/>
											<TextField
												className="mt-8 mb-16"
												label="Price"
												id="price"
												name="price"
												value={form.price ? form.price : ''}
												onChange={this.handleChange}
												variant="outlined"
												fullWidth
												type="text"
												disabled
											/>
										</Paper>
									</div>

									<div className="w-full mt-44">
										<div className="w-full">
											<div className="flex items-center justify-between mb-12">
												<p className="text-20">Additional Tags</p>
												<div>
													<Button
														className="whitespace-no-wrap mr-16"
														variant="contained"
														size="small"
														color="primary"
														onClick={this.handleAddMetaTag}
													>
														Add new
													</Button>
													<Button
														className="whitespace-no-wrap"
														variant="contained"
														size="small"
														color="primary"
														disabled={savingSeoProduct !== 'saved' && savingSeoProduct}
														onClick={() => this.saveSeoProduct('additional_tags')}
													>
														{savingSeoProduct !== 'saved' && savingSeoProduct ? (
															'Saving...'
														) : (
															'Save'
														)}
													</Button>
												</div>
											</div>

											{form.additional_tags &&
												form.additional_tags.map((tag, index) => (
													<Paper
														key={index}
														className="p-12 mb-16 flex items-center justify-between"
													>
														<pre style={{ whiteSpace: 'pre-wrap' }}>
															<code style={{ padding: 6 }}>{getMetaTag(tag)}</code>
														</pre>
														<div className="flex">
															<IconButton onClick={() => this.handleEditTag(tag)}>
																<Icon>edit</Icon>
															</IconButton>
															<IconButton onClick={() => this.handleDeleteTag(tag)}>
																<Icon>delete</Icon>
															</IconButton>
														</div>
													</Paper>
												))}
										</div>
									</div>
								</div>

								{selectedMetaData && (
									<Dialog
										open={openMetaDataDialog}
										TransitionComponent={Transition}
										keepMounted
										aria-labelledby="alert-dialog-slide-title"
										aria-describedby="alert-dialog-slide-description"
										maxWidth="sm"
										fullWidth={true}
									>
										<DialogTitle id="alert-dialog-slide-title">Meta Data</DialogTitle>
										<DialogContent>
											<div>
												{Object.keys(selectedMetaData).map((key, index) => (
													<React.Fragment key={index}>
														{key !== 'id' && (
															<div className="flex flex-row items-center mb-12">
																<TextField
																	margin="dense"
																	id="name"
																	placeholder="Key"
																	type="name"
																	fullWidth
																	variant="outlined"
																	required
																	value={key}
																	onChange={(e) => this.handleKeyChange(e, key)}
																/>
																<p className="text-18 mx-4"> : </p>
																<TextField
																	margin="dense"
																	id="name"
																	placeholder="Value"
																	type="name"
																	fullWidth
																	variant="outlined"
																	required
																	value={selectedMetaData[key]}
																	onChange={(e) => this.handleValueChange(e, key)}
																/>
															</div>
														)}
													</React.Fragment>
												))}
												<Paper
													className="w-full flex items-center justify-center mt-16 rounded-none cursor-pointer"
													onClick={this.handleAddNewPair}
												>
													<p className="py-12 text-18 font-500">Add New</p>
												</Paper>
											</div>
										</DialogContent>
										<DialogActions>
											<Button color="primary" onClick={this.handleCloseMetaDialog}>
												Cancel
											</Button>
											{selectedMetaData.id === 'new' ? (
												<Button
													color="primary"
													onClick={this.addUpdateMetaTag}
													disabled={!this.canBeAdded()}
												>
													Add
												</Button>
											) : (
												<Button
													color="primary"
													onClick={this.addUpdateMetaTag}
													disabled={!this.canBeAdded()}
												>
													Update
												</Button>
											)}
										</DialogActions>
									</Dialog>
								)}
							</React.Fragment>
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
			getSeoProduct: Actions.getSeoProduct,
			setSeoProductLoader: Actions.setSeoProductLoader,

			saveSeoProduct: Actions.saveSeoProduct,
			setSaveSeoProductLoader: Actions.setSaveSeoProductLoader
		},
		dispatch
	);
}

function mapStateToProps({ seoProductApp }) {
	return {
		data: seoProductApp.seoproduct.data,
		loadingSeoProduct: seoProductApp.seoproduct.loadingSeoProduct,
		savingSeoProduct: seoProductApp.seoproduct.savingSeoProduct
	};
}

export default withReducer('seoProductApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(SeoProduct))
);
