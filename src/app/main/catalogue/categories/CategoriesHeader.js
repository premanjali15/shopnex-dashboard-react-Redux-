import React, { Component } from 'react';
import { Button, Icon, Typography, MuiThemeProvider, Paper, Input } from '@material-ui/core';
import { FuseAnimate } from '@fuse';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

class CategoriesHeader extends Component {
	componentDidMount() {
		this.props.setSearchText('');
	}
	render() {
		return (
			<div className="flex flex-1 w-full items-center justify-between">
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32 mr-0 sm:mr-12">shopping_basket</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography className="hidden sm:flex" variant="h6">
							Categories
						</Typography>
					</FuseAnimate>
				</div>

				<div className="flex flex-1 items-center justify-center px-12">
					<MuiThemeProvider theme={this.props.mainTheme}>
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
									value={this.props.searchText}
									inputProps={{
										'aria-label': 'Search'
									}}
									onChange={(e) => this.props.setSearchText(e.target.value)}
								/>
							</Paper>
						</FuseAnimate>
					</MuiThemeProvider>
				</div>

				<FuseAnimate animation="transition.slideRightIn" delay={300}>
					<Button className="whitespace-no-wrap" variant="contained" onClick={this.props.handleOpen}>
						<span className="hidden sm:flex">Add New Category</span>
						<span className="flex sm:hidden">New</span>
					</Button>
				</FuseAnimate>

				<div className="flex items-center pl-24">
					<Button className="whitespace-no-wrap" variant="contained" onClick={this.props.refreshData}>
						<Icon className="text-24 mr-4">refresh</Icon>
						<span className="hidden sm:flex">Refresh</span>
					</Button>
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setSearchText: Actions.setCategoriesSearchText
		},
		dispatch
	);
}

function mapStateToProps({ categoriesApp, fuse }) {
	return {
		searchText: categoriesApp.categories.searchText,
		mainTheme: fuse.settings.mainTheme
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesHeader);
