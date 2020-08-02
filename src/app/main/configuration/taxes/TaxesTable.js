import React, { Component } from 'react';
import {
	Icon,
	Table,
	TableBody,
	TableCell,
	TableRow,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	TextField,
	withStyles
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import _ from '@lodash';
import TaxesTableHead from './TaxesTableHead';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ShowDialog } from '../../components/showdialog/ShowDialog';
import Pagination from '../../components/pagination/Pagination';

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

class TaxesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: { name: '', value: '' },
			openDeleteDialog: false,
			data: null,
			loadingData: false
		};
	}

	componentDidMount() {
		this.props.setTaxesLoader(true);
		this.props.getTaxes();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.creatingTax === 'created') {
			this.props.setCreateTaxLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingTax === 'updated') {
			this.props.setUpdateTaxLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingTax === 'deleted') {
			this.props.setDeleteTaxLoader(false);
			this.closeDeleteDialog();
		}
	}

	handlePropsClose = () => {
		this.setState({ form: {} });
		this.props.handleClose();
	};

	handleChange = (event) => {
		this.setState({
			form: _.set({ ...this.state.form }, event.target.name, event.target.value)
		});
	};

	createTax = () => {
		if (this.state.form.name !== '' && this.state.form.value !== '') {
			this.props.setCreateTaxLoader(true);
			this.props.createTax(this.state.form);
		}
	};

	updateTax = () => {
		this.props.setUpdateTaxLoader(true);
		this.props.updateTax(this.state.form);
	};

	handleEditTax = (tax) => {
		this.setState({ openEditDialog: true, form: tax });
	};

	deleteTax = () => {
		let id = this.state.form.id;
		this.props.setDeleteTaxLoader(true);
		this.props.deleteTax(id);
	};

	handleDeleteTax = (tax) => {
		this.setState({ openDeleteDialog: true, form: tax });
	};

	closeEditDialog = () => {
		this.props.setUpdateTaxLoader(false);
		this.setState({ openEditDialog: false, form: { name: '', value: '' } });
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, form: { name: '', value: '' } });
	};

	setPaginationLoader = (value) => {
		this.setState({ loadingData: value });
	};

	setPaginationData = (data) => {
		this.setState({ data });
	};

	render() {
		const { loading, addNew, creatingTax, updatingTax, deletingTax, classes } = this.props;
		const { form, data, loadingData } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteTax}
					deleting={deletingTax}
				/>
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
							<Table className="min-w-xl" aria-labelledby="tableTitle">
								<TaxesTableHead />

								<TableBody>
									{data.results.map((tax) => {
										return (
											<TableRow className="h-64 cursor-pointer" tabIndex={-1} key={tax.id}>
												<TableCell component="th" scope="row">
													{tax.id}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{tax.name}
												</TableCell>
												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{tax.value}
												</TableCell>
												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													<IconButton
														onClick={() => {
															this.handleEditTax(tax);
														}}
													>
														<Icon>edit</Icon>
													</IconButton>
													<IconButton
														onClick={() => {
															this.handleDeleteTax(tax);
														}}
													>
														<Icon>delete</Icon>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>

							{data.results &&
							data.results.length > 0 && (
								<Pagination
									data={data}
									setPaginationLoader={this.setPaginationLoader}
									setPaginationData={this.setPaginationData}
									currentUrl={Actions.taxesURl}
								/>
							)}
						</FuseScrollbars>
					</div>
				)}

				<Dialog open={this.state.openEditDialog || addNew} aria-labelledby="form-dialog-title" fullWidth>
					<DialogTitle id="form-dialog-title">{addNew ? 'Create New Tax' : 'Update Tax'}</DialogTitle>
					<DialogContent className="flex flex-row">
						<TextField
							className="mx-6"
							autoFocus
							margin="dense"
							id="name"
							label="Tax Name"
							name="name"
							variant="outlined"
							value={form.name}
							onChange={this.handleChange}
							fullWidth
							required
						/>
						<TextField
							className="mx-6"
							margin="dense"
							id="value"
							label="Tax Value (%)"
							name="value"
							type="number"
							variant="outlined"
							value={form.value}
							onChange={this.handleChange}
							fullWidth
							required
						/>
					</DialogContent>
					{!addNew &&
					this.state.openEditDialog && (
						<DialogActions>
							<Button onClick={this.closeEditDialog} color="primary">
								Cancel
							</Button>
							<Button
								onClick={this.updateTax}
								color="primary"
								disabled={
									form.name === '' || form.value === '' || (updatingTax !== 'updated' && updatingTax)
								}
							>
								{updatingTax !== 'updated' && updatingTax ? 'Updating...' : 'Update'}
							</Button>
						</DialogActions>
					)}
					{addNew && (
						<DialogActions>
							<Button color="primary" onClick={this.handlePropsClose}>
								Cancel
							</Button>
							<Button
								onClick={this.createTax}
								color="primary"
								disabled={
									form.name === '' || form.value === '' || (creatingTax !== 'created' && creatingTax)
								}
							>
								{creatingTax !== 'created' && creatingTax ? 'Saving...' : 'Save'}
							</Button>
						</DialogActions>
					)}
				</Dialog>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getTaxes: Actions.getTaxes,
			createTax: Actions.createTax,
			updateTax: Actions.updateTax,
			deleteTax: Actions.deleteTax,
			setTaxesLoader: Actions.setTaxesLoader,
			setCreateTaxLoader: Actions.setCreateTaxLoader,
			setUpdateTaxLoader: Actions.setUpdateTaxLoader,
			setDeleteTaxLoader: Actions.setDeleteTaxLoader
		},
		dispatch
	);
}

function mapStateToProps({ taxesApp }) {
	return {
		data: taxesApp.taxes.taxes,
		loading: taxesApp.taxes.loading,
		creatingTax: taxesApp.taxes.creatingTax,
		updatingTax: taxesApp.taxes.updatingTax,
		deletingTax: taxesApp.taxes.deletingTax
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(TaxesTable))
);
