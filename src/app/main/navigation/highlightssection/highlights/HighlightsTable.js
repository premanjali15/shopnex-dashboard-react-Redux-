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
import HighlightsTableHead from './HighlightsTableHead';
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

class HighlightsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedHighlight: null,
			openEditDialog: false,
			openDeleteDialog: false,
			data: null,
			selectedHighlightTitle: ''
		};
	}

	componentDidMount() {
		this.props.setHighlightsLoader(true);
		this.props.getHighlights();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.creatingHighlight === 'created') {
			this.setState({ data: this.props.data });
			this.props.setCreateHighlightLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingHighlight === 'updated') {
			this.setState({ data: this.props.data });
			this.props.setUpdateHighlightLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingHighlight === 'deleted') {
			this.props.setDeleteHighlightlLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.addingToHome === 'added') {
			this.setState({ data: this.props.data });
			this.props.setAddHighlightToHomeLoader(false);
		}
	}

	createHighlight = () => {
		if (this.state.selectedHighlightTitle !== '') {
			this.props.setCreateHighlightLoader(true);
			this.props.createHighlight(this.state.selectedHighlightTitle);
		}
	};
	handlePropsClose = () => {
		this.setState({ selectedHighlightTitle: '', selectedHighlight: null, openEditDialog: false });
		this.props.handleClose();
	};

	handleClick = (highlight) => {
		this.props.history.push('/app/highlights/' + highlight.id);
	};

	handleDeleteHighlight = (highlight) => {
		this.setState({ openDeleteDialog: true, selectedHighlight: highlight });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedHighlight: null });
	};
	deleteHighlight = () => {
		this.props.setDeleteHighlightlLoader(true);
		this.props.deleteHighlight(this.state.selectedHighlight.id);
	};

	handleAddToHome = (item) => {
		this.props.setAddHighlightToHomeLoader(true);
		this.props.addHighlightToHome(item.id);
	};

	handleEditDialog = (highlight) => {
		this.setState({ selectedHighlight: highlight, selectedHighlightTitle: highlight.title, openEditDialog: true });
	};
	closeEditDialog = () => {
		this.setState({ selectedHighlight: null, selectedHighlightTitle: '', openEditDialog: false });
	};
	updateHighlight = () => {
		let obj = { id: this.state.selectedHighlight.id, title: this.state.selectedHighlightTitle };
		this.props.setUpdateHighlightLoader(true);
		this.props.updateHighlight(obj);
	};

	render() {
		const {
			classes,
			loadingHighlights,
			deletingHighlight,
			addNew,
			creatingHighlight,
			updatingHighlight,
			addingToHome
		} = this.props;
		const { data, selectedHighlightTitle, openEditDialog } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteHighlight}
					deleting={deletingHighlight}
				/>

				{addingToHome &&
				addingToHome !== 'added' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}

				{loadingHighlights && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!loadingHighlights &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<HighlightsTableHead />
								{data &&
								data.length > 0 && (
									<TableBody>
										{data.map((highlight) => {
											return (
												<TableRow
													className="h-64 cursor-pointer"
													tabIndex={-1}
													key={highlight.id}
												>
													<TableCell component="th" scope="row">
														{highlight.id}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<div className="flex items-center justify-center">
															{highlight.title}
															<Icon
																className="ml-12 text-16 cursor-pointer"
																onClick={() => this.handleEditDialog(highlight)}
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
														{highlight.item_count}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<IconButton
															onClick={() => {
																this.handleClick(highlight);
															}}
														>
															<Icon>edit</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleDeleteHighlight(highlight);
															}}
														>
															<Icon>delete</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleAddToHome(highlight);
															}}
															disabled={highlight.in_home}
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
								{addNew ? 'Create Highlight' : 'Update Highlight'}
							</DialogTitle>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									id="selectedHighlightTitle"
									label="Highlight Title"
									type="text"
									fullWidth
									value={selectedHighlightTitle}
									onChange={(e) => {
										this.setState({ selectedHighlightTitle: e.target.value });
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
										onClick={this.createHighlight}
										color="primary"
										disabled={
											selectedHighlightTitle === '' ||
											(creatingHighlight !== 'created' && creatingHighlight)
										}
									>
										{creatingHighlight ? 'Saving...' : 'Save'}
									</Button>
								) : (
									<Button
										onClick={this.updateHighlight}
										color="primary"
										disabled={
											selectedHighlightTitle === '' ||
											(updatingHighlight !== 'updated' && updatingHighlight)
										}
									>
										{updatingHighlight ? 'Updating...' : 'Update'}
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
			getHighlights: Actions.getHighlights,
			setHighlightsLoader: Actions.setHighlightsLoader,

			createHighlight: Actions.createHighlight,
			setCreateHighlightLoader: Actions.setCreateHighlightLoader,

			updateHighlight: Actions.updateHighlight,
			setUpdateHighlightLoader: Actions.setUpdateHighlightLoader,

			deleteHighlight: Actions.deleteHighlight,
			setDeleteHighlightlLoader: Actions.setDeleteHighlightlLoader,

			addHighlightToHome: Actions.addHighlightToHome,
			setAddHighlightToHomeLoader: Actions.setAddHighlightToHomeLoader
		},
		dispatch
	);
}

function mapStateToProps({ highlightsApp }) {
	return {
		data: highlightsApp.highlights.highlights,
		loadingHighlights: highlightsApp.highlights.loadingHighlights,
		creatingHighlight: highlightsApp.highlights.creatingHighlight,
		updatingHighlight: highlightsApp.highlights.updatingHighlight,
		deletingHighlight: highlightsApp.highlights.deletingHighlight,
		addingToHome: highlightsApp.highlights.addingToHome
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(HighlightsTable))
);
