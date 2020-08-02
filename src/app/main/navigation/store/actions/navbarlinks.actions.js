import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import { showMessage } from 'app/store/actions/fuse';

import displayError from 'app/main/commonactions/displayError';

export const GET_NAVBAR_LINKS = '[E-COMMERCE APP] GET NAVBAR LINKS';
export const CREATE_NAVBAR_LINK = '[E-COMMERCE APP] CREATE NAVBAR LINK';
export const UPDATE_NAVBAR_LINK = '[E-COMMERCE APP] UPDATE NAVBAR LINK';
export const DELETE_NAVBAR_LINK = '[E-COMMERCE APP] DELETE NAVBAR LINK';
export const SET_NAVBAR_LINK_ORDER = '[E-COMMERCE APP] SET NAVBAR LINK ORDER';

export const SET_NAVBAR_LINKS_LOADER = '[E-COMMERCE APP] SET NAVBAR LINKS LOADER';
export const SET_CREATE_NAVBAR_LINK_LOADER = '[E-COMMERCE APP] SET CREATE NAVBAR LINK LOADER';
export const SET_UPDATE_NAVBAR_LINK_LOADER = '[E-COMMERCE APP] SET UPDATE NAVBAR LINK LOADER';
export const SET_DELETE_NAVBAR_LINK_LOADER = '[E-COMMERCE APP] SET DELETE NAVBAR LINK LOADER';
export const SET_NAVBAR_LINK_ORDER_LOADER = '[E-COMMERCE APP] SET NAVBAR LINK ORDER LOADER';

export const navbarlinksURl = settingsConfig.host_url + 'storefront/navbar/';

export function getNavbarLinks() {
	const request = axios.get(navbarlinksURl);

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_NAVBAR_LINKS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_NAVBAR_LINKS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function createNavbarLink(data) {
	const request = axios.post(settingsConfig.host_url + 'storefront/navbar/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: CREATE_NAVBAR_LINK,
					payload: response.data
				});
				dispatch(showMessage({ message: 'Navbar Link Created Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_NAVBAR_LINK_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateNavbarLink(data) {
	const request = axios.put(settingsConfig.host_url + 'storefront/navbar/' + data.id + '/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: UPDATE_NAVBAR_LINK,
					payload: response.data
				});
				dispatch(showMessage({ message: 'Navbar Link Updated Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_NAVBAR_LINK_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteNavbarLink(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/navbar/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_NAVBAR_LINK,
					payload: id
				});
				dispatch(showMessage({ message: 'Navbar Link Deleted Successfully.', variant: 'success' }));
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_NAVBAR_LINK_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setNavbarLinkOrder(obj) {
	const request = axios.post(settingsConfig.host_url + 'storefront/navbar/move-position/' + obj.id + '/', {
		position: obj.position
	});

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Order Saved Successfully.', variant: 'success' }));
				dispatch({
					type: SET_NAVBAR_LINK_ORDER,
					payload: response
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_NAVBAR_LINK_ORDER_LOADER,
					payload: 'error'
				});
				dispatch(displayError(error));
			});
}

export function setNavbarLinksLoader(value) {
	return {
		type: SET_NAVBAR_LINKS_LOADER,
		payload: value
	};
}
export function setCreateNavbarLinkLoader(value) {
	return {
		type: SET_CREATE_NAVBAR_LINK_LOADER,
		payload: value
	};
}
export function setUpdateNavbarLinkLoader(value) {
	return {
		type: SET_UPDATE_NAVBAR_LINK_LOADER,
		payload: value
	};
}
export function setDeleteNavbarLinkLoader(value) {
	return {
		type: SET_DELETE_NAVBAR_LINK_LOADER,
		payload: value
	};
}
export function setNavbarLinkOrderLoader(value) {
	return {
		type: SET_NAVBAR_LINK_ORDER_LOADER,
		payload: value
	};
}
