import React, { Component } from 'react';
import TablePagination from '@material-ui/core/TablePagination';

import withReducer from 'app/store/withReducer';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import reducer from './store/reducers';
import * as Actions from './store/actions';

class Pagination extends Component {
	state = {
		rowsPerPage: 10,
		page: 0,
		data: this.props.data,
		currentUrl: this.props.currentUrl
	};

	handleChangePage = (event, page) => {
		let url;
		if (page > this.state.page) {
			url = this.state.data.next;
		} else if (page < this.state.page) {
			url = this.state.data.previous;
		}
		this.props.setDataLoader(true);
		this.props.setPaginationLoader(true);
		this.props.getData(url);
		this.setState({ page, currentUrl: url });
	};

	handleChangeRowsPerPage = (event) => {
		let url = this.state.currentUrl;
		let ind = url.indexOf('limit=');
		if (ind < 0) {
			url = url + '&limit=' + event.target.value;
		} else {
			let obj = url.split('&limit=');
			url = obj[0] + '&limit=' + event.target.value;
			if (obj[1] && obj[1].split('&').length > 1) {
				url = url + '&' + obj[1].split('&')[1];
			}
		}
		this.props.setDataLoader(true);
		this.props.setPaginationLoader(true);
		this.props.getData(url);
		this.setState({ rowsPerPage: event.target.value });
	};

	componentDidUpdate(prevProps) {
		if (this.props.loadingData === 'loaded') {
			this.props.setDataLoader(false);
			this.props.setPaginationLoader(false);
			this.setState({ data: this.props.paginationData });
			this.props.setPaginationData(this.props.paginationData);
		}
		if (this.props.data !== prevProps.data) {
			this.setState({ data: this.props.data });
		}
		if (this.props.currentUrl !== prevProps.currentUrl) {
			this.setState({ currentUrl: this.props.currentUrl });
		}
	}

	render() {
		const { rowsPerPage, page, data } = this.state;
		return (
			<React.Fragment>
				{data && (
					<TablePagination
						rowsPerPageOptions={[ 10, 25, 50, 100 ]}
						component="div"
						count={data.count}
						rowsPerPage={rowsPerPage}
						page={page}
						labelDisplayedRows={() => 'Total: ' + data.count}
						backIconButtonProps={{
							'aria-label': 'Previous Page',
							disabled: data.previous === null
						}}
						nextIconButtonProps={{
							'aria-label': 'Next Page',
							disabled: data.next === null
						}}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
					/>
				)}
			</React.Fragment>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			getData: Actions.getData,
			setDataLoader: Actions.setDataLoader
		},
		dispatch
	);
}

function mapStateToProps({ paginationApp }) {
	return {
		paginationData: paginationApp.pagination.data,
		loadingData: paginationApp.pagination.loadingData
	};
}

export default withReducer('paginationApp', reducer)(
	withRouter(connect(mapStateToProps, mapDispatchToProps)(Pagination))
);
