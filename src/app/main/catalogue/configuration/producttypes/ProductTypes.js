import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import ProductTypesTable from './ProductTypesTable';
import ProductTypesHeader from './ProductTypesHeader';
import reducer from '../../store/reducers';

class ProductTypes extends Component {
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
				header={<ProductTypesHeader refreshData={this.refreshData} />}
				content={<ProductTypesTable refresh={this.state.refresh} setRefreshValue={this.setRefreshValue} />}
				innerScroll
			/>
		);
	}
}

export default withReducer('productTypesApp', reducer)(ProductTypes);
