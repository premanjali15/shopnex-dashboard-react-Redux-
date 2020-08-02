import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_SWIPERS = '[E-COMMERCE APP] GET SWIPERS';
export const SET_SWIPERS_LOADER = '[E-COMMERCE APP] SET SWIPERS LOADER';

export const CREATE_SWIPER = '[E-COMMERCE APP] CREATE SWIPER';
export const SET_CREATE_SWIPER_LOADER = '[E-COMMERCE APP] SET CREATE SWIPER LOADER';

export const UPDATE_SWIPER = '[E-COMMERCE APP] UPDATE SWIPER';
export const SET_UPDATE_SWIPER_LOADER = '[E-COMMERCE APP] SET UPDATE SWIPER LOADER';

export const DELETE_SWIPER = '[E-COMMERCE APP] DELETE SWIPER';
export const SET_DELETE_SWIPER_LOADER = '[E-COMMERCE APP] SET DELETE SWIPER LOADER';

export const ADD_SWIPER_TO_HOME = '[E-COMMERCE APP] ADD SWIPER TO HOME';
export const SET_ADD_SWIPER_TO_HOME_LOADER = '[E-COMMERCE APP] SET ADD SWIPER TO HOME LOADER';

export const swipersURl = settingsConfig.host_url + 'storefront/swiper/';

export function getSwipers() {
	const request = axios.get(swipersURl);

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_SWIPERS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_SWIPERS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setSwipersLoader(value) {
	return {
		type: SET_SWIPERS_LOADER,
		payload: value
	};
}

export function createSwiper(data) {
	const request = axios.post(settingsConfig.host_url + 'storefront/swiper/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: CREATE_SWIPER,
					payload: response.data
				});
				dispatch(showMessage({ message: 'Swiper Created Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_SWIPER_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCreateSwiperLoader(value) {
	return {
		type: SET_CREATE_SWIPER_LOADER,
		payload: value
	};
}

export function updateSwiper(data) {
	const request = axios.put(settingsConfig.host_url + 'storefront/swiper/' + data.id + '/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: UPDATE_SWIPER,
					payload: response.data
				});
				dispatch(showMessage({ message: 'Swiper Updated Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_SWIPER_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateSwiperLoader(value) {
	return {
		type: SET_UPDATE_SWIPER_LOADER,
		payload: value
	};
}

export function deleteSwiper(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/swiper/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_SWIPER,
					payload: id
				});
				dispatch(showMessage({ message: 'Swiper Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_SWIPER_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteSwiperLoader(value) {
	return {
		type: SET_DELETE_SWIPER_LOADER,
		payload: value
	};
}

export function addSwiperToHome(id) {
	const request = axios.post(settingsConfig.host_url + 'storefront/swiper/add-to-home/' + id + '/', '');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Swiper Added To Home Successfully.', variant: 'success' }));
				return dispatch({
					type: ADD_SWIPER_TO_HOME,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ADD_SWIPER_TO_HOME_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setAddSwiperToHomeLoader(value) {
	return {
		type: SET_ADD_SWIPER_TO_HOME_LOADER,
		payload: value
	};
}
