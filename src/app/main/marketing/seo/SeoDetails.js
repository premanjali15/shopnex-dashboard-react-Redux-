import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple, FuseChipSelect } from '@fuse';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
	Paper,
	InputBase,
	CircularProgress,
	Table,
	TableRow,
	TableHead,
	TableBody,
	TableCell
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Icon from '@material-ui/core/Icon';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';

const styles = () => ({
	layoutRoot: {},
	bgGrey: { backgroundColor: '#EBEBEB' },
	greenCircle: {
		width: '18px',
		height: '18px',
		backgroundColor: 'green',
		borderRadius: '50%',
		marginRight: '10px'
	},
	link: {
		cursor: 'pointer',
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'none !important'
		}
	}
});

class Seo extends Component {
	state = {
		value: 0,
		homeData: null,
		pages: null,
		openPageDialogue: false,
		selectedPage: null,
		pageType: null,

		products: null,
		searchText: ''
	};

	componentDidMount() {
		this.props.setSeoHomeDataLoader(true);
		this.props.getSeoHomeData();
	}

	componentDidUpdate(prevProps) {
		if ((!this.state.homeData && this.props.homeData) || prevProps.homeData !== this.props.homeData) {
			this.setState({ homeData: this.props.homeData });
		}
		if ((!this.state.pages && this.props.pages) || prevProps.pages !== this.props.pages) {
			this.setState({ pages: this.props.pages });
		}
		if ((!this.state.products && this.props.products) || prevProps.products !== this.props.products) {
			this.setState({ products: this.props.products });
		}
		if (this.props.updatingHomeData === 'updated') {
			this.props.setUpdateSeoHomeDataLoader(false);
		}
		if (this.props.updatingPage === 'updated') {
			this.props.setUpdateSeoPageLoader(false);
			this.handlePageDialogClose();
		}
	}

	handleTabChange = (event, newValue) => {
		if (newValue === 0 && (this.state.homeData === undefined || this.state.homeData === null)) {
			this.props.setSeoHomeDataLoader(true);
			this.props.getSeoHomeData();
		}
		if (newValue === 1 && !this.state.pages) {
			this.props.setSeoPagesLoader(true);
			this.props.getSeoPages();
		}
		if (newValue === 2 && !this.state.products) {
			this.searchProducts(this.state.searchText);
		}
		this.setState({ value: newValue });
	};

	// home related functions
	handleChange = (e) => {
		this.setState({
			homeData: { ...this.state.homeData, [e.target.name]: e.target.value }
		});
	};
	saveHomeData = () => {
		let { homeData } = this.state;
		let obj = {
			seo_title: homeData.ef_title,
			seo_description: homeData.ef_desc
		};
		this.props.setUpdateSeoHomeDataLoader(true);
		this.props.updateSeoHomeData(obj);
	};

	// pages related functions
	handlePageDialogOpen = (page, type) => {
		this.setState({ openPageDialogue: true, selectedPage: page, pageType: type });
	};
	handlePageDialogClose = () => {
		this.setState({ openDialogue: false, selectedPage: null, pageType: null });
	};
	handlePageChange = (e) => {
		this.setState({ selectedPage: { ...this.state.selectedPage, [e.target.name]: e.target.value } });
	};
	handleChipChange = (value) => {
		let { keywords } = this.state.selectedPage;
		if (value.length > keywords.length) {
			keywords.push(value[value.length - 1].value);
			this.setState({ selectedPage: { ...this.state.selectedPage, keywords } });
		}
		if (value.length < keywords.length) {
			for (let i = 0; i < keywords.length; i++) {
				let count = 0;
				for (let j = 0; j < value.length; j++) {
					if (keywords[i] === value[j].id) {
						break;
					} else count++;
				}
				if (count === value.length) {
					var filtered = keywords.filter(function(item) {
						return item !== keywords[i];
					});
					this.setState({ selectedPage: { ...this.state.selectedPage, keywords: filtered } });
					break;
				}
			}
		}
	};
	updateSeoPage = () => {
		let { selectedPage, pageType } = this.state;
		this.props.setUpdateSeoPageLoader(true);
		this.props.updateSeoPage(selectedPage, pageType);
	};

	// product related functions
	handleSearchChange = (e) => {
		this.setState({ searchText: e.target.value });
		if (e.target.value.length > 2) {
			this.searchProducts(e.target.value);
		}
	};
	searchProducts = (text) => {
		this.props.setSeoProductsLoader(true);
		this.props.getSeoProducts(text);
	};
	handleProductClick = (product) => {
		this.props.history.push('/app/seoproduct/' + product.id);
	};

