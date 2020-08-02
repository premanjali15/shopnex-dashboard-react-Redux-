import React, { Component } from 'react';
import { FusePageCarded, FuseAnimate } from '@fuse';
import withReducer from 'app/store/withReducer';
import { Button, Icon, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import reducer from '../../store/reducers';
import VideoSectionTable from './VideoSectionTable';

class VideoSection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addNew: false,
			refresh: false,
			title: ''
		};
	}
	handleOpen = () => {
		this.setState({ addNew: true });
	};
	handleClose = () => {
		this.setState({ addNew: false });
	};
	refreshData = () => {
		this.setState({ refresh: true });
	};
	setRefreshValue = () => {
		this.setState({ refresh: false });
	};
	updateTitle = (title) => {
		this.setState({ title });
	};
	render() {
		const { title } = this.state;

		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/app/videos"
								>
									<Icon className="mr-4 text-20">arrow_back</Icon>
									Video Sections
								</Typography>
							</FuseAnimate>
							<div className="flex flex-col min-w-0">
								<FuseAnimate animation="transition.slideLeftIn" delay={300}>
									<Typography className="text-16 sm:text-20 truncate">{title}</Typography>
								</FuseAnimate>
							</div>
						</div>

						<div className="flex flex-1" />

						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button className="whitespace-no-wrap" variant="contained" onClick={this.handleOpen}>
								<span className="hidden sm:flex">Add New Video</span>
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
					<VideoSectionTable
						addNew={this.state.addNew}
						handleClose={this.handleClose}
						refresh={this.state.refresh}
						setRefreshValue={this.setRefreshValue}
						updateTitle={this.updateTitle}
					/>
				}
				innerScroll
			/>
		);
	}
}
export default withReducer('videoSectionApp', reducer)(VideoSection);
