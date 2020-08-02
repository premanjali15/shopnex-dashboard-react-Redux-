import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import InstagramSectionsHeader from './InstagramSectionsHeader';
import InstagramSectionsTable from './InstagramSectionsTable';
import reducer from '../../store/reducers';

class InstagramSections extends Component {
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
				header={<InstagramSectionsHeader handleOpen={this.handleOpen} refreshData={this.refreshData} />}
				content={
					<InstagramSectionsTable
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

export default withReducer('instagramSectionsApp', reducer)(InstagramSections);
