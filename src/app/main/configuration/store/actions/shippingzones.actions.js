import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_SHIPPING_ZONES = '[E-COMMERCE APP] GET SHIPPING ZONES';
export const SET_SHIPPING_ZONES_LOADER = '[E-COMMERCE APP] SET SHIPPING ZONES LOADER';
export const SET_DELETE_SHIPPING_ZONE_LOADER = '[E-COMMERCE APP] SET DELETE SHIPPING ZONE LOADER';
export const DELETE_SHIPPING_ZONE = '[E-COMMERCE APP] DELETE SHIPPING ZONE';

export const shippingURl = settingsConfig.host_url + 'shipping/zone/?fields=id,title';

export function getShippingZones() {
	const request = axios.get(shippingURl);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_SHIPPING_ZONES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SHIPPING_ZONES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteShippingZone(id) {
	const request = axios.delete(settingsConfig.host_url + 'shipping/zone/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Shipping Zone Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_SHIPPING_ZONE,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_SHIPPING_ZONE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setShippingZonesLoader(value) {
	return {
		type: SET_SHIPPING_ZONES_LOADER,
		payload: value
	};
}
export function setDeleteShippingZoneLoader(value) {
	return {
		type: SET_DELETE_SHIPPING_ZONE_LOADER,
		payload: value
	};
}
