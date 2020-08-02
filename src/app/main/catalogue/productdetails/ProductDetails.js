import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles/index';
import { Icon, Input, Paper, Typography, Button, Card } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import classNames from 'classnames';
import { FuseAnimate, FuseAnimateGroup } from '@fuse';
import _ from '@lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

const styles = (theme) => ({
	root: {
		width: '100%'
	},
	card: {},
	cardHeader: {
		backgroundColor: theme.palette.grey[800],
		color: theme.palette.getContrastText(theme.palette.grey[800])
	},
	header: {
		background: "url('/assets/images/backgrounds/dark-material-bg.jpg') no-repeat",
		backgroundSize: 'cover',
		color: '#fff'
	},
	content: {},
	panel: {
		margin: 0,
		borderWidth: '1px 1px 0 1px',
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		'&:first-child': {
			borderRadius: '16px 16px 0 0'
		},
		'&:last-child': {
			borderRadius: '0 0 16px 16px',
			borderWidth: '0 1px 1px 1px'
		}
	},
	deleteBtn: {
		backgroundColor: red[600],
		'&:hover': {
			backgroundColor: red[800]
		}
	},
	w280: {
		maxWidth: 280
	},
	h320: {
		height: 320
	},
	imgClass: {
		maxHeight: 220,
		objectFit: 'contain'
	}
});

class ProductDetails extends Component {
	state = {
		data: [],
		expanded: null,
		searchID: '',
		idEntered: false
	};

	toogleExpansion = (panel) => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false
		});
	};

	searchProduct = (id) => {
		this.setState({ idEntered: true });
		this.props.getSearchedProduct(id);
	};
	render() {
		const { classes, searchedProduct } = this.props;
		const { searchID, idEntered } = this.state;
		console.log(idEntered, searchID);
		console.log(searchedProduct);

		return (
			<div className={classNames(classes.root, '')}>
				<div
					className={classNames(
						classes.header,
						'flex flex-col items-center justify-center text-center p-8 sm:p-24 h-280'
					)}
				>
					<FuseAnimate animation="transition.slideUpIn" duration={400} delay={100}>
						<Typography color="inherit" className="text-36 sm:text-56 font-light">
							Product Details
						</Typography>
					</FuseAnimate>

					<FuseAnimate duration={400} delay={600}>
						<Typography
							variant="subtitle1"
							color="inherit"
							className="opacity-75 mt-8 sm:mt-16 mx-auto max-w-512"
						>
							Enter Product ID to search
						</Typography>
					</FuseAnimate>

					<Paper className={'flex items-center h-56 w-full max-w-md mt-16 sm:mt-32'} elevation={1}>
						<Input
							placeholder="Enter Product ID"
							className="px-16"
							disableUnderline
							fullWidth
							inputProps={{
								'aria-label': 'Search'
							}}
							value={searchID}
							onChange={(event) => {
								this.setState({ searchID: event.target.value });
							}}
							onKeyPress={(event) => {
								if (event.key === 'Enter') {
									this.searchProduct(searchID);
								}
							}}
							onPaste={(e) => this.searchProduct(searchID + e.clipboardData.getData('Text'))}
						/>
						<Icon
							color="action"
							className="m-15 text-32 cursor-pointer"
							onClick={() => {
								this.searchProduct(searchID);
							}}
						>
							search
						</Icon>
					</Paper>
				</div>
				{idEntered &&
				searchedProduct !== undefined &&
				searchedProduct !== null && (
					<div className={classNames(classes.content)}>
						<div className="w-250 mx-auto py-24">
							<FuseAnimateGroup
								enter={{
									animation: 'transition.slideUpBigIn'
								}}
							>
								<Card className={classNames(classes.root, classes.w280, 'mx-auto')}>
									<div className="relative p-12 flex flex-row items-center justify-between">
										<div className="flex flex-col h320">
											{searchedProduct.top_image ? (
												<img
													src={searchedProduct.top_image}
													alt={searchedProduct.name}
													className={classes.imgClass}
												/>
											) : (
												<img
													className="w-full block rounded"
													src="assets/images/ecommerce/product-image-placeholder.png"
													alt={searchedProduct.name}
												/>
											)}
											<Typography className="h2 sm:h2 text-center">
												{searchedProduct.name}
											</Typography>
											<div className="text-center p-4">
												<Button
													variant="contained"
													className={classNames(classes.deleteBtn, 'text-white')}
												>
													Delete
												</Button>
											</div>
										</div>
									</div>
								</Card>
							</FuseAnimateGroup>
						</div>
					</div>
				)}
				{idEntered &&
				(searchedProduct === undefined || searchedProduct === null) && (
					<div>
						<div>
							<h1>There are no products with the id you're searching...</h1>
							<Icon color="action" className="m-15 text-32 cursor-pointer">
								search
							</Icon>
						</div>
					</div>
				)}
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getSearchedProduct: Actions.getSearchedProduct
		},
		dispatch
	);
}

function mapStateToProps({ productDetailsApp }) {
	return {
		searchedProduct: productDetailsApp.productdetails.SearchedProduct
	};
}

export default withReducer('productDetailsApp', reducer)(
	withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(ProductDetails))
);
