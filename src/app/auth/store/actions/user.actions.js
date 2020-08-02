import history from 'history.js';
import { setInitialSettings } from 'app/store/actions/fuse';
import store from 'app/store';
import * as Actions from 'app/store/actions';
import jwtService from 'app/services/jwtService';

export const SET_USER_DATA = '[USER] SET DATA';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';

export function setUserData(user) {
	return (dispatch) => {
		/*
        Set User Settings
         */
		// dispatch(setDefaultSettings(user.data.settings));

		/*
        Set User Data
         */
		dispatch({
			type: SET_USER_DATA,
			payload: user
		});
	};
}
/**
 * Remove User Data
 */
export function removeUserData() {
	return {
		type: REMOVE_USER_DATA
	};
}

/**
 * Logout
 */
export function logoutUser() {
	return (dispatch, getState) => {
		// const user = getState().auth.user;

		// if (user.role === 'guest') {
		// 	return null;
		// }
		jwtService.logout();

		dispatch(setInitialSettings());

		dispatch({
			type: USER_LOGGED_OUT
		});
		history.push({
			pathname: '/login'
		});
	};
}

/**
 * Update User Data
 */
export function updateUserData(user) {
	if (user.role === 'guest') {
		return;
	}

	switch (user.from) {
		default: {
			jwtService
				.updateUserData(user)
				.then(() => {
					store.dispatch(Actions.showMessage({ message: 'User data saved with api' }));
				})
				.catch((error) => {
					store.dispatch(Actions.showMessage({ message: error.message }));
				});
			break;
		}
	}
}
