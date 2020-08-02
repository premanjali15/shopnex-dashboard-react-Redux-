import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_INSTA_SECTION_DETAILS = '[E-COMMERCE APP] GET INSTA SECTION DETAILS';
export const SET_INSTA_SECTION_DETAILS_LOADER = '[E-COMMERCE APP] SET INSTA SECTION DETAILS LOADER';

export const DELETE_INSTA_POST = '[E-COMMERCE APP] DELETE INSTA POST';
export const SET_DELETE_INSTA_POST_LOADER = '[E-COMMERCE APP] SET DELETE INSTA POST LOADER';

export const SET_INSTASECTION_POSTS_ORDER = '[E-COMMERCE APP] SET INSTASECTION POSTS ORDER';
export const SET_INSTASECTION_POSTS_ORDER_LOADER = '[E-COMMERCE APP] SET INSTASECTION POSTS ORDER LOADER';

export function getInstaSectionDetails(id) {
	const request = axios.get(settingsConfig.host_url + 'storefront/instagram-section/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_INSTA_SECTION_DETAILS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_INSTA_SECTION_DETAILS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setInstaSectionDetailsLoader(value) {
	return {
		type: SET_INSTA_SECTION_DETAILS_LOADER,
		payload: value
	};
}

export function deleteInstaPost(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/instagram-post/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'InstaPost Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_INSTA_POST,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_INSTA_POST_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteInstaPostLoader(value) {
	return {
		type: SET_DELETE_INSTA_POST_LOADER,
		payload: value
	};
}

export function setInstaSectionPostsOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/instagram-post/move-position/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				dispatch({
					type: SET_INSTASECTION_POSTS_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_INSTASECTION_POSTS_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}
export function setInstaSectionPostsOrderLoader(value) {
	return {
		type: SET_INSTASECTION_POSTS_ORDER_LOADER,
		payload: value
	};
}
