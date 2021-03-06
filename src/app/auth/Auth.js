import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as userActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import * as Actions from 'app/store/actions';
import jwtService from 'app/services/jwtService';

class Auth extends Component {
	/*eslint-disable-next-line no-useless-constructor*/
	constructor(props) {
		super(props);

		/**
         * Comment the line if you do not use JWt
         */
		//this.jwtCheck();

		/**
         * Comment the line if you do not use Auth0
         */
		//this.auth0Check();

		/**
         * Comment the line if you do not use Firebase
         */
		//this.firebaseCheck();
	}

	jwtCheck = () => {
		jwtService.on('onAutoLogin', () => {
			this.props.showMessage({ message: 'Logging in with JWT' });

			/**
             * Sign in and retrieve user data from Api
             */
			jwtService
				.signInWithToken()
				.then((user) => {
					this.props.setUserData(user);

					this.props.showMessage({ message: 'Logged in with JWT' });
				})
				.catch((error) => {
					this.props.showMessage({ message: error });
				});
		});

		jwtService.on('onAutoLogout', (message) => {
			if (message) {
				this.props.showMessage({ message });
			}
			this.props.logout();
		});

		jwtService.init();
	};
	render() {
		const { children } = this.props;

		return <React.Fragment>{children}</React.Fragment>;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: userActions.logoutUser,
			setUserData: userActions.setUserData,
			showMessage: Actions.showMessage,
			hideMessage: Actions.hideMessage
		},
		dispatch
	);
}

export default connect(null, mapDispatchToProps)(Auth);
