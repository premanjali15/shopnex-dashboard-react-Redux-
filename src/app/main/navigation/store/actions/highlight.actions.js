import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_HIGHLIGHT = '[E-COMMERCE APP] GET HIGHLIGHT';
export const SET_HIGHLIGHT_LOADER = '[E-COMMERCE APP] SET HIGHLIGHT LOADER';

export const SAVE_HIGHLIGHT_ITEM = '[E-COMMERCE APP] SAVE_HIGHLIGHT_ITEM';
export const SET_SAVE_HIGHLIGHT_ITEM_LOADER = '[E-COMMERCE APP] SET SAVE HIGHLIGHT ITEM LOADER';

export const SET_DELETE_HIGHLIGHT_ITEM_LOADER = '[E-COMMERCE APP] SET DELETE HIGHLIGHT ITEM LOADER';
export const DELETE_HIGHLIGHT_ITEM = '[E-COMMERCE APP] DELETE HIGHLIGHT ITEM';

export const SET_HIGHLIGHT_ITEM_ORDER_LOADER = '[E-COMMERCE APP] SET HIGHLIGHT ITEM ORDER LOADER';
export const SET_HIGHLIGHT_ITEM_ORDER = '[E-COMMERCE APP] SET HIGHLIGHT ITEM ORDER';

export function getHighlight(id) {
	const request = axios.get(settingsConfig.host_url + 'storefront/highlights/' + id + '/');
	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_HIGHLIGHT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_HIGHLIGHT_LOADER,
					payload: false
				});
			});
}

export function saveHighlightItem(obj) {
	let request;
	let type = obj.id;
	if (obj.id === 'new') {
		delete obj.id;
		request = axios.post(settingsConfig.host_url + 'storefront/highlights/item/', obj);
	} else {
		request = axios.patch(settingsConfig.host_url + 'storefront/highlights/item/' + obj.id + '/', obj);
	}
	return (dispatch) =>
		request
			.then((response) => {
				if (type === 'new')
					dispatch(showMessage({ message: 'Highlight Item Added Successfully.', variant: 'success' }));
				else dispatch(showMessage({ message: 'Highlight Item Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: SAVE_HIGHLIGHT_ITEM,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SAVE_HIGHLIGHT_ITEM_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteHighlightItem(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/highlights/item/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Highlight Item Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_HIGHLIGHT_ITEM,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_HIGHLIGHT_ITEM_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setHighlightItemOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/highlights/item/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				return dispatch({
					type: SET_HIGHLIGHT_ITEM_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_HIGHLIGHT_ITEM_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}

export function setHighlightLoader(value) {
	return {
		type: SET_HIGHLIGHT_LOADER,
		payload: value
	};
}
export function setSaveHighlightItemLoader(value) {
	return {
		type: SET_SAVE_HIGHLIGHT_ITEM_LOADER,
		payload: value
	};
}
export function setDeleteHighlightItemLoader(value) {
	return {
		type: SET_DELETE_HIGHLIGHT_ITEM_LOADER,
		payload: value
	};
}
export function setHighlightItemOrderLoader(value) {
	return {
		type: SET_HIGHLIGHT_ITEM_ORDER_LOADER,
		payload: value
	};
}
