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
import VideoSectionsTableHead from './VideoSectionsTableHead';
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

class VideoSectionsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedVideoSection: null,
			openEditDialog: false,
			openDeleteDialog: false,
			data: null,
			selectedVideoSectionTitle: ''
		};
	}

	componentDidMount() {
		this.props.setVideoSectionsLoader(true);
		this.props.getVideoSections();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.creatingVideoSection === 'created') {
			this.setState({ data: this.props.data });
			this.props.setCreateVideoSectionLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingVideoSection === 'updated') {
			this.setState({ data: this.props.data });
			this.props.setUpdateVideoSectionLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingVideoSection === 'deleted') {
			this.props.setDeleteVideoSectionlLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.addingToHome === 'added') {
			this.props.setAddVideoSectionToHomeLoader(false);
		}
	}

	createVideoSection = () => {
		if (this.state.selectedVideoSectionTitle !== '') {
			this.props.setCreateVideoSectionLoader(true);
			this.props.createVideoSection(this.state.selectedVideoSectionTitle);
		}
	};
	handlePropsClose = () => {
		this.setState({ selectedVideoSectionTitle: '', openEditDialog: false, selectedVideoSection: null });
		this.props.handleClose();
	};

	handleClick = (item) => {
		this.props.history.push('/app/videos/' + item.id);
	};

	handleDeleteVideoSection = (item) => {
		this.setState({ openDeleteDialog: true, selectedVideoSection: item });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedVideoSection: null });
	};
	deleteVideoSection = () => {
		this.props.setDeleteVideoSectionlLoader(true);
		this.props.deleteVideoSection(this.state.selectedVideoSection.id);
	};

	handleAddToHome = (item) => {
		this.props.setAddVideoSectionToHomeLoader(true);
		this.props.addVideoSectionToHome(item.id);
	};

	handleEditDialog = (videoSection) => {
		this.setState({
			selectedVideoSection: videoSection,
			selectedVideoSectionTitle: videoSection.title,
			openEditDialog: true
		});
	};
	closeEditDialog = () => {
		this.setState({ selectedVideoSection: null, selectedVideoSectionTitle: '', openEditDialog: false });
	};
	updateVideoSection = () => {
		let obj = { id: this.state.selectedVideoSection.id, title: this.state.selectedVideoSectionTitle };
		this.props.setUpdateVideoSectionLoader(true);
		this.props.updateVideoSection(obj);
	};

	render() {
		const {
			classes,
			loadingVideoSections,
			deletingVideoSection,
			addNew,
			creatingVideoSection,
			addingToHome,
			updatingVideoSection
		} = this.props;
		const { data, selectedVideoSectionTitle, openEditDialog } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteVideoSection}
					deleting={deletingVideoSection}
				/>

				{addingToHome &&
				addingToHome !== 'added' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}

				{loadingVideoSections && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!loadingVideoSections &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<VideoSectionsTableHead />
								{data &&
								data.length > 0 && (
									<TableBody>
										{data.map((videoSection) => {
											return (
												<TableRow
													className="h-64 cursor-pointer"
													tabIndex={-1}
													key={videoSection.id}
												>
													<TableCell component="th" scope="row">
														{videoSection.id}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<div className="flex items-center justify-center">
															{videoSection.title}
															<Icon
																className="ml-12 text-16 cursor-pointer"
																onClick={() => this.handleEditDialog(videoSection)}
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
														{videoSection.item_count.toString()}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<IconButton
															onClick={() => {
																this.handleClick(videoSection);
															}}
														>
															<Icon>edit</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleDeleteVideoSection(videoSection);
															}}
														>
															<Icon>delete</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleAddToHome(videoSection);
															}}
															disabled={videoSection.in_home}
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
								{addNew ? 'Create Video Section' : 'Update Video Section'}
							</DialogTitle>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									id="videoSectionTitle"
									label="Video Section Title"
									type="text"
									fullWidth
									value={selectedVideoSectionTitle}
									onChange={(e) => {
										this.setState({ selectedVideoSectionTitle: e.target.value });
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
										onClick={this.createVideoSection}
										color="primary"
										disabled={
											selectedVideoSectionTitle === '' ||
											(creatingVideoSection !== 'created' && creatingVideoSection)
										}
									>
										{creatingVideoSection ? 'Saving...' : 'Save'}
									</Button>
								) : (
									<Button
										onClick={this.updateVideoSection}
										color="primary"
										disabled={
											selectedVideoSectionTitle === '' ||
											(updatingVideoSection !== 'updated' && updatingVideoSection)
										}
									>
										{updatingVideoSection ? 'Updating...' : 'Update'}
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
			getVideoSections: Actions.getVideoSections,
			setVideoSectionsLoader: Actions.setVideoSectionsLoader,

			createVideoSection: Actions.createVideoSection,
			setCreateVideoSectionLoader: Actions.setCreateVideoSectionLoader,

			updateVideoSection: Actions.updateVideoSection,
			setUpdateVideoSectionLoader: Actions.setUpdateVideoSectionLoader,

			deleteVideoSection: Actions.deleteVideoSection,
			setDeleteVideoSectionlLoader: Actions.setDeleteVideoSectionlLoader,

			addVideoSectionToHome: Actions.addVideoSectionToHome,
			setAddVideoSectionToHomeLoader: Actions.setAddVideoSectionToHomeLoader
		},
		dispatch
	);
}

function mapStateToProps({ videoSectionsApp }) {
	return {
		data: videoSectionsApp.videosections.videoSections,
		loadingVideoSections: videoSectionsApp.videosections.loadingVideoSections,
		creatingVideoSection: videoSectionsApp.videosections.creatingVideoSection,
		updatingVideoSection: videoSectionsApp.videosections.updatingVideoSection,
		deletingVideoSection: videoSectionsApp.videosections.deletingVideoSection,
		addingToHome: videoSectionsApp.videosections.addingToHome
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(VideoSectionsTable))
);
