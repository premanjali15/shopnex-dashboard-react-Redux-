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

class Highlight extends Component {
	state = {
		form: null,
		openItemDiaog: false,
		selectedItem: null,
		imageChanged: false,
		openItemDelteDialog: false,
		prevOrderItems: null
	};

	componentDidMount() {
		const params = this.props.match.params;
		const { highlightId } = params;
		this.props.setHighlightLoader(true);
		this.props.getHighlight(highlightId);

		this.props.setHomeDataLoader(true);
		this.props.getHomeData();
	}

	componentDidUpdate(prevProps, prevState) {
		if ((this.props.highlight && !this.state.form) || this.props.highlight !== prevProps.highlight) {
			let form = this.props.highlight;
			form.items = _.sortBy(this.props.highlight.items, 'order');
			this.setState({ form });
		}
		if (this.props.savingHighlightItem === 'saved') {
			this.props.setSaveHighlightItemLoader(false);
			this.handleEditItemDiaogClose();
		}
		if (this.props.deletingHighlightItem === 'deleted') {
			this.props.setDeleteHighlightItemLoader(false);
			this.handleCloseDeleteItemDiaog();
		}
		if (this.props.orderingItems === 'ordered') {
			this.props.setHighlightItemOrderLoader(false);
		}
		if (this.props.orderingItems === 'error') {
			this.props.setHighlightItemOrderLoader(false);
			let items = this.state.prevOrderItems;
			let form = this.state.form;
			form.items = _.sortBy(items, 'order');
			this.setState({ form });
			this.props.setHighlightItemOrderLoader(false);
		}
	}

