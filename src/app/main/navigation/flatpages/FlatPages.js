import React, { Component } from 'react';
import { FusePageCarded, FuseAnimate, FuseScrollbars } from '@fuse';
import {
	Typography,
	Button,
	Icon,
	CircularProgress,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	IconButton
} from '@material-ui/core';

import { withRouter, Link } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import { ShowDialog } from '../../components/showdialog/ShowDialog';

class FlatPages extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			selectedPage: null,
			openDeleteDialog: false
		};
	}

	componentDidMount() {
		this.props.setFlatPagesLoader(true);
		this.props.getFlatPages();
	}

	componentDidUpdate(prevProps) {
		if ((!this.state.data && this.props.data) || prevProps.data !== this.props.data) {
			this.setState({ data: this.props.data });
		}
		if (this.props.deletingFlatPage === 'deleted') {
			this.props.setDeleteFlatPageLoader(false);
			this.closeDeleteDialog();
		}
	}

	refreshData = () => {
		this.componentDidMount();
	};

	handleEditPage = (page) => {
		this.props.history.push('/app/flatpages/' + page.id);
	};

	handleDeletePage = (page) => {
		this.setState({ openDeleteDialog: true, selectedPage: page });
	};
	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedPage: null });
	};
	deleteFlatPage = () => {
		this.props.setDeleteFlatPageLoader(true);
		this.props.deleteFlatPage(this.state.selectedPage.id);
	};

	render() {
		const { data, openDeleteDialog } = this.state;
		const { loading, deletingFlatPage } = this.props;

		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex items-center">
							<FuseAnimate animation="transition.expandIn" delay={300}>
								<Icon className="text-32 mr-0 sm:mr-12">library_books</Icon>
							</FuseAnimate>
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="hidden sm:flex" variant="h6">
									Pages
								</Typography>
							</FuseAnimate>
						</div>

						<div className="flex flex-1 items-center justify-center px-12" />

						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap"
								variant="contained"
								component={Link}
								to="/app/flatpages/new"
							>
								<span className="hidden sm:flex">Add New Page</span>
								<span className="flex sm:hidden">New</span>
							</Button>
						</FuseAnimate>

						<div className="flex items-center pl-24">
							<Button className="whitespace-no-wrap" variant="contained" onClick={this.refreshData}>
								<Icon className="text-24 mr-4">refresh</Icon>
								<span className="hidden sm:flex">Refresh</span>
							</Button>
						</div>
					</div>
				}
				content={
					<div className="w-full flex flex-col">
						<ShowDialog
							open={openDeleteDialog}
							closeDeleteDialog={this.closeDeleteDialog}
							deleteDialogFunction={this.deleteFlatPage}
							deleting={deletingFlatPage}
						/>

						{loading && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}

						{!loading &&
						data && (
							<FuseScrollbars className="flex-grow overflow-x-auto">
								<Table className="min-w-xl" aria-labelledby="tableTitle">
									<TableHead>
										<TableRow className="h-64">
											{[ 'ID', 'Title', 'url', 'Actions' ].map((title, index) => {
												return (
													<TableCell key={index} align="center">
														{title}
													</TableCell>
												);
											}, this)}
										</TableRow>
									</TableHead>

									<TableBody>
										{data.map((page) => {
											return (
												<TableRow className="h-64 cursor-pointer" tabIndex={-1} key={page.id}>
													<TableCell component="th" scope="row" align="center">
														{page.id}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														{page.title}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														{page.url}
													</TableCell>

													<TableCell
														className="truncate"
														component="th"
														scope="row"
														align="center"
													>
														<IconButton onClick={() => this.handleEditPage(page)}>
															<Icon>edit</Icon>
														</IconButton>
														<IconButton
															onClick={() => {
																this.handleDeletePage(page);
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
							</FuseScrollbars>
						)}
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
			getFlatPages: Actions.getFlatPages,
			setFlatPagesLoader: Actions.setFlatPagesLoader,

			deleteFlatPage: Actions.deleteFlatPage,
			setDeleteFlatPageLoader: Actions.setDeleteFlatPageLoader
		},
		dispatch
	);
}

function mapStateToProps({ flatPagesApp }) {
	return {
		data: flatPagesApp.flatpages.flatpages,
		loading: flatPagesApp.flatpages.loading,
		deletingFlatPage: flatPagesApp.flatpages.deletingFlatPage
	};
}

export default withReducer('flatPagesApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(FlatPages))
);
