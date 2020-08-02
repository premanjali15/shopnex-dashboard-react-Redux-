import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_VIDEO_SECTION_DETAILS = '[E-COMMERCE APP] GET VIDEO SECTION DETAILS';
export const SET_VIDEO_SECTION_DETAILS_LOADER = '[E-COMMERCE APP] SET VIDEO SECTION DETAILS LOADER';

export const CREATE_VIDEO = '[E-COMMERCE APP] CREATE VIDEO';
export const SET_CREATE_VIDEO_LOADER = '[E-COMMERCE APP] SET CREATE VIDEO LOADER';

export const UPDATE_VIDEO = '[E-COMMERCE APP] UPDATE VIDEO';
export const SET_UPDATE_VIDEO_LOADER = '[E-COMMERCE APP] SET UPDATE VIDEO LOADER';

export const DELETE_VIDEO = '[E-COMMERCE APP] DELETE VIDEO';
export const SET_DELETE_VIDEO_LOADER = '[E-COMMERCE APP] SET DELETE VIDEO LOADER';

export const SET_VIDEOSECTION_VIDEOS_ORDER = '[E-COMMERCE APP] SET VIDEOSECTION VIDEOS ORDER';
export const SET_VIDEOSECTION_VIDEOS_ORDER_LOADER = '[E-COMMERCE APP] SET VIDEOSECTION VIDEOS ORDER_LOADER';

export function getVideoSectionDetails(id) {
	const request = axios.get(settingsConfig.host_url + 'storefront/video-section/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_VIDEO_SECTION_DETAILS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_VIDEO_SECTION_DETAILS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setVideoSectionDetailsLoader(value) {
	return {
		type: SET_VIDEO_SECTION_DETAILS_LOADER,
		payload: value
	};
}

export function createVideo(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/video/', {
		product: obj.product,
		yt_id: obj.yt_id,
		section: obj.section
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Video Created Successfully.', variant: 'success' }));
				return dispatch({
					type: CREATE_VIDEO,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_VIDEO_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCreateVideoLoader(value) {
	return {
		type: SET_CREATE_VIDEO_LOADER,
		payload: value
	};
}

export function updateVideo(obj) {
	const request = axios.patch(settingsConfig.host_url + 'storefront/video/' + obj.id + '/', obj);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Video Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_VIDEO,
					payload: obj
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_VIDEO_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateVideoLoader(value) {
	return {
		type: SET_UPDATE_VIDEO_LOADER,
		payload: value
	};
}

export function deleteVideo(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/video/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Video Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_VIDEO,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_VIDEO_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteVideoLoader(value) {
	return {
		type: SET_DELETE_VIDEO_LOADER,
		payload: value
	};
}

export function setVidoeSectionVideosOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/video/move-position/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				dispatch({
					type: SET_VIDEOSECTION_VIDEOS_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_VIDEOSECTION_VIDEOS_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}
export function setVidoeSectionVideosOrderLoader(value) {
	return {
		type: SET_VIDEOSECTION_VIDEOS_ORDER_LOADER,
		payload: value
	};
}
