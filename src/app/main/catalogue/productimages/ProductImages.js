import React, { Component } from 'react';
import {
	withStyles,
	Button,
	Icon,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Slide,
	TextField
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
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import reducer from '../store/reducers';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ShowDialog } from '../../components/showdialog/ShowDialog';

function Transition(props) {
	return <Slide direction="down" {...props} />;
}

const styles = (theme) => ({
	productImageStarIconButton: {
		width: '24px',
		height: '24px'
	},
	productImageFeaturedStar: {
		position: 'absolute',
		color: orange[400],
		opacity: 1,
		fontSize: '18px'
	},
	productImageStar: {
		position: 'absolute',
		color: 'white',
		opacity: 1,
		fontSize: '18px'
	},
	productImageIconButton: {
		width: '24px',
		height: '24px',
		opacity: 0
	},
	productImageDelete: {
		position: 'absolute',
		color: 'white',
		opacity: 1,
		fontSize: '18px'
	},
	productLoaderIcon: {
		color: '#03b6f2',
		top: 0
	},
	r0: {
		right: 0
	},
	l0: {
		left: 0
	},
	productImageItem: {
		width: 'auto',
		height: 300,
		display: 'flex',
		alignItems: 'center',
		justifyItems: 'center',
		position: 'relative',
		borderRadius: 4,
		marginRight: 30,
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
			},
			'& $imgActions': {
				opacity: 0.8
			},
			'& $pickText': {
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
		height: 180,
		width: 180,
		objectFit: 'contain'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	imgActions: {
		position: 'absolute',
		bottom: 0,
		background: '#000000',
		opacity: 0,
		color: 'white',
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: '3px',
		paddingBottom: '3px'
	},
	op8: {
		opacity: 0.8
	},
	pickText: {
		opacity: 0
	},
	pickedText: {
		opacity: 1
	},
	emptyCirlce: {
		border: '2px solid #707070',
		width: '32px',
		height: '32px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: '50%'
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
class ProductImages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			open: false,
			selectedFormImages: null,
			selectedImages: null,
			toppingImgId: null,
			openDeleteDialog: false,
			selectedImgObj: null,
			openImgDialog: false,
			colorObj: null,
			imageSize: {
				width: null,
				height: null
			}
		};
	}

	componentDidMount() {
		this.props.setProductImagesLoader(true);
		this.props.getProductImages(this.props.match.params.productId);
	}

	componentDidUpdate() {
		if (
			(this.props.data && !this.state.data) ||
			(this.props.data &&
				this.state.data &&
				(this.props.data.images !== this.state.data.images || this.props.data.color !== this.state.data.color))
		) {
			let data = this.props.data;
			data.images = _.sortBy(this.props.data.images, 'order');
			this.setState({ data });
		}
		if (this.props.savingImage === 'saved') {
			this.props.setSaveImageLoader(false);
			this.handleClose();
			this.componentDidMount();
		}
		if (this.props.toppingImage === 'topped') {
			this.props.setTopImageLoader(false);
			this.setState({ toppingImgId: null });
		}
		if (this.props.deletingImage === 'deleted') {
			this.props.setDeleteImageLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.savingImgColor === 'saved') {
			this.props.setSaveImageColorLoader(false);
			this.closeImgSelectDialog();
		}
		if (this.props.updatingImgColor === 'updated') {
			this.props.setUpdateImageColorLoader(false);
			this.closeImgSelectDialog();
		}
		if (this.props.deletingImgColor === 'deleted') {
			this.props.setDeleteImageColorLoader(false);
			this.closeImgSelectDialog();
		}
		if (this.props.orderingImages === 'ordered') {
			this.props.setImagesOrderLoader(false);
		}
		if (this.props.orderingImages === 'error') {
			this.props.setImagesOrderLoader(false);
			let images = this.state.prevOrderImages;
			let data = this.state.data;
			data.images = _.sortBy(images, 'order');
			this.setState({ data });
			this.props.setImagesOrderLoader(false);
		}
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false, selectedImages: null });
	};

	handleClick = () => {
		this.refs.fileInput.click();
	};

	handleImageChange = async (e) => {
		e.preventDefault();
		let files = e.target.files;
		if (files) {
			this.setState({ selectedFormImages: files });
			for (let i = 0; i < files.length; i++) {
				await this.getBase64Url(files[i]);
			}
		}
	};
	getBase64Url = (file) => {
		let reader = new FileReader();
		reader.onloadend = () => {
			let selectedImages = this.state.selectedImages ? this.state.selectedImages : [];
			selectedImages.push(reader.result);
			this.setState({ selectedImages });
		};
		reader.readAsDataURL(file);
	};

	saveImage = () => {
		let { selectedImages, selectedFormImages } = this.state;
		if (selectedImages && selectedImages.length > 0 && selectedFormImages && selectedFormImages.length > 0) {
			let fd = new FormData();
			fd.append('product', this.props.match.params.productId);
			for (let i = 0; i < selectedFormImages.length; i++) {
				fd.append('image', selectedFormImages[i]);
			}
			this.props.setSaveImageLoader(true);
			this.props.saveImage(fd);
		}
	};

	topImage = (id) => {
		this.setState({ toppingImgId: id });
		this.props.setTopImageLoader(true);
		this.props.topImage(id);
	};

	handleDeleteImage = (image) => {
		this.setState({ openDeleteDialog: true, selectedImgObj: image });
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedImgObj: null });
	};

	deleteImage = () => {
		let id = this.state.selectedImgObj.id;
		this.props.setDeleteImageLoader(true);
		this.props.deleteImage(id);
	};

	openImgSelectDialog = (image) => {
		this.setState({ selectedImgObj: image, openImgDialog: true });
	};

	closeImgSelectDialog = () => {
		this.setState({ openImgDialog: false });
		this.setState({
			colorObj: null
		});
	};

	getImgPosition = (e) => {
		var elmPos = document.getElementById('img-to-crop').getBoundingClientRect();
		var x = e.pageX - elmPos.left;
		var y = e.pageY - elmPos.top;
		const { imageSize } = this.state;
		var x_pos = (x / imageSize.width).toFixed(2);
		var y_pos = (y / imageSize.height).toFixed(2);
		let ppoi = x_pos + 'x' + y_pos;
		this.handleChange(ppoi, 'color_icon');
	};

	getImageSize = () => {
		var obj = document.getElementById('img-to-crop');
		this.setState({
			imageSize: {
				width: obj.clientWidth,
				height: obj.clientHeight
			}
		});
	};

	getCoords = () => {
		const { colorObj } = this.state;
		let coords = [];
		if (colorObj !== undefined && colorObj !== null && colorObj.icon !== undefined && colorObj.icon !== null) {
			var regex = /[+-]?\d+(?:\.\d+)?/g;
			var str = colorObj.icon.ppoi;
			var match;
			while ((match = regex.exec(str))) {
				coords.push(match[0]);
			}
		}
		return coords;
	};

	handleChange = (event, type) => {
		if (type === 'color_name') {
			this.setState({ colorObj: _.set({ ...this.state.colorObj, name: event.target.value }) });
		} else if (type === 'color_icon') {
			this.setState({
				colorObj: _.set({ ...this.state.colorObj, icon: { id: this.state.selectedImgObj.id, ppoi: event } })
			});
		}
	};

	updateColor = () => {
		const { colorObj } = this.state;
		let coords = this.getCoords();
		let ppoi;
		if (coords && coords.length === 2) {
			ppoi = coords[0] + 'x' + coords[1];
		}
		if (
			colorObj !== undefined &&
			colorObj !== null &&
			colorObj.name !== undefined &&
			colorObj.name !== null &&
			colorObj.name !== '' &&
			colorObj.icon !== undefined &&
			colorObj.icon !== null
		) {
			let { colorObj } = this.state;
			let obj = {
				id: colorObj.id,
				product: this.props.match.params.productId,
				name: colorObj.name,
				icon: {
					id: colorObj.icon.id,
					ppoi: ppoi
				}
			};
			this.props.setUpdateImageColorLoader(true);
			this.props.updateImageColor(obj);
		}
	};

	saveColorData = () => {
		const { colorObj } = this.state;
		if (colorObj !== undefined && colorObj !== null) {
			let obj = {
				type: 'save_color',
				product: this.props.match.params.productId,
				name: colorObj.name,
				icon: colorObj.icon
			};
			this.props.setSaveImageColorLoader(true);
			this.props.saveImageColor(obj);
		}
	};

	ModifyColor = (image) => {
		this.setState({ colorObj: this.state.data.color });
		this.openImgSelectDialog(image);
	};

	deleteColor = () => {
		const { data } = this.state;
		if (data !== undefined && data !== null && data.color !== undefined && data.color !== null && data.color.id) {
			this.props.setDeleteImageColorLoader(true);
			this.props.deleteImageColor(data.color.id);
		}
	};

	// for ordering images
	onDragEnd = (result) => {
		let { source, destination } = result;
		let orderObj = {
			removedIndex: source.index,
			addedIndex: destination.index
		};
		const { removedIndex, addedIndex } = orderObj;

		if (removedIndex !== addedIndex) {
			let images = this.state.data.images;
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

				let data = this.props.data;
				data.images = images;
				this.setState({ data });
			}

			this.props.setImagesOrderLoader(true);
			this.props.setImagesOrder(obj);
		}
	};

	render() {
		const {
			loading,
			classes,
			savingImage,
			toppingImage,
			deletingImage,
			savingImgColor,
			updatingImgColor,
			deletingImgColor,
			orderingImages
		} = this.props;
		const {
			data,
			toppingImgId,
			openDeleteDialog,
			openImgDialog,
			colorObj,
			imageSize,
			selectedImgObj,
			selectedImages
		} = this.state;

		let coords = this.getCoords();

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					data &&
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
							open={openDeleteDialog}
							closeDeleteDialog={this.closeDeleteDialog}
							deleteDialogFunction={this.deleteImage}
							deleting={deletingImage}
						/>
						{orderingImages &&
						orderingImages !== 'ordered' && (
							<div className={classes.overlay}>
								<div className={classes.overlayContent}>
									<CircularProgress color="secondary" />
								</div>
							</div>
						)}
						{loading && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{data &&
						!loading && (
							<div className="flex justify-center sm:justify-start flex-wrap">
								<input
									type="file"
									onChange={this.handleImageChange}
									ref="fileInput"
									className={classes.dn}
									multiple="multiple"
								/>
								<DragDropContext onDragEnd={this.onDragEnd}>
									<Droppable droppableId="list" type="list" direction="horizontal">
										{(provided) => (
											<div ref={provided.innerRef} className="flex flex-row flex-wrap">
												{data.images &&
													data.images.length > 0 &&
													data.images.map((media, index) => (
														<Draggable
															draggableId={media.id}
															key={index}
															index={index}
															type="list"
														>
															{(provided, snapshot) => (
																<div
																	className={classes.productImageItem}
																	key={media.id}
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<div
																		className={classNames(
																			classes.imgActions,
																			(media.order === 0 ||
																				(data.color !== undefined &&
																					data.color !== null &&
																					data.color.name !== undefined &&
																					data.color.name !== null &&
																					data.color.icon !== undefined &&
																					data.color.icon !== null &&
																					data.color.id !== undefined &&
																					data.color.id !== null &&
																					data.color.icon.id === media.id)) &&
																				classes.op8
																		)}
																	>
																		{media.order === 0 && (
																			<IconButton
																				className={
																					classes.productImageStarIconButton
																				}
																			>
																				<Icon
																					className={
																						classes.productImageFeaturedStar
																					}
																				>
																					star
																				</Icon>
																			</IconButton>
																		)}
																		{media.order !== 0 &&
																		!(
																			toppingImage &&
																			toppingImage !== 'topped' &&
																			toppingImgId !== undefined &&
																			toppingImgId !== null &&
																			toppingImgId === media.id
																		) && (
																			<IconButton
																				className={classNames(
																					classes.productImageIconButton,
																					classes.l0
																				)}
																				onClick={() => this.topImage(media.id)}
																			>
																				<Icon
																					className={classes.productImageStar}
																				>
																					star
																				</Icon>
																			</IconButton>
																		)}
																		{toppingImage &&
																		toppingImage !== 'topped' &&
																		toppingImgId !== undefined &&
																		toppingImgId !== null &&
																		toppingImgId === media.id && (
																			<CircularProgress
																				className={classNames(
																					classes.productLoaderIcon,
																					classes.l0
																				)}
																				color="secondary"
																				size={18}
																			/>
																		)}
																		{data.color !== undefined &&
																		data.color !== null &&
																		data.color.name !== undefined &&
																		data.color.name !== null &&
																		data.color.icon !== undefined &&
																		data.color.icon !== null &&
																		data.color.id !== undefined &&
																		data.color.id !== null &&
																		data.color.icon.id === media.id && (
																			<p
																				className={classes.pickedText}
																				onClick={() => this.ModifyColor(media)}
																			>
																				Modify Color
																			</p>
																		)}
																		{(data.color === undefined ||
																			data.color === null ||
																			(data.color !== undefined &&
																				data.color !== null &&
																				(data.color.id === undefined ||
																					data.color.id === null))) && (
																			<p
																				className={classes.pickText}
																				onClick={() =>
																					this.openImgSelectDialog(media)}
																			>
																				Pick Color
																			</p>
																		)}
																		<IconButton
																			className={classNames(
																				classes.productImageIconButton,
																				classes.r0
																			)}
																			onClick={() =>
																				this.handleDeleteImage(media)}
																		>
																			<Icon
																				className={classes.productImageDelete}
																			>
																				close
																			</Icon>
																		</IconButton>
																	</div>
																	<img
																		className="max-w-none w-auto h-full"
																		src={media.image}
																		alt="product"
																	/>
																</div>
															)}
														</Draggable>
													))}
											</div>
										)}
									</Droppable>
								</DragDropContext>
								<div onClick={this.handleClickOpen}>
									<div className={classes.productImageItem}>
										<div
											className={classNames(
												classes.board,
												classes.newBoard,
												'flex flex-col items-center justify-center w-full h-full rounded py-24'
											)}
										>
											<Icon className="text-56">add_circle</Icon>
										</div>
									</div>
								</div>
							</div>
						)}
						<Dialog
							open={this.state.open}
							onClose={this.handleClose}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
							maxWidth="sm"
							scroll="paper"
							fullWidth={true}
						>
							<DialogTitle id="alert-dialog-title">{'Click on Select Image and Upload'}</DialogTitle>
							<DialogContent className="flex items-center justify-center flex-col">
								<div className="flex flex-row flex-wrap justify-center mt-12">
									{selectedImages && selectedImages.length > 0 ? (
										<React.Fragment>
											{selectedImages.map((img, index) => (
												<img
													key={index}
													className={classNames('rounded m-8', classes.addedImage)}
													src={img}
													alt=""
												/>
											))}
										</React.Fragment>
									) : (
										<img
											className={classNames('rounded', classes.addedImage)}
											src={'assets/images/ecommerce/product-image-placeholder.png'}
											alt=""
										/>
									)}
								</div>
								<Fab
									variant="extended"
									size="small"
									color="primary"
									aria-label="Add"
									className="mt-8"
									onClick={this.handleClick}
									disabled={savingImage && savingImage !== 'saved'}
								>
									Select Image
								</Fab>
								{savingImage &&
								savingImage !== 'saved' && <LinearProgress color="secondary" className="w-full mt-8" />}
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary">
									Cancel
								</Button>
								<div className={classes.wrapper}>
									<Button
										onClick={this.saveImage}
										color="primary"
										autoFocus
										disabled={
											(savingImage && savingImage !== 'saved') ||
											(!selectedImages || selectedImages.length === 0)
										}
										className="disabled"
									>
										{savingImage && savingImage !== 'saved' ? 'Saving...' : 'Save'}
									</Button>
								</div>
							</DialogActions>
						</Dialog>

						{data && (
							<Dialog
								fullWidth={true}
								maxWidth={'sm'}
								scroll={'body'}
								open={openImgDialog}
								TransitionComponent={Transition}
								keepMounted
								aria-labelledby="alert-dialog-slide-title"
								aria-describedby="alert-dialog-slide-description"
							>
								<DialogTitle id="alert-dialog-slide-title" className="flex justify-center items-center">
									{'Click anywhere on the image to crop'}
								</DialogTitle>
								{selectedImgObj !== undefined &&
								selectedImgObj !== null && (
									<DialogContent>
										<div className="flex flex-col justify-center items-center">
											<img
												src={selectedImgObj.image}
												onClick={this.getImgPosition}
												onLoad={this.getImageSize}
												onLoadedData={this.getImageSize}
												id="img-to-crop"
												alt=""
											/>
											<div className="flex justify-center pt-16">
												<p className="text-20">Selected Position:</p>
												{colorObj !== undefined &&
												colorObj !== null &&
												coords !== undefined &&
												coords !== null &&
												coords.length === 2 &&
												imageSize.width !== null &&
												imageSize.height !== null ? (
													<div
														className="ml-12"
														style={{
															width: 32,
															height: 32,
															background: "url('" + selectedImgObj.image + "')",
															backgroundPosition:
																-(coords[0] * imageSize.width) +
																14 +
																'px ' +
																(-(coords[1] * imageSize.height) + 14) +
																'px',
															borderRadius: '50%',
															border: '2px solid #707070'
														}}
													/>
												) : (
													<div className={classNames(classes.emptyCirlce, 'ml-12')} />
												)}
											</div>
											<TextField
												className="mt-8 mb-16"
												label="Name"
												error={
													colorObj !== undefined &&
													colorObj !== null &&
													(colorObj.name === undefined ||
														colorObj.name === null ||
														colorObj.name === '')
												}
												required
												autoFocus
												id="name"
												name="name"
												value={
													colorObj !== undefined && colorObj !== null && colorObj.name ? (
														colorObj.name
													) : (
														''
													)
												}
												onChange={(e) => this.handleChange(e, 'color_name')}
												variant="outlined"
												fullWidth
											/>
										</div>
									</DialogContent>
								)}
								<DialogActions>
									<div className="flex justify-between w-full">
										{data.color !== undefined &&
										data.color !== null && (
											<Button
												className={classNames('ml-8', classes.button)}
												onClick={this.deleteColor}
												disabled={deletingImgColor && deletingImgColor !== 'deleted'}
											>
												{deletingImgColor && deletingImgColor !== 'deleted' ? (
													'Deleting...'
												) : (
													'Delete'
												)}
											</Button>
										)}
										<div className="ml-auto">
											<Button onClick={this.closeImgSelectDialog} color="primary">
												Cancel
											</Button>
											{data !== undefined &&
											data !== null &&
											data.color !== undefined &&
											data.color !== null ? (
												<Button
													className={classes.button}
													onClick={this.updateColor}
													disabled={
														(updatingImgColor && updatingImgColor !== 'updated') ||
														(colorObj === undefined ||
															colorObj === null ||
															colorObj.name === undefined ||
															colorObj.name === null ||
															colorObj.name === '' ||
															colorObj.icon === undefined ||
															colorObj.icon === null)
													}
												>
													{updatingImgColor && updatingImgColor !== 'updated' ? (
														'Updating...'
													) : (
														'Update'
													)}
												</Button>
											) : (
												<Button
													onClick={this.saveColorData}
													disabled={
														colorObj === undefined ||
														colorObj === null ||
														colorObj.name === undefined ||
														colorObj.name === null ||
														colorObj.name === '' ||
														colorObj.icon === undefined ||
														colorObj.icon === null ||
														(savingImgColor !== 'saved' && savingImgColor)
													}
													color="primary"
												>
													{savingImgColor !== 'saved' && savingImgColor ? (
														'Saving...'
													) : (
														'Save'
													)}
												</Button>
											)}
										</div>
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
			getProductImages: Actions.getProductImages,
			setProductImagesLoader: Actions.setProductImagesLoader,
			setSaveImageLoader: Actions.setSaveImageLoader,
			saveImage: Actions.saveImage,
			setTopImageLoader: Actions.setTopImageLoader,
			topImage: Actions.topImage,
			deleteImage: Actions.deleteImage,
			setDeleteImageLoader: Actions.setDeleteImageLoader,
			saveImageColor: Actions.saveImageColor,
			setSaveImageColorLoader: Actions.setSaveImageColorLoader,
			updateImageColor: Actions.updateImageColor,
			setUpdateImageColorLoader: Actions.setUpdateImageColorLoader,
			deleteImageColor: Actions.deleteImageColor,
			setDeleteImageColorLoader: Actions.setDeleteImageColorLoader,
			setImagesOrder: Actions.setImagesOrder,
			setImagesOrderLoader: Actions.setImagesOrderLoader
		},
		dispatch
	);
}

function mapStateToProps({ productImagesApp }) {
	return {
		data: productImagesApp.productimages.data,
		loading: productImagesApp.productimages.loading,
		savingImage: productImagesApp.productimages.savingImage,
		toppingImage: productImagesApp.productimages.toppingImage,
		deletingImage: productImagesApp.productimages.deletingImage,
		savingImgColor: productImagesApp.productimages.savingImgColor,
		updatingImgColor: productImagesApp.productimages.updatingImgColor,
		deletingImgColor: productImagesApp.productimages.deletingImgColor,
		orderingImages: productImagesApp.productimages.orderingImages
	};
}

export default withReducer('productImagesApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductImages)))
);
