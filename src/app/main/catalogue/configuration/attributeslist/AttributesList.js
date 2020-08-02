import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import AttributesListTable from './AttributesListTable';
import AttributesListHeader from './AttributesListHeader';
import reducer from '../../store/reducers';

class AttributesList extends Component {
	state = {
		refresh: false,
		addNew: false
	};
	refreshData = () => {
		this.setState({ refresh: true });
	};
	setRefreshValue = () => {
		this.setState({ refresh: false });
	};
	handleOpen = () => {
		this.setState({ addNew: true });
	};
	handleClose = () => {
		this.setState({ addNew: false });
	};
	render() {
		return (
			<FusePageCarded
				classes={{
					content: 'flex',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<AttributesListHeader refreshData={this.refreshData} handleOpen={this.handleOpen} />}
				content={
					<AttributesListTable
						refresh={this.state.refresh}
						setRefreshValue={this.setRefreshValue}
						addNew={this.state.addNew}
						handleClose={this.handleClose}
					/>
				}
				innerScroll
			/>
		);
	}
}

export default withReducer('attributesApp', reducer)(AttributesList);
