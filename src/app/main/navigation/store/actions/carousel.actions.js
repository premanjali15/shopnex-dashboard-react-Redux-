import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_CAROUSEL = '[E-COMMERCE APP] GET CAROUSEL';
export const SET_CAROUSEL_LOADER = '[E-COMMERCE APP] SET CAROUSEL LOADER';
export const SAVE_CAROUSEL_IMAGE = '[E-COMMERCE APP] SAVE_CAROUSEL_IMAGE';
export const SET_SAVE_CAROUSEL_IMAGE_LOADER = '[E-COMMERCE APP] SET SAVE CAROUSEL IMAGE LOADER';
export const GET_HOME_DATA = '[E-COMMERCE APP] GET HOME DATA';
export const SET_HOME_DATA_LOADER = '[E-COMMERCE APP] SET HOME DATA LOADER';
export const SET_SAVE_CAROUSEL_IMAGE_OBJ_LOADER = '[E-COMMERCE APP] SET SAVE CAROUSEL IMAGE OBJ LOADER';
export const SAVE_CAROUSEL_IMAGE_OBJ = '[E-COMMERCE APP] SAVE CAROUSEL IMAGE OBJ';
export const SET_DELETE_IMAGE_OBJ_LOADER = '[E-COMMERCE APP] SET DELETE IMAGE OBJ LOADER';
export const DELETE_IMAGE_OBJ = '[E-COMMERCE APP] DELETE IMAGE OBJ';
export const SET_CAROUSEL_IMG_ORDER_LOADER = '[E-COMMERCE APP] SET CAROUSEL IMG ORDER LOADER';
export const SET_CAROUSEL_IMG_ORDER = '[E-COMMERCE APP] SET CAROUSEL IMG ORDER';

export function getCarousel(id) {
	const request = axios.get(settingsConfig.host_url + 'storefront/carousel/' + id + '/');
	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_CAROUSEL,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_CAROUSEL_LOADER,
					payload: false
				});
			});
}

export function getHomeData() {
	const request = axios.get(settingsConfig.host_url + 'storefront/data/');
	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_HOME_DATA,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_HOME_DATA_LOADER,
					payload: false
				});
			});
}

export function saveCarouselImageObj(data) {
	let request = axios.patch(settingsConfig.host_url + 'storefront/carousel/images/' + data.id + '/', data);
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Carousel Updated Successfully.', variant: 'success' }));

				return dispatch({
					type: SAVE_CAROUSEL_IMAGE_OBJ,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));

				return dispatch({
					type: SET_SAVE_CAROUSEL_IMAGE_OBJ_LOADER,
					payload: false
				});
			});
}

export function saveCarouselImage(obj) {
	let request;
	if (obj.id === 'new') {
		delete obj.id;
		request = axios.post(settingsConfig.host_url + 'storefront/carousel/images/', obj);
	} else {
		request = axios.patch(settingsConfig.host_url + 'storefront/carousel/images/' + obj.id + '/', {
			image: obj.image
		});
	}
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Carousel Image Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: SAVE_CAROUSEL_IMAGE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_SAVE_CAROUSEL_IMAGE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteImageObj(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/carousel/images/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Image Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_IMAGE_OBJ,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_IMAGE_OBJ_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setCarouselImgOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/carousel/move-images/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				return dispatch({
					type: SET_CAROUSEL_IMG_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CAROUSEL_IMG_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}

export function setCarouselLoader(value) {
	return {
		type: SET_CAROUSEL_LOADER,
		payload: value
	};
}
export function setSaveCarouselImageLoader(value) {
	return {
		type: SET_SAVE_CAROUSEL_IMAGE_LOADER,
		payload: value
	};
}
export function setHomeDataLoader(value) {
	return {
		type: SET_HOME_DATA_LOADER,
		payload: value
	};
}
export function setSaveCarouselImageObjLoader(value) {
	return {
		type: SET_SAVE_CAROUSEL_IMAGE_OBJ_LOADER,
		payload: value
	};
}
export function setDeleteImageObjLoader(value) {
	return {
		type: SET_DELETE_IMAGE_OBJ_LOADER,
		payload: value
	};
}
export function setCarouselImgOrderLoader(value) {
	return {
		type: SET_CAROUSEL_IMG_ORDER_LOADER,
		payload: value
	};
}
