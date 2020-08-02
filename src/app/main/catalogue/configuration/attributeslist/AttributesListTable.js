import React, { Component } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	withStyles,
	TableRow,
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
	TextField,
	DialogActions
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import AttributesListTableHead from './AttributesListTableHead';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';

import Pagination from '../../../components/pagination/Pagination';

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

class AttributesListTable extends Component {
	state = {
		order: 'asc',
		orderBy: null,
		selected: [],
		data: null,
		newAttribute: {
			name: '',
			slug: '',
			product_type: null,
			product_variant_type: null
		},
		loadingData: false
	};

	componentDidMount() {
		this.props.setAttributesLoader(true);
		this.props.getAttributes();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.creatingAttr === 'created') {
			this.props.setCreateAttributeLoader(false);
			this.handlePropsClose();
		}
	}

	getFilteredArray = (data, searchText) => {
		if (searchText.length === 0) {
			return data;
		}
		return _.filter(data, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
	};

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}
		this.setState({
			order,
			orderBy
		});
	};

	handleClick = (item) => {
		this.props.history.push('/app/configuration/attributes/' + item.id);
	};

	handlePropsClose = () => {
		this.setState({
			newAttribute: {
				name: '',
				slug: '',
				product_type: null,
				product_variant_type: null
			}
		});
		this.props.handleClose();
	};

	createAttribute = () => {
		this.props.setCreateAttributeLoader(true);
		this.props.createAttribute(this.state.newAttribute);
	};

	setPaginationLoader = (value) => {
		this.setState({ loadingData: value });
	};

	setPaginationData = (data) => {
		this.setState({ data });
	};

	render() {
		const { order, orderBy, newAttribute, loadingData, data } = this.state;
		const { loading, addNew, creatingAttr, classes } = this.props;

		return (
			<div className="w-full flex flex-col">
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
								<AttributesListTableHead
									order={order}
									orderBy={orderBy}
									onSelectAllClick={this.handleSelectAllClick}
									onRequestSort={this.handleRequestSort}
									rowCount={data.results.length}
								/>

								<TableBody>
									{_.orderBy(
										data.results,
										[
											(o) => {
												if (orderBy === 'price') {
													return parseInt(o[orderBy]);
												} else {
													return o[orderBy];
												}
											}
										],
										[ order ]
									).map((attribute) => {
										return (
											<TableRow
												className="h-64 cursor-pointer"
												hover
												role="checkbox"
												tabIndex={-1}
												key={attribute.id}
												onClick={() => this.handleClick(attribute)}
											>
												<TableCell component="th" scope="row" align="left">
													{attribute.id}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{attribute.name}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{attribute.product_type_name ? attribute.product_type_name : 'NA'}
												</TableCell>

												<TableCell component="th" scope="row" align="center">
													{attribute.values.length > 0 ? (
														<React.Fragment>
															{attribute.values.map((value, index) => {
																return (
																	<React.Fragment key={index}>
																		{index !== attribute.values.length - 1 ? (
																			value.name + ', '
																		) : (
																			value.name
																		)}
																	</React.Fragment>
																);
															})}
														</React.Fragment>
													) : (
														<p>NA</p>
													)}
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
								currentUrl={Actions.attributesURl}
							/>
						</FuseScrollbars>

						<Dialog open={addNew} aria-labelledby="form-dialog-title" fullWidth>
							<DialogTitle id="form-dialog-title">Create Attribute</DialogTitle>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									id="name"
									label="Name"
									type="name"
									fullWidth
									value={newAttribute.name}
									onChange={(e) => {
										this.setState({
											newAttribute: { ...this.state.newAttribute, name: e.target.value }
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
									value={newAttribute.slug}
									onChange={(e) => {
										this.setState({
											newAttribute: { ...this.state.newAttribute, slug: e.target.value }
										});
									}}
									variant="outlined"
									required
								/>
							</DialogContent>
							<DialogActions>
								<Button color="primary" onClick={this.handlePropsClose}>
									Cancel
								</Button>
								<Button
									onClick={this.createAttribute}
									color="primary"
									disabled={
										newAttribute.name === '' ||
										newAttribute.slug === '' ||
										(creatingAttr !== 'created' && creatingAttr)
									}
								>
									{creatingAttr !== 'created' && creatingAttr ? 'Saving...' : 'Save'}
								</Button>
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
			getAttributes: Actions.getAttributes,
			setAttributesLoader: Actions.setAttributesLoader,
			createAttribute: Actions.createAttribute,
			setCreateAttributeLoader: Actions.setCreateAttributeLoader
		},
		dispatch
	);
}

function mapStateToProps({ attributesApp }) {
	return {
		data: attributesApp.attributes.data,
		searchText: attributesApp.attributes.searchText,
		loading: attributesApp.attributes.loading,
		creatingAttr: attributesApp.attributes.creatingAttr
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(AttributesListTable))
);
