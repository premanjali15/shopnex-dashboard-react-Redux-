import React, { Component } from 'react';
import {
	withStyles,
	Button,
	TextField,
	Icon,
	IconButton,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { orange } from '@material-ui/core/colors';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import Switch from 'react-switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import { FuseChipSelect } from '@fuse';
import reducer from '../store/reducers';

const styles = (theme) => ({
	productImageStarIconButton: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '24px',
		height: '24px',
		background: '#000000',
		'&:hover': {
			background: '#000000'
		}
	},
	productImageFeaturedStar: {
		position: 'absolute',
		color: orange[400],
		opacity: 1,
		fontSize: '18px'
	},
	productImageIconButton: {
		position: 'absolute',
		top: 0,
		right: 0,
		background: '#000000',
		width: '24px',
		height: '24px',
		opacity: 0,
		'&:hover': {
			background: '#000000'
		}
	},
	productImageStar: {
		position: 'absolute',
		color: 'white',
		opacity: 1,
		fontSize: '18px'
	},
	productLoaderIcon: {
		color: '#03b6f2',
		position: 'absolute',
		top: 0,
		right: 0
	},
	productImageItem: {
		width: 'auto',
		height: 300,
		display: 'flex',
		alignItems: 'center',
		justifyItems: 'center',
		position: 'relative',
		borderRadius: 4,
		marginBottom: 16,
		marginTop: 16,
		overflow: 'hidden',
		boxShadow: theme.shadows[1],
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		cursor: 'pointer',
		'&:hover': {
			boxShadow: theme.shadows[6],
			'& $productImageIconButton': {
				opacity: 0.8
			}
		}
	},
	dn: {
		display: 'none'
	},
	center: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	addedImage: {
		height: 160,
		width: 'auto'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	}
});

class Collection extends Component {
	state = {
		form: null,
		open: false,
		selectedImage: '',
		imageUploading: false,
		toppingId: null,
		searchText: '',
		selectedPrdcts: null,
		productsData: null,
		imageChanged: false
	};
	componentDidMount() {
		const params = this.props.match.params;
		const { collectionId } = params;
		this.props.setCollectionLoadingValue(true);
		this.props.getCollection(collectionId);
	}

	componentDidUpdate(prevProps) {
		if ((this.props.collection && !this.state.form) || prevProps.collection !== this.props.collection) {
			this.setState({ form: this.props.collection, productsData: _.clone(this.props.collection.products_data) });
		}
		if (this.props.savingCollection === 'saved') {
			let collection = this.props.collection;
			this.setState({ form: null, toppingId: null, productsData: null });
			this.props.setCollectionSavedValue(false);
			this.props.history.push('/app/collections/' + collection.id);
		}
	}

	handleChange = (event) => {
		this.setState({
			form: _.set(
				{ ...this.state.form },
				event.target.name,
				event.target.type === 'checkbox' ? event.target.checked : event.target.value
			)
		});
	};

	handleSwitch = () => {
		let obj = {
			is_published: !this.state.form.is_published,
			id: this.state.form.id
		};
		this.props.saveCollection(obj);
	};

	canBeSubmitted() {
		// const { name } = this.state.form;
		// return name.length > 0 && !_.isEqual(this.props.product.data, this.state.form);
		if (this.state.form !== null) {
			const { name } = this.state.form;
			let showSave;
			if (name !== undefined && name !== null && name.length > 0) showSave = true;
			else showSave = false;
			return showSave;
		} else {
			return false;
		}
	}
	saveCollection = () => {
		let form = _.clone(this.state.form);
		if (!this.state.imageChanged) delete form.background_image;
		this.props.setCollectionSavedValue(true);
		this.props.saveCollection(form);
	};

