import React, { Component } from 'react';
import {
	Icon,
	IconButton,
	withStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	MenuItem,
	Table,
	TableHead,
	TableBody,
	TableCell,
	TableRow
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';

import { ShowDialog } from '../../components/showdialog/ShowDialog';

const styles = () => ({
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

class SwipersTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedSwiper: null,
			openDeleteDialog: false,
			data: null,
			openEditDialog: false,
			prevOrderSwipers: null
		};
	}

	componentDidMount() {
		this.props.setHomeDataLoader(true);
		this.props.getHomeData();

		this.props.setSwipersLoader(true);
		this.props.getSwipers();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}

		if (this.props.addNew && !this.state.selectedSwiper) {
			this.setState({
				selectedSwiper: {
					id: 'new',
					title: '',
					category: null,
					collection: null,
					items: null
				}
			});
		}

		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.creatingSwiper === 'created') {
			this.setState({ data: this.props.data });
			this.props.setCreateSwiperLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingSwiper === 'updated') {
			this.props.setUpdateSwiperLoader(false);
			this.setState({ data: this.props.data });
			this.handleEditSwiperClose();
		}
		if (this.props.deletingSwiper === 'deleted') {
			this.props.setDeleteSwiperLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.addingToHome === 'added') {
			this.setState({ data: this.props.data });
			this.props.setAddSwiperToHomeLoader(false);
		}
	}

	// create swiper functions
	handlePropsClose = () => {
		this.setState({ selectedSwiper: null });
		this.props.handleClose();
	};
	createSwiper = () => {
		let obj = this.state.selectedSwiper;
		if (obj.items === undefined || obj.items === null || obj.items === '') delete obj.items;
		this.props.setCreateSwiperLoader(true);
		this.props.createSwiper(obj);
	};

	// update swiper functions
	handleEditSwiper = (swiper) => {
		let selectedSwiper = _.clone(swiper);
		this.setState({ selectedSwiper: selectedSwiper, openEditDialog: true });
	};
	handleEditSwiperClose = () => {
		this.setState({ selectedSwiper: null, openEditDialog: false });
	};
	updateSwiper = () => {
		let obj = this.state.selectedSwiper;
		if (obj.items === undefined || obj.items === null || obj.items === '' || isNaN(obj.items)) {
			delete obj.items;
		}

		this.props.setUpdateSwiperLoader(true);
		this.props.updateSwiper(obj);
	};

	// delete swiper functions
	handleDeleteSwiper = (swiper) => {
		this.setState({ openDeleteDialog: true, selectedSwiper: swiper });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedSwiper: null });
	};
	deleteSwiper = () => {
		this.props.setDeleteSwiperLoader(true);
		this.props.deleteSwiper(this.state.selectedSwiper.id);
	};

	handleChangeSwiperLink = (event, swiper) => {
		let value = event.target.value;
		if (value) {
			if (value.indexOf('category_') > -1) {
				let id = parseInt(value.split('category_')[1].toString());
				swiper.category = id;
				swiper.collection = null;
			} else if (value.indexOf('collection_') > -1) {
				let id = parseInt(value.split('collection_')[1].toString());
				swiper.category = null;
				swiper.collection = id;
			}
			this.setState({
				selectedSwiper: swiper
			});
		}
	};

	getLinkedWithValue = (swiper) => {
		let value = null;
		if (swiper.category) {
			value = 'category_' + swiper.category;
		} else if (swiper.collection) {
			value = 'collection_' + swiper.collection;
		}
		return value;
	};

	handleAddToHome = (item) => {
		this.props.setAddSwiperToHomeLoader(true);
		this.props.addSwiperToHome(item.id);
	};

	render() {
		const {
			loadingSwipers,
			loadingHomeData,
			homeData,
			addNew,
			creatingSwiper,
			updatingSwiper,
			deletingSwiper,
			addingToHome,
			classes
		} = this.props;
		const { data, selectedSwiper, openEditDialog } = this.state;

		let categories = [];
		let collections = [];
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
		}

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteSwiper}
					deleting={deletingSwiper}
				/>

				{addingToHome &&
				addingToHome !== 'added' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}

				{loadingSwipers && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!loadingSwipers &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<TableHead>
									<TableRow className="h-64">
										{[
											'ID',
											'Swiper Title',
											'Linked With',
											'Display Count',
											'Products count',
											'Actions'
										].map((row, index) => {
											return (
												<TableCell key={index} align={'center'} padding={'default'}>
													{row}
												</TableCell>
											);
										}, this)}
									</TableRow>
								</TableHead>

								<TableBody>
									{data &&
										data.length > 0 &&
										data.map((swiper, index) => (
											<TableRow className="h-64 cursor-pointer" tabIndex={-1} key={swiper.id}>
												<TableCell component="th" scope="row" align="center">
													{swiper.id}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{swiper.title}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{swiper.link_name}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{swiper.items}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{swiper.item_count}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													<IconButton
														onClick={() => {
															this.handleEditSwiper(swiper);
														}}
													>
														<Icon>edit</Icon>
													</IconButton>
													<IconButton
														onClick={() => {
															this.handleDeleteSwiper(swiper);
														}}
													>
														<Icon>delete</Icon>
													</IconButton>
													<IconButton
														onClick={() => {
															this.handleAddToHome(swiper);
														}}
														disabled={swiper.in_home}
													>
														<Icon>home</Icon>
													</IconButton>
												</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</FuseScrollbars>

						{selectedSwiper && (
							<Dialog open={addNew || openEditDialog} aria-labelledby="form-dialog-title" fullWidth>
								<DialogTitle id="form-dialog-title">
									{openEditDialog ? 'Edit Swiper' : 'Creat Swiper'}
								</DialogTitle>
								<DialogContent>
									<TextField
										autoFocus
										margin="dense"
										id="title"
										label="Title"
										type="text"
										fullWidth
										value={selectedSwiper.title ? selectedSwiper.title : ''}
										onChange={(e) => {
											this.setState({
												selectedSwiper: { ...this.state.selectedSwiper, title: e.target.value }
											});
										}}
										variant="outlined"
										required
									/>

									<TextField
										className={'my-16'}
										name="category"
										id="category"
										select
										label="Linked With"
										value={
											this.getLinkedWithValue(selectedSwiper) ? (
												this.getLinkedWithValue(selectedSwiper)
											) : (
												''
											)
										}
										onChange={(e) => this.handleChangeSwiperLink(e, selectedSwiper)}
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
									</TextField>

									<TextField
										margin="dense"
										id="items"
										label="Display Count"
										type="number"
										fullWidth
										value={selectedSwiper.items ? selectedSwiper.items : ''}
										onChange={(e) => {
											this.setState({
												selectedSwiper: {
													...this.state.selectedSwiper,
													items: parseInt(e.target.value)
												}
											});
										}}
										variant="outlined"
									/>
								</DialogContent>

								{openEditDialog && (
									<DialogActions>
										<Button color="primary" onClick={this.handleEditSwiperClose}>
											Cancel
										</Button>
										<Button
											onClick={this.updateSwiper}
											color="primary"
											disabled={
												!selectedSwiper.title ||
												selectedSwiper.title === '' ||
												!(selectedSwiper.category || selectedSwiper.collection) ||
												(updatingSwiper !== 'updated' && updatingSwiper)
											}
										>
											{updatingSwiper !== 'updated' && updatingSwiper ? 'Updating...' : 'Update'}
										</Button>
									</DialogActions>
								)}
								{addNew && (
									<DialogActions>
										<Button color="primary" onClick={this.handlePropsClose}>
											Cancel
										</Button>
										<Button
											onClick={this.createSwiper}
											color="primary"
											disabled={
												!selectedSwiper.title ||
												selectedSwiper.title === '' ||
												!(selectedSwiper.category || selectedSwiper.collection) ||
												(creatingSwiper !== 'created' && creatingSwiper)
											}
										>
											{creatingSwiper !== 'created' && creatingSwiper ? 'Creating...' : 'Create'}
										</Button>
									</DialogActions>
								)}
							</Dialog>
						)}
					</div>
				)}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getHomeData: Actions.getHomeData,
			setHomeDataLoader: Actions.setHomeDataLoader,

			getSwipers: Actions.getSwipers,
			setSwipersLoader: Actions.setSwipersLoader,

			createSwiper: Actions.createSwiper,
			setCreateSwiperLoader: Actions.setCreateSwiperLoader,

			updateSwiper: Actions.updateSwiper,
			setUpdateSwiperLoader: Actions.setUpdateSwiperLoader,

			deleteSwiper: Actions.deleteSwiper,
			setDeleteSwiperLoader: Actions.setDeleteSwiperLoader,

			addSwiperToHome: Actions.addSwiperToHome,
			setAddSwiperToHomeLoader: Actions.setAddSwiperToHomeLoader
		},
		dispatch
	);
}

function mapStateToProps({ swipersApp }) {
	return {
		homeData: swipersApp.carousel.homeData,
		loadingHomeData: swipersApp.carousel.loadingHomeData,

		data: swipersApp.swipers.swipers,
		loadingSwipers: swipersApp.swipers.loadingSwipers,

		creatingSwiper: swipersApp.swipers.creatingSwiper,
		updatingSwiper: swipersApp.swipers.updatingSwiper,
		deletingSwiper: swipersApp.swipers.deletingSwiper,

		addingToHome: swipersApp.swipers.addingToHome
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(SwipersTable))
);
