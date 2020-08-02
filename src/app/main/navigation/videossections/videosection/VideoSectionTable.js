import React, { Component } from 'react';
import {
	Icon,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	CircularProgress,
	Paper
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import _ from 'lodash';
import * as Actions from '../../store/actions';
import reducer from '../../store/reducers';
import * as CollectionActions from '../../../catalogue/store/actions/collection.actions';
import CollectionReducer from '../../../catalogue/store/reducers/collection.reducer';
import { combineReducers } from 'redux';
import withReducer from 'app/store/withReducer';
import { FuseChipSelect } from '@fuse';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ShowDialog } from '../../../components/showdialog/ShowDialog';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		margin: '5px',
		height: 110
	},
	input: {
		display: 'flex',
		padding: 0
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden'
	},
	chip: {
		margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
	},
	chipFocused: {
		backgroundColor: emphasize(
			theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
			0.08
		)
	},
	noOptionsMessage: {
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
	},
	singleValue: {
		fontSize: 16
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		fontSize: 16
	},
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0
	},
	divider: {
		height: theme.spacing.unit * 2
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

class VideoSectionTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedVideo: {
				yt_id: '',
				product: null,
				product_name: ''
			},
			selectedProduct: null,
			openEditDialog: false,
			openDeleteDialog: false,
			videoId: '',
			data: null,
			loadingData: false,
			prevOrderVideos: null
		};
	}

	componentDidMount() {
		this.getData();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.props.updateTitle(this.props.data.title);
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.getData();
		}
		if (this.props.creatingVideo === 'created') {
			this.setState({ data: this.props.data });
			this.props.setCreateVideoLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingVideo === 'updated') {
			this.setState({ data: this.props.data });
			this.props.setUpdateVideoLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingVideo === 'deleted') {
			this.props.setDeleteVideoLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.orderingVideos === 'ordered') {
			this.props.setVidoeSectionVideosOrderLoader(false);
		}
		if (this.props.orderingVideos === 'error') {
			this.props.setVidoeSectionVideosOrderLoader(false);
			let videos = this.state.prevOrderVideos;
			this.setState({ data: { ...this.state.data, videos } });
		}
	}

	getData() {
		this.props.setVideoSectionDetailsLoader(true);
		this.props.getVideoSectionDetails(this.props.match.params.videoSectionId);
	}

	handleEditVideo = (video) => {
		this.setState({ videoId: video.yt_id });
		let obj = _.clone(video);
		obj['yt_id'] = 'https://www.youtube.com/watch?v=' + obj.yt_id;
		this.setState({ selectedVideo: obj, openEditDialog: true });
	};
	handleDeleteVideo = (video) => {
		this.setState({ openDeleteDialog: true, selectedVideo: video });
	};

	closeEditDialog = () => {
		this.setState({
			openEditDialog: false,
			selectedVideo: {
				yt_id: '',
				product: null,
				product_name: ''
			},
			videoId: ''
		});
	};
	closeDeleteDialog = () => {
		this.setState({
			openDeleteDialog: false,
			selectedVideo: {
				yt_id: '',
				product: null,
				product_name: ''
			}
		});
	};

	handleProductChange = (value) => {
		this.setState({
			selectedVideo: {
				id: this.state.selectedVideo.id,
				product: value ? value.value : null,
				product_name: value ? value.label : '',
				yt_id: this.state.selectedVideo.yt_id ? this.state.selectedVideo.yt_id : ''
			}
		});
	};

	handlePropsClose = () => {
		this.setState({
			selectedVideo: {
				yt_id: '',
				product: null
			},
			videoId: ''
		});
		this.props.handleClose();
	};

	handleChange = (event) => {
		const { selectedVideo } = this.state;
		let vid = this.youtube_parser(event.target.value);
		this.setState({
			selectedVideo: {
				id: selectedVideo.id,
				product: selectedVideo !== undefined && selectedVideo !== null ? selectedVideo.product : null,
				product_name: selectedVideo !== undefined && selectedVideo !== null ? selectedVideo.product_name : null,
				yt_id: event.target.value
			},
			videoId: vid
		});
	};

	youtube_parser(url) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		var match = url.match(regExp);
		return match && match[7].length === 11 ? match[7] : false;
	}

	createVideo = () => {
		if (
			this.state.selectedVideo.product !== null &&
			this.state.selectedVideo.product !== '' &&
			this.state.selectedVideo.yt_id !== '' &&
			this.state.videoId !== false
		) {
			let obj = _.clone(this.state.selectedVideo);
			obj['yt_id'] = this.state.videoId;
			obj['section'] = parseInt(this.props.match.params.videoSectionId);
			this.props.setCreateVideoLoader(true);
			this.props.createVideo(obj);
		}
	};
	updateVideo = () => {
		if (
			this.state.selectedVideo.product !== null &&
			this.state.selectedVideo.product !== '' &&
			this.state.selectedVideo.yt_id !== '' &&
			this.state.videoId !== false
		) {
			let obj = _.clone(this.state.selectedVideo);
			obj['yt_id'] = this.state.videoId;
			this.props.setUpdateVideoLoader(true);
			this.props.updateVideo(obj);
		}
	};
	deleteVideo = () => {
		let id = this.state.selectedVideo.id;
		this.props.setDeleteVideoLoader(true);
		this.props.deleteVideo(id);
	};

	searchedProducts = (inputValue) => {
		if (inputValue !== '' && inputValue.length > 2) {
			this.props.setSearchedProductsLoader(true);
			this.props.getSearchedProducts(inputValue);
		}
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
				let videos = this.state.data.videos;
				this.setState({ prevOrderVideos: _.cloneDeep(videos) });

				let obj = { id: videos[source.index].id, position: destination.index };

				let addedOrder;

				if (removedIndex > addedIndex) {
					addedOrder = videos[addedIndex].order;
					for (let i = addedIndex; i < removedIndex; i++) {
						videos[i].order = videos[i + 1].order;
					}
				} else if (removedIndex < addedIndex) {
					addedOrder = videos[addedIndex].order;
					for (let i = addedIndex; i > removedIndex; i--) {
						videos[i].order = videos[i - 1].order;
					}
				}
				if (addedOrder !== undefined && addedOrder !== null) {
					videos[removedIndex].order = addedOrder;
					videos = _.sortBy(videos, 'order');
					let data = { ...this.state.data, videos };
					this.setState({ data: data });
				}
				this.props.setVidoeSectionVideosOrderLoader(true);
				this.props.setVidoeSectionVideosOrder(obj);
			}
		}
	};

	render() {
		const { openEditDialog, openDeleteDialog, selectedVideo, videoId, data } = this.state;
		const {
			addNew,
			classes,
			loading,
			videoProducts,
			creatingVideo,
			updatingVideo,
			deletingVideo,
			loadingVideoPrdcts,
			orderingVideos
		} = this.props;

		let suggestions = [];
		if (videoProducts && videoProducts.results) {
			suggestions = videoProducts.results.map((product) => ({
				value: product.id,
				label: product.name
			}));
		}

		let product = null;

		if (selectedVideo) {
			product = {
				value: selectedVideo.product,
				label: selectedVideo.product_name
			};
		}

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteVideo}
					deleting={deletingVideo}
				/>
				{orderingVideos &&
				orderingVideos !== 'ordered' && (
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
				{!loading &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<div className="min-w-xl">
								<div className="h-64 flex flex-column w-full items-center rounded-none border-b-1">
									{[ 'ID', 'Product', 'Video ID', 'Actions' ].map((row, index) => {
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
											<div ref={provided.innerRef} className="flex flex-row flex-wrap">
												{data &&
													data.videos &&
													data.videos.length > 0 &&
													data.videos.map((video, index) => (
														<Draggable
															draggableId={video.id}
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
																		key={video.id}
																	>
																		<div className="w-1/3 flex justify-center items-center">
																			{video.id}
																		</div>

																		<div className="w-1/3 flex justify-center items-center">
																			{video.product_name}
																		</div>
																		<div className="w-1/3 flex justify-center items-center">
																			<div className="flex flex-row items-center">
																				<img
																					className="w-52  block rounded py-4 mr-16"
																					src={
																						'https://img.youtube.com/vi/' +
																						video.yt_id +
																						'/default.jpg'
																					}
																					alt={video.product_name}
																				/>
																				{video.yt_id}
																			</div>
																		</div>
																		<div className="w-1/3 flex justify-center items-center">
																			<IconButton
																				onClick={() => {
																					this.handleEditVideo(video);
																				}}
																			>
																				<Icon>edit</Icon>
																			</IconButton>
																			<IconButton
																				onClick={() => {
																					this.handleDeleteVideo(video);
																				}}
																			>
																				<Icon>delete</Icon>
																			</IconButton>
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
							</div>
						</FuseScrollbars>
					</div>
				)}

				<Dialog
					open={openEditDialog || addNew}
					aria-labelledby="form-dialog-title"
					fullWidth={true}
					maxWidth={'md'}
				>
					<DialogTitle id="form-dialog-title">{addNew ? 'Create Video' : 'Update Video'}</DialogTitle>
					<DialogContent className="flex flex-col">
						<TextField
							autoFocus
							error={this.state.videoId !== '' && !this.state.videoId}
							margin="dense"
							id="name"
							label="Video URL"
							type="name"
							className="mb-24 ml-4 pr-8"
							variant="outlined"
							fullWidth
							required
							onChange={this.handleChange}
							value={selectedVideo.yt_id}
							helperText={this.state.videoId !== '' && !this.state.videoId && 'Invalid Youtube URL'}
						/>
						<div
							className={classes.root}
							style={{ height: this.state.videoId && this.state.videoId !== '' ? '130px' : '220px' }}
						>
							<FuseChipSelect
								className={'w-full mt-24'}
								isClearable={true}
								isLoading={loadingVideoPrdcts}
								value={product}
								onInputChange={this.searchedProducts}
								onChange={this.handleProductChange}
								placeholder="Product Specific Attributes"
								textFieldProps={{
									label: 'Enter atleast 3 characters to search',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={suggestions}
							/>
						</div>
						{this.state.videoId &&
						this.state.videoId !== '' && (
							<div className="flex w-full justify-center">
								<img
									src={'https://img.youtube.com/vi/' + this.state.videoId + '/mqdefault.jpg'}
									alt=""
								/>
							</div>
						)}
					</DialogContent>
					{!addNew &&
					this.state.openEditDialog && (
						<DialogActions>
							<Button onClick={this.closeEditDialog} color="primary">
								Cancel
							</Button>
							<Button
								onClick={this.updateVideo}
								color="primary"
								disabled={
									(updatingVideo !== 'updated' && updatingVideo) ||
									selectedVideo.product === null ||
									selectedVideo.product === '' ||
									selectedVideo.yt_id === '' ||
									videoId === false
								}
							>
								{updatingVideo ? 'Updating...' : 'Update'}
							</Button>
						</DialogActions>
					)}
					{addNew && (
						<DialogActions>
							<Button color="primary" onClick={this.handlePropsClose}>
								Cancel
							</Button>
							<Button
								onClick={this.createVideo}
								color="primary"
								disabled={
									(creatingVideo !== 'created' && creatingVideo) ||
									selectedVideo.product === null ||
									selectedVideo.product === '' ||
									selectedVideo.yt_id === '' ||
									videoId === false
								}
							>
								{creatingVideo ? 'Saving...' : 'Save'}
							</Button>
						</DialogActions>
					)}
				</Dialog>
			</div>
		);
	}
}

const rootReducer = combineReducers({ collectionApp: CollectionReducer, videoSectionApp: reducer });

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setSearchedProductsLoader: CollectionActions.setSearchedProductsLoader,
			getSearchedProducts: CollectionActions.getSearchedProducts,

			getVideoSectionDetails: Actions.getVideoSectionDetails,
			setVideoSectionDetailsLoader: Actions.setVideoSectionDetailsLoader,

			createVideo: Actions.createVideo,
			setCreateVideoLoader: Actions.setCreateVideoLoader,

			updateVideo: Actions.updateVideo,
			setUpdateVideoLoader: Actions.setUpdateVideoLoader,

			deleteVideo: Actions.deleteVideo,
			setDeleteVideoLoader: Actions.setDeleteVideoLoader,

			setVidoeSectionVideosOrder: Actions.setVidoeSectionVideosOrder,
			setVidoeSectionVideosOrderLoader: Actions.setVidoeSectionVideosOrderLoader
		},
		dispatch
	);
}

function mapStateToProps({ rootReducer }) {
	return {
		data: rootReducer.videoSectionApp.videosection.videosection,
		loadingVideoPrdcts: rootReducer.collectionApp.loadingSearchPrdcts,
		videoProducts: rootReducer.collectionApp.searchedProducts,
		loading: rootReducer.videoSectionApp.videosection.loading,
		creatingVideo: rootReducer.videoSectionApp.videosection.creatingVideo,
		updatingVideo: rootReducer.videoSectionApp.videosection.updatingVideo,
		deletingVideo: rootReducer.videoSectionApp.videosection.deletingVideo,
		orderingVideos: rootReducer.videoSectionApp.videosection.orderingVideos
	};
}

export default withReducer('rootReducer', rootReducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(VideoSectionTable)))
);
