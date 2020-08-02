import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import ShippingZonesTable from './ShippingZonesTable';
import ShippingZonesHeader from './ShippingZonesHeader';
import reducer from '../../store/reducers';

class ShippingZones extends Component {
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
				header={<ShippingZonesHeader refreshData={this.refreshData} />}
				content={<ShippingZonesTable refresh={this.state.refresh} setRefreshValue={this.setRefreshValue} />}
				innerScroll
			/>
		);
	}
}

export default withReducer('shippingZonesApp', reducer)(ShippingZones);
