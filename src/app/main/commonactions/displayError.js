import * as authActions from 'app/auth/store/actions';
import { showMessage } from 'app/store/actions/fuse';

export default function displayError(error, dispatch) {
	if (error && error.response && error.response.data) {
		let errData = error.response.data;
		if (typeof errData === 'object') {
			let msgs = [];
			let keys = Object.keys(errData);
			let values = Object.values(errData);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				key = key[0].toUpperCase() + key.substring(1, key.length);
				let msg = key + ' : ' + values[i];
				msgs.push(msg);
			}
			if (msgs.length === 1 && msgs[0] === 'Detail : Error decoding signature.') {
				return authActions.logoutUser();
			}
			return (dispatch) => {
				for (let i = 0; i < msgs.length; i++) {
					dispatch(showMessage({ message: msgs[i], variant: 'error' }));
				}
			};
		} else if (typeof errData === 'string') {
			return (dispatch) => {
				dispatch(showMessage({ message: errData, variant: 'error' }));
			};
		} else {
			return (dispatch) => {
				dispatch(showMessage({ message: 'Some error occurred.....', variant: 'error' }));
			};
		}
	} else {
		return (dispatch) => {
			dispatch(showMessage({ message: 'Some error occurred.....', variant: 'error' }));
		};
	}
}
