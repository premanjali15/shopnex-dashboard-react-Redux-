import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import HomeTable from './HomeTable';
import HomeHeader from './HomeHeader';
import reducer from '../store/reducers';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			refresh: false
		};
	}
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
				header={<HomeHeader refreshData={this.refreshData} />}
				content={<HomeTable refresh={this.state.refresh} setRefreshValue={this.setRefreshValue} />}
				innerScroll
			/>
		);
	}
}

export default withReducer('homeApp', reducer)(Home);
