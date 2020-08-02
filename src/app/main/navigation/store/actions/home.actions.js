import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_NAV_HOME_DATA = '[E-COMMERCE APP] GET NAV HOME DATA';
export const SET_NAV_HOME_DATA_LOADER = '[E-COMMERCE APP] SET NAV HOME DATA LOADER';

export const DELETE_NAV_HOME_DATA_ITEM = '[E-COMMERCE APP] DELETE NAV HOME DATA ITEM';
export const SET_DELETE_NAV_HOME_DATA_ITEM_LOADER = '[E-COMMERCE APP] SET DELETE NAV HOME DATA ITEM LOADER';

export const SET_HOME_DATA_ITEM_ORDER = '[E-COMMERCE APP] SET HOME DATA ITEM ORDER';
export const SET_HOME_DATA_ITEM_ORDER_LOADER = '[E-COMMERCE APP] SET HOME DATA ITEM ORDER LOADER';

export function getNavHomeData() {
	const request = axios.get(settingsConfig.host_url + 'storefront/components/');

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_NAV_HOME_DATA,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_NAV_HOME_DATA_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setNavHomeDataLoader(value) {
	return {
		type: SET_NAV_HOME_DATA_LOADER,
		payload: value
	};
}

export function deleteNavHomeDataItem(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/components/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_NAV_HOME_DATA_ITEM,
					payload: id
				});
				dispatch(showMessage({ message: 'Item Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_NAV_HOME_DATA_ITEM_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteNavHomeDataItemLoader(value) {
	return {
		type: SET_DELETE_NAV_HOME_DATA_ITEM_LOADER,
		payload: value
	};
}

export function setHomeDataItemOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/components/move-position/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				dispatch({
					type: SET_HOME_DATA_ITEM_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_HOME_DATA_ITEM_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}
export function setHomeDataItemOrderLoader(value) {
	return {
		type: SET_HOME_DATA_ITEM_ORDER_LOADER,
		payload: value
	};
}
