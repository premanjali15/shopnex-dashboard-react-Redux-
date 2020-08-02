import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_PRODUCT = '[E-COMMERCE APP] GET PRODUCT';
export const SAVE_PRODUCT = '[E-COMMERCE APP] SAVE PRODUCT';
export const SET_LOADER = '[E-COMMERCE APP] SET LOADER';
export const SET_PRODUCT_SAVE_VALUE = '[E-COMMERCE APP] SET PRODUCT SAVE VALUE';
export const SET_PRODUCT_RELATED_DATA_LOADER = '[E-COMMERCE APP] GET PRODUCT RELATED DATA LOADER';
export const GET_PRODUCT_RELATED_DATA = '[E-COMMERCE APP] GET PRODUCT RELATED DATA';

export function getProduct(id) {
	const request = axios.get(settingsConfig.host_url + 'product/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function saveProduct(data, id) {
	let request;
	if (data.type === 'new') {
		request = axios.post(settingsConfig.host_url + 'product/create/' + id + '/', data);
	} else {
		request = axios.put(settingsConfig.host_url + 'product/' + data.id + '/', data);
	}

	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new') {
					dispatch(showMessage({ message: 'Product Added Successfully.', variant: 'success' }));
				} else {
					dispatch(showMessage({ message: 'Product Saved Successfully.', variant: 'success' }));
				}
				return dispatch({
					type: SAVE_PRODUCT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_PRODUCT_SAVE_VALUE,
					payload: false
				});
			});
}

export function getProductRelatedData(id) {
	const request = axios.get(settingsConfig.host_url + 'product/create/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCT_RELATED_DATA,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_PRODUCT_RELATED_DATA_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function newProduct() {
	const data = {
		name: '',
		description: '',
		price: '',
		available: false,
		category: '',
		collections: [],
		attributes: {},
		weight: '',
		variants: [],
		type: 'new'
	};

	return {
		type: GET_PRODUCT,
		payload: data
	};
}
export function setLoader(value) {
	return {
		type: SET_LOADER,
		payload: value
	};
}
export function setProductSavedValue(value) {
	return {
		type: SET_PRODUCT_SAVE_VALUE,
		payload: value
	};
}
export function setPrdctRelatedDataLoader(value) {
	return {
		type: SET_PRODUCT_RELATED_DATA_LOADER,
		payload: value
	};
}
