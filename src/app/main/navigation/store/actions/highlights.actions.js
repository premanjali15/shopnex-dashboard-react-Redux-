import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_HIGHLIGHTS = '[E-COMMERCE APP] GET HIGHLIGHTS';
export const SET_HIGHLIGHTS_LOADER = '[E-COMMERCE APP] SET HIGHLIGHTS LOADER';

export const CREATE_HIGHLIGHT = '[E-COMMERCE APP] CREATE HIGHLIGHT';
export const SET_CREATE_HIGHLIGHT_LOADER = '[E-COMMERCE APP] SET CREATE HIGHLIGHT LOADER';

export const UPDATE_HIGHLIGHT = '[E-COMMERCE APP] UPDATE HIGHLIGHT';
export const SET_UPDATE_HIGHLIGHT_LOADER = '[E-COMMERCE APP] SET UPDATE HIGHLIGHT LOADER';

export const DELETE_HIGHLIGHT = '[E-COMMERCE APP] DELETE HIGHLIGHT';
export const SET_DELETE_HIGHLIGHT_LOADER = '[E-COMMERCE APP] SET DELETE HIGHLIGHT LOADER';

export const ADD_HIGHLIGHT_TO_HOME = '[E-COMMERCE APP] ADD HIGHLIGHT TO HOME';
export const SET_ADD_HIGHLIGHT_TO_HOME_LOADER = '[E-COMMERCE APP] SET ADD HIGHLIGHT TO HOME LOADER';

export function getHighlights() {
	const request = axios.get(settingsConfig.host_url + 'storefront/highlights/?fields=id,title,in_home,item_count');

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_HIGHLIGHTS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_HIGHLIGHTS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setHighlightsLoader(value) {
	return {
		type: SET_HIGHLIGHTS_LOADER,
		payload: value
	};
}

export function createHighlight(title) {
	const request = axios.post(settingsConfig.host_url + 'storefront/highlights/', { title: title });

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Highlight Created Successfully.', variant: 'success' }));
				dispatch({
					type: CREATE_HIGHLIGHT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_HIGHLIGHT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCreateHighlightLoader(value) {
	return {
		type: SET_CREATE_HIGHLIGHT_LOADER,
		payload: value
	};
}

export function updateHighlight(obj) {
	const request = axios.put(settingsConfig.host_url + 'storefront/highlights/' + obj.id + '/', { title: obj.title });

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Highlight Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_HIGHLIGHT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_HIGHLIGHT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateHighlightLoader(value) {
	return {
		type: SET_UPDATE_HIGHLIGHT_LOADER,
		payload: value
	};
}

export function deleteHighlight(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/highlights/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_HIGHLIGHT,
					payload: id
				});
				dispatch(showMessage({ message: 'Highlight Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_HIGHLIGHT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteHighlightlLoader(value) {
	return {
		type: SET_DELETE_HIGHLIGHT_LOADER,
		payload: value
	};
}

export function addHighlightToHome(id) {
	const request = axios.post(settingsConfig.host_url + 'storefront/highlights/add-to-home/' + id + '/', '');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Highlight Added To Home Successfully.', variant: 'success' }));
				return dispatch({
					type: ADD_HIGHLIGHT_TO_HOME,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ADD_HIGHLIGHT_TO_HOME_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setAddHighlightToHomeLoader(value) {
	return {
		type: SET_ADD_HIGHLIGHT_TO_HOME_LOADER,
		payload: value
	};
}
