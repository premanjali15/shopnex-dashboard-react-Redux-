import React, { Component } from 'react';
import { FusePageCarded, FuseAnimate } from '@fuse';
import { Button, Icon, Typography, withStyles, CircularProgress, IconButton, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import _ from 'lodash';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import withReducer from 'app/store/withReducer';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { combineReducers } from 'redux';
import * as Actions from '../../store/actions';
import reducer from '../../store/reducers';
import CollectionReducer from '../../../catalogue/store/reducers/collection.reducer';

import { ShowDialog } from '../../../components/showdialog/ShowDialog';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
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

class InstagramSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			selectedInstaPost: null,
			openDeleteDialog: false,
			prevOrderPosts: null
		};
	}

	componentDidMount() {
		this.getData();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.deletingInstaPost === 'deleted') {
			this.props.setDeleteInstaPostLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.orderingInstaPosts === 'ordered') {
			this.props.setInstaSectionPostsOrderLoader(false);
		}
		if (this.props.orderingInstaPosts === 'error') {
			this.props.setInstaSectionPostsOrderLoader(false);
			let posts = this.state.prevOrderPosts;
			this.setState({ data: { ...this.state.data, posts } });
		}
	}

	getData = () => {
		this.props.setInstaSectionDetailsLoader(true);
		this.props.getInstaSectionDetails(this.props.match.params.instaSectionId);
	};

	handleAddNewPost = () => {
		this.props.history.replace('/app/instagram/' + this.state.data.id + '/post/new');
	};

	handleEditPost = (post) => {
		this.props.history.replace('/app/instagram/' + this.state.data.id + '/post/' + post.id);
	};

	// Delete Post
	handleDeletePost = (post) => {
		this.setState({ openDeleteDialog: true, selectedInstaPost: post });
	};
	closeDeleteDialog = () => {
		this.setState({
			openDeleteDialog: false,
			selectedInstaPost: null
		});
	};
	deleteInstaPost = () => {
		let id = this.state.selectedInstaPost.id;
		this.props.setDeleteInstaPostLoader(true);
		this.props.deleteInstaPost(id);
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
				let posts = this.state.data.posts;
				this.setState({ prevOrderPosts: _.cloneDeep(posts) });

				let obj = { id: posts[source.index].id, position: destination.index };

				let addedOrder;

				if (removedIndex > addedIndex) {
					addedOrder = posts[addedIndex].order;
					for (let i = addedIndex; i < removedIndex; i++) {
						posts[i].order = posts[i + 1].order;
					}
				} else if (removedIndex < addedIndex) {
					addedOrder = posts[addedIndex].order;
					for (let i = addedIndex; i > removedIndex; i--) {
						posts[i].order = posts[i - 1].order;
					}
				}
				if (addedOrder !== undefined && addedOrder !== null) {
					posts[removedIndex].order = addedOrder;
					posts = _.sortBy(posts, 'order');
					let data = { ...this.state.data, posts };
					this.setState({ data: data });
				}
				this.props.setInstaSectionPostsOrderLoader(true);
				this.props.setInstaSectionPostsOrder(obj);
			}
		}
	};

	render() {
		const { openDeleteDialog, data } = this.state;

		const { classes, loading, deletingInstaPost, orderingInstaPosts } = this.props;

		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					!loading &&
					data && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/instagram"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Instagram Sections
									</Typography>
								</FuseAnimate>
								<div className="flex flex-col min-w-0">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">{data.title}</Typography>
									</FuseAnimate>
								</div>
							</div>

							<div className="flex flex-1" />

							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									onClick={this.handleAddNewPost}
								>
									<span className="hidden sm:flex">Add New Post</span>
									<span className="flex sm:hidden">New</span>
								</Button>
							</FuseAnimate>

							<div className="flex items-center pl-24">
								<Button className="whitespace-no-wrap" variant="contained" onClick={this.getData}>
									<Icon className="text-24 mr-4">refresh</Icon>
									<span className="hidden sm:flex">Refresh</span>
								</Button>
							</div>
						</div>
					)
				}
				content={
					<div className="w-full flex flex-col">
						<ShowDialog
							open={openDeleteDialog}
							closeDeleteDialog={this.closeDeleteDialog}
							deleteDialogFunction={this.deleteInstaPost}
							deleting={deletingInstaPost}
						/>
						{orderingInstaPosts &&
						orderingInstaPosts !== 'ordered' && (
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
							<React.Fragment>
								<div className="h-64 flex flex-column w-full items-center rounded-none border-b-1">
									{[ 'ID', 'Post Url', 'Author', 'Actions' ].map((row, index) => {
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
												{data &&
													data.posts &&
													data.posts.length > 0 &&
													data.posts.map((post, index) => (
														<Draggable
															draggableId={post.id}
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
																		className="min-h-64 flex flex-column w-full items-center rounded-none border-b-1 shadow py-4"
																		key={post.id}
																	>
																		<div className="w-1/4 flex justify-center items-center">
																			{post.id}
																		</div>
																		<div className="w-1/4 flex justify-center items-center">
																			{post.post_url}
																		</div>
																		<div className="w-1/4 flex justify-center items-center">
																			{post.author}
																		</div>

																		<div className="w-1/4 flex justify-center items-center">
																			<IconButton
																				onClick={() => {
																					this.handleEditPost(post);
																				}}
																			>
																				<Icon>edit</Icon>
																			</IconButton>
																			<IconButton
																				onClick={() => {
																					this.handleDeletePost(post);
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
							</React.Fragment>
						)}
					</div>
				}
				innerScroll
			/>
		);
	}
}

const rootReducer = combineReducers({ collectionApp: CollectionReducer, instagramSectionApp: reducer });

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getInstaSectionDetails: Actions.getInstaSectionDetails,
			setInstaSectionDetailsLoader: Actions.setInstaSectionDetailsLoader,

			deleteInstaPost: Actions.deleteInstaPost,
			setDeleteInstaPostLoader: Actions.setDeleteInstaPostLoader,

			setInstaSectionPostsOrder: Actions.setInstaSectionPostsOrder,
			setInstaSectionPostsOrderLoader: Actions.setInstaSectionPostsOrderLoader
		},
		dispatch
	);
}

function mapStateToProps({ rootReducer }) {
	return {
		data: rootReducer.instagramSectionApp.instagramsection.instagramsection,
		loading: rootReducer.instagramSectionApp.instagramsection.loading,
		deletingInstaPost: rootReducer.instagramSectionApp.instagramsection.deletingInstaPost,
		orderingInstaPosts: rootReducer.instagramSectionApp.instagramsection.orderingInstaPosts
	};
}

export default withReducer('rootReducer', rootReducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(InstagramSection)))
);
