import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import CollectionsHeader from './CollectionsHeader';
import CollectionsTable from './CollectionsTable';
import reducer from '../store/reducers';

class Collections extends Component {
	state = {
		refresh: false
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
				header={<CollectionsHeader refreshData={this.refreshData} />}
				content={<CollectionsTable refresh={this.state.refresh} setRefreshValue={this.setRefreshValue} />}
				innerScroll
			/>
		);
	}
}

export default withReducer('collectionsApp', reducer)(Collections);
