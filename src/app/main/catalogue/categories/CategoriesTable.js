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
	withStyles,
	Fab
} from '@material-ui/core';
import _ from 'lodash';
import { FuseScrollbars } from '@fuse';
import CategoriesTableHead from './CategoriesTableHead';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';

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

class CategoriesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openEditDialog: false,
			selectedCategory: null,
			openDeleteDialog: false,
			data: null,
			loadingData: false,
			imageChanged: false
		};
	}

	componentDidMount() {
		this.props.setCategoriesLoader(true);
		this.props.getCategories();
	}
	componentDidUpdate(prevProps) {
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.addNew && !this.state.selectedCategory) {
			this.setState({ selectedCategory: { name: '', background_image: null } });
		}
		if (
			(this.props.data && !this.state.data) ||
			!_.isEqual(this.props.data, prevProps.data) ||
			!_.isEqual(this.props.searchText, prevProps.searchText)
		) {
			const data = this.getFilteredArray(this.props.data, this.props.searchText);
			this.setState({ data });
		}
		if (this.props.creatingCategory === 'created') {
			const data = this.getFilteredArray(this.props.data, this.props.searchText);
			this.setState({ data });

			this.props.setCreateCategoryLoader(false);
			this.handlePropsClose();
		}
		if (this.props.updatingCategory === 'updated') {
			const data = this.getFilteredArray(this.props.data, this.props.searchText);
			this.setState({ data });

			this.props.setUpdateCategoryLoader(false);
			this.closeEditDialog();
		}
		if (this.props.deletingCategory === 'deleted') {
			this.props.setDeleteCategoryLoader(false);
			this.closeDeleteDialog();
		}
	}
	getFilteredArray = (data, searchText) => {
		if (searchText.length === 0) {
			return data;
		}
		return _.filter(data, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
	};

	handlePropsClose = () => {
		this.setState({ selectedCategory: null });
		this.props.handleClose();
	};
	createCategory = () => {
		if (this.state.selectedCategory) {
			this.props.setCreateCategoryLoader(true);
			this.props.createCategory(this.state.selectedCategory);
		}
	};

	handleEditCategory = (category) => {
		this.setState({
			openEditDialog: true,
			selectedCategory: category,
			imageChanged: false
		});
	};
	closeEditDialog = () => {
		this.props.setUpdateCategoryLoader(false);
		this.setState({
			openEditDialog: false,
			selectedCategory: null,
			imageChanged: false
		});
	};
	updateCategory = () => {
		let data = _.clone(this.state.selectedCategory);
		if (this.state.imageChanged === false) delete data.background_image;
		this.props.setUpdateCategoryLoader(true);
		this.props.updateCategory(data);
	};

	handleDeleteCategory = (category) => {
		this.setState({ openDeleteDialog: true, selectedCategory: category });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedCategory: null });
	};
	deleteCategory = () => {
		let id = this.state.selectedCategory.id;
		this.props.setDeleteCategoryLoader(true);
		this.props.deleteCategory(id);
	};

	handleChangeImg = () => {
		this.refs.fileInput.click();
	};
	handleImageChange = (e) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		if (file) {
			reader.onloadend = () => {
				this.setState({
					selectedCategory: _.set({ ...this.state.selectedCategory }, 'background_image', reader.result),
					imageChanged: true
				});
			};
			reader.readAsDataURL(file);
		}
	};
	handleRemoveImg = () => {
		this.setState({
			selectedCategory: _.set({ ...this.state.selectedCategory }, 'background_image', null),
			imageChanged: true
		});
	};

	render() {
		const { loading, creatingCategory, updatingCategory, deletingCategory, addNew, classes } = this.props;
		const { data, loadingData, selectedCategory } = this.state;

		return (
			<div className="w-full flex flex-col">
				<input type="file" onChange={this.handleImageChange} ref="fileInput" className="hidden" />
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteCategory}
					deleting={deletingCategory}
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
								<CategoriesTableHead />

								<TableBody>
									{data.map((category) => {
										return (
											<TableRow className="h-64 cursor-pointer" tabIndex={-1} key={category.id}>
												<TableCell component="th" scope="row">
													{category.id}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{category.name}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{category.available_products}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{category.total_products}
												</TableCell>
												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													<IconButton
														onClick={() => {
															this.handleEditCategory(category);
														}}
													>
														<Icon>edit</Icon>
													</IconButton>
													<IconButton
														onClick={() => {
															this.handleDeleteCategory(category);
														}}
														disabled={
															category.available_products !== 0 ||
															category.total_products !== 0
														}
													>
														<Icon>delete</Icon>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</FuseScrollbars>
					</div>
				)}

				{selectedCategory && (
					<Dialog open={this.state.openEditDialog || addNew} aria-labelledby="form-dialog-title" fullWidth>
						<DialogTitle id="form-dialog-title">
							{addNew ? 'Creat Category' : 'Update Category'}
						</DialogTitle>
						<DialogContent>
							<TextField
								autoFocus
								margin="dense"
								id="name"
								label="Category Name"
								type="name"
								fullWidth
								value={selectedCategory.name}
								onChange={(e) => {
									this.setState({
										selectedCategory: { ...selectedCategory, name: e.target.value }
									});
								}}
								variant="outlined"
								required
							/>

							{selectedCategory.background_image && selectedCategory.background_image !== '' ? (
								<div className="text-center mt-12">
									<img src={selectedCategory.background_image} alt="" />
								</div>
							) : (
								<div className="px-32 text-center mt-12">
									<img
										className={'rounded min-h-96'}
										src={'assets/images/ecommerce/product-image-placeholder.png'}
										alt=""
									/>
								</div>
							)}
							<div className="text-center">
								<Fab
									variant="extended"
									size="small"
									color="primary"
									aria-label="Add"
									className="mt-8"
									onClick={this.handleChangeImg}
									disabled={
										(creatingCategory !== 'created' && creatingCategory) ||
										(updatingCategory !== 'updated' && updatingCategory)
									}
								>
									{selectedCategory.background_image && selectedCategory.background_image !== '' ? (
										'Change Image'
									) : (
										'Select Image'
									)}
								</Fab>

								{selectedCategory.background_image &&
								selectedCategory.background_image !== '' && (
									<Fab
										variant="extended"
										size="small"
										color="primary"
										aria-label="Add"
										className="mt-8 ml-12"
										onClick={this.handleRemoveImg}
										disabled={
											(creatingCategory !== 'created' && creatingCategory) ||
											(updatingCategory !== 'updated' && updatingCategory)
										}
									>
										Remove Image
									</Fab>
								)}
							</div>
						</DialogContent>
						{!addNew &&
						this.state.openEditDialog && (
							<DialogActions>
								<Button onClick={this.closeEditDialog} color="primary">
									Cancel
								</Button>
								<Button
									onClick={this.updateCategory}
									color="primary"
									disabled={updatingCategory !== 'updated' && updatingCategory}
								>
									{updatingCategory ? 'Updating...' : 'Update'}
								</Button>
							</DialogActions>
						)}
						{addNew && (
							<DialogActions>
								<Button color="primary" onClick={this.handlePropsClose}>
									Cancel
								</Button>
								<Button
									onClick={this.createCategory}
									color="primary"
									disabled={creatingCategory !== 'created' && creatingCategory}
								>
									{creatingCategory ? 'Saving...' : 'Save'}
								</Button>
							</DialogActions>
						)}
					</Dialog>
				)}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getCategories: Actions.getCategories,
			createCategory: Actions.createCategory,
			updateCategory: Actions.updateCategory,
			deleteCategory: Actions.deleteCategory,
			setCategoriesLoader: Actions.setCategoriesLoader,
			setCreateCategoryLoader: Actions.setCreateCategoryLoader,
			setUpdateCategoryLoader: Actions.setUpdateCategoryLoader,
			setDeleteCategoryLoader: Actions.setDeleteCategoryLoader
		},
		dispatch
	);
}

function mapStateToProps({ categoriesApp }) {
	return {
		data: categoriesApp.categories.data,
		loading: categoriesApp.categories.loading,
		creatingCategory: categoriesApp.categories.creatingCategory,
		updatingCategory: categoriesApp.categories.updatingCategory,
		deletingCategory: categoriesApp.categories.deletingCategory,
		searchText: categoriesApp.categories.searchText
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoriesTable))
);
