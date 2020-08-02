import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_PRODUCT_IMAGES = '[E-COMMERCE APP] GET PRODUCT IMAGES';
export const SET_PRODUCT_IMAGES_LOADER = '[E-COMMERCE APP] SET PRODUCT IMAGES LOADER';
export const SAVE_IMAGE = '[E-COMMERCE APP] SAVE IMAGE';
export const TOP_IMAGE = '[E-COMMERCE APP] TOP IMAGE';
export const DELETE_IMAGE = '[E-COMMERCE APP] DELETE IMAGE';
export const SAVE_IMAGE_COLOR = '[E-COMMERCE APP] SAVE IMAGE COLOR';
export const UPDATE_IMAGE_COLOR = '[E-COMMERCE APP] UPDATE IMAGE COLOR';
export const DELETE_IMAGE_COLOR = '[E-COMMERCE APP] DELETE IMAGE COLOR';
export const SET_IMAGES_ORDER = '[E-COMMERCE APP] SET IMAGES ORDER';
export const SET_SAVE_IMAGE_LOADER = '[E-COMMERCE APP] SET SAVE IMAGE LOADER';
export const SET_TOP_IMAGE_LOADER = '[E-COMMERCE APP] SET TOP IMAGE LOADER';
export const SET_DELETE_IMAGE_LOADER = '[E-COMMERCE APP] SET DELETE IMAGE LOADER';
export const SET_SAVE_IMAGE_COLOR_LOADER = '[E-COMMERCE APP] SET SAVE IMAGE COLOR LOADER';
export const SET_UPDATE_IMAGE_COLOR_LOADER = '[E-COMMERCE APP] SET UPDATE IMAGE COLOR LOADER';
export const SET_DELETE_IMAGE_COLOR_LOADER = '[E-COMMERCE APP] SET DELETE IMAGE COLOR LOADER';
export const SET_IMAGES_ORDER_LOADER = '[E-COMMERCE APP] SET IMAGES ORDER LOADER';

export function getProductImages(id) {
	const request = axios.get(settingsConfig.host_url + 'product/' + id + '/?fields=id,name,images,top_image,color');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCT_IMAGES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_PRODUCT_IMAGES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function saveImage(data) {
	const request = axios.post(settingsConfig.host_url + 'product/image/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Image Saved Successfully.', variant: 'success' }));
				return dispatch({
					type: SAVE_IMAGE
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SAVE_IMAGE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function topImage(id) {
	const request = axios.post(settingsConfig.host_url + 'product/image/' + id + '/top');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Image maked as top Successfully.', variant: 'success' }));
				return dispatch({
					type: TOP_IMAGE,
					payload: id
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_TOP_IMAGE_LOADER,
					payload: null
				});
			});
}

export function deleteImage(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/image/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Image Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_IMAGE,
					payload: id
				});
			})
			.catch((error) => {
				dispatch(displayError(error));

				return dispatch({
					type: SET_DELETE_IMAGE_LOADER,
					payload: false
				});
			});
}

export function saveImageColor(data) {
	let request = axios.post(settingsConfig.host_url + 'product/color', data);
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Color added successfully.', variant: 'success' }));

				return dispatch({
					type: SAVE_IMAGE_COLOR,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_SAVE_IMAGE_COLOR_LOADER,
					payload: false
				});
			});
}

export function updateImageColor(obj) {
	const request = axios.patch(settingsConfig.host_url + 'product/color/' + obj.id, obj);
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Color Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_IMAGE_COLOR,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_IMAGE_COLOR_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteImageColor(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/color/' + id);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Color Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_IMAGE_COLOR,
					payload: id
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_DELETE_IMAGE_COLOR_LOADER,
					payload: false
				});
			});
}

export function setImagesOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'product/move-image/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				return dispatch({
					type: SET_IMAGES_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_IMAGES_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}

export function setProductImagesLoader(value) {
	return {
		type: SET_PRODUCT_IMAGES_LOADER,
		payload: value
	};
}
export function setSaveImageLoader(value) {
	return {
		type: SET_SAVE_IMAGE_LOADER,
		payload: value
	};
}
export function setTopImageLoader(value) {
	return {
		type: SET_TOP_IMAGE_LOADER,
		payload: value
	};
}
export function setDeleteImageLoader(value) {
	return {
		type: SET_DELETE_IMAGE_LOADER,
		payload: value
	};
}
export function setSaveImageColorLoader(value) {
	return {
		type: SET_SAVE_IMAGE_COLOR_LOADER,
		payload: value
	};
}
export function setUpdateImageColorLoader(value) {
	return {
		type: SET_UPDATE_IMAGE_COLOR_LOADER,
		payload: value
	};
}
export function setDeleteImageColorLoader(value) {
	return {
		type: SET_DELETE_IMAGE_COLOR_LOADER,
		payload: value
	};
}
export function setImagesOrderLoader(value) {
	return {
		type: SET_IMAGES_ORDER_LOADER,
		payload: value
	};
}
