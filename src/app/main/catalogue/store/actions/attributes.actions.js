import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_ATTRIBUTES = '[E-COMMERCE APP] GET ATTRIBUTES';
export const CREATE_ATTRIBUTE = '[E-COMMERCE APP] CREATE ATTRIBUTE';
export const SET_ATTRIBUTES_SEARCH_TEXT = '[E-COMMERCE APP] SET ATTRIBUTES SEARCH TEXT';
export const SET_ATTRIBUTES_LOADER = '[E-COMMERCE APP] SET ATTRIBUTES LOADER';
export const SET_CREATE_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET CREATE ATTRIBUTE';

export const attributesURl = settingsConfig.host_url + 'product/attribute/?fields=id,name,values,product_type_name';

export function getAttributes() {
	const request = axios.get(attributesURl);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_ATTRIBUTES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ATTRIBUTES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function createAttribute(data) {
	const request = axios.post(settingsConfig.host_url + 'product/attribute/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Attribute Created Successfully.', variant: 'success' }));
				return dispatch({
					type: CREATE_ATTRIBUTE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_ATTRIBUTE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setAttributesSearchText(event) {
	return {
		type: SET_ATTRIBUTES_SEARCH_TEXT,
		searchText: event.target.value
	};
}

export function setAttributesLoader(value) {
	return {
		type: SET_ATTRIBUTES_LOADER,
		payload: value
	};
}

export function setCreateAttributeLoader(value) {
	return {
		type: SET_CREATE_ATTRIBUTE_LOADER,
		payload: value
	};
}
