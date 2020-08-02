import React, { Component } from 'react';
import { FusePageCarded, FuseAnimate } from '@fuse';
import {
	Typography,
	Button,
	Icon,
	withStyles,
	CircularProgress,
	Paper,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	TextField,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup
} from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import { ShowDialog } from '../../components/showdialog/ShowDialog';

const styles = () => ({
	visible: {
		visibility: 'visible !important'
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

class NavbarLinks extends Component {
	state = {
		addNew: false,
		selectedNavlink: null,
		openDeleteDialog: false,
		data: null,
		selectedNavData: null,
		currentNavlink: null,
		level: 0,
		openEditDialog: false,
		prevOrderLinks: null
	};

	componentDidMount() {
		this.props.setHomeDataLoader(true);
		this.props.getHomeData();

		this.props.setNavbarLinksLoader(true);
		this.props.getNavbarLinks();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			let data = _.sortBy(this.props.data, 'order');
			this.setState({ data });
			this.getSelectedNavData(this.state.level, this.state.currentNavlink);
		}

		if (this.props.creatingNavbarlink === 'created') {
			let data = _.sortBy(this.props.data, 'order');
			this.setState({ data });
			this.props.setCreateNavbarLinkLoader(false);
			this.handleAddNavlinkClose();
			this.getSelectedNavData(this.state.level, this.state.currentNavlink);
		}
		if (this.props.updatingNavbarlink === 'updated') {
			let data = _.sortBy(this.props.data, 'order');
			this.setState({ data });
			this.props.setUpdateNavbarLinkLoader(false);
			this.handleEditNavlinkClose();
			this.getSelectedNavData(this.state.level, this.state.currentNavlink);
		}
		if (this.props.deletingNavbarlink === 'deleted') {
			this.props.setDeleteNavbarLinkLoader(false);
			this.closeDeleteDialog();
			this.getSelectedNavData(this.state.level, this.state.currentNavlink);
		}
		if (this.props.orderingLinks === 'ordered') {
			let data = _.sortBy(this.props.data, 'order');
			this.setState({ data });
			this.props.setNavbarLinkOrderLoader(false);
		}
		if (this.props.orderingLinks === 'error') {
			this.props.setNavbarLinkOrderLoader(false);
			let links = this.state.prevOrderLinks;
			this.setState({ selectedNavData: links });
		}
	}

	getSelectedNavData(level, navlink) {
		let parent;
		if (level === 0) {
			parent = null;
		} else if (navlink) {
			parent = navlink.id;
		}
		let data = _.sortBy(this.props.data, 'order');
		let selectedNavData = data.filter((item) => {
			return item.parent === parent;
		});
		this.setState({ selectedNavData });
	}

	// create navlink functions
	handleAddNavlink = () => {
		this.setState({
			addNew: true,
			selectedNavlink: {
				id: 'new',
				url: '',
				name: '',
				category: null,
				collection: null,
				page: null,
				parent: this.state.currentNavlink ? this.state.currentNavlink.id : null
			}
		});
	};
	handleAddNavlinkClose = () => {
		this.setState({ selectedNavlink: null, addNew: false });
	};
	createNavbarLink = () => {
		this.props.setCreateNavbarLinkLoader(true);
		this.props.createNavbarLink(this.state.selectedNavlink);
	};

	// update navlink functions
	handleEditNavlink = (navlink) => {
		let link = _.clone(navlink);
		this.setState({ selectedNavlink: link, openEditDialog: true });
	};
	handleEditNavlinkClose = () => {
		this.setState({ selectedNavlink: null, openEditDialog: false });
	};
	updateNavbarLink = () => {
		this.props.setUpdateNavbarLinkLoader(true);
		this.props.updateNavbarLink(this.state.selectedNavlink);
	};

	// delete navlink functions
	handleDeleteNavlink = (navlink) => {
		this.setState({ openDeleteDialog: true, selectedNavlink: navlink });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedNavlink: null });
	};
	deleteNavbarLink = () => {
		this.props.setDeleteNavbarLinkLoader(true);
		this.props.deleteNavbarLink(this.state.selectedNavlink.id);
	};

	// view navlink
	handleViewNavlink = (navlink) => {
		this.setState({ currentNavlink: navlink, level: this.state.level + 1 });
		this.getSelectedNavData(this.state.level + 1, navlink);
	};

	handleBack = (navlink) => {
		let currentNavlink;
		if (navlink.parent === null) {
			currentNavlink = null;
		} else {
			let ind = this.state.data.findIndex((item) => {
				return item.id === navlink.parent;
			});
			currentNavlink = this.state.data[ind];
		}
		this.setState({ level: this.state.level - 1, currentNavlink });
		this.getSelectedNavData(this.state.level - 1, currentNavlink);
	};

	getParentName = (parentId) => {
		if (parentId) {
			let ind = this.state.data.findIndex((item) => {
				return item.id === parentId;
			});
			let parent = this.state.data[ind];
			return parent.name;
		}
		return null;
	};

	refreshData = () => {
		this.componentDidMount();
	};

	getRadioValue = (link) => {
		let value = 'other';
		if (link.url !== undefined && link.url !== null) {
			value = 'url';
		}
		return value;
	};

	handleChangeBtnLink = (event, link) => {
		let value = event.target.value;

		if (value) {
			if (value.indexOf('category_') > -1) {
				let id = parseInt(value.split('category_')[1].toString());
				link.category = id;
				link.collection = null;
				link.page = null;
				link.url = null;
			} else if (value.indexOf('collection_') > -1) {
				let id = parseInt(value.split('collection_')[1].toString());
				link.category = null;
				link.collection = id;
				link.page = null;
				link.url = null;
			} else if (value.indexOf('page_') > -1) {
				let id = parseInt(value.split('page_')[1].toString());
				link.category = null;
				link.collection = null;
				link.page = id;
				link.url = null;
			}
			this.setState({
				selectedNavlink: link
			});
		}
	};

	handleChangeRadioValue = (event, link) => {
		let value = event.target.value;
		if (value === 'other') {
			link.url = null;
		} else if (value === 'url') {
			link.category = null;
			link.collection = null;
			link.page = null;
			link.url = '';
		}

		this.setState({
			selectedNavlink: link
		});
	};

	getLinkedWithValue = (link) => {
		let value = '';
		if (link.category) {
			value = 'category_' + link.category;
		} else if (link.collection) {
			value = 'collection_' + link.collection;
		} else if (link.page) {
			value = 'page_' + link.page;
		}
		return value;
	};

	onDragEnd = (result) => {
		let { source, destination } = result;

		if (source && destination) {
			let orderObj = {
				removedIndex: source.index,
				addedIndex: destination.index
			};
			const { removedIndex, addedIndex } = orderObj;

			if (removedIndex !== addedIndex) {
				let links = this.state.selectedNavData;
				this.setState({ prevOrderLinks: _.cloneDeep(links) });

				let obj = { id: links[source.index].id, position: links[destination.index].order };
				let addedOrder;

				if (removedIndex > addedIndex) {
					addedOrder = links[addedIndex].order;
					for (let i = addedIndex; i < removedIndex; i++) {
						links[i].order = links[i + 1].order;
					}
				} else if (removedIndex < addedIndex) {
					addedOrder = links[addedIndex].order;
					for (let i = addedIndex; i > removedIndex; i--) {
						links[i].order = links[i - 1].order;
					}
				}
				if (addedOrder !== undefined && addedOrder !== null) {
					links[removedIndex].order = addedOrder;
					links = _.sortBy(links, 'order');
					this.setState({ selectedNavData: links });
				}

				this.props.setNavbarLinkOrderLoader(true);
				this.props.setNavbarLinkOrder(obj);
			}
		}
	};

	render() {
		const {
			loadingLinks,
			loadingHomeData,
			homeData,
			creatingNavbarlink,
			updatingNavbarlink,
			deletingNavbarlink,
			orderingLinks,
			classes
		} = this.props;
		const { selectedNavData, currentNavlink, selectedNavlink, level, addNew, openEditDialog } = this.state;

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
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						{level !== 0 && currentNavlink ? (
							<div className="flex items-center">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Icon
										className="text-28 mr-8 cursor-pointer"
										onClick={() => this.handleBack(currentNavlink)}
									>
										arrow_back
									</Icon>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<React.Fragment>
										{this.getParentName(currentNavlink.parent) && (
											<React.Fragment>
												<Typography className="text-20" variant="h6">
													{this.getParentName(currentNavlink.parent)}
												</Typography>
												<Icon className="text-28 mx-8">chevron_right</Icon>
											</React.Fragment>
										)}
										<Typography className="text-20" variant="h6">
											{currentNavlink.name}
										</Typography>
									</React.Fragment>
								</FuseAnimate>
							</div>
						) : (
							<div className="flex items-center">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<Icon className="text-28 mr-0 sm:mr-12">shopping_basket</Icon>
								</FuseAnimate>
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<p className={classNames('text-20', classes.visible)}>Navbar Links</p>
								</FuseAnimate>
							</div>
						)}

						<div className="flex flex-1" />

						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button className="whitespace-no-wrap" variant="contained" onClick={this.handleAddNavlink}>
								<span className="hidden sm:flex">Add New Link</span>
								<span className="flex sm:hidden">New</span>
							</Button>
						</FuseAnimate>

						<div className="flex items-center pl-24">
							<Button className="whitespace-no-wrap" variant="contained" onClick={this.refreshData}>
								<Icon className="text-24 mr-4">refresh</Icon>
								<span className="hidden sm:flex">Refresh</span>
							</Button>
						</div>
					</div>
				}
				content={
					<div className="w-full flex flex-col">
						<ShowDialog
							open={this.state.openDeleteDialog}
							closeDeleteDialog={this.closeDeleteDialog}
							deleteDialogFunction={this.deleteNavbarLink}
							deleting={deletingNavbarlink}
						/>
						{orderingLinks &&
						orderingLinks !== 'ordered' && (
							<div className={classes.overlay}>
								<div className={classes.overlayContent}>
									<CircularProgress color="secondary" />
								</div>
							</div>
						)}
						{loadingLinks && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loadingLinks &&
						selectedNavData && (
							<React.Fragment>
								<div className="h-64 flex flex-column w-full items-center rounded-none border-b-1">
									{[ 'Title', 'Parent', 'Linked With', 'Actions' ].map((row, index) => {
										return (
											<div key={index} className="w-1/4 flex justify-center items-center">
												<p className="font-500" style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
													{row}
												</p>
											</div>
										);
									}, this)}
								</div>

								<DragDropContext onDragEnd={this.onDragEnd}>
									<Droppable droppableId="list" type="list" direction="vertical">
										{(provided) => (
											<div
												ref={provided.innerRef}
												className="flex flex-row flex-wrap white-space-no-wrap overflow-auto"
											>
												{selectedNavData &&
													selectedNavData.length > 0 &&
													selectedNavData.map((link, index) => (
														<Draggable
															draggableId={link.id}
															key={index}
															index={index}
															type="list"
														>
															{(provided, snapshot) => (
																<div
																	className="w-full"
																	key={index}
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																>
																	<Paper
																		className="h-64 flex flex-column w-full items-center rounded-none border-b-1 shadow"
																		key={link.id}
																	>
																		<div className="w-1/4 flex justify-center items-center">
																			{link.name}
																		</div>

																		<div className="w-1/4 flex justify-center items-center capitalize">
																			{this.getParentName(link.parent) ? (
																				this.getParentName(link.parent)
																			) : (
																				'-'
																			)}
																		</div>

																		<div className="w-1/4 flex justify-center items-center">
																			{link.link_name}
																		</div>

																		<div className="w-1/4 flex justify-center items-center">
																			<IconButton
																				onClick={() => {
																					this.handleEditNavlink(link);
																				}}
																			>
																				<Icon>edit</Icon>
																			</IconButton>
																			<IconButton
																				onClick={() => {
																					this.handleDeleteNavlink(link);
																				}}
																			>
																				<Icon>delete</Icon>
																			</IconButton>
																			{level < 2 && (
																				<IconButton
																					onClick={() => {
																						this.handleViewNavlink(link);
																					}}
																				>
																					<Icon>redo</Icon>
																				</IconButton>
																			)}
																		</div>
																	</Paper>
																</div>
															)}
														</Draggable>
													))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</DragDropContext>
							</React.Fragment>
						)}
						{selectedNavlink && (
							<Dialog open={addNew || openEditDialog} aria-labelledby="form-dialog-title" fullWidth>
								<DialogTitle id="form-dialog-title">
									{openEditDialog ? 'Edit Navbar Link' : 'Creat Navbar Link'}
								</DialogTitle>
								<DialogContent>
									<TextField
										autoFocus
										margin="dense"
										id="name"
										label="Link Name"
										type="text"
										fullWidth
										value={selectedNavlink.name}
										onChange={(e) => {
											this.setState({
												selectedNavlink: {
													...this.state.selectedNavlink,
													name: e.target.value
												}
											});
										}}
										variant="outlined"
										required
									/>
									<FormControl component="fieldset">
										<RadioGroup
											aria-label="position"
											name="position"
											value={this.getRadioValue(selectedNavlink)}
											onChange={(e) => this.handleChangeRadioValue(e, selectedNavlink)}
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
									{this.getRadioValue(selectedNavlink) === 'other' && (
										<TextField
											className={'my-16'}
											name="category"
											id="category"
											select
											label="Linked With"
											value={this.getLinkedWithValue(selectedNavlink)}
											onChange={(e) => this.handleChangeBtnLink(e, selectedNavlink)}
											SelectProps={{
												MenuProps: {}
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

											{/* collections */}
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
									{this.getRadioValue(selectedNavlink) === 'url' && (
										<TextField
											className="my-16"
											margin="dense"
											id="url"
											name="url"
											label="External URL"
											type="text"
											fullWidth
											value={selectedNavlink.url}
											onChange={(e) => {
												this.setState({
													selectedNavlink: {
														...this.state.selectedNavlink,
														url: e.target.value
													}
												});
											}}
											variant="outlined"
											required
										/>
									)}
								</DialogContent>

								{openEditDialog && (
									<DialogActions>
										<Button color="primary" onClick={this.handleEditNavlinkClose}>
											Cancel
										</Button>
										<Button
											onClick={this.updateNavbarLink}
											color="primary"
											disabled={
												!selectedNavlink.name ||
												selectedNavlink.name === '' ||
												!(
													selectedNavlink.category ||
													selectedNavlink.collection ||
													selectedNavlink.page ||
													selectedNavlink.url
												) ||
												(updatingNavbarlink !== 'updated' && updatingNavbarlink)
											}
										>
											{updatingNavbarlink !== 'updated' && updatingNavbarlink ? (
												'Updating...'
											) : (
												'Update'
											)}
										</Button>
									</DialogActions>
								)}
								{addNew && (
									<DialogActions>
										<Button color="primary" onClick={this.handleAddNavlinkClose}>
											Cancel
										</Button>
										<Button
											onClick={this.createNavbarLink}
											color="primary"
											disabled={
												!selectedNavlink.name ||
												selectedNavlink.name === '' ||
												!(
													selectedNavlink.category ||
													selectedNavlink.collection ||
													selectedNavlink.page ||
													selectedNavlink.url
												) ||
												(creatingNavbarlink !== 'created' && creatingNavbarlink)
											}
										>
											{creatingNavbarlink !== 'created' && creatingNavbarlink ? (
												'Creating...'
											) : (
												'Create'
											)}
										</Button>
									</DialogActions>
								)}
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
			getHomeData: Actions.getHomeData,
			setHomeDataLoader: Actions.setHomeDataLoader,

			getNavbarLinks: Actions.getNavbarLinks,
			setNavbarLinksLoader: Actions.setNavbarLinksLoader,

			setCreateNavbarLinkLoader: Actions.setCreateNavbarLinkLoader,
			createNavbarLink: Actions.createNavbarLink,

			setUpdateNavbarLinkLoader: Actions.setUpdateNavbarLinkLoader,
			updateNavbarLink: Actions.updateNavbarLink,

			setDeleteNavbarLinkLoader: Actions.setDeleteNavbarLinkLoader,
			deleteNavbarLink: Actions.deleteNavbarLink,

			setNavbarLinkOrderLoader: Actions.setNavbarLinkOrderLoader,
			setNavbarLinkOrder: Actions.setNavbarLinkOrder
		},
		dispatch
	);
}

function mapStateToProps({ navbarLinksApp }) {
	return {
		homeData: navbarLinksApp.carousel.homeData,
		loadingHomeData: navbarLinksApp.carousel.loadingHomeData,

		data: navbarLinksApp.navbarlinks.navbarLinks,
		loadingLinks: navbarLinksApp.navbarlinks.loadingLinks,

		creatingNavbarlink: navbarLinksApp.navbarlinks.creatingNavbarlink,
		updatingNavbarlink: navbarLinksApp.navbarlinks.updatingNavbarlink,
		deletingNavbarlink: navbarLinksApp.navbarlinks.deletingNavbarlink,
		orderingLinks: navbarLinksApp.navbarlinks.orderingLinks
	};
}

export default withReducer('navbarLinksApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarLinks)))
);
