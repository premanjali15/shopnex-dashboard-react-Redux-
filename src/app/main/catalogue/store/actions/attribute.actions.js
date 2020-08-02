import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_ATTRIBUTE_DETAILS = '[E-COMMERCE APP] GET ATTRIBUTE DETAILS';
export const UPDATE_ATTRIBUTE = '[E-COMMERCE APP] UPDATE ATTRIBUTE';
export const SAVE_ATTRIBUTE_VALUE = '[E-COMMERCE APP] SAVE ATTRIBUTE VALUE';
export const UPDATE_ATTRIBUTE_VALUE = '[E-COMMERCE APP] UPDATE ATTRIBUTE VALUE';
export const DELETE_ATTRIBUTE_VALUE = '[E-COMMERCE APP] DELETE ATTRIBUTE VALUE';
export const SET_ATTRIBUTE_DETAILS_LOADER = '[E-COMMERCE APP] SET ATTRIBUTE DETAILS LOADER';
export const SET_UPDATE_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET UPDATE ATTRIBUTE LOADER';
export const SET_DELETE_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET DELETE ATTRIBUTE LOADER';
export const SET_SAVE_ATTRIBUTE_VALUE_LOADER = '[E-COMMERCE APP] SET SAVE ATTRIBUTE VALUE LOADER';
export const SET_UPDATE_ATTRIBUTE_VALUE_LOADER = '[E-COMMERCE APP] SET UPDATE ATTRIBUTE VALUE LOADER';
export const SET_DELETE_ATTRIBUTE_VALUE_LOADER = '[E-COMMERCE APP] SET DELETE ATTRIBUTE VALUE LOADER';

export function getAttributeDetails(id) {
	const request = axios.get(settingsConfig.host_url + 'product/attribute/' + id + '/');
	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_ATTRIBUTE_DETAILS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ATTRIBUTE_DETAILS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateAttribute(data) {
	const request = axios.patch(settingsConfig.host_url + 'product/attribute/' + data.id + '/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Attribute Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_ATTRIBUTE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_ATTRIBUTE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteAttribute(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/attribute/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Attribute Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: SET_DELETE_ATTRIBUTE_LOADER,
					payload: 'deleted'
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_ATTRIBUTE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function saveAttrValue(data) {
	const request = axios.post(settingsConfig.host_url + 'product/attribute-value/', data);
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Attribute Value Created Successfully.', variant: 'success' }));
				return dispatch({
					type: SAVE_ATTRIBUTE_VALUE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SAVE_ATTRIBUTE_VALUE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateAttrValue(data) {
	const request = axios.patch(settingsConfig.host_url + 'product/attribute-value/' + data.id + '/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Attribute Value Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_ATTRIBUTE_VALUE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_ATTRIBUTE_VALUE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteAttrValue(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/attribute-value/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Attribute Value Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_ATTRIBUTE_VALUE,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_ATTRIBUTE_VALUE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setAttributeDetailsLoader(value) {
	return {
		type: SET_ATTRIBUTE_DETAILS_LOADER,
		payload: value
	};
}

export function setUpdateAttibuteLoader(value) {
	return {
		type: SET_UPDATE_ATTRIBUTE_LOADER,
		payload: value
	};
}

export function setDeleteAttibuteLoader(value) {
	return {
		type: SET_DELETE_ATTRIBUTE_LOADER,
		payload: value
	};
}

export function setSaveAttrValueLoader(value) {
	return {
		type: SET_SAVE_ATTRIBUTE_VALUE_LOADER,
		payload: value
	};
}

export function setUpdateAttrValueLoader(value) {
	return {
		type: SET_UPDATE_ATTRIBUTE_VALUE_LOADER,
		payload: value
	};
}
export function setDeleteAttrValueLoader(value) {
	return {
		type: SET_DELETE_ATTRIBUTE_VALUE_LOADER,
		payload: value
	};
}
