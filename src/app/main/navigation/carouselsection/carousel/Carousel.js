import React, { Component } from 'react';
import {
	Button,
	TextField,
	Icon,
	Typography,
	Card,
	CardActions,
	CardHeader,
	IconButton,
	withStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Fab,
	LinearProgress,
	Slide,
	FormControl,
	MenuItem,
	RadioGroup,
	FormControlLabel,
	Radio
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import reducer from '../../store/reducers';

import { ShowDialog } from '../../../components/showdialog/ShowDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="down" ref={ref} {...props} />;
});

const styles = (theme) => ({
	editImg: {
		position: 'relative'
	},
	editImgChild: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0,0.6)',
		width: 24,
		height: 24,
		borderRadius: '50%',
		marginRight: 4,
		marginTop: 4,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer'
	},
	dn: {
		display: 'none'
	},
	error: {
		backgroundColor: theme.palette.error.dark,
		color: theme.palette.getContrastText(theme.palette.error.dark),
		'&:hover': {
			background: '#da2c2c'
		}
	},
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

class Carousel extends Component {
	state = {
		form: null,
		openEditImgDiaog: false,
		selectedImage: null,
		selectedImageObj: null,
		imageChanged: false,
		addNewBtn: false,
		openImageObjDelteDialog: false,
		prevOrderImages: null
	};

	componentDidMount() {
		const params = this.props.match.params;
		const { carouselId } = params;
		this.props.setCarouselLoader(true);
		this.props.getCarousel(carouselId);

		this.props.setHomeDataLoader(true);
		this.props.getHomeData();
	}

	componentDidUpdate(prevProps, prevState) {
		if ((this.props.carousel && !this.state.form) || this.props.carousel !== prevProps.carousel) {
			let form = this.props.carousel;
			form.images = _.sortBy(this.props.carousel.images, 'order');
			this.setState({ form });
		}
		if (this.props.savingCarouselImage === 'saved') {
			this.props.setSaveCarouselImageLoader(false);
			this.handleEditImgDiaogClose();
		}

		if (this.props.savingCarouselImageObj === 'saved') {
			this.props.setSaveCarouselImageObjLoader(false);
			this.handleEditImgObjDiaogClose();
		}
		if (this.props.deletingImageObj === 'deleted') {
			this.props.setDeleteImageObjLoader(false);
			this.closeImageObjDelete();
		}
		if (this.props.orderingImages === 'ordered') {
			this.props.setCarouselImgOrderLoader(false);
		}
		if (this.props.orderingImages === 'error') {
			this.props.setCarouselImgOrderLoader(false);
			let images = this.state.prevOrderImages;
			let form = this.state.form;
			form.images = _.sortBy(images, 'order');
			this.setState({ form });
			this.props.setCarouselImgOrderLoader(false);
		}
	}

	handleImgObjChange = (event) => {
		this.setState({
			selectedImageObj: _.set({ ...this.state.selectedImageObj }, event.target.name, event.target.value)
		});
	};

	canBeSubmitted() {
		if (this.state.form !== null) {
			const { name, category } = this.state.form;
			let showSave;
			if (
				name !== undefined &&
				name !== null &&
				name.length > 0 &&
				category !== undefined &&
				category !== null &&
				category !== ''
			)
				showSave = true;
			else showSave = false;
			return showSave && !_.isEqual(this.props.carousel, this.state.form);
		} else {
			return false;
		}
	}

	handleEditImgDiaog = (image) => {
		this.setState({
			openEditImgDiaog: true,
			selectedImage: image.image,
			selectedImageObj: _.cloneDeep(image),
			imageChanged: false,
			openEditImgObjDiaog: false
		});
	};

	handleEditImgDiaogClose = () => {
		this.setState({ openEditImgDiaog: false, selectedImage: null, selectedImageObj: null, imageChanged: false });
	};

	handleChangeImg = () => {
		this.refs.fileInput.click();
	};

