import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_PRODUCT_TYPE = '[E-COMMERCE APP] GET PRODUCT TYPE';
export const GET_FREE_PRODUCT_ATTRIBUTES = '[E-COMMERCE APP] GET FREE PRODUCT ATTRIBUTES';
export const SAVE_PRODUCT_TYPE = '[E-COMMERCE APP] SAVE PRODUCT TYPE';
export const ADD_PRODUCT_ATTRIBUTE = '[E-COMMERCE APP] ADD PRODUCT ATTRIBUTE';
export const DELETE_PRODUCT_ATTRIBUTE = '[E-COMMERCE APP] DELETE PRODUCT ATTRIBUTE';
export const ADD_ATTRIBUTE = '[E-COMMERCE APP] ADD ATTRIBUTE';
export const DELETE_ATTRIBUTE = '[E-COMMERCE APP] DELETE ATTRIBUTE';
export const SET_PRODUCT_TYPE_LOADER = '[E-COMMERCE APP] SET PRODUCT TYPE LOADER';
export const SET_PRODUCT_TYPE_SAVE_LOADER = '[E-COMMERCE APP] SET PRODUCT TYPE SAVE LOADER';
export const SET_FREE_PRODUCT_ATTRS_LOADER = '[E-COMMERCE APP] SET FREE PRODUCT ATTRS LOADER';
export const SET_ADD_PRODUCT_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET ADD PRODUCT ATTRIBUTE LOADER';
export const SET_DELETE_PRODUCT_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET DELETE PRODUCT ATTRIBUTE LOADER';
export const SET_ADD_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET ADD ATTRIBUTE LOADER';
export const SET_DELETE_ATTRIBUTE_LOADER = '[E-COMMERCE APP] SET DELETE ATTRIBUTE LOADER';

export function newProductType() {
	const data = {
		name: '',
		weight: '',
		has_variants: false,
		type: 'new'
	};

	return {
		type: GET_PRODUCT_TYPE,
		payload: data
	};
}

export function getProductType(id) {
	const request = axios.get(settingsConfig.host_url + 'product/type/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCT_TYPE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_PRODUCT_TYPE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function saveProductType(data) {
	let request;
	if (data.type === 'new') {
		request = axios.post(settingsConfig.host_url + 'product/type/', data);
	} else {
		let obj = {
			has_variants: data.has_variants,
			name: data.name,
			weight: data.weight
		};
		request = axios.put(settingsConfig.host_url + 'product/type/' + data.id + '/', obj);
	}

	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new') {
					dispatch(showMessage({ message: 'Product Type Added Successfully.', variant: 'success' }));
				} else {
					dispatch(showMessage({ message: 'Product Type Updated Successfully.', variant: 'success' }));
				}
				return dispatch({
					type: SAVE_PRODUCT_TYPE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_PRODUCT_TYPE_SAVE_LOADER,
					payload: false
				});
			});
}

export function getFreeProductAttrs() {
	const request = axios.get(settingsConfig.host_url + 'product/attribute-free/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_FREE_PRODUCT_ATTRIBUTES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_FREE_PRODUCT_ATTRS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function modifyProductAttribute(data) {
	let obj = {
		product_type: data.product_type,
		product_variant_type: data.product_variant_type
	};
	const request = axios.patch(settingsConfig.host_url + 'product/attribute/' + data.id + '/', obj);

	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'add_product_specific_attribute') {
					dispatch({
						type: ADD_PRODUCT_ATTRIBUTE,
						payload: response.data
					});
				} else if (data.type === 'delete_product_specific_attribute') {
					dispatch({
						type: DELETE_PRODUCT_ATTRIBUTE,
						payload: response.data
					});
				} else if (data.type === 'add_attribute_specific_value') {
					dispatch({
						type: ADD_ATTRIBUTE,
						payload: response.data
					});
				} else if (data.type === 'delete_specific_attribute') {
					dispatch({
						type: DELETE_ATTRIBUTE,
						payload: response.data
					});
				}
			})
			.catch((error) => {
				if (data && data.type === 'add_product_specific_attribute') {
					dispatch({
						type: SET_ADD_PRODUCT_ATTRIBUTE_LOADER,
						payload: false
					});
				} else if (data && data.type === 'delete_product_specific_attribute') {
					dispatch({
						type: SET_DELETE_PRODUCT_ATTRIBUTE_LOADER,
						payload: false
					});
				} else if (data && data.type === 'add_attribute_specific_value') {
					dispatch({
						type: SET_ADD_ATTRIBUTE_LOADER,
						payload: false
					});
				} else if (data && data.type === 'delete_specific_attribute') {
					dispatch({
						type: SET_DELETE_ATTRIBUTE_LOADER,
						payload: false
					});
				}
				dispatch(displayError(error));
			});
}

export function setProductTypeSaveLoader(value) {
	return {
		type: SET_PRODUCT_TYPE_SAVE_LOADER,
		payload: value
	};
}
export function setProductTypeLoader(value) {
	return {
		type: SET_PRODUCT_TYPE_LOADER,
		payload: value
	};
}
export function setFreeProductAttrsLoader(value) {
	return {
		type: SET_FREE_PRODUCT_ATTRS_LOADER,
		payload: value
	};
}
export function setAddProductAttributeLoader(value) {
	return {
		type: SET_ADD_PRODUCT_ATTRIBUTE_LOADER,
		payload: value
	};
}
export function setDeleteProductAttributeLoader(value) {
	return {
		type: SET_DELETE_PRODUCT_ATTRIBUTE_LOADER,
		payload: value
	};
}
export function setAddAttributeLoader(value) {
	return {
		type: SET_ADD_ATTRIBUTE_LOADER,
		payload: value
	};
}
export function setDeleteAttributeLoader(value) {
	return {
		type: SET_DELETE_ATTRIBUTE_LOADER,
		payload: value
	};
}
