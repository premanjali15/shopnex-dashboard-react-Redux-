import React, { Component } from 'react';
import { Paper, Button, Input, Icon, Typography, MuiThemeProvider } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';

class ProductsHeader extends Component {
	componentDidMount() {
		this.props.setSearchText('');
	}

	handleEnter = (e) => {
		if (e.key === 'Enter') {
			this.props.handleEnter();
		}
	};
	render() {
		const { setSearchText, searchText, mainTheme, refreshData, openPrdctTypeDialog } = this.props;
		return (
			<div className="flex flex-1 w-full items-center justify-between">
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32 mr-0 sm:mr-12">shopping_basket</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography className="hidden sm:flex" variant="h6">
							Products
						</Typography>
					</FuseAnimate>
				</div>

				<div className="flex flex-1 items-center justify-center px-12">
					<MuiThemeProvider theme={mainTheme}>
						<FuseAnimate animation="transition.slideDownIn" delay={300}>
							<Paper className="flex items-center w-full max-w-512 px-8 py-4 rounded-8" elevation={1}>
								<Icon className="mr-8" color="action">
									search
								</Icon>

								<Input
									placeholder="Press Enter to search"
									className="flex flex-1"
									disableUnderline
									fullWidth
									value={searchText}
									inputProps={{
										'aria-label': 'Search'
									}}
									onChange={(e) => setSearchText(e.target.value)}
									onKeyPress={this.handleEnter}
								/>
							</Paper>
						</FuseAnimate>
					</MuiThemeProvider>
				</div>

				<FuseAnimate animation="transition.slideRightIn" delay={300}>
					<Button onClick={openPrdctTypeDialog} className="whitespace-no-wrap" variant="contained">
						<span className="hidden sm:flex">Add New Product</span>
						<span className="flex sm:hidden">New</span>
					</Button>
				</FuseAnimate>

				<div className="flex items-center pl-24">
					<Button className="whitespace-no-wrap" variant="contained" onClick={refreshData}>
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
			setSearchText: Actions.setProductsSearchText
		},
		dispatch
	);
}

function mapStateToProps({ productsApp, fuse }) {
	return {
		searchText: productsApp.products.searchText,
		mainTheme: fuse.settings.mainTheme
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsHeader);
