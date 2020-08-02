import React, { Component } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import TaxesTable from './TaxesTable';
import TaxesHeader from './TaxesHeader';
import reducer from '../store/reducers';

class Taxes extends Component {
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
				header={<TaxesHeader handleOpen={this.handleOpen} refreshData={this.refreshData} />}
				content={
					<TaxesTable
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

export default withReducer('taxesApp', reducer)(Taxes);
