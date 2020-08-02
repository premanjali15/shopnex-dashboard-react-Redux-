import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_VIDEO_SECTIONS = '[E-COMMERCE APP] GET VIDEO SECTIONS';
export const SET_VIDEO_SECTIONS_LOADER = '[E-COMMERCE APP] SET VIDEO SECTIONS LOADER';

export const CREATE_VIDEO_SECTION = '[E-COMMERCE APP] CREATE VIDEO SECTION';
export const SET_CREATE_VIDEO_SECTION_LOADER = '[E-COMMERCE APP] SET CREATE VIDEO SECTION LOADER';

export const UPDATE_VIDEO_SECTION = '[E-COMMERCE APP] UPDATE VIDEO SECTION';
export const SET_UPDATE_VIDEO_SECTION_LOADER = '[E-COMMERCE APP] SET UPDATE VIDEO SECTION LOADER';

export const DELETE_VIDEO_SECTION = '[E-COMMERCE APP] DELETE VIDEO_SECTION';
export const SET_DELETE_VIDEO_SECTION_LOADER = '[E-COMMERCE APP] SET DELETE VIDEO SECTION LOADER';

export const ADD_VIDEO_SECTION_TO_HOME = '[E-COMMERCE APP] ADD VIDEO_SECTION TO HOME';
export const SET_ADD_VIDEO_SECTION_TO_HOME_LOADER = '[E-COMMERCE APP] SET ADD VIDEO SECTION TO HOME LOADER';

export function getVideoSections() {
	const request = axios.get(settingsConfig.host_url + 'storefront/video-section/?fields=id,title,in_home,item_count');

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_VIDEO_SECTIONS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_VIDEO_SECTIONS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setVideoSectionsLoader(value) {
	return {
		type: SET_VIDEO_SECTIONS_LOADER,
		payload: value
	};
}

export function createVideoSection(title) {
	const request = axios.post(settingsConfig.host_url + 'storefront/video-section/', { title: title });

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Video Section Created Successfully.', variant: 'success' }));
				dispatch({
					type: CREATE_VIDEO_SECTION,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_VIDEO_SECTION_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCreateVideoSectionLoader(value) {
	return {
		type: SET_CREATE_VIDEO_SECTION_LOADER,
		payload: value
	};
}

export function updateVideoSection(obj) {
	const request = axios.put(settingsConfig.host_url + 'storefront/video-section//' + obj.id + '/', {
		title: obj.title
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Video Section Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_VIDEO_SECTION,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_VIDEO_SECTION_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateVideoSectionLoader(value) {
	return {
		type: SET_UPDATE_VIDEO_SECTION_LOADER,
		payload: value
	};
}

export function deleteVideoSection(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/video-section/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_VIDEO_SECTION,
					payload: id
				});
				dispatch(showMessage({ message: 'Video Section Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_VIDEO_SECTION_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteVideoSectionlLoader(value) {
	return {
		type: SET_DELETE_VIDEO_SECTION_LOADER,
		payload: value
	};
}

export function addVideoSectionToHome(id) {
	const request = axios.post(settingsConfig.host_url + 'storefront/video-section/add-to-home/' + id + '/', '');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Video Section Added To Home Successfully.', variant: 'success' }));
				return dispatch({
					type: ADD_VIDEO_SECTION_TO_HOME,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ADD_VIDEO_SECTION_TO_HOME_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setAddVideoSectionToHomeLoader(value) {
	return {
		type: SET_ADD_VIDEO_SECTION_TO_HOME_LOADER,
		payload: value
	};
}
