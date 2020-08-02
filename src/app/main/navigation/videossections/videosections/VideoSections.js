import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import VideoSectionsHeader from './VideoSectionsHeader';
import VideoSectionsTable from './VideoSectionsTable';
import reducer from '../../store/reducers';

class VideoSections extends Component {
	state = {
		addNew: false,
		refresh: false
	};
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
	render() {
		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<VideoSectionsHeader handleOpen={this.handleOpen} refreshData={this.refreshData} />}
				content={
					<VideoSectionsTable
						addNew={this.state.addNew}
						refresh={this.state.refresh}
						handleClose={this.handleClose}
						setRefreshValue={this.setRefreshValue}
					/>
				}
				innerScroll
			/>
		);
	}
}

export default withReducer('videoSectionsApp', reducer)(VideoSections);
