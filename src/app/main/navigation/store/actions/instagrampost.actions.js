import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_INSTA_POST = '[E-COMMERCE APP] GET INSTA POST';
export const SET_INSTA_POST_LOADER = '[E-COMMERCE APP] SET INSTA POST LOADER';

export const SAVE_INSTA_POST = '[E-COMMERCE APP] SAVE INSTA POST';
export const SET_SAVE_INSTA_POST_LOADER = '[E-COMMERCE APP] SET SAVE INSTA POST LOADER';

export const GET_SEARCHED_INSTA_PRODUCTS = '[E-COMMERCE APP] GET SEARCHED INSTA PRODUCTS';
export const SET_SEARCHED_INSTA_PRODUCTS_LOADER = '[E-COMMERCE APP] GET SEARCHED INSTA PRODUCTS LOADER';

export function newInstaPost(sectionId) {
	const data = {
		post_url: '',
		author: '',
		description: '',
		section: parseInt(sectionId),
		products: null,
		type: 'new'
	};
	return {
		type: GET_INSTA_POST,
		payload: data
	};
}

export function getInstaPost(id) {
	const request = axios.get(settingsConfig.host_url + 'storefront/instagram-post/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_INSTA_POST,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_INSTA_POST_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setInstaPostLoader(value) {
	return {
		type: SET_INSTA_POST_LOADER,
		payload: value
	};
}

export function saveInstaPost(data) {
	let request;
	if (data.type === 'new') {
		request = axios.post(settingsConfig.host_url + 'storefront/instagram-post/', data);
	} else {
		request = axios.patch(settingsConfig.host_url + 'storefront/instagram-post/' + data.id + '/', data);
	}

	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new') {
					dispatch(showMessage({ message: 'InstaPost Created Successfully.', variant: 'success' }));
				} else {
					dispatch(showMessage({ message: 'InstaPost Updated Successfully.', variant: 'success' }));
				}
				return dispatch({
					type: SAVE_INSTA_POST,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_SAVE_INSTA_POST_LOADER,
					payload: false
				});
			});
}
export function setSaveInstaPostLoader(value) {
	return {
		type: SET_SAVE_INSTA_POST_LOADER,
		payload: value
	};
}

export function getSearchedInstaProducts(searchText) {
	const request = axios.get(
		settingsConfig.host_url + 'product/?fields=id,name,top_image,get_absolute_url&search=' + searchText
	);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_SEARCHED_INSTA_PRODUCTS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				dispatch({
					type: SET_SEARCHED_INSTA_PRODUCTS_LOADER,
					payload: false
				});
			});
}
export function setSearchedInstaProductsLoader(value) {
	return {
		type: SET_SEARCHED_INSTA_PRODUCTS_LOADER,
		payload: value
	};
}