	handleImageChange = (e) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		reader.onloadend = () => {
			this.setState({ selectedImage: reader.result, imageChanged: true });
		};
		reader.readAsDataURL(file);
	};

	handleClickOpen = () => {
		this.setState({ open: true, selectedImage: this.state.form.background_image });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleClick = () => {
		this.refs.fileInput.click();
	};

	saveImage = () => {
		if (
			this.state.selectedImage !== undefined &&
			this.state.selectedImage !== null &&
			this.state.selectedImage !== ''
		) {
			this.setState({
				form: { ...this.state.form, background_image: this.state.selectedImage }
			});
			this.handleClose();
		}
	};

	handlePrdctChange = (value) => {
		let { products } = this.state.form;
		let { productsData } = this.state;
		if (value.length > products.length) {
			let obj = {
				id: value[value.length - 1].id,
				name: value[value.length - 1].value
			};
			productsData.push(obj);
			products.push(value[value.length - 1].id);
			this.setState({ form: { ...this.state.form, products }, productsData });
		}
		if (value.length < products.length) {
			for (let i = 0; i < products.length; i++) {
				let count = 0;
				for (let j = 0; j < value.length; j++) {
					if (products[i] === value[j].id) {
						break;
					} else count++;
				}
				if (count === value.length) {
					var filtered = products.filter(function(clc) {
						return clc !== products[i];
					});

					var filteredPrdctsData = productsData.filter(function(prdct) {
						return prdct !== productsData[i];
					});

					this.setState({
						form: { ...this.state.form, products: filtered },
						productsData: filteredPrdctsData
					});
					break;
				}
			}
		}
	};

	searchedProducts = (inputValue) => {
		if (inputValue && inputValue !== '' && inputValue.length > 2) {
			this.setState({ searchText: inputValue });
			this.props.setSearchedProductsLoader(true);
			this.props.getSearchedProducts(inputValue);
		}
	};

	handleDeleteImage = () => {
		this.setState({
			form: { ...this.state.form, background_image: null },
			selectedImage: '',
			imageChanged: true
		});
	};

	render() {
		const { classes, loadingCollection, savingCollection, searchedProducts, loadingSearchPrdcts } = this.props;
		const { form, productsData } = this.state;

		let productOptions = [];
		if (searchedProducts !== undefined && searchedProducts !== null && searchedProducts.results) {
			productOptions = searchedProducts.results.map((item) => ({
				value: item.name,
				label: item.id + ' : ' + item.name,
				id: item.id
			}));
		}

		let selectedPrdcts = [];
		if (form && form.products && productsData && productsData.length > 0) {
			let prdcts = form.products;
			for (let i = 0; i < prdcts.length; i++) {
				let ind = productsData.findIndex((item) => {
					return item.id === prdcts[i];
				});
				let item = productsData[ind];
				let obj = {
					value: item.name,
					label: item.name,
					id: item.id
				};
				selectedPrdcts.push(obj);
			}
		}

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					!loadingCollection &&
					form && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/collections"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Collections
									</Typography>
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<FuseAnimate animation="transition.expandIn" delay={300}>
										{form.image_url ? (
											<img
												className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
												src={form.image_url}
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
												{form.name ? form.name : 'Create New Collection'}
											</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									disabled={
										!this.canBeSubmitted() || (savingCollection !== 'saved' && savingCollection)
									}
									onClick={this.saveCollection}
								>
									{savingCollection !== 'saved' && savingCollection ? 'Saving...' : 'Save'}
								</Button>
							</FuseAnimate>
						</div>
					)
				}
				contentToolbar={
					!loadingCollection &&
					form && (
						<div className="flex w-full items-center justify-end">
							{this.props.match.params.collectionId !== 'new' && (
								<Switch
									className="mr-24 sm\:mr-2"
									onChange={this.handleSwitch}
									checked={form.is_published}
									id="available"
									name="available"
								/>
							)}
						</div>
					)
				}
				content={
					<div>
						<input type="file" onChange={this.handleImageChange} ref="fileInput" className={classes.dn} />
						<div className="p-16 sm:p-24">
							{loadingCollection && (
								<div className="text-center pt-60">
									<CircularProgress color="secondary" />
								</div>
							)}
							{!loadingCollection &&
							form && (
								<div>
									<TextField
										className="mt-8 mb-16"
										// error={form.name === ''}
										required
										label="Collection Name"
										autoFocus
										id="name"
										name="name"
										value={form.name}
										onChange={this.handleChange}
										variant="outlined"
										fullWidth
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
									/>
									<FuseChipSelect
										className={'w-full mt-16 mb-32'}
										isClearable={false}
										isLoading={loadingSearchPrdcts}
										value={selectedPrdcts}
										onChange={this.handlePrdctChange}
										placeholder="Select Products"
										variant="fixed"
										onInputChange={this.searchedProducts}
										textFieldProps={{
											label: 'Products',
											InputLabelProps: {
												shrink: true
											},
											variant: 'outlined',
											value: this.state.searchText
											// onChange: (e) => this.searchedProducts(e)
										}}
										options={productOptions}
										isMulti
									/>
									{form.background_image ? (
										<Paper>
											<img src={form.background_image} className="w-full" alt="" />
											<div className="flex justify-center py-8">
												<IconButton className="mx-8" onClick={this.handleClickOpen}>
													<Icon>edit</Icon>
												</IconButton>
												<IconButton className="mx-8" onClick={this.handleDeleteImage}>
													<Icon>delete</Icon>
												</IconButton>
											</div>
										</Paper>
									) : (
										<div className={classes.productImageItem}>
											<div
												className={classNames(
													classes.board,
													classes.newBoard,
													'flex flex-col items-center justify-center w-full h-full rounded py-24'
												)}
											>
												<Icon className="text-56" onClick={this.handleClickOpen}>
													add_circle
												</Icon>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
						{form && (
							<Dialog
								open={this.state.open}
								onClose={this.handleClose}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
							>
								<DialogTitle id="alert-dialog-title">{'Click on Select Image and Upload'}</DialogTitle>
								<DialogContent className={classes.center}>
									<img
										className={classNames('rounded', classes.addedImage)}
										src={
											this.state.selectedImage && this.state.selectedImage !== '' ? (
												this.state.selectedImage
											) : (
												'assets/images/ecommerce/product-image-placeholder.png'
											)
										}
										alt="sravani"
									/>
									<Fab
										variant="extended"
										size="small"
										color="primary"
										aria-label="Add"
										className="mt-8"
										onClick={this.handleClick}
									>
										{form.background_image ? 'Change Image' : 'Select Image'}
									</Fab>
									{this.state.imageUploading && (
										<LinearProgress color="secondary" className="w-full mt-8" />
									)}
								</DialogContent>
								<DialogActions>
									<Button onClick={this.handleClose} color="primary">
										Cancel
									</Button>
									<div className={classes.wrapper}>
										<Button onClick={this.saveImage} color="primary" autoFocus className="disabled">
											Select
										</Button>
									</div>
								</DialogActions>
							</Dialog>
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
			getCollection: Actions.getCollection,
			saveCollection: Actions.saveCollection,
			setCollection: Actions.setCollection,
			setCollectionSavedValue: Actions.setCollectionSavedValue,
			setCollectionLoadingValue: Actions.setCollectionLoadingValue,
			getSearchedProducts: Actions.getSearchedProducts,
			setSearchedProductsLoader: Actions.setSearchedProductsLoader
		},
		dispatch
	);
}

function mapStateToProps({ collectionApp }) {
	return {
		collection: collectionApp.collection.collection,
		savingCollection: collectionApp.collection.savingCollection,
		loadingCollection: collectionApp.collection.loadingCollection,
		searchedProducts: collectionApp.collection.searchedProducts,
		loadingSearchPrdcts: collectionApp.collection.loadingSearchPrdcts
	};
}

export default withReducer('collectionApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Collection)))
);
