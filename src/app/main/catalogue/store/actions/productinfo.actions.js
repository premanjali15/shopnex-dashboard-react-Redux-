import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_PRODUCT_INFO = '[E-COMMERCE APP] GET PRODUCT INFO';
export const SET_PRODUCT_INFO_LOADER = '[E-COMMERCE APP] SET PRODUCT INFO LOADER';
export const DELETE_PRODUCT = '[E-COMMERCE APP] DELETE PRODUCT';
export const SET_DELETE_PRODUCT_LOADER = '[E-COMMERCE APP] SET DELETE PRODUCT LOADER';
export const DELETE_VARIANT = '[E-COMMERCE APP] DELETE VARIANT';
export const SET_DELETE_VARIANT_LOADER = '[E-COMMERCE APP] SET DELETE VARIANT LOADER';
export const SAVE_PRODUCT_STATUS = '[E-COMMERCE APP] SAVE PRODUCT STATUS';
export const SET_SAVE_PRODUCT_STATUS_LOADER = '[E-COMMERCE APP] SET SAVE PRODUCT STATUS LOADER';

export function getProductInfo(id) {
	const request = axios.get(
		settingsConfig.host_url +
			'product/' +
			id +
			'/?fields=id,available,product_type,has_variants,name,price,variants,images,top_image,product_type_name'
	);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCT_INFO,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_PRODUCT_INFO_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteProduct(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Product Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_PRODUCT,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_PRODUCT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteVariant(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/variant/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Variant Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_VARIANT,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_VARIANT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function saveProductStatus(data, id) {
	const request = axios.patch(settingsConfig.host_url + 'product/' + data.id + '/', { available: data.value });

	return (dispatch) =>
		request
			.then((response) => {
				let msg = 'Now the product is ' + (data.value === true ? 'available' : 'unavailable');
				dispatch(showMessage({ message: msg, variant: 'success' }));

				return dispatch({
					type: SAVE_PRODUCT_STATUS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_SAVE_PRODUCT_STATUS_LOADER,
					payload: false
				});
			});
}

export function setProductInfoLoader(value) {
	return {
		type: SET_PRODUCT_INFO_LOADER,
		payload: value
	};
}
export function setDeleteProductLoader(value) {
	return {
		type: SET_DELETE_PRODUCT_LOADER,
		payload: value
	};
}
export function setDeleteVariantLoader(value) {
	return {
		type: SET_DELETE_VARIANT_LOADER,
		payload: value
	};
}
