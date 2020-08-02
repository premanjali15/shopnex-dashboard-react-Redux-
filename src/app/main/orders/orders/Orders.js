import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import OrdersHeader from './OrdersHeader';
import OrdersTable from './OrdersTable';
import reducer from '../store/reducers';

class Orders extends Component {
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
				header={<OrdersHeader refreshData={this.refreshData} />}
				content={<OrdersTable refresh={this.state.refresh} setRefreshValue={this.setRefreshValue} />}
				innerScroll
			/>
		);
	}
}

export default withReducer('ordersApp', reducer)(Orders);
