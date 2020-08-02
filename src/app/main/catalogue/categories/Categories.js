import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import CategoriesTable from './CategoriesTable';
import CategoriesHeader from './CategoriesHeader';
import reducer from '../store/reducers';

class Categories extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addNew: false,
			refresh: false
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
	render() {
		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<CategoriesHeader handleOpen={this.handleOpen} refreshData={this.refreshData} />}
				content={
					<CategoriesTable
						addNew={this.state.addNew}
						handleClose={this.handleClose}
						refresh={this.state.refresh}
						setRefreshValue={this.setRefreshValue}
					/>
				}
				innerScroll
			/>
		);
	}
}

export default withReducer('categoriesApp', reducer)(Categories);
