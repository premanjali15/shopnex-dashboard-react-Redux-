import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import displayError from 'app/main/commonactions/displayError';

export const GET_GENERAL_SETTINGS = '[E-COMMERCE APP] GET GENERAL SETTINGS';
export const UPDATE_GENERAL_SETTINGS = '[E-COMMERCE APP] UPDATE GENERAL SETTINGS';
export const SET_GENERAL_SETTINGS_LOADER = '[E-COMMERCE APP] SET GENERAL SETTINGS LOADER';
export const SET_SETTINGS_UPDATE_LOADER = '[E-COMMERCE APP] SET SETTINGS UPDATE LOADER';

export function getGeneralSettings() {
	const request = axios.get(settingsConfig.host_url + 'conf/site/1/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_GENERAL_SETTINGS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_GENERAL_SETTINGS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateGeneralSettings(obj) {
	let type = Object.keys(obj)[0];
	type = type.charAt(0).toUpperCase() + type.slice(1);

	const request = axios.patch(settingsConfig.host_url + 'conf/site/1/', obj);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: type + ' Updated Successfully.', variant: 'success' }));
				dispatch({
					type: UPDATE_GENERAL_SETTINGS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SETTINGS_UPDATE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setGeneralSettingsLoader(value) {
	return {
		type: SET_GENERAL_SETTINGS_LOADER,
		payload: value
	};
}
export function setSettingsUpdateLoader(value) {
	return {
		type: SET_SETTINGS_UPDATE_LOADER,
		payload: value
	};
}
