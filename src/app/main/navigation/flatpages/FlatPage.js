import React, { Component } from 'react';
import { Button, TextField, Icon, Typography, CircularProgress, Paper } from '@material-ui/core';
import { FuseAnimate, FusePageCarded } from '@fuse';
import _ from '@lodash';
import Switch from 'react-switch';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

class FlatPage extends Component {
	state = {
		form: null,
		editorState: EditorState.createEmpty()
	};

	componentDidMount() {
		const params = this.props.match.params;
		const { pageId } = params;
		this.props.setFlatPageLoader(true);
		this.props.getFlatPage(pageId);
	}

	componentDidUpdate(prevProps) {
		if ((!this.state.form && this.props.flatpage) || prevProps.flatpage !== this.props.flatpage) {
			this.setState({ form: this.props.flatpage });
			let html = this.props.flatpage.content;
			let contentBlock = htmlToDraft(html);
			if (contentBlock) {
				const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
				const editorState = EditorState.createWithContent(contentState);
				this.setState({ editorState });
			}
		}
	}

	canBeSubmitted() {
		if (this.state.form !== null) {
			let { title } = this.state.form;
			let url = this.slugify(title);
			let showSave;
			if (title && title !== '' && url && url !== '') showSave = true;
			else showSave = false;
			return showSave;
		} else {
			return false;
		}
	}

	handleChange = (event, type) => {
		if (type === 'switch') {
			this.setState({
				form: _.set({ ...this.state.form }, 'registration_required', !this.state.form.registration_required)
			});
		} else {
			this.setState({
				form: _.set({ ...this.state.form }, event.target.name, event.target.value)
			});
		}
	};

	slugify(text) {
		let slug = text
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/&/g, '-and-') // Replace & with 'and'
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			.replace(/\--+/g, '-') // Replace multiple - with single -
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, ''); // Trim - from end of text
		return slug.toLowerCase();
	}

	saveFlatPage = () => {
		let page = _.clone(this.state.form);
		let html = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));

		page.url = '/' + this.slugify(page.title) + '/';
		page.content = html;

		this.props.setSaveFlatPageLoader(true);
		this.props.saveFlatPage(page);
	};

	onEditorStateChange = (editorState) => {
		this.setState({ editorState });
	};

	render() {
		const { loadingFlatpage, savingFlatpage } = this.props;
		const { form, editorState } = this.state;

		return (
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					!loadingFlatpage &&
					form && (
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Typography
										className="normal-case flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/app/flatpages"
									>
										<Icon className="mr-4 text-20">arrow_back</Icon>
										Pages
									</Typography>
								</FuseAnimate>

								<div className="flex items-center max-w-full">
									<div className="flex flex-col min-w-0">
										<FuseAnimate animation="transition.slideLeftIn" delay={300}>
											<Typography className="text-16 sm:text-20 truncate">
												{form.title && form.title !== '' ? form.title : 'Create New Page'}
											</Typography>
										</FuseAnimate>
									</div>
								</div>
							</div>
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap"
									variant="contained"
									disabled={!this.canBeSubmitted() || (savingFlatpage !== 'saved' && savingFlatpage)}
									onClick={this.saveFlatPage}
								>
									{savingFlatpage !== 'saved' && savingFlatpage ? 'Saving...' : 'Save'}
								</Button>
							</FuseAnimate>
						</div>
					)
				}
				content={
					<div className="p-32">
						{loadingFlatpage && (
							<div className="text-center pt-60">
								<CircularProgress color="secondary" />
							</div>
						)}
						{!loadingFlatpage &&
						form && (
							<div>
								<div className="flex w-full items-center justify-end">
									<p className="mb-12 text-16">Registration Required:</p>
									<Switch
										className="mx-12 mb-12"
										onChange={(e) => this.handleChange(e, 'switch')}
										checked={form.registration_required}
										id="registration_required"
										name="registration_required"
									/>
								</div>
								<div className="flex flex-row w-full">
									<TextField
										className="m-12"
										label="Page Title"
										id="title"
										name="title"
										value={form.title ? form.title : ''}
										onChange={this.handleChange}
										variant="outlined"
										fullWidth
										autoFocus
										required
									/>
									<TextField
										className="m-12"
										label="Page Url"
										id="title"
										name="title"
										value={this.slugify(form.title) ? '/' + this.slugify(form.title) + '/' : ''}
										onChange={this.handleChange}
										variant="outlined"
										fullWidth
										disabled
										required
									/>
								</div>

								<Paper className="m-12 mt-28" style={{ minHeight: '350px' }}>
									<Editor
										editorState={editorState}
										toolbarClassName="toolbarClassName"
										wrapperClassName="wrapperClassName"
										editorClassName="editorClassName"
										onEditorStateChange={this.onEditorStateChange}
									/>
								</Paper>
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
			getFlatPage: Actions.getFlatPage,
			setFlatPageLoader: Actions.setFlatPageLoader,

			saveFlatPage: Actions.saveFlatPage,
			setSaveFlatPageLoader: Actions.setSaveFlatPageLoader
		},
		dispatch
	);
}

function mapStateToProps({ flatpageApp }) {
	return {
		flatpage: flatpageApp.flatpage.flatpage,
		loadingFlatpage: flatpageApp.flatpage.loadingFlatpage,
		savingFlatpage: flatpageApp.flatpage.savingFlatpage
	};
}

export default withReducer('flatpageApp', reducer)(withRouter(connect(mapStateToProps, mapDispatchToProps)(FlatPage)));
