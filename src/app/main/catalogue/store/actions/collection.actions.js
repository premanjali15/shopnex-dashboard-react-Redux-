import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_COLLECTION = '[E-COMMERCE APP] GET COLLECTION';
export const SAVE_COLLECTION = '[E-COMMERCE APP] SAVE COLLECTION';
export const SET_COLLECTION_SAVE_VALUE = '[E-COMMERCE APP] SET COLLECTION SAVE VALUE';
export const SET_COLLECTION = '[E-COMMERCE APP] SET COLLECTION';
export const SET_COLLECTION_LOADING_VALUE = '[E-COMMERCE APP] SET COLLECTION LOADING VALUE';
export const GET_SEARCHED_PRODUCTS = '[E-COMMERCE APP] GET SEARCHED PRODUCTS';
export const SET_SEARCHED_PRODUCTS_LOADER = '[E-COMMERCE APP] SET SEARCHED PRODUCTS LOADER';

export function getCollection(params) {
	if (params === 'new') {
		let data = {
			name: '',
			background_image: null,
			is_published: false,
			description: '',
			products: [],
			products_data: [],
			type: 'new'
		};
		return {
			type: GET_COLLECTION,
			payload: data
		};
	} else {
		const request = axios.get(settingsConfig.host_url + 'product/collection/' + params + '/');

		return (dispatch) =>
			request
				.then((response) => {
					dispatch({
						type: GET_COLLECTION,
						payload: response.data
					});
				})
				.catch((error) => {
					dispatch(displayError(error));
					return dispatch({
						type: SET_COLLECTION_LOADING_VALUE,
						payload: false
					});
				});
	}
}

export function saveCollection(data) {
	let request;
	if (data.type === 'new') {
		request = axios.post(settingsConfig.host_url + 'product/collection/', data);
	} else {
		request = axios.patch(settingsConfig.host_url + 'product/collection/' + data.id + '/', data);
	}
	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new') {
					dispatch(showMessage({ message: 'Collection Added Successfully.', variant: 'success' }));
				} else {
					dispatch(showMessage({ message: 'Collection Updated Successfully.', variant: 'success' }));
				}
				return dispatch({
					type: SAVE_COLLECTION,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_COLLECTION_SAVE_VALUE,
					payload: false
				});
			});
}

export function getSearchedProducts(searchText) {
	const request = axios.get(settingsConfig.host_url + 'product/?fields=id,name&search=' + searchText);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_SEARCHED_PRODUCTS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				dispatch({
					type: SET_SEARCHED_PRODUCTS_LOADER,
					payload: false
				});
			});
}

export function setCollectionSavedValue(value) {
	return {
		type: SET_COLLECTION_SAVE_VALUE,
		payload: value
	};
}
export function setCollection(value) {
	return {
		type: SET_COLLECTION,
		payload: value
	};
}
export function setCollectionLoadingValue(value) {
	return {
		type: SET_COLLECTION_LOADING_VALUE,
		payload: value
	};
}
export function setSearchedProductsLoader(value) {
	return {
		type: SET_SEARCHED_PRODUCTS_LOADER,
		payload: value
	};
}
