import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

export const GET_SEO_PRODUCT = '[E-COMMERCE APP] GET SEO PRODUCT';
export const SET_SEO_PRODUCT_LOADER = '[E-COMMERCE APP] SET SEO PRODUCT LOADER';

export const SAVE_SEO_PRODUCT = '[E-COMMERCE APP] SAVE SEO PRODUCT';
export const SET_SAVE_SEO_PRODUCT_LOADER = '[E-COMMERCE APP] SET SAVE SEO PRODUCT LOADER';

export function getSeoProduct(id) {
	const request = axios.get(settingsConfig.host_url + 'seo/product/' + id + '/');
	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_SEO_PRODUCT,
					payload: response.data
				})
			)
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SET_SEO_PRODUCT_LOADER,
					payload: false
				});
			});
}
export function setSeoProductLoader(value) {
	return {
		type: SET_SEO_PRODUCT_LOADER,
		payload: value
	};
}

export function saveSeoProduct(data) {
	const request = axios.patch(settingsConfig.host_url + 'seo/product/' + data.id + '/', data);
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Product Saved Successfully.', variant: 'success' }));
				return dispatch({
					type: SAVE_SEO_PRODUCT,
					payload: response.data
				});
			})
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SET_SAVE_SEO_PRODUCT_LOADER,
					payload: false
				});
			});
}
export function setSaveSeoProductLoader(value) {
	return {
		type: SET_SAVE_SEO_PRODUCT_LOADER,
		payload: value
	};
}
