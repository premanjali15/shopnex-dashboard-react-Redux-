import React, { Component } from 'react';
import { matchRoutes } from 'react-router-config';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import AppContext from 'app/AppContext';
import { bindActionCreators } from 'redux';
import * as authActions from 'app/auth/store/actions';
import jwtService from 'app/services/jwtService';
import jwtDecode from 'jwt-decode';

import axios from 'axios';

class FuseAuthorization extends Component {
	constructor(props, context) {
		super(props);
		const { routes } = context;
		this.state = {
			accessGranted: false,
			routes
		};
	}

	componentDidMount() {
		axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		let loggedIn;
		let token = localStorage.getItem('jwt_access_token');
		if (token !== undefined && token !== null) {
			if (jwtService.isAuthTokenValid(token)) {
				loggedIn = true;
				jwtService.setSession(token);
			} else loggedIn = false;
		} else {
			loggedIn = false;
		}
		if (!loggedIn) {
			this.props.history.replace('/login');
		}
		if (loggedIn) {
			const decoded = jwtDecode(token);
			// this.props.setCommonData();
			this.props.setUserData(decoded);
		}
	}

	componentDidUpdate() {
		if (!this.state.accessGranted) {
			this.redirectRoute(this.props);
		}
	}

	static getDerivedStateFromProps(props, state) {
		const { location, user } = props;
		const { pathname } = location;

		const matched = matchRoutes(state.routes, pathname)[0];

		const accessGranted =
			matched && matched.route.auth && matched.route.auth.length > 0
				? matched.route.auth.includes(user.role)
				: true;

		return {
			accessGranted
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.accessGranted !== this.state.accessGranted;
	}

	redirectRoute(props) {
		const { location, user, history } = props;
		const { pathname, state } = location;
		/*
        User is guest
        Redirect to Login Page
        */
		if (user.role === 'guest') {
			history.push({
				pathname: '/login',
				state: { redirectUrl: pathname }
			});
		} else {
			const redirectUrl = state && state.redirectUrl ? state.redirectUrl : '/';

			history.push({
				pathname: redirectUrl
			});
		}
	}

	render() {
		const { children } = this.props;
		const { accessGranted } = this.state;
		// console.info('Fuse Authorization rendered', accessGranted);
		return accessGranted ? <React.Fragment>{children}</React.Fragment> : null;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			setUserData: authActions.setUserData
			// setCommonData: authActions.setCommonData
		},
		dispatch
	);
}
function mapStateToProps({ fuse, auth }) {
	return {
		user: auth.user
	};
}

FuseAuthorization.contextType = AppContext;

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FuseAuthorization));
