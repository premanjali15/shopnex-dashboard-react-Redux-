import React, { Component } from 'react';
import { FuseAnimate, FusePageCarded, FuseChipSelect } from '@fuse';
import { withStyles, Typography, TextField, Button, Icon, CircularProgress, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import withReducer from 'app/store/withReducer';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import * as Actions from '../../store/actions';
import reducer from '../../store/reducers';

const styles = () => ({
	prdctCard: {
		'&:hover': {
			'& $deleteIcon': {
				opacity: 1
			}
		}
	},
	deleteIcon: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 24,
		height: 24,
		opacity: 0,
		cursor: 'pointer',
		backgroundColor: 'rgba(0,0,0,0.7)',
		borderRadius: 12,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

class InstagramPost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: null
		};
	}

	componentDidMount() {
		this.props.setSearchedInstaProductsLoader(true);
		this.props.getSearchedInstaProducts('');

		let postId = this.props.match.params.postId;
		this.props.setInstaPostLoader(true);
		if (postId === 'new') {
			this.props.newInstaPost(this.props.match.params.sectionId);
		} else {
			this.props.getInstaPost(this.props.match.params.postId);
		}
	}

	componentDidUpdate(prevProps) {
		if ((!this.state.form && this.props.data) || prevProps.data !== this.props.data) {
			this.setState({ form: this.props.data });
		}
		if (this.props.savingInstaPost === 'saved') {
			this.props.setSaveInstaPostLoader(false);
		}
	}

	handleChange = (event) => {
		let { form } = this.state;
		this.setState({
			form: { ...form, [event.target.name]: event.target.value }
		});
	};

	searchProducts = (inputValue) => {
		if (inputValue !== '') {
			this.props.setSearchedInstaProductsLoader(true);
			this.props.getSearchedInstaProducts(inputValue);
		}
	};

	handleProductChange = (value) => {
		if (value && value.length > 0) {
			let { products } = this.state.form;
			products = products ? products : [];
			let product = value[0];
			let obj = {
				id: product.value,
				name: product.label,
				image: product.image,
				url: product.url
			};
			products.push(obj);
			this.setState({
				form: {
					...this.state.form,
					products: products
				}
			});
		}
	};

	removeProduct = (product) => {
		let products = this.state.form.products ? this.state.form.products : [];
		let filtered = products.filter(function(item) {
			return item.id !== product.id;
		});
		this.setState({
			form: {
				...this.state.form,
				products: filtered
			}
		});
	};

	canBeSubmitted() {
		const { post_url, section } = this.state.form;
		let showSave;
		if (post_url && post_url !== '' && section !== undefined && section !== null) showSave = true;
		else showSave = false;
		return showSave;
	}

	saveInstaPost = () => {
		this.props.setSaveInstaPostLoader(true);
		this.props.saveInstaPost(this.state.form);
	};

	render() {
		const { classes, loading, loadingPrdcts, products, savingInstaPost } = this.props;
		const { form } = this.state;

		let suggestions = [];
		if (products && products.results) {
			suggestions = products.results.map((product) => ({
				value: product.id,
				label: product.name,
				image: product.top_image,
				url: product.get_absolute_url
			}));
		}

		if (form && form.products && form.products.length > 0) {
			for (let i = 0; i < form.products.length; i++) {
				suggestions = suggestions.filter(function(item) {
					return item.value !== form.products[i].id;
				});
			}
		}

		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					!loading &&
					form && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to={'/app/instagram/' + form.section}
									>
										<Icon className="mr-4 text-24">arrow_back</Icon>
										Instagram Section
									</Typography>
								</FuseAnimate>
								<div className="flex flex-col min-w-0">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.author ? form.author : ''}
										</Typography>
									</FuseAnimate>
								</div>
							</div>

							<div className="flex flex-1" />

							<div className="flex items-center pl-24">
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									onClick={this.saveInstaPost}
									disabled={
										!this.canBeSubmitted() || (savingInstaPost !== 'saved' && savingInstaPost)
									}
								>
									{savingInstaPost !== 'saved' && savingInstaPost ? 'Saving...' : 'Save'}
								</Button>
							</div>
						</div>
					)
				}
				content={
					<div className="w-full flex flex-col">
						{loading && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loading &&
						form && (
							<div className="p-32 w-full flex flex-row flex-wrap">
								<div className="w-2/3">
									<TextField
										autoFocus
										error={!form.post_url}
										margin="dense"
										id="name"
										name="post_url"
										label="Post URL"
										type="name"
										className="mb-20"
										variant="outlined"
										fullWidth
										required
										onChange={this.handleChange}
										value={form.post_url}
									/>
									<TextField
										margin="dense"
										id="name"
										name="author"
										label="Author"
										type="name"
										className="mb-32"
										variant="outlined"
										onChange={this.handleChange}
										value={form.author}
										fullWidth
									/>
									<TextField
										className="mb-32"
										id="description"
										name="description"
										onChange={this.handleChange}
										label="Description"
										type="text"
										value={form.description}
										multiline
										rows={5}
										variant="outlined"
										fullWidth
									/>

									<div className={classes.root}>
										<FuseChipSelect
											className={'w-full mb-12'}
											isClearable={false}
											isLoading={loadingPrdcts}
											value={null}
											onInputChange={this.searchProducts}
											onChange={this.handleProductChange}
											placeholder="Type Product ID, Name or SKU to search"
											textFieldProps={{
												label: 'Add Products',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={suggestions}
											isMulti
										/>
									</div>
								</div>
								<div className="w-1/3">
									{form.post_url &&
									form.post_url !== '' && (
										<div className="flex w-full justify-center mt-8">
											<img
												src={form.post_url + 'media/?size=m'}
												alt=""
												style={{ maxWidth: '250px' }}
											/>
										</div>
									)}
								</div>

								{form.products &&
								form.products.length > 0 && (
									<div className="w-full mt-20 flex flex-row flex-wrap">
										{form.products.map((prdct, index) => (
											<div key={index} className="py-12 pr-16" style={{ width: 150 }}>
												<Paper
													className={classNames(
														'flex flex-col rounded-none pointer relative',
														classes.prdctCard
													)}
												>
													<img src={prdct.image} alt="" className="w-full" />
													<p className="px-8 py-4 text-14">{prdct.name}</p>

													<div className={classes.deleteIcon}>
														<Icon
															className="text-20 text-white"
															onClick={() => this.removeProduct(prdct)}
														>
															close
														</Icon>
													</div>
												</Paper>
											</div>
										))}
									</div>
								)}
							</div>
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
			newInstaPost: Actions.newInstaPost,

			getInstaPost: Actions.getInstaPost,
			setInstaPostLoader: Actions.setInstaPostLoader,

			saveInstaPost: Actions.saveInstaPost,
			setSaveInstaPostLoader: Actions.setSaveInstaPostLoader,

			setSearchedInstaProductsLoader: Actions.setSearchedInstaProductsLoader,
			getSearchedInstaProducts: Actions.getSearchedInstaProducts
		},
		dispatch
	);
}

function mapStateToProps({ instagramSectionApp }) {
	return {
		data: instagramSectionApp.instagrampost.instagrampost,
		loading: instagramSectionApp.instagrampost.loading,
		savingInstaPost: instagramSectionApp.instagrampost.savingInstaPost,
		products: instagramSectionApp.instagrampost.searchedInstaProducts,
		loadingPrdcts: instagramSectionApp.instagrampost.loadingSearchedInstaPrdcts
	};
}

export default withReducer('instagramSectionApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(InstagramPost)))
);
