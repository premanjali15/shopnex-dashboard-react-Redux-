import React, { Component } from 'react';
import {
	withStyles,
	Icon,
	Typography,
	Paper,
	Button,
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableSortLabel,
	TableBody,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField
} from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ShowDialog } from '../../../components/showdialog/ShowDialog';
import reducer from '../../store/reducers';

const styles = (theme) => ({
	noUnderLine: {
		'&:hover': {
			textDecoration: 'none !important'
		}
	}
});

class Attribute extends Component {
	constructor(props) {
		super(props);
		this.state = {
			attrDetails: null,
			atrId: this.props.match.params.id,
			openEditDialog: false,
			editedData: null,
			openDeleteDialog: false,
			openAddValueDialog: false,
			openEditValueDialog: false,
			openDeleteValueDialog: false,
			valueForm: null
		};
	}

	componentDidMount() {
		this.props.setAttributeDetailsLoader(true);
		this.props.getAttributeDetails(this.state.atrId);
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			(this.props.data && !this.state.attrDetails) ||
			(this.props.data && this.state.attrDetails && this.props.data.id !== this.state.attrDetails.id) ||
			prevProps.data !== this.props.data
		) {
			this.setState({ attrDetails: this.props.data });
		}
		if (this.props.updatingAttr === 'updated') {
			this.props.setUpdateAttibuteLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingAttr === 'deleted') {
			this.props.setDeleteAttibuteLoader(false);
			this.closeDeleteDialog();
			this.props.history.replace('/app/configuration/attributes');
		}
		if (this.props.savingAttrValue === 'saved') {
			this.props.setSaveAttrValueLoader(false);
			this.closeValueDialog();
		}
		if (this.props.updatingAttrValue === 'updated') {
			this.props.setUpdateAttrValueLoader(false);
			this.closeValueDialog();
		}
		if (this.props.deletingAttrValue === 'deleted') {
			this.props.setDeleteAttrValueLoader(false);
			this.closeValueDialog();
		}
	}

	handleAttrEdit = () => {
		this.setState({ openEditDialog: true, editedData: this.state.attrDetails });
	};

	closeEditDialog = () => {
		this.setState({ openEditDialog: false, editedData: null });
	};

	updateAttribute = () => {
		this.props.setUpdateAttibuteLoader(true);
		this.props.updateAttribute(this.state.editedData);
	};

	deleteAttrDelete = () => {
		this.setState({ openDeleteDialog: true });
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false });
	};

	deleteAttribute = () => {
		this.props.setDeleteAttibuteLoader(true);
		this.props.deleteAttribute(this.state.attrDetails.id);
	};

	handleValueModify = (data) => {
		if (data === 'add') {
			this.setState({ valueForm: { name: '', slug: '', attribute: parseInt(this.state.atrId) } });
			this.setState({ openAddValueDialog: true });
		} else {
			this.setState({ valueForm: data });
			this.setState({ openEditValueDialog: true });
		}
	};

	closeValueDialog = () => {
		this.setState({
			openAddValueDialog: false,
			openEditValueDialog: false,
			openDeleteValueDialog: false,
			valueForm: null
		});
	};

	saveAttrValue = () => {
		this.props.setSaveAttrValueLoader(true);
		this.props.saveAttrValue(this.state.valueForm);
	};

	updateAttrValue = () => {
		this.props.setUpdateAttrValueLoader(true);
		this.props.updateAttrValue(this.state.valueForm);
	};

	handleValueRemove = (data) => {
		this.setState({ valueForm: data, openDeleteValueDialog: true });
	};

	deleteAttrValue = () => {
		this.props.setDeleteAttrValueLoader(true);
		this.props.deleteAttrValue(this.state.valueForm.id);
	};

	render() {
		const {
			loading,
			classes,
			updatingAttr,
			deletingAttr,
			savingAttrValue,
			updatingAttrValue,
			deletingAttrValue
		} = this.props;
		const {
			attrDetails,
			editedData,
			openEditDialog,
			openDeleteDialog,
			openAddValueDialog,
			openEditValueDialog,
			openDeleteValueDialog,
			valueForm
		} = this.state;

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					attrDetails &&
					!loading && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/configuration/attributes"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Attributes
									</Typography>
								</FuseAnimate>
							</div>
						</div>
					)
				}
				content={
					<div className="p-16 sm:p-24">
						{loading && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loading &&
						attrDetails && (
							<div className="px-24 py-12">
								<Paper className="rounded-none p-16 mb-32">
									<p className="text-20 mb-8">{attrDetails.name}</p>
									{attrDetails.product_type_name === null && (
										<Link to="/app/configuration/producttypes" className={classes.noUnderLine}>
											Assign to a product type
										</Link>
									)}
									<div className="mt-16">
										<Button
											color="secondary"
											className="mr-16"
											size="small"
											onClick={this.handleAttrEdit}
										>
											EDIT ATTRIBUTE
										</Button>
										<Button color="secondary" size="small" onClick={this.deleteAttrDelete}>
											REMOVE ATTRIBUTE
										</Button>
									</div>
								</Paper>

								<Paper className="rounded-none p-16">
									<div className="flex items-center justify-between">
										<p className="text-20">Attribute Values</p>
										<Button color="secondary" onClick={() => this.handleValueModify('add')}>
											Add
										</Button>
									</div>
									{attrDetails.values && attrDetails.values.length > 0 ? (
										<Table className="mt-8" aria-labelledby="tableTitle">
											<TableHead>
												<TableRow className="h-64">
													<TableCell padding="default" align="left">
														<TableSortLabel>Display Name</TableSortLabel>
													</TableCell>
													<TableCell />
												</TableRow>
											</TableHead>

											<TableBody>
												{attrDetails.values.map((value) => {
													return (
														<TableRow
															className="h-64 cursor-pointer"
															tabIndex={-1}
															key={value.id}
														>
															<TableCell
																className="truncate"
																component="th"
																scope="row"
																align="left"
															>
																{value.name}
															</TableCell>

															<TableCell
																className="truncate"
																component="th"
																scope="row"
																align="right"
															>
																<Button
																	color="secondary"
																	size="small"
																	onClick={() => this.handleValueModify(value)}
																>
																	EDIT
																</Button>
																<Button
																	color="secondary"
																	size="small"
																	onClick={() => this.handleValueRemove(value)}
																>
																	REMOVE
																</Button>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									) : (
										<div className="text-center py-24">
											<p>No Attribute Values</p>
										</div>
									)}
								</Paper>
							</div>
						)}
						{editedData && (
							<Dialog open={openEditDialog} aria-labelledby="form-dialog-title" fullWidth>
								<DialogTitle id="form-dialog-title">Create Attribute</DialogTitle>
								<DialogContent>
									<TextField
										margin="dense"
										id="name"
										label="Name"
										type="name"
										fullWidth
										value={editedData.name}
										onChange={(e) => {
											this.setState({
												editedData: { ...this.state.editedData, name: e.target.value }
											});
										}}
										variant="outlined"
										required
									/>
									<TextField
										className="mt-20"
										margin="dense"
										id="slug"
										label="Internal Name"
										type="slug"
										fullWidth
										value={editedData.slug}
										onChange={(e) => {
											this.setState({
												editedData: { ...this.state.editedData, slug: e.target.value }
											});
										}}
										variant="outlined"
										required
									/>
								</DialogContent>
								<DialogActions>
									<Button color="primary" onClick={this.closeEditDialog}>
										Cancel
									</Button>
									<Button
										onClick={this.updateAttribute}
										color="primary"
										disabled={
											editedData.name === '' ||
											editedData.slug === '' ||
											(updatingAttr !== 'updated' && updatingAttr)
										}
									>
										{updatingAttr !== 'updated' && updatingAttr ? 'Updating...' : 'Update'}
									</Button>
								</DialogActions>
							</Dialog>
						)}
						<ShowDialog
							open={openDeleteDialog}
							closeDeleteDialog={this.closeDeleteDialog}
							deleteDialogFunction={this.deleteAttribute}
							deleting={deletingAttr}
						/>

						{valueForm && (
							<Dialog
								open={openAddValueDialog || openEditValueDialog}
								aria-labelledby="form-dialog-title"
								fullWidth
							>
								<DialogTitle id="form-dialog-title">
									{openAddValueDialog ? 'Create Value' : 'Update Value'}
								</DialogTitle>
								<DialogContent>
									<TextField
										margin="dense"
										id="name"
										label="Name"
										type="name"
										fullWidth
										value={valueForm.name}
										onChange={(e) => {
											this.setState({
												valueForm: { ...this.state.valueForm, name: e.target.value }
											});
										}}
										variant="outlined"
										required
									/>
									<TextField
										className="mt-20"
										margin="dense"
										id="slug"
										label="Internal Name"
										type="slug"
										fullWidth
										value={valueForm.slug}
										onChange={(e) => {
											this.setState({
												valueForm: { ...this.state.valueForm, slug: e.target.value }
											});
										}}
										variant="outlined"
										required
									/>
								</DialogContent>
								<DialogActions>
									<Button color="primary" onClick={this.closeValueDialog}>
										Cancel
									</Button>
									{openAddValueDialog && (
										<Button
											onClick={this.saveAttrValue}
											color="primary"
											disabled={
												valueForm.name === '' ||
												valueForm.slug === '' ||
												(savingAttrValue !== 'saved' && savingAttrValue)
											}
										>
											{savingAttrValue !== 'saved' && savingAttrValue ? 'Saving...' : 'Save'}
										</Button>
									)}
									{openEditValueDialog && (
										<Button
											onClick={this.updateAttrValue}
											color="primary"
											disabled={
												valueForm.name === '' ||
												valueForm.slug === '' ||
												(updatingAttrValue !== 'updated' && updatingAttrValue)
											}
										>
											{updatingAttrValue !== 'updated' && updatingAttrValue ? (
												'Updating...'
											) : (
												'Update'
											)}
										</Button>
									)}
								</DialogActions>
							</Dialog>
						)}
						<ShowDialog
							open={openDeleteValueDialog}
							closeDeleteDialog={this.closeValueDialog}
							deleteDialogFunction={this.deleteAttrValue}
							deleting={deletingAttrValue}
						/>
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
			getAttributeDetails: Actions.getAttributeDetails,
			updateAttribute: Actions.updateAttribute,
			deleteAttribute: Actions.deleteAttribute,
			saveAttrValue: Actions.saveAttrValue,
			updateAttrValue: Actions.updateAttrValue,
			deleteAttrValue: Actions.deleteAttrValue,
			setAttributeDetailsLoader: Actions.setAttributeDetailsLoader,
			setUpdateAttibuteLoader: Actions.setUpdateAttibuteLoader,
			setDeleteAttibuteLoader: Actions.setDeleteAttibuteLoader,
			setSaveAttrValueLoader: Actions.setSaveAttrValueLoader,
			setUpdateAttrValueLoader: Actions.setUpdateAttrValueLoader,
			setDeleteAttrValueLoader: Actions.setDeleteAttrValueLoader
		},
		dispatch
	);
}

function mapStateToProps({ attributeApp }) {
	return {
		data: attributeApp.attribute.data,
		loading: attributeApp.attribute.loading,
		updatingAttr: attributeApp.attribute.updatingAttr,
		deletingAttr: attributeApp.attribute.deletingAttr,
		savingAttrValue: attributeApp.attribute.savingAttrValue,
		updatingAttrValue: attributeApp.attribute.updatingAttrValue,
		deletingAttrValue: attributeApp.attribute.deletingAttrValue
	};
}

export default withReducer('attributeApp', reducer)(
	withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Attribute)))
);
