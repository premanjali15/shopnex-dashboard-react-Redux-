import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_INSTAGRAM_SECTIONS = '[E-COMMERCE APP] GET INSTAGRAM SECTIONS';
export const SET_INSTAGRAM_SECTIONS_LOADER = '[E-COMMERCE APP] SET INSTAGRAM SECTIONS LOADER';

export const CREATE_INSTAGRAM_SECTION = '[E-COMMERCE APP] CREATE INSTAGRAM SECTION';
export const SET_CREATE_INSTAGRAM_SECTION_LOADER = '[E-COMMERCE APP] SET CREATE INSTAGRAM SECTION LOADER';

export const UPDATE_INSTAGRAM_SECTION = '[E-COMMERCE APP] UPDATE INSTAGRAM SECTION';
export const SET_UPDATE_INSTAGRAM_SECTION_LOADER = '[E-COMMERCE APP] SET UPDATE INSTAGRAM SECTION LOADER';

export const DELETE_INSTAGRAM_SECTION = '[E-COMMERCE APP] DELETE INSTAGRAM SECTION';
export const SET_DELETE_INSTAGRAM_SECTION_LOADER = '[E-COMMERCE APP] SET DELETE INSTAGRAM SECTION LOADER';

export const ADD_INSTAGRAM_SECTION_TO_HOME = '[E-COMMERCE APP] ADD INSTAGRAM SECTION TO HOME';
export const SET_ADD_INSTAGRAM_SECTION_TO_HOME_LOADER = '[E-COMMERCE APP] SET ADD INSTAGRAM SECTION TO HOME LOADER';

export function getInstagramSections() {
	const request = axios.get(
		settingsConfig.host_url + 'storefront/instagram-section/?fields=id,title,in_home,item_count'
	);

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_INSTAGRAM_SECTIONS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_INSTAGRAM_SECTIONS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setInstagramSectionsLoader(value) {
	return {
		type: SET_INSTAGRAM_SECTIONS_LOADER,
		payload: value
	};
}

export function createInstagramSection(title) {
	const request = axios.post(settingsConfig.host_url + 'storefront/instagram-section/', { title: title });

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Instagram Section Created Successfully.', variant: 'success' }));
				dispatch({
					type: CREATE_INSTAGRAM_SECTION,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_INSTAGRAM_SECTION_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setCreateInstagramSectionLoader(value) {
	return {
		type: SET_CREATE_INSTAGRAM_SECTION_LOADER,
		payload: value
	};
}

export function updateInstagramSection(obj) {
	const request = axios.put(settingsConfig.host_url + 'storefront/instagram-section//' + obj.id + '/', {
		title: obj.title
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Instagram Section Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_INSTAGRAM_SECTION,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_INSTAGRAM_SECTION_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateInstagramSectionLoader(value) {
	return {
		type: SET_UPDATE_INSTAGRAM_SECTION_LOADER,
		payload: value
	};
}

export function deleteInstagramSection(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/instagram-section/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_INSTAGRAM_SECTION,
					payload: id
				});
				dispatch(showMessage({ message: 'Instagram Section Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_INSTAGRAM_SECTION_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteInstagramSectionlLoader(value) {
	return {
		type: SET_DELETE_INSTAGRAM_SECTION_LOADER,
		payload: value
	};
}

export function addInstagramSectionToHome(id) {
	const request = axios.post(settingsConfig.host_url + 'storefront/instagram-section/add-to-home/' + id + '/', '');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Instagram Section Added To Home Successfully.', variant: 'success' }));
				return dispatch({
					type: ADD_INSTAGRAM_SECTION_TO_HOME,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_ADD_INSTAGRAM_SECTION_TO_HOME_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setAddInstagramSectionToHomeLoader(value) {
	return {
		type: SET_ADD_INSTAGRAM_SECTION_TO_HOME_LOADER,
		payload: value
	};
}
