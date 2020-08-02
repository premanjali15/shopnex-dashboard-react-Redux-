import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_CAROUSELS = '[E-COMMERCE APP] GET CAROUSELS';
export const SET_CAROUSELS_LOADER = '[E-COMMERCE APP] SET CAROUSELS LOADER';

export const CREATE_CAROUSEL = '[E-COMMERCE APP] CREATE CAROUSEL';
export const SET_CREATE_CAROUSEL_LOADER = '[E-COMMERCE APP] SET CREATE CAROUSEL LOADER';

export const UPDATE_CAROUSEL = '[E-COMMERCE APP] UPDATE CAROUSEL';
export const SET_UPDATE_CAROUSEL_LOADER = '[E-COMMERCE APP] SET UPDATE CAROUSEL LOADER';

export const DELETE_CAROUSEL = '[E-COMMERCE APP] DELETE CAROUSEL';
export const SET_DELETE_CAROUSEL_LOADER = '[E-COMMERCE APP] SET DELETE CAROUSEL LOADER';

export const ADD_CAROUSEL_TO_HOME = '[E-COMMERCE APP] ADD CAROUSEL TO HOME';
export const SET_ADD_CAROUSEL_TO_HOME_LOADER = '[E-COMMERCE APP] SET ADD CAROUSEL TO HOME LOADER';

export function getCarousels() {
	const request = axios.get(settingsConfig.host_url + 'storefront/carousel/?fields=id,title,in_home,item_count');

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_CAROUSELS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_CAROUSELS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCarouselsLoader(value) {
	return {
		type: SET_CAROUSELS_LOADER,
		payload: value
	};
}

export function createCarousel(title) {
	const request = axios.post(settingsConfig.host_url + 'storefront/carousel/', { title: title });

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Carousel Created Successfully.', variant: 'success' }));
				return dispatch({
					type: CREATE_CAROUSEL,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_CAROUSEL_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCreateCarouselLoader(value) {
	return {
		type: SET_CREATE_CAROUSEL_LOADER,
		payload: value
	};
}

export function updateCarousel(obj) {
	const request = axios.put(settingsConfig.host_url + 'storefront/carousel/' + obj.id + '/', { title: obj.title });

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Carousel Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_CAROUSEL,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_CAROUSEL_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateCarouselLoader(value) {
	return {
		type: SET_UPDATE_CAROUSEL_LOADER,
		payload: value
	};
}

export function deleteCarousel(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/carousel/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_CAROUSEL,
					payload: id
				});
				dispatch(showMessage({ message: 'Carousel Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_CAROUSEL_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteCarouselLoader(value) {
	return {
		type: SET_DELETE_CAROUSEL_LOADER,
		payload: value
	};
}

export function addCarouselToHome(id) {
	const request = axios.post(settingsConfig.host_url + 'storefront/carousel/add-to-home/' + id + '/', '');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Carousel Added To Home Successfully.', variant: 'success' }));
				return dispatch({
					type: ADD_CAROUSEL_TO_HOME,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ADD_CAROUSEL_TO_HOME_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setAddCarouselToHomeLoader(value) {
	return {
		type: SET_ADD_CAROUSEL_TO_HOME_LOADER,
		payload: value
	};
}
