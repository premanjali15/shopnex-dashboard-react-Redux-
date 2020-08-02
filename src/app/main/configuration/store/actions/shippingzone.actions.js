import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_SHIPPING_ZONE = '[E-COMMERCE APP] GET SHIPPING ZONE';
export const SET_SHIPPING_ZONE_LOADER = '[E-COMMERCE APP] SET SHIPPING ZONE LOADER';
export const SET_SHIPPING_STATES_LOADER = '[E-COMMERCE APP] SET SHIPPING STATES LOADER';
export const GET_SHIPPING_STATES = '[E-COMMERCE APP] GET SHIPPING STATES';
export const SAVE_SHIPPING_ZONE = '[E-COMMERCE APP] SAVE SHIPPING ZONE';
export const SET_SAVE_SHIPPING_ZONE_LOADER = '[E-COMMERCE APP] SET SAVE SHIPPING ZONE LOADER';
export const MODIFY_SHIPPING_ZONE_STATES = '[E-COMMERCE APP] MODIFY SHIPPING ZONE STATES';
export const SET_MODIFY_SHIPPING_ZONE_STATES_LOADER = '[E-COMMERCE APP] SET MODIFY SHIPPING ZONE STATES LOADER';

export function getShippingZone(id) {
	if (id === 'new') {
		let obj = {
			title: '',
			states: [],
			methods: [],
			type: 'new'
		};
		return {
			type: GET_SHIPPING_ZONE,
			payload: obj
		};
	} else {
		const request = axios.get(settingsConfig.host_url + 'shipping/zone/' + id + '/');

		return (dispatch) =>
			request
				.then((response) => {
					dispatch({
						type: GET_SHIPPING_ZONE,
						payload: response.data
					});
				})
				.catch((error) => {
					dispatch({
						type: SET_SHIPPING_ZONE_LOADER,
						payload: false
					});
					dispatch(displayError(error));
				});
	}
}

export function getShippingStates() {
	const request = axios.get(settingsConfig.host_url + 'shipping/states/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_SHIPPING_STATES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SHIPPING_STATES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function modifyShippingZoneStates(data) {
	const request = axios.patch(settingsConfig.host_url + 'shipping/zone/' + data.id + '/', { states: data.states });

	return (dispatch) =>
		request
			.then((response) => {
				// dispatch(showMessage({ message: 'Shipping States Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: MODIFY_SHIPPING_ZONE_STATES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_MODIFY_SHIPPING_ZONE_STATES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function saveShippingZone(data) {
	let request;
	if (data.type === 'new') {
		request = axios.post(settingsConfig.host_url + 'shipping/zone/', data);
	} else {
		request = axios.put(settingsConfig.host_url + 'shipping/zone/' + data.id + '/', data);
	}
	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new') {
					dispatch(showMessage({ message: 'Shipping Zone Added Successfully.', variant: 'success' }));
				} else {
					dispatch(showMessage({ message: 'Shipping Zone Updated Successfully.', variant: 'success' }));
				}
				return dispatch({
					type: SAVE_SHIPPING_ZONE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_SAVE_SHIPPING_ZONE_LOADER,
					payload: false
				});
			});
}

export function setShippingZoneLoader(value) {
	return {
		type: SET_SHIPPING_ZONE_LOADER,
		payload: value
	};
}
export function setShippingStatesLoader(value) {
	return {
		type: SET_SHIPPING_STATES_LOADER,
		payload: value
	};
}
export function setSaveShippingZoneLoader(value) {
	return {
		type: SET_SAVE_SHIPPING_ZONE_LOADER,
		payload: value
	};
}
export function setModifyShippingZoneStatesLoader(value) {
	return {
		type: SET_MODIFY_SHIPPING_ZONE_STATES_LOADER,
		payload: value
	};
}
