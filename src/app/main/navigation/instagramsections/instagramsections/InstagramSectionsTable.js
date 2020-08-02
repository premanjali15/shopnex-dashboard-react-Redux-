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
import InstagramSectionsTableHead from './InstagramSectionsTableHead';
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

class InstagramSectionsTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedInstagramSection: null,
			openEditDialog: false,
			openDeleteDialog: false,
			data: null,
			selectedInstagramSectionTitle: ''
		};
	}

	componentDidMount() {
		this.props.setInstagramSectionsLoader(true);
		this.props.getInstagramSections();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.creatingInstagramSection === 'created') {
			this.setState({ data: this.props.data });
			this.props.setCreateInstagramSectionLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingInstagramSection === 'updated') {
			this.setState({ data: this.props.data });
			this.props.setUpdateInstagramSectionLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingInstagramSection === 'deleted') {
			this.props.setDeleteInstagramSectionlLoader(false);
			this.closeDeleteDialog();
		}
		if (this.props.addingToHome === 'added') {
			this.props.setAddInstagramSectionToHomeLoader(false);
		}
	}

	createInstagramSection = () => {
		if (this.state.selectedInstagramSectionTitle !== '') {
			this.props.setCreateInstagramSectionLoader(true);
			this.props.createInstagramSection(this.state.selectedInstagramSectionTitle);
		}
	};
	handlePropsClose = () => {
		this.setState({ selectedInstagramSectionTitle: '', openEditDialog: false, selectedInstagramSection: null });
		this.props.handleClose();
	};

	handleClick = (item) => {
		this.props.history.push('/app/instagram/' + item.id);
	};

	handleDeleteInstagramSection = (item) => {
		this.setState({ openDeleteDialog: true, selectedInstagramSection: item });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedInstagramSection: null });
	};
	deleteInstagramSection = () => {
		this.props.setDeleteInstagramSectionlLoader(true);
		this.props.deleteInstagramSection(this.state.selectedInstagramSection.id);
	};

	handleAddToHome = (item) => {
		this.props.setAddInstagramSectionToHomeLoader(true);
		this.props.addInstagramSectionToHome(item.id);
	};

	handleEditDialog = (instagramSection) => {
		this.setState({
			selectedInstagramSection: instagramSection,
			selectedInstagramSectionTitle: instagramSection.title,
			openEditDialog: true
		});
	};
	closeEditDialog = () => {
		this.setState({ selectedInstagramSection: null, selectedInstagramSectionTitle: '', openEditDialog: false });
	};
	updateInstagramSection = () => {
		let obj = { id: this.state.selectedInstagramSection.id, title: this.state.selectedInstagramSectionTitle };
		this.props.setUpdateInstagramSectionLoader(true);
		this.props.updateInstagramSection(obj);
	};

	render() {
		const {
			classes,
			loadingInstagramSections,
			deletingInstagramSection,
			addNew,
			creatingInstagramSection,
			addingToHome,
			updatingInstagramSection
		} = this.props;
		const { data, selectedInstagramSectionTitle, openEditDialog } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteInstagramSection}
					deleting={deletingInstagramSection}
				/>

				{addingToHome &&
				addingToHome !== 'added' && (
					<div className={classes.overlay}>
						<div className={classes.overlayContent}>
							<CircularProgress color="secondary" />
						</div>
					</div>
				)}

				{loadingInstagramSections && (
					<div className="text-center pt-60">
						<CircularProgress color="secondary" />
					</div>
				)}
				{!loadingInstagramSections &&
				data && (
					<div>
						<FuseScrollbars className="flex-grow overflow-x-auto">
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<InstagramSectionsTableHead />
								{data &&
								data.length > 0 && (
									<TableBody>
										{data.map((instagramSection) => {
											return (
												<TableRow
													className="h-64 cursor-pointer"
													tabIndex={-1}
													key={instagramSection.id}
												>
													<TableCell component="th" scope="row">
														{instagramSection.id}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<div className="flex items-center justify-center">
															{instagramSection.title}
															<Icon
																className="ml-12 text-16 cursor-pointer"
																onClick={() => this.handleEditDialog(instagramSection)}
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
														{instagramSection.item_count.toString()}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<IconButton
															onClick={() => {
																this.handleClick(instagramSection);
															}}
														>
															<Icon>edit</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleDeleteInstagramSection(instagramSection);
															}}
														>
															<Icon>delete</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleAddToHome(instagramSection);
															}}
															disabled={instagramSection.in_home}
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
								{addNew ? 'Create Instagram Section' : 'Update Instagram Section'}
							</DialogTitle>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									id="InstagramSectionTitle"
									label="Instagram Section Title"
									type="text"
									fullWidth
									value={selectedInstagramSectionTitle}
									onChange={(e) => {
										this.setState({ selectedInstagramSectionTitle: e.target.value });
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
										onClick={this.createInstagramSection}
										color="primary"
										disabled={
											selectedInstagramSectionTitle === '' ||
											(creatingInstagramSection !== 'created' && creatingInstagramSection)
										}
									>
										{creatingInstagramSection ? 'Saving...' : 'Save'}
									</Button>
								) : (
									<Button
										onClick={this.updateInstagramSection}
										color="primary"
										disabled={
											selectedInstagramSectionTitle === '' ||
											(updatingInstagramSection !== 'updated' && updatingInstagramSection)
										}
									>
										{updatingInstagramSection ? 'Updating...' : 'Update'}
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
			getInstagramSections: Actions.getInstagramSections,
			setInstagramSectionsLoader: Actions.setInstagramSectionsLoader,

			createInstagramSection: Actions.createInstagramSection,
			setCreateInstagramSectionLoader: Actions.setCreateInstagramSectionLoader,

			updateInstagramSection: Actions.updateInstagramSection,
			setUpdateInstagramSectionLoader: Actions.setUpdateInstagramSectionLoader,

			deleteInstagramSection: Actions.deleteInstagramSection,
			setDeleteInstagramSectionlLoader: Actions.setDeleteInstagramSectionlLoader,

			addInstagramSectionToHome: Actions.addInstagramSectionToHome,
			setAddInstagramSectionToHomeLoader: Actions.setAddInstagramSectionToHomeLoader
		},
		dispatch
	);
}

function mapStateToProps({ instagramSectionsApp }) {
	return {
		data: instagramSectionsApp.instagramsections.instagramSections,
		loadingInstagramSections: instagramSectionsApp.instagramsections.loadingInstagramSections,
		creatingInstagramSection: instagramSectionsApp.instagramsections.creatingInstagramSection,
		updatingInstagramSection: instagramSectionsApp.instagramsections.updatingInstagramSection,
		deletingInstagramSection: instagramSectionsApp.instagramsections.deletingInstagramSection,
		addingToHome: instagramSectionsApp.instagramsections.addingToHome
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(InstagramSectionsTable))
);
