import React, { Component } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	Icon,
	IconButton,
	withStyles,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import CarouselsTableHead from './CarouselsTableHead';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';

import { ShowDialog } from '../../../components/showdialog/ShowDialog';

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

class CarouselsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCarousel: null,
			openEditDialog: false,
			openDeleteDialog: false,
			data: null,
			selectedCarouselTitle: ''
		};
	}

	componentDidMount() {
		this.props.setCarouselsLoader(true);
		this.props.getCarousels();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.creatingCarousel === 'created') {
			this.setState({ data: this.props.data });
			this.props.setCreateCarouselLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingCarousel === 'updated') {
			this.setState({ data: this.props.data });
			this.props.setUpdateCarouselLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingCarousel === 'deleted') {
			this.props.setDeleteCarouselLoader(false);
			this.closeDeleteDialog();
		}

		if (this.props.addingToHome === 'added') {
			this.setState({ data: this.props.data });
			this.props.setAddCarouselToHomeLoader(false);
		}
	}

	deleteCarousel = () => {
		this.props.setDeleteCarouselLoader(true);
		this.props.deleteCarousel(this.state.selectedCarousel.id);
	};

	handleDeleteCarousel = (carousel) => {
		this.setState({ openDeleteDialog: true, selectedCarousel: carousel });
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedCarousel: null });
	};

	handleClick = (carousel) => {
		this.props.history.push('/app/carousel/' + carousel.id);
	};

	handlePropsClose = () => {
		this.setState({ selectedCarouselTitle: '', selectedCarousel: null, openEditDialog: false });
		this.props.handleClose();
	};

	createCarousel = () => {
		if (this.state.selectedCarouselTitle !== '') {
			this.props.setCreateCarouselLoader(true);
			this.props.createCarousel(this.state.selectedCarouselTitle);
		}
	};

	handleAddToHome = (carousel) => {
		this.props.setAddCarouselToHomeLoader(true);
		this.props.addCarouselToHome(carousel.id);
	};

	handleEditDialog = (carousel) => {
		this.setState({ selectedCarousel: carousel, selectedCarouselTitle: carousel.title, openEditDialog: true });
	};
	closeEditDialog = () => {
		this.setState({ selectedCarousel: null, selectedCarouselTitle: '', openEditDialog: false });
	};
	updateCarousel = () => {
		let obj = { id: this.state.selectedCarousel.id, title: this.state.selectedCarouselTitle };
		this.props.setUpdateCarouselLoader(true);
		this.props.updateCarousel(obj);
	};

	render() {
		const {
			classes,
			loadingCarousels,
			deletingCarousel,
			addNew,
			creatingCarousel,
			addingToHome,
			updatingCarousel
		} = this.props;
		const { data, selectedCarouselTitle, openEditDialog } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteCarousel}
					deleting={deletingCarousel}
				/>

				{addingToHome &&
				addingToHome !== 'added' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}

				{loadingCarousels && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!loadingCarousels &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<CarouselsTableHead />
								{data &&
								data.length > 0 && (
									<TableBody>
										{data.map((carousel) => {
											return (
												<TableRow className="h-64" tabIndex={-1} key={carousel.id}>
													<TableCell component="th" scope="row">
														{carousel.id}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<div className="flex items-center justify-center">
															{carousel.title}
															<Icon
																className="ml-12 text-16 cursor-pointer"
																onClick={() => this.handleEditDialog(carousel)}
															>
																edit
															</Icon>
														</div>
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														{carousel.item_count}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<IconButton
															onClick={() => {
																this.handleClick(carousel);
															}}
														>
															<Icon>edit</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleDeleteCarousel(carousel);
															}}
														>
															<Icon>delete</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleAddToHome(carousel);
															}}
															disabled={carousel.in_home}
														>
															<Icon>home</Icon>
														</IconButton>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								)}
							</Table>
						</FuseScrollbars>

						<Dialog open={addNew || openEditDialog} aria-labelledby="form-dialog-title" fullWidth>
							<DialogTitle id="form-dialog-title">
								{addNew ? 'Creat Carousel' : 'Update Carousel'}
							</DialogTitle>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									id="selectedCarouselTitle"
									label="Carousel Title"
									type="text"
									fullWidth
									value={selectedCarouselTitle}
									onChange={(e) => {
										this.setState({ selectedCarouselTitle: e.target.value });
									}}
									variant="outlined"
									required
								/>
							</DialogContent>

							<DialogActions>
								<Button color="primary" onClick={this.handlePropsClose}>
									Cancel
								</Button>
								{addNew ? (
									<Button
										onClick={this.createCarousel}
										color="primary"
										disabled={
											selectedCarouselTitle === '' ||
											(creatingCarousel !== 'created' && creatingCarousel)
										}
									>
										{creatingCarousel ? 'Saving...' : 'Save'}
									</Button>
								) : (
									<Button
										onClick={this.updateCarousel}
										color="primary"
										disabled={
											selectedCarouselTitle === '' ||
											(updatingCarousel !== 'updated' && updatingCarousel)
										}
									>
										{updatingCarousel ? 'Updating...' : 'Update'}
									</Button>
								)}
							</DialogActions>
						</Dialog>
					</div>
				)}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getCarousels: Actions.getCarousels,
			setCarouselsLoader: Actions.setCarouselsLoader,

			createCarousel: Actions.createCarousel,
			setCreateCarouselLoader: Actions.setCreateCarouselLoader,

			updateCarousel: Actions.updateCarousel,
			setUpdateCarouselLoader: Actions.setUpdateCarouselLoader,

			deleteCarousel: Actions.deleteCarousel,
			setDeleteCarouselLoader: Actions.setDeleteCarouselLoader,

			addCarouselToHome: Actions.addCarouselToHome,
			setAddCarouselToHomeLoader: Actions.setAddCarouselToHomeLoader
		},
		dispatch
	);
}

function mapStateToProps({ carouselsApp }) {
	return {
		data: carouselsApp.carousels.carousels,
		loadingCarousels: carouselsApp.carousels.loadingCarousels,
		creatingCarousel: carouselsApp.carousels.creatingCarousel,
		updatingCarousel: carouselsApp.carousels.updatingCarousel,
		deletingCarousel: carouselsApp.carousels.deletingCarousel,
		addingToHome: carouselsApp.carousels.addingToHome
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(CarouselsTable))
);