	handleImageChange = (e) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		if (file) {
			reader.onloadend = () => {
				this.setState({ selectedImage: reader.result, imageChanged: true });
			};
			reader.readAsDataURL(file);
		}
	};

	saveCarouselImage = () => {
		if (
			this.state.selectedImage !== undefined &&
			this.state.selectedImage !== null &&
			this.state.selectedImage !== ''
		) {
			let obj = {
				id: this.state.selectedImageObj.id,
				image: this.state.selectedImage
			};
			if (obj.id === 'new') {
				obj.carousel = this.state.form.id;
				obj.buttons = [];
			}
			this.props.setSaveCarouselImageLoader(true);
			this.props.saveCarouselImage(obj);
		}
	};

	handleImageObjEdit = (image) => {
		let imageObj = _.cloneDeep(image);
		this.setState({ selectedImageObj: imageObj, openEditImgObjDiaog: true });
	};

	handleEditImgObjDiaogClose = () => {
		this.setState({ selectedImageObj: null, openEditImgObjDiaog: false, addNewBtn: false });
	};

	handleImgObjBtnTextChange = (e, btn) => {
		let buttons = _.clone(this.state.selectedImageObj.buttons);
		let ind = buttons.findIndex((item) => {
			return item.id === btn.id;
		});
		if (ind > -1) {
			buttons[ind][e.target.name] = e.target.value;
			this.setState({
				selectedImageObj: _.set({ ...this.state.selectedImageObj, buttons })
			});
		}
	};

	getLinkedWithValue = (btn) => {
		let value = '';
		if (btn.category) {
			value = 'category_' + btn.category;
		} else if (btn.collection) {
			value = 'collection_' + btn.collection;
		} else if (btn.page) {
			value = 'page_' + btn.page;
		}
		return value;
	};

	handleChangeBtnLink = (event, btn) => {
		let value = event.target.value;
		if (value) {
			if (value.indexOf('category_') > -1) {
				let id = parseInt(value.split('category_')[1].toString());
				btn.category = id;
				btn.collection = null;
				btn.page = null;
				btn.url = null;
			} else if (value.indexOf('collection_') > -1) {
				let id = parseInt(value.split('collection_')[1].toString());
				btn.category = null;
				btn.collection = id;
				btn.page = null;
				btn.url = null;
			} else if (value.indexOf('page_') > -1) {
				let id = parseInt(value.split('page_')[1].toString());
				btn.category = null;
				btn.collection = null;
				btn.page = id;
				btn.url = null;
			}

			let buttons = _.cloneDeep(this.state.selectedImageObj.buttons);
			let ind = buttons.findIndex((item) => {
				return item.id === btn.id;
			});
			if (ind > -1) {
				buttons[ind] = btn;
				this.setState({
					selectedImageObj: _.set({ ...this.state.selectedImageObj, buttons: buttons })
				});
			}
		}
	};

	getRadioValue = (btn) => {
		let value = 'other';
		if (btn.url !== undefined && btn.url !== null) {
			value = 'url';
		}
		return value;
	};

	handleBtnUrlChange = (e, btn) => {
		let buttons = this.state.selectedImageObj.buttons;
		let ind = buttons.findIndex((item) => {
			return item.id === btn.id;
		});
		if (ind > -1) {
			buttons[ind][e.target.name] = e.target.value;
			this.setState({
				selectedImageObj: _.set({ ...this.state.selectedImageObj, buttons: buttons })
			});
		}
	};

	handleChangeRadioValue = (event, btn) => {
		let value = event.target.value;
		if (value === 'other') {
			btn.url = null;
		} else if (value === 'url') {
			btn.category = null;
			btn.collection = null;
			btn.page = null;
			btn.url = '';
		}

		let buttons = _.cloneDeep(this.state.selectedImageObj.buttons);
		let ind = buttons.findIndex((item) => {
			return item.id === btn.id;
		});
		if (ind > -1) {
			buttons[ind] = btn;
			this.setState({
				selectedImageObj: _.set({ ...this.state.selectedImageObj, buttons: buttons })
			});
		}
	};

	saveCarouselImageObj = () => {
		let obj = _.clone(this.state.selectedImageObj);
		let buttons = obj.buttons;
		buttons.forEach((item) => {
			if (item.id === 'new') {
				delete item.id;
			}
		});
		obj.buttons = buttons;
		if (obj.image) {
			delete obj.image;
		}
		this.props.setSaveCarouselImageObjLoader(true);
		this.props.saveCarouselImageObj(obj);
	};

	handleAddNewBtn = () => {
		this.setState({ addNewBtn: true });
		let newButton = {
			id: 'new',
			url: '',
			title: '',
			category: null,
			collection: null,
			page: null
		};
		let buttons = _.cloneDeep(this.state.selectedImageObj.buttons);
		buttons.push(newButton);
		this.setState({
			selectedImageObj: _.set({ ...this.state.selectedImageObj, buttons: buttons })
		});
	};

	handleImageObjBtnDelete = (btn) => {
		let buttons = _.cloneDeep(this.state.selectedImageObj.buttons);
		let filtered = buttons.filter(function(item) {
			return item.id !== btn.id;
		});
		this.setState({
			selectedImageObj: _.set({ ...this.state.selectedImageObj, buttons: filtered })
		});
		if (btn.id === 'new') {
			this.setState({ addNewBtn: false });
		}
	};

	handleImageObjDelete = (image) => {
		this.setState({ selectedImageObj: image, openImageObjDelteDialog: true });
	};

	closeImageObjDelete = () => {
		this.setState({ selectedImageObj: null, openImageObjDelteDialog: false });
	};

	deleteImageObj = () => {
		this.props.setDeleteImageObjLoader(true);
		this.props.deleteImageObj(this.state.selectedImageObj.id);
	};

	onDragEnd = (result) => {
		let { source, destination } = result;
		let orderObj = {
			removedIndex: source.index,
			addedIndex: destination.index
		};
		const { removedIndex, addedIndex } = orderObj;

		if (removedIndex !== addedIndex) {
			let images = this.state.form.images;
			this.setState({ prevOrderImages: _.cloneDeep(images) });

			let obj = { id: images[source.index].id, position: destination.index };

			let addedOrder;

			if (removedIndex > addedIndex) {
				addedOrder = images[addedIndex].order;
				for (let i = addedIndex; i < removedIndex; i++) {
					images[i].order = images[i + 1].order;
				}
			} else if (removedIndex < addedIndex) {
				addedOrder = images[addedIndex].order;
				for (let i = addedIndex; i > removedIndex; i--) {
					images[i].order = images[i - 1].order;
				}
			}
			if (addedOrder !== undefined && addedOrder !== null) {
				images[removedIndex].order = addedOrder;
				images = _.sortBy(images, 'order');

				let form = this.props.carousel;
				form.images = images;
				this.setState({ form });
			}

			this.props.setCarouselImgOrderLoader(true);
			this.props.setCarouselImgOrder(obj);
		}
	};

	render() {
		const {
			loadingCarousel,
			savingCarouselImageObj,
			classes,
			savingCarouselImage,
			loadingHomeData,
			homeData,
			deletingImageObj,
			orderingImages
		} = this.props;

		const {
			form,
			openEditImgDiaog,
			selectedImage,
			imageChanged,
			openEditImgObjDiaog,
			selectedImageObj,
			addNewBtn
		} = this.state;

		let categories = [];
		let collections = [];
		let pages = [];

		if (!loadingHomeData && homeData) {
			// categories
			let catgrs = homeData.categories;
			let catKeys = Object.keys(catgrs);
			catKeys.forEach((catItem) => {
				let obj = {
					id: 'category_' + catItem,
					value: catgrs[catItem]
				};
				categories.push(obj);
			});

			// collections
			let clctns = homeData.collections;
			let clctnKeys = Object.keys(clctns);
			clctnKeys.forEach((clctnItem) => {
				let obj = {
					id: 'collection_' + clctnItem,
					value: clctns[clctnItem]
				};
				collections.push(obj);
			});

			// pages
			let pgs = homeData.pages;
			let pgKeys = Object.keys(pgs);
			pgKeys.forEach((pgItem) => {
				let obj = {
					id: 'page_' + pgItem,
					value: pgs[pgItem]
				};
				pages.push(obj);
			});
		}

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					!loadingCarousel &&
					form && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/carousel"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Carousels
									</Typography>
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{form.title}
											</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
						</div>
					)
				}
				content={
					<div>
						<ShowDialog
							open={this.state.openImageObjDelteDialog}
							closeDeleteDialog={this.closeImageObjDelete}
							deleteDialogFunction={this.deleteImageObj}
							deleting={deletingImageObj}
						/>

						<div className="p-16 sm:p-24">
							<input
								type="file"
								onChange={this.handleImageChange}
								ref="fileInput"
								className={classes.dn}
							/>

							{orderingImages &&
							orderingImages !== 'ordered' && (
								<div className={classes.overlay}>
									<div className={classes.overlayContent}>
										<CircularProgress color="secondary" />
									</div>
								</div>
							)}

							{loadingCarousel && (
								<div className="text-center pt-60">
									<CircularProgress color="secondary" />
								</div>
							)}

							{!loadingCarousel &&
							form && (
								<DragDropContext onDragEnd={this.onDragEnd}>
									<Droppable droppableId="list" type="list" direction="horizontal">
										{(provided) => (
											<div
												ref={provided.innerRef}
												className="flex w-full white-space-no-wrap overflow-x-auto"
											>
												{form.images &&
													form.images.length > 0 &&
													form.images.map((image, index) => (
														<Draggable
															draggableId={image.id}
															key={index}
															index={index}
															type="list"
														>
															{(provided, snapshot) => (
																<div
																	key={index}
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<Card
																		style={{ width: 500 }}
																		className="m-8"
																		elevation={snapshot.isDragging ? 3 : 1}
																	>
																		<CardHeader
																			title={image.caption}
																			style={{ height: 60 }}
																		/>
																		<div className={classes.editImg}>
																			<img
																				src={image.image}
																				alt=""
																				className="w-full"
																			/>
																			<div
																				className={classes.editImgChild}
																				onClick={() =>
																					this.handleEditImgDiaog(image)}
																			>
																				<Icon
																					style={{
																						fontSize: 16,
																						color: 'white'
																					}}
																				>
																					edit
																				</Icon>
																			</div>
																		</div>

																		<CardActions className="flex items-center">
																			<div className="whitespace-no-wrap overflow-x-auto w-4/5">
																				{image.buttons &&
																				image.buttons.length > 0 && (
																					<div className="py-8">
																						{image.buttons.map(
																							(btn, index) => {
																								return (
																									<Button
																										variant="contained"
																										size="small"
																										color="primary"
																										key={index}
																										className="mr-8 my-4"
																										disabled
																									>
																										{btn.title}
																									</Button>
																								);
																							}
																						)}
																					</div>
																				)}
																			</div>
																			<div className="w-1/5 whitespace-no-wrap overflow-x-auto flex justify-end">
																				<IconButton
																					aria-label="Edit Image"
																					onClick={() =>
																						this.handleImageObjEdit(image)}
																				>
																					<Icon>edit</Icon>
																				</IconButton>
																				<IconButton
																					aria-label="Delete Image"
																					onClick={() =>
																						this.handleImageObjDelete(
																							image
																						)}
																				>
																					<Icon>delete</Icon>
																				</IconButton>
																			</div>
																		</CardActions>
																	</Card>
																</div>
															)}
														</Draggable>
													))}
												{provided.placeholder}

												<div className="" key={'new'}>
													<Card
														className="m-8 flex items-center px-16 cursor-pointer justify-center"
														onClick={() =>
															this.handleEditImgDiaog({
																image: null,
																caption: '',
																id: 'new',
																buttons: [],
																carousel: form.id
															})}
														style={{ height: 326 }}
													>
														<Icon style={{ fontSize: 40 }}>add_circle</Icon>
													</Card>
												</div>
											</div>
										)}
									</Droppable>
								</DragDropContext>
							)}
						</div>

						{/* dialog for updating image */}
						<Dialog
							open={openEditImgDiaog}
							TransitionComponent={Transition}
							onClose={this.handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
							maxWidth={'sm'}
							fullWidth={true}
						>
							<DialogTitle id="alert-dialog-title">{'Click on Select Image and Save'}</DialogTitle>
							<DialogContent>
								{selectedImage && selectedImage !== '' ? (
									<img
										className={classNames('rounded', classes.addedImage)}
										src={selectedImage}
										alt=""
									/>
								) : (
									<div className="px-32 text-center">
										<img
											className={classNames('rounded min-h-96')}
											src={'assets/images/ecommerce/product-image-placeholder.png'}
											alt=""
										/>
									</div>
								)}
								<div className="text-center">
									<Fab
										variant="extended"
										size="small"
										color="primary"
										aria-label="Add"
										className="mt-8"
										onClick={this.handleChangeImg}
										disabled={savingCarouselImage && savingCarouselImage !== 'saved'}
									>
										Change Image
									</Fab>
								</div>
								{savingCarouselImage &&
								savingCarouselImage !== 'saved' && (
									<LinearProgress color="secondary" className="w-full mt-8" />
								)}
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleEditImgDiaogClose} color="primary">
									Cancel
								</Button>
								<div className={classes.wrapper}>
									<Button
										onClick={this.saveCarouselImage}
										color="primary"
										autoFocus
										disabled={
											(savingCarouselImage && savingCarouselImage !== 'saved') ||
											selectedImage === '' ||
											!imageChanged
										}
										className="disabled"
									>
										{savingCarouselImage && savingCarouselImage !== 'saved' ? 'Saving...' : 'Save'}
									</Button>
								</div>
							</DialogActions>
						</Dialog>

						{/*  dialog for updating image object */}
						{selectedImageObj && (
							<Dialog
								open={openEditImgObjDiaog}
								TransitionComponent={Transition}
								onClose={this.handleClose}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
								maxWidth={'sm'}
								fullWidth={true}
							>
								<DialogTitle id="alert-dialog-title">{'Update Image Object'}</DialogTitle>
								<DialogContent>
									<TextField
										autoFocus
										margin="dense"
										id="caption"
										name="caption"
										label="Image Caption"
										type="text"
										fullWidth
										value={selectedImageObj.caption ? selectedImageObj.caption : ''}
										onChange={(e) => this.handleImgObjChange(e)}
										variant="outlined"
										required
									/>
									{selectedImageObj.buttons.map((butn, index) => {
										return (
											<Card key={index} className="rounded-4 my-28 p-16">
												<TextField
													autoFocus
													margin="dense"
													id="title"
													name="title"
													label="Button Text"
													type="text"
													fullWidth
													value={butn.title}
													onChange={(e) => this.handleImgObjBtnTextChange(e, butn)}
													variant="outlined"
													required
												/>
												<FormControl component="fieldset">
													<RadioGroup
														aria-label="position"
														name="position"
														value={this.getRadioValue(butn)}
														onChange={(e) => this.handleChangeRadioValue(e, butn)}
														row
													>
														<FormControlLabel
															value="other"
															control={<Radio color="secondary" />}
															label="Other"
															labelPlacement="end"
														/>
														<FormControlLabel
															value="url"
															control={<Radio color="secondary" />}
															label="URL"
															labelPlacement="end"
														/>
													</RadioGroup>
												</FormControl>
												{this.getRadioValue(butn) === 'other' && (
													<TextField
														className={classNames('my-16', classes.textField)}
														name="category"
														id="category"
														select
														label="Linked With"
														value={this.getLinkedWithValue(butn)}
														onChange={(e) => this.handleChangeBtnLink(e, butn)}
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
														{loadingHomeData && <MenuItem>Loading...</MenuItem>}

														{/* Categories */}
														{!loadingHomeData &&
														categories && (
															<MenuItem key="categories" value="categories" disabled>
																Categories
															</MenuItem>
														)}
														{!loadingHomeData && categories && categories.length > 0 ? (
															categories.map((catItem) => {
																return (
																	<MenuItem key={catItem.id} value={catItem.id}>
																		{catItem.value}
																	</MenuItem>
																);
															})
														) : (
															<MenuItem>No Options</MenuItem>
														)}

														{/* collections */}
														{!loadingHomeData &&
														collections && (
															<MenuItem key="collections" value="collections" disabled>
																Collections
															</MenuItem>
														)}
														{!loadingHomeData && collections && collections.length > 0 ? (
															collections.map((clctnItem) => {
																return (
																	<MenuItem key={clctnItem.id} value={clctnItem.id}>
																		{clctnItem.value}
																	</MenuItem>
																);
															})
														) : (
															<MenuItem>No Options</MenuItem>
														)}

														{/* pages */}
														{!loadingHomeData &&
														pages && (
															<MenuItem key="pages" value="pages" disabled>
																Pages
															</MenuItem>
														)}
														{!loadingHomeData && pages && pages.length > 0 ? (
															pages.map((pgItem) => {
																return (
																	<MenuItem key={pgItem.id} value={pgItem.id}>
																		{pgItem.value}
																	</MenuItem>
																);
															})
														) : (
															<MenuItem>No Options</MenuItem>
														)}
													</TextField>
												)}
												{this.getRadioValue(butn) === 'url' && (
													<TextField
														autoFocus
														className="my-16"
														margin="dense"
														id="url"
														name="url"
														label="External URL"
														type="text"
														fullWidth
														value={butn.url}
														onChange={(e) => this.handleBtnUrlChange(e, butn)}
														variant="outlined"
														required
													/>
												)}
												<div className="flex justify-end">
													<Button
														className={classes.error}
														variant="contained"
														size="small"
														onClick={() => this.handleImageObjBtnDelete(butn)}
													>
														Delete
													</Button>
												</div>
											</Card>
										);
									})}

									{!addNewBtn && (
										<Card className="rounded-4 my-28 p-16">
											<div
												onClick={this.handleAddNewBtn}
												className="flex items-center justify-center cursor-pointer"
											>
												<IconButton aria-label="Add Button">
													<Icon>add_circle</Icon>
												</IconButton>
												<p className="text-18 font-500">Add New Button</p>
											</div>
										</Card>
									)}
								</DialogContent>
								<DialogActions>
									<Button onClick={this.handleEditImgObjDiaogClose} color="primary">
										Cancel
									</Button>
									<div className={classes.wrapper}>
										<Button
											onClick={this.saveCarouselImageObj}
											color="primary"
											autoFocus
											disabled={savingCarouselImageObj && savingCarouselImageObj !== 'saved'}
										>
											{savingCarouselImageObj && savingCarouselImageObj !== 'saved' ? (
												'Saving...'
											) : (
												'Save'
											)}
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
			getCarousel: Actions.getCarousel,
			setCarouselLoader: Actions.setCarouselLoader,
			setSaveCarouselImageLoader: Actions.setSaveCarouselImageLoader,
			saveCarouselImage: Actions.saveCarouselImage,
			getHomeData: Actions.getHomeData,
			setHomeDataLoader: Actions.setHomeDataLoader,
			setSaveCarouselImageObjLoader: Actions.setSaveCarouselImageObjLoader,
			saveCarouselImageObj: Actions.saveCarouselImageObj,
			setDeleteImageObjLoader: Actions.setDeleteImageObjLoader,
			deleteImageObj: Actions.deleteImageObj,
			setCarouselImgOrderLoader: Actions.setCarouselImgOrderLoader,
			setCarouselImgOrder: Actions.setCarouselImgOrder
		},
		dispatch
	);
}

function mapStateToProps({ carouselReducer }) {
	return {
		carousel: carouselReducer.carousel.carousel,
		loadingCarousel: carouselReducer.carousel.loadingCarousel,
		savingCarouselImage: carouselReducer.carousel.savingCarouselImage,
		homeData: carouselReducer.carousel.homeData,
		loadingHomeData: carouselReducer.carousel.loadingHomeData,
		savingCarouselImageObj: carouselReducer.carousel.savingCarouselImageObj,
		deletingImageObj: carouselReducer.carousel.deletingImageObj,
		orderingImages: carouselReducer.carousel.orderingImages
	};
}

export default withReducer('carouselReducer', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Carousel)))
);
