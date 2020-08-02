import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_FLAT_PAGES = '[E-COMMERCE APP] GET FLAT PAGES';
export const SET_FLAT_PAGES_LOADER = '[E-COMMERCE APP] SET FLAT PAGES LOADER';

export const DELETE_FLAT_PAGE = '[E-COMMERCE APP] DELETE FLAT PAGE';
export const SET_DELETE_FLAT_PAGE_LOADER = '[E-COMMERCE APP] SET DELETE FLAT PAGE LOADER';

export function getFlatPages() {
	const request = axios.get(settingsConfig.host_url + 'storefront/flatpage/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_FLAT_PAGES,
					payload: response.data
				});
			})
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SET_FLAT_PAGES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setFlatPagesLoader(value) {
	return {
		type: SET_FLAT_PAGES_LOADER,
		payload: value
	};
}

export function deleteFlatPage(id) {
	const request = axios.delete(settingsConfig.host_url + 'storefront/flatpage/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_FLAT_PAGE,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_FLAT_PAGE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setDeleteFlatPageLoader(value) {
	return {
		type: SET_DELETE_FLAT_PAGE_LOADER,
		payload: value
	};
}
