import React, { Component } from 'react';
import { Icon, IconButton, Paper, withStyles } from '@material-ui/core';
import _ from 'lodash';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

class HomeTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openDeleteDialog: false,
			data: null,
			loadingData: false,
			selectedItem: null,
			prevOrderItems: null
		};
	}

	componentDidMount() {
		this.props.setNavHomeDataLoader(true);
		this.props.getNavHomeData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			let data = _.sortBy(this.props.data, 'order');
			this.setState({ data });
		}
		if (this.props.deletingHomeData === 'deleted') {
			this.props.setDeleteNavHomeDataItemLoader(false);
			this.closeDeleteDialog();
		}

		if (this.props.orderingItems === 'ordered') {
			this.props.setHomeDataItemOrderLoader(false);
		}
		if (this.props.orderingItems === 'error') {
			this.props.setHomeDataItemOrderLoader(false);
			let items = this.state.prevOrderItems;
			this.setState({ data: items });
		}
	}

	handleDeleteHomeItem = (item) => {
		this.setState({ openDeleteDialog: true, selectedItem: item });
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedItem: null });
	};

	deleteHomeItem = () => {
		let id = this.state.selectedItem.id;
		this.props.setDeleteNavHomeDataItemLoader(true);
		this.props.deleteNavHomeDataItem(id);
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
				let items = this.state.data;
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
					this.setState({ data: items });
				}

				this.props.setHomeDataItemOrderLoader(true);
				this.props.setHomeDataItemOrder(obj);
			}
		}
	};

	render() {
		const { loading, deletingHomeData, classes, orderingItems } = this.props;
		const { data, loadingData } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteHomeItem}
					deleting={deletingHomeData}
				/>
				{orderingItems &&
				orderingItems !== 'ordered' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}
				{loadingData &&
				loadingData !== 'loaded' && (
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
							<div className="min-w-xl" aria-labelledby="tableTitle">
								<div className="h-64 flex flex-column w-full items-center rounded-none border-b-1">
									{[ 'ID', 'Title', 'Actions' ].map((row, index) => {
										return (
											<div key={index} className="w-1/3 flex justify-center items-center">
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
													data.length > 0 &&
													data.map((item, index) => (
														<Draggable
															draggableId={item.id}
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
																		key={item.id}
																	>
																		<div className="w-1/3 flex justify-center items-center">
																			{item.id}
																		</div>

																		<div className="w-1/3 flex justify-center items-center">
																			{item.title}
																		</div>
																		<div className="w-1/3 flex justify-center items-center">
																			<IconButton
																				onClick={() => {
																					this.handleDeleteHomeItem(item);
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
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getNavHomeData: Actions.getNavHomeData,
			setNavHomeDataLoader: Actions.setNavHomeDataLoader,

			deleteNavHomeDataItem: Actions.deleteNavHomeDataItem,
			setDeleteNavHomeDataItemLoader: Actions.setDeleteNavHomeDataItemLoader,

			setHomeDataItemOrder: Actions.setHomeDataItemOrder,
			setHomeDataItemOrderLoader: Actions.setHomeDataItemOrderLoader
		},
		dispatch
	);
}

function mapStateToProps({ homeApp }) {
	return {
		data: homeApp.home.homeData,
		loading: homeApp.home.loadingHomeData,
		deletingHomeData: homeApp.home.deletingHomeData,
		orderingItems: homeApp.home.orderingItems
	};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HomeTable)));
