import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import ProductsTable from './ProductsTable';
import ProductsHeader from './ProductsHeader';
import reducer from '../store/reducers';

class Products extends Component {
	state = {
		refresh: false,
		openPrdctType: false,
		enterPressed: false
	};
	refreshData = () => {
		this.setState({ refresh: true });
	};
	setRefreshValue = () => {
		this.setState({ refresh: false });
	};
	openPrdctTypeDialog = () => {
		this.setState({ openPrdctType: true });
	};
	closePrdctTypeDialog = () => {
		this.setState({ openPrdctType: false });
	};

	handleEnter = () => {
		this.setState({ enterPressed: true });
	};

	closeHandleEnter = () => {
		this.setState({ enterPressed: false });
	};

	render() {
		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={
					<ProductsHeader
						refreshData={this.refreshData}
						openPrdctTypeDialog={this.openPrdctTypeDialog}
						handleEnter={this.handleEnter}
					/>
				}
				content={
					<ProductsTable
						refresh={this.state.refresh}
						setRefreshValue={this.setRefreshValue}
						openPrdctType={this.state.openPrdctType}
						closePrdctTypeDialog={this.closePrdctTypeDialog}
						enterPressed={this.state.enterPressed}
						closeHandleEnter={this.closeHandleEnter}
					/>
				}
				innerScroll
			/>
		);
	}
}

export default withReducer('productsApp', reducer)(Products);