	handleItemChange = (event) => {
		this.setState({
			selectedItem: _.set({ ...this.state.selectedItem }, event.target.name, event.target.value)
		});
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
				this.setState({
					selectedItem: _.set({ ...this.state.selectedItem }, 'image', reader.result),
					imageChanged: true
				});
			};
			reader.readAsDataURL(file);
		}
	};

	getLinkedWithValue = (item) => {
		let value = '';
		if (item.category) {
			value = 'category_' + item.category;
		} else if (item.collection) {
			value = 'collection_' + item.collection;
		} else if (item.page) {
			value = 'page_' + item.page;
		}
		return value;
	};

	handleChangeBtnLink = (event, item) => {
		let value = event.target.value;
		if (value) {
			if (value.indexOf('category_') > -1) {
				let id = parseInt(value.split('category_')[1].toString());
				item.category = id;
				item.collection = null;
				item.page = null;
				item.url = null;
			} else if (value.indexOf('collection_') > -1) {
				let id = parseInt(value.split('collection_')[1].toString());
				item.category = null;
				item.collection = id;
				item.page = null;
				item.url = null;
			} else if (value.indexOf('page_') > -1) {
				let id = parseInt(value.split('page_')[1].toString());
				item.category = null;
				item.collection = null;
				item.page = id;
				item.url = null;
			}

			this.setState({
				selectedItem: item
			});
		}
	};

	getRadioValue = (item) => {
		let value = 'other';
		if (item.url !== undefined && item.url !== null) {
			value = 'url';
		}
		return value;
	};

	handleChangeRadioValue = (event, item) => {
		let value = event.target.value;
		if (value === 'other') {
			item.url = null;
		} else if (value === 'url') {
			item.category = null;
			item.collection = null;
			item.page = null;
			item.url = '';
		}
		this.setState({
			selectedItem: item
		});
	};

	// for add and edit items
	handleEditItemDiaog = (item) => {
		this.setState({
			openItemDiaog: true,
			selectedItem: item,
			imageChanged: false
		});
	};
	handleEditItemDiaogClose = () => {
		this.setState({ openItemDiaog: false, selectedItem: null, imageChanged: false });
	};
	saveHighlightItem = () => {
		if (
			this.state.selectedItem !== undefined &&
			this.state.selectedItem !== null &&
			this.state.selectedItem.image &&
			this.state.selectedItem.image !== ''
		) {
			let data = _.clone(this.state.selectedItem);
			if (this.state.imageChanged === false) delete data.image;
			this.props.setSaveHighlightItemLoader(true);
			this.props.saveHighlightItem(data);
		}
	};

	// for deleting items
	handleDeleteItemDiaog = (item) => {
		this.setState({ selectedItem: item, openItemDelteDialog: true });
	};
	handleCloseDeleteItemDiaog = () => {
		this.setState({ selectedItem: null, openItemDelteDialog: false });
	};
	deleteHighlightItem = () => {
		this.props.setDeleteHighlightItemLoader(true);
		this.props.deleteHighlightItem(this.state.selectedItem.id);
	};

	// for ordering items
	onDragEnd = (result) => {
		let { source, destination } = result;
		let orderObj = {
			removedIndex: source.index,
			addedIndex: destination.index
		};
		const { removedIndex, addedIndex } = orderObj;

		if (removedIndex !== addedIndex) {
			let items = this.state.form.items;
			this.setState({ prevOrderItems: _.cloneDeep(items) });

			let obj = { id: items[source.index].id, position: destination.index };

			let addedOrder;

			if (removedIndex > addedIndex) {
				addedOrder = items[addedIndex].order;
				for (let i = addedIndex; i < removedIndex; i++) {
					items[i].order = items[i + 1].order;
				}
			} else if (removedIndex < addedIndex) {
				addedOrder = items[addedIndex].order;
				for (let i = addedIndex; i > removedIndex; i--) {
					items[i].order = items[i - 1].order;
				}
			}
			if (addedOrder !== undefined && addedOrder !== null) {
				items[removedIndex].order = addedOrder;
				items = _.sortBy(items, 'order');

				let form = this.props.highlight;
				form.items = items;
				this.setState({ form });
			}

			this.props.setHighlightItemOrderLoader(true);
			this.props.setHighlightItemOrder(obj);
		}
	};

	render() {
		const {
			loadingHighlight,
			classes,
			savingHighlightItem,
			loadingHomeData,
			homeData,
			deletingHighlightItem,
			orderingItems
		} = this.props;
		const { form, openItemDiaog, selectedItem } = this.state;

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
					!loadingHighlight &&
					form && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/highlights"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Highlights
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
							open={this.state.openItemDelteDialog}
							closeDeleteDialog={this.handleCloseDeleteItemDiaog}
							deleteDialogFunction={this.deleteHighlightItem}
							deleting={deletingHighlightItem}
						/>

						<div className="p-16 sm:p-24">
							<input
								type="file"
								onChange={this.handleImageChange}
								ref="fileInput"
								className={classes.dn}
							/>

							{orderingItems &&
							orderingItems !== 'ordered' && (
								<div className={classes.overlay}>
									<div className={classes.overlayContent}>
										<CircularProgress color="secondary" />
									</div>
								</div>
							)}

							{loadingHighlight && (
								<div className="text-center pt-60">
									<CircularProgress color="secondary" />
								</div>
							)}

							{!loadingHighlight &&
							form && (
								<DragDropContext onDragEnd={this.onDragEnd}>
									<Droppable droppableId="list" type="list" direction="horizontal">
										{(provided) => (
											<div
												ref={provided.innerRef}
												className="flex w-full white-space-no-wrap overflow-x-auto"
											>
												{form.items &&
													form.items.length > 0 &&
													form.items.map((item, index) => (
														<Draggable
															draggableId={item.id}
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
																		style={{ width: 450 }}
																		className="m-8"
																		elevation={snapshot.isDragging ? 3 : 1}
																	>
																		<CardHeader
																			title={item.caption}
																			style={{ height: 60 }}
																		/>
																		<div className="flex items-center justify-center">
																			<img
																				src={item.image}
																				alt=""
																				style={{ maxHeight: 200 }}
																			/>
																		</div>

																		<CardActions className="flex items-center justify-between">
																			{item.button_text &&
																			item.button_text !== '' && (
																				<div style={{ height: 60 }}>
																					<div className="p-8">
																						<div className="whitespace-no-wrap overflow-x-auto w-full">
																							<Button
																								disabled
																								size="small"
																								variant="contained"
																								color="primary"
																								key={index}
																								className="mr-8 my-4"
																							>
																								{item.button_text}
																							</Button>
																						</div>
																					</div>
																				</div>
																			)}
																			<div>
																				<IconButton
																					aria-label="Edit Item"
																					onClick={() =>
																						this.handleEditItemDiaog(item)}
																				>
																					<Icon>edit</Icon>
																				</IconButton>
																				<IconButton
																					aria-label="Delete Item"
																					onClick={() =>
																						this.handleDeleteItemDiaog(
																							item
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

												<div className="flex md:w-1/3 xl:w-1/4 items-center" key={'new'}>
													<Card
														className="m-8 flex items-center px-16 cursor-pointer justify-center"
														onClick={() =>
															this.handleEditItemDiaog({
																id: 'new',
																caption: '',
																button_text: '',
																image: null,
																url: '',
																category: null,
																collection: null,
																page: null,
																highlight: form.id
															})}
														style={{ height: 334 }}
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

						{/* dialog for adding and updating items */}
						{selectedItem && (
							<Dialog
								open={openItemDiaog}
								TransitionComponent={Transition}
								onClose={this.handleClose}
								aria-labelledby="alert-dialog-title"
								aria-describedby="alert-dialog-description"
								maxWidth={'sm'}
								fullWidth={true}
							>
								<DialogTitle id="alert-dialog-title">
									{selectedItem.id === 'new' ? 'Create Highlight Item' : 'Edit Highlight Item'}
								</DialogTitle>
								<DialogContent>
									<TextField
										autoFocus
										margin="dense"
										id="caption"
										name="caption"
										label="Caption"
										type="text"
										fullWidth
										value={selectedItem.caption ? selectedItem.caption : ''}
										onChange={(e) => this.handleItemChange(e)}
										variant="outlined"
									/>
									<TextField
										className="mt-16"
										margin="dense"
										id="button_text"
										name="button_text"
										label="Button Text"
										type="text"
										fullWidth
										value={selectedItem.button_text ? selectedItem.button_text : ''}
										onChange={(e) => this.handleItemChange(e)}
										variant="outlined"
									/>
									<FormControl component="fieldset" className="mt-12">
										<RadioGroup
											aria-label="position"
											name="position"
											value={this.getRadioValue(selectedItem)}
											onChange={(e) => this.handleChangeRadioValue(e, selectedItem)}
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
									{this.getRadioValue(selectedItem) === 'other' && (
										<TextField
											className={classNames('my-8', classes.textField)}
											name="category"
											id="category"
											select
											label="Linked With"
											value={this.getLinkedWithValue(selectedItem)}
											onChange={(e) => this.handleChangeBtnLink(e, selectedItem)}
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
									{this.getRadioValue(selectedItem) === 'url' && (
										<TextField
											className="my-8"
											margin="dense"
											id="url"
											name="url"
											label="External URL"
											type="text"
											fullWidth
											value={selectedItem.url}
											onChange={(e) => this.handleItemChange(e)}
											variant="outlined"
											required
										/>
									)}

									{selectedItem.image && selectedItem.image !== '' ? (
										<div className="text-center">
											<img
												className={classNames('rounded', classes.addedImage)}
												src={selectedItem.image}
												alt=""
											/>
										</div>
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
											disabled={savingHighlightItem && savingHighlightItem !== 'saved'}
										>
											{selectedItem.image && selectedItem.image !== '' ? (
												'Change Image'
											) : (
												'Select Image'
											)}
										</Fab>
									</div>
									{savingHighlightItem &&
									savingHighlightItem !== 'saved' && (
										<LinearProgress color="secondary" className="w-full mt-8" />
									)}
								</DialogContent>
								<DialogActions>
									<Button onClick={this.handleEditItemDiaogClose} color="primary">
										Cancel
									</Button>

									<div className={classes.wrapper}>
										<Button
											onClick={this.saveHighlightItem}
											color="primary"
											autoFocus
											disabled={
												(savingHighlightItem && savingHighlightItem !== 'saved') ||
												(!selectedItem.image || selectedItem.image === '')
											}
										>
											{savingHighlightItem && savingHighlightItem !== 'saved' ? (
												<React.Fragment>
													{selectedItem.id === 'new' ? 'Saving...' : 'Updating...'}
												</React.Fragment>
											) : (
												<React.Fragment>
													{selectedItem.id === 'new' ? 'Save' : 'Update'}
												</React.Fragment>
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
			getHighlight: Actions.getHighlight,
			setHighlightLoader: Actions.setHighlightLoader,

			getHomeData: Actions.getHomeData,
			setHomeDataLoader: Actions.setHomeDataLoader,

			setSaveHighlightItemLoader: Actions.setSaveHighlightItemLoader,
			saveHighlightItem: Actions.saveHighlightItem,

			setDeleteHighlightItemLoader: Actions.setDeleteHighlightItemLoader,
			deleteHighlightItem: Actions.deleteHighlightItem,

			setHighlightItemOrderLoader: Actions.setHighlightItemOrderLoader,
			setHighlightItemOrder: Actions.setHighlightItemOrder
		},
		dispatch
	);
}

function mapStateToProps({ highlightReducer }) {
	return {
		homeData: highlightReducer.carousel.homeData,
		loadingHomeData: highlightReducer.carousel.loadingHomeData,

		highlight: highlightReducer.highlight.highlight,
		loadingHighlight: highlightReducer.highlight.loadingHighlight,

		savingHighlightItem: highlightReducer.highlight.savingHighlightItem,

		deletingHighlightItem: highlightReducer.highlight.deletingHighlightItem,

		orderingItems: highlightReducer.highlight.orderingItems
	};
}

export default withReducer('highlightReducer', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Highlight)))
);
