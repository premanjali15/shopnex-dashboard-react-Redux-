import React, { Component } from 'react';
import { Icon, Table, TableBody, TableCell, TableRow, IconButton, withStyles } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import _ from '@lodash';
import ShippingZonesTableHead from './ShippingZonesTableHead';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../../store/actions';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ShowDialog } from '../../../components/showdialog/ShowDialog';
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

class ShippingZonesTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			loadingData: false,
			openDeleteDialog: false,
			selectedZone: null
		};
	}

	componentDidMount() {
		this.props.setShippingZonesLoader(true);
		this.props.getShippingZones();
	}

	componentDidUpdate(prevProps) {
		if ((this.props.data && !this.state.data) || !_.isEqual(this.props.data, prevProps.data)) {
			this.setState({ data: this.props.data });
		}
		if (this.props.refresh) {
			this.props.setRefreshValue();
			this.componentDidMount();
		}
		if (this.props.deletingShippingZone === 'deleted') {
			this.props.setDeleteShippingZoneLoader(false);
			this.closeDeleteDialog();
		}
	}

	setPaginationLoader = (value) => {
		this.setState({ loadingData: value });
	};

	setPaginationData = (data) => {
		this.setState({ data });
	};

	handleDeleteShipping = (zone) => {
		this.setState({ openDeleteDialog: true, selectedZone: zone });
	};

	deleteShippingZone = () => {
		let id = this.state.selectedZone.id;
		this.props.setDeleteShippingZoneLoader(true);
		this.props.deleteShippingZone(id);
	};

	closeDeleteDialog = () => {
		this.setState({ openDeleteDialog: false, selectedZone: null });
	};

	render() {
		const { loading, classes, deletingShippingZone } = this.props;
		const { data, loadingData } = this.state;

		return (
			<div className="w-full flex flex-col">
				<ShowDialog
					open={this.state.openDeleteDialog}
					closeDeleteDialog={this.closeDeleteDialog}
					deleteDialogFunction={this.deleteShippingZone}
					deleting={deletingShippingZone}
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
								<ShippingZonesTableHead />

								<TableBody>
									{data.results.map((ship) => {
										return (
											<TableRow className="h-64 cursor-pointer" tabIndex={-1} key={ship.id}>
												<TableCell component="th" scope="row">
													{ship.id}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													{ship.title}
												</TableCell>

												<TableCell
													className="truncate"
													component="th"
													scope="row"
													align="center"
												>
													<IconButton
														onClick={() => {
															this.props.history.push('/app/shippingzones/' + ship.id);
														}}
													>
														<Icon>edit</Icon>
													</IconButton>
													<IconButton
														onClick={() => {
															this.handleDeleteShipping(ship);
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
									currentUrl={Actions.shippingURl}
								/>
							)}
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
			getShippingZones: Actions.getShippingZones,
			setShippingZonesLoader: Actions.setShippingZonesLoader,
			setDeleteShippingZoneLoader: Actions.setDeleteShippingZoneLoader,
			deleteShippingZone: Actions.deleteShippingZone
		},
		dispatch
	);
}

function mapStateToProps({ shippingZonesApp }) {
	return {
		data: shippingZonesApp.shippingzones.shippingZones,
		loading: shippingZonesApp.shippingzones.loading,
		deletingShippingZone: shippingZonesApp.shippingzones.deletingShippingZone
	};
}

export default withStyles(styles, { withTheme: true })(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(ShippingZonesTable))
);
