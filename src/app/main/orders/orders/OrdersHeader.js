import React from 'react';
import { Paper, Input, Icon, Typography, MuiThemeProvider, Button } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import * as Actions from '../store/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const OrdersHeader = (props) => {
	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<FuseAnimate animation="transition.expandIn" delay={300}>
					<Icon className="text-32 mr-0 sm:mr-12">shopping_basket</Icon>
				</FuseAnimate>

				<FuseAnimate animation="transition.slideLeftIn" delay={300}>
					<Typography className="hidden sm:flex" variant="h6">
						Orders
					</Typography>
				</FuseAnimate>
			</div>

			<div className="flex flex-1 items-center justify-center pr-0 pl-12 sm:px-12">
				<MuiThemeProvider theme={props.mainTheme}>
					<FuseAnimate animation="transition.slideDownIn" delay={300}>
						<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
							<Icon className="mr-8" color="action">
								search
							</Icon>

							<Input
								placeholder="Search"
								className="flex flex-1"
								disableUnderline
								fullWidth
								value={props.searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={props.setSearchText}
							/>
						</Paper>
					</FuseAnimate>
				</MuiThemeProvider>
			</div>

			{/* <FuseAnimate animation="transition.slideRightIn" delay={300}>
				<div className="pr-24">
					<FormControl>
						<Select value={props.selectedTab} onChange={props.handleChange}>
							<MenuItem value="created">Created</MenuItem>
							<MenuItem value="placed">Placed</MenuItem>
							<MenuItem value="confirmed">Confirmed</MenuItem>
							<MenuItem value="shipped">Shipped</MenuItem>
							<MenuItem value="delivered">Delivered</MenuItem>
							<MenuItem value="canceled">Canceled</MenuItem>
						</Select>
					</FormControl>
				</div>
			</FuseAnimate> */}
			<div className="flex items-center pl-24">
				<Button className="whitespace-no-wrap" variant="contained" onClick={props.refreshData}>
					<Icon className="text-24 mr-4">refresh</Icon>
					<span className="hidden sm:flex">Refresh</span>
				</Button>
			</div>
		</div>
	);
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setSearchText: Actions.setOrdersSearchText
		},
		dispatch
	);
}

function mapStateToProps({ ordersApp, fuse }) {
	return {
		searchText: ordersApp.orders.searchText,
		mainTheme: fuse.settings.mainTheme
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersHeader);
