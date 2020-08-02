import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableRow, Icon, IconButton, withStyles } from '@material-ui/core';
import _ from 'lodash';
import { FuseScrollbars } from '@fuse';
import CollectionsTableHead from './CollectionsTableHead';
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

class CategoriesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCollection: null,
			openDeleteDialog: false,
			data: null,
			loadingData: false
		};
	}
	componentDidMount() {
		this.props.setCollectionsLoader(true);
		this.props.getCollections();
	}
	componentDidUpdate(prevProps) {
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.deletingCollection === 'deleted') {
			this.props.setDeleteCollectionValue(false);
			this.closeDeleteDialog();
		}
	}
	handleClick = (collection) => {
		this.props.history.push('/app/collections/' + collection.id);
	};

	deleteCollection = () => {
		this.props.setDeleteCollectionValue(true);
		this.props.deleteCollection(this.state.selectedCollection.id);
	};

	handleDeleteCollection = (collection) => {
		this.setState({ openDeleteDialog: true, selectedCollection: collection });
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedCollection: null });
	};

	setPaginationLoader = (value) => {
		this.setState({ loadingData: value });
	};

	setPaginationData = (data) => {
		this.setState({ data });
	};

	render() {
		const { loading, deletingCollection, classes } = this.props;
		const { data, loadingData } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteCollection}
					deleting={deletingCollection}
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
								<CollectionsTableHead />

								<TableBody>
									{data.results.map((collection) => {
										return (
											<TableRow className="h-64 cursor-pointer" tabIndex={-1} key={collection.id}>
												<TableCell component="th" scope="row">
													{collection.id}
												</TableCell>

												{/* <TableCell className="w-96" component="th" scope="row" padding="none">
													{collection.background_image ? (
														<img
															className="w-full block rounded py-4"
															src={collection.background_image}
															alt={collection.name}
														/>
													) : (
														<img
															className="w-full block rounded"
															src="assets/images/ecommerce/product-image-placeholder.png"
															alt={collection.name}
														/>
													)}
												</TableCell> */}

												<TableCell className="truncate" component="th" scope="row">
													{collection.name}
												</TableCell>
												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{collection.available_products} {' / '} {collection.total_products}
												</TableCell>
												<TableCell component="th" scope="row" align="center">
													{collection.is_published ? (
														<Icon className="text-green text-20">check_circle</Icon>
													) : (
														<Icon className="text-red text-20">remove_circle</Icon>
													)}
												</TableCell>
												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													<IconButton
														onClick={() => {
															this.handleClick(collection);
														}}
													>
														<Icon>edit</Icon>
													</IconButton>
													<IconButton
														onClick={() => {
															this.handleDeleteCollection(collection);
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

							<Pagination
								data={data}
								setPaginationLoader={this.setPaginationLoader}
								setPaginationData={this.setPaginationData}
								currentUrl={Actions.collectionsURl}
							/>
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
			getCollections: Actions.getCollections,
			setCollectionsLoader: Actions.setCollectionsLoader,
			deleteCollection: Actions.deleteCollection,
			setDeleteCollectionValue: Actions.setDeleteCollectionValue
		},
		dispatch
	);
}

function mapStateToProps({ collectionsApp }) {
	return {
		data: collectionsApp.collections.collections,
		loading: collectionsApp.collections.loading,
		deletingCollection: collectionsApp.collections.deletingCollection
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoriesTable))
);