	render() {
		const { classes, loadingHomeData, updatingHomeData, loadingPages, updatingPage, loadingProducts } = this.props;
		const { value, homeData, pages, selectedPage, openPageDialogue, products, searchText } = this.state;

		let selectedKeywords = [];
		if (selectedPage && selectedPage.keywords) {
			for (let i = 0; i < selectedPage.keywords.length; i++) {
				let item = selectedPage.keywords[i];
				let obj = {
					value: item,
					label: item,
					id: item
				};
				selectedKeywords.push(obj);
			}
		}

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot,
					header: 'h-64 min-h-64 d-flex items-center',
					content: 'bg-white'
				}}
				header={
					<div className="ml-72 flex items-center flex-row">
						<h1 className="text-20 font-600">Marketing</h1>
						<Icon className="mx-8 text-32">chevron_right</Icon>
						<h1 className="text-18 font-600">SEO</h1>
					</div>
				}
				content={
					<div className="p-32">
						<p className="text-18 font-600 my-20" style={{ color: '#303643' }}>
							SEARCH APPEARANCE
						</p>
						<div className={classes.root}>
							<Tabs
								value={value}
								onChange={this.handleTabChange}
								indicatorColor="secondary"
								textColor="primary"
								variant="standard"
								centered
								className={classNames('py-8', classes.bgGrey)}
							>
								<Tab
									label="Home"
									className={classNames('mx-72', value === 0 ? 'bg-white shadow' : classes.bgGrey)}
								/>
								<Tab
									label="Pages"
									className={classNames('mx-72', value === 1 ? 'bg-white shadow' : classes.bgGrey)}
								/>
								<Tab
									label="Items"
									className={classNames('mx-72', value === 2 ? 'bg-white shadow' : classes.bgGrey)}
								/>
							</Tabs>

							{/* home */}
							{value === 0 && (
								<React.Fragment>
									{loadingHomeData ? (
										<div className="text-center pt-72">
											<CircularProgress color="secondary" />
										</div>
									) : (
										<React.Fragment>
											{homeData && (
												<div className="w-full px-4">
													<Paper className="border-1 mt-32 py-16 px-20 w-full rounded-none">
														<h6 className="font-600 text-16" style={{ color: '#719FE7' }}>
															{homeData.ef_title}
														</h6>
														<h5
															className="font-600 text-15 my-12"
															style={{ color: '#135E31' }}
														>
															{window.location.origin}
														</h5>
														<p className="text-14" style={{ color: '#313131' }}>
															{homeData.ef_desc}
														</p>
													</Paper>

													<div className="mt-32">
														<h6
															className="font-600 text-16"
															style={{ color: '#313131', opacity: 0.8 }}
														>
															SEO TITLE
														</h6>
														<TextField
															id="standard-full-width"
															className="mt-8"
															placeholder="%S"
															fullWidth
															margin="normal"
															InputLabelProps={{
																shrink: true
															}}
															name="ef_title"
															value={homeData.ef_title ? homeData.ef_title : ''}
															onChange={this.handleChange}
														/>
														<p
															className="font-500 text-14"
															style={{
																color: '#313131',
																opacity: 0.65
															}}
														>
															The title appears in browser tabs and search engine results.{' '}
															<Link to="/" className={classes.link}>
																Learn more
															</Link>
														</p>
													</div>

													<div className="mt-32">
														<h6
															className="font-600 text-16"
															style={{ color: '#313131', opacity: 0.8 }}
														>
															SEO SITE DESCRIPTION
														</h6>
														<TextField
															id="standard-full-width"
															className="mt-12"
															placeholder="Enter Description"
															fullWidth
															margin="normal"
															InputLabelProps={{
																shrink: true
															}}
															multiline
															rows={3}
															name="ef_desc"
															value={homeData.ef_desc ? homeData.ef_desc : ''}
															onChange={this.handleChange}
														/>
														<p
															className="font-500 text-14"
															style={{
																color: '#313131',
																opacity: 0.65
															}}
														>
															A short description of your site. It should be between 50
															and 300 characters. Length displayed varies by search
															engines.{' '}
															<Link to="/" className={classes.link}>
																Learn more
															</Link>
														</p>
													</div>

													<div className="flex items-center justify-end mt-16">
														<Button
															variant="contained"
															color="primary"
															onClick={this.saveHomeData}
															disabled={
																updatingHomeData && updatingHomeData !== 'updated'
															}
														>
															{updatingHomeData && updatingHomeData !== 'updated' ? (
																'Updating...'
															) : (
																'Update'
															)}
														</Button>
													</div>
												</div>
											)}
										</React.Fragment>
									)}
								</React.Fragment>
							)}

							{/* pages */}
							{value === 1 && (
								<React.Fragment>
									{loadingPages ? (
										<div className="text-center pt-72">
											<CircularProgress color="secondary" />
										</div>
									) : (
										<div className="mt-32">
											{pages &&
												pages.category &&
												pages.category.map((item, index) => (
													<Paper
														className="border-1 mt-20 py-12 px-20 w-full rounded-none cursor-pointer"
														key={index}
														onClick={() => this.handlePageDialogOpen(item, 'category')}
													>
														<h6 className="font-600 text-16" style={{ color: '#719FE7' }}>
															{item.seo_title}
														</h6>
														<h5
															className="font-600 text-15 my-8"
															style={{ color: '#135E31' }}
														>
															{window.location.origin + '/' + item.url}
														</h5>
														<p className="text-14" style={{ color: '#313131' }}>
															{item.seo_description}
														</p>
													</Paper>
												))}
											{pages &&
												pages.collection &&
												pages.collection.map((item, index) => (
													<Paper
														className="border-1 mt-20 py-12 px-20 w-full rounded-none cursor-pointer"
														key={index}
														onClick={() => this.handlePageDialogOpen(item, 'collection')}
													>
														<h6 className="font-600 text-16" style={{ color: '#719FE7' }}>
															{item.seo_title}
														</h6>
														<h5
															className="font-600 text-15 my-8"
															style={{ color: '#135E31' }}
														>
															{window.location.origin + '/' + item.url}
														</h5>
														<p className="text-14" style={{ color: '#313131' }}>
															{item.seo_description}
														</p>
													</Paper>
												))}
										</div>
									)}
								</React.Fragment>
							)}

							{/* products */}
							{value === 2 && (
								<div className="mt-32">
									<React.Fragment>
										<Paper className="w-full flex flex-row items-center justify-between">
											<InputBase
												placeholder="Search Products Or Enter SKU"
												inputProps={{ 'aria-label': 'search google maps' }}
												className="flex w-full h-48 px-20"
												value={searchText}
												onChange={(e) => this.handleSearchChange(e)}
											/>
											<Button
												variant="contained"
												color="secondary"
												className="py-12"
												onClick={() => this.searchProducts(searchText)}
											>
												<Icon className="mx-8">search</Icon>
												Search
											</Button>
										</Paper>

										{loadingProducts ? (
											<div className="text-center pt-72">
												<CircularProgress color="secondary" />
											</div>
										) : (
											<div>
												{products &&
												products.results &&
												products.results.length > 0 && (
													<div className="mt-40">
														<Table
															aria-labelledby="tableTitle"
															className="mt-4 border-l-1 border-r-1"
														>
															<TableHead>
																<TableRow
																	className="h-52 border-t-1"
																	style={{ backgroundColor: '#F8F8F8' }}
																>
																	<TableCell align="left">
																		<p className="text-16 font-600 text-black">
																			Product Name
																		</p>
																	</TableCell>
																	<TableCell align="center">
																		<p className="text-16 font-600 text-black">
																			ID
																		</p>
																	</TableCell>
																	<TableCell align="right">
																		<p className="text-16 font-600 text-black">
																			Marked
																		</p>
																	</TableCell>
																</TableRow>
															</TableHead>

															<TableBody>
																{products.results.map((item, index) => (
																	<TableRow
																		className="h-52 cursor-pointer"
																		role="checkbox"
																		key={index}
																		hover
																		onClick={() => this.handleProductClick(item)}
																	>
																		<TableCell
																			component="th"
																			scope="row"
																			align="left"
																			className="flex flex-row items-center justify-start py-8"
																		>
																			<img
																				src={item.image}
																				alt=""
																				className="h-72"
																			/>
																			<p className="m-0 text-16 ml-12 font-500">
																				{item.name}
																			</p>
																		</TableCell>
																		<TableCell
																			component="th"
																			scope="row"
																			align="center"
																		>
																			{item.id}
																		</TableCell>
																		<TableCell
																			component="th"
																			scope="row"
																			align="right"
																		>
																			<div
																				style={{
																					width: 20,
																					height: 20,
																					borderRadius: '50%',
																					backgroundColor: item.marked
																						? '#3A9F96'
																						: 'red',
																					float: 'right'
																				}}
																			/>
																		</TableCell>
																	</TableRow>
																))}
															</TableBody>
														</Table>
													</div>
												)}
											</div>
										)}
									</React.Fragment>
								</div>
							)}

							{/* pages dialog */}
							{selectedPage && (
								<Dialog
									aria-labelledby="customized-dialog-title"
									open={openPageDialogue}
									maxWidth={'md'}
									fullWidth={true}
								>
									<DialogContent>
										<div className="w-full px-4">
											<div className="mt-32">
												<h6
													className="font-600 text-16"
													style={{ color: '#313131', opacity: 0.8 }}
												>
													SEARCH RESULTS PREVIEW
												</h6>

												<Paper className="py-16 px-20 w-full rounded-none mt-12">
													<h6 className="font-600 text-16" style={{ color: '#719FE7' }}>
														{selectedPage.title}
													</h6>
													<h5 className="font-600 text-15 my-12" style={{ color: '#135E31' }}>
														{window.location.origin}
													</h5>
													<p className="text-14" style={{ color: '#313131' }}>
														{selectedPage.description}
													</p>
												</Paper>
											</div>

											<div className="mt-20">
												<h6
													className="font-600 text-16"
													style={{ color: '#313131', opacity: 0.8 }}
												>
													SEO TITLE (OPTIONAL)
												</h6>
												<TextField
													id="standard-full-width"
													className="mt-8"
													placeholder="%S"
													fullWidth
													margin="normal"
													InputLabelProps={{
														shrink: true
													}}
													variant="outlined"
													name="seo_title"
													value={selectedPage.seo_title ? selectedPage.seo_title : ''}
													onChange={this.handlePageChange}
												/>
											</div>

											<div className="mt-20">
												<h6
													className="font-600 text-16"
													style={{ color: '#313131', opacity: 0.8 }}
												>
													SEO DESCRIPTION (OPTIONAL)
												</h6>
												<TextField
													id="standard-full-width"
													className="mt-8"
													placeholder="Enter Description"
													fullWidth
													margin="normal"
													InputLabelProps={{
														shrink: true
													}}
													multiline
													rows={3}
													variant="outlined"
													name="seo_description"
													value={
														selectedPage.seo_description ? selectedPage.seo_description : ''
													}
													onChange={this.handlePageChange}
												/>
											</div>
											<div className="mt-20">
												<FuseChipSelect
													className={'w-full my-16'}
													isClearable={false}
													value={selectedKeywords}
													onChange={this.handleChipChange}
													placeholder="Enter Keywords"
													textFieldProps={{
														label: 'Keywords',
														InputLabelProps: {
															shrink: true
														},
														variant: 'outlined'
													}}
													isMulti
												/>
											</div>

											<p className="text-12 font-600 mt-8" style={{ color: '#636871' }}>
												Search results typically show your SEO title and description. Your title
												is also the browser window title and matches your title formats.
												Depending on the search engine, descriptions displayed can be 50 to 300
												characters long. If you don’t add a title or description, search engines
												will use your page title and content.
											</p>
										</div>
									</DialogContent>
									<DialogActions className="p-16">
										<Button color="primary" onClick={this.handlePageDialogClose}>
											Close
										</Button>
										<Button
											color="primary"
											autoFocus
											onClick={this.updateSeoPage}
											disabled={updatingPage && updatingPage !== 'updated'}
										>
											{updatingPage && updatingPage !== 'updated' ? 'Updating...' : 'Update'}
										</Button>
									</DialogActions>
								</Dialog>
							)}
						</div>
					</div>
				}
			/>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getSeoHomeData: Actions.getSeoHomeData,
			setSeoHomeDataLoader: Actions.setSeoHomeDataLoader,

			updateSeoHomeData: Actions.updateSeoHomeData,
			setUpdateSeoHomeDataLoader: Actions.setUpdateSeoHomeDataLoader,

			getSeoPages: Actions.getSeoPages,
			setSeoPagesLoader: Actions.setSeoPagesLoader,

			updateSeoPage: Actions.updateSeoPage,
			setUpdateSeoPageLoader: Actions.setUpdateSeoPageLoader,

			getSeoProducts: Actions.getSeoProducts,
			setSeoProductsLoader: Actions.setSeoProductsLoader
		},
		dispatch
	);
}

function mapStateToProps({ seoApp }) {
	return {
		homeData: seoApp.seo.homeData,
		loadingHomeData: seoApp.seo.loadingHomeData,
		updatingHomeData: seoApp.seo.updatingHomeData,

		pages: seoApp.seo.pages,
		loadingPages: seoApp.seo.loadingPages,
		updatingPage: seoApp.seo.updatingPage,

		products: seoApp.seo.products,
		loadingProducts: seoApp.seo.loadingProducts
	};
}

export default withReducer('seoApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Seo)))
);
