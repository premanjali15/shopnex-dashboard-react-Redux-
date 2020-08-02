import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_FLAT_PAGE = '[E-COMMERCE APP] GET FLAT PAGE';
export const SET_FLAT_PAGE_LOADER = '[E-COMMERCE APP] SET FLAT PAGE LOADER';

export const SAVE_FLAT_PAGE = '[E-COMMERCE APP] SAVE FLAT PAGE';
export const SET_SAVE_FLAT_PAGE_LOADER = '[E-COMMERCE APP] SET SAVE FLAT PAGE LOADER';

export function getFlatPage(id) {
	if (id === 'new') {
		let data = {
			url: '',
			title: '',
			content: '',
			registration_required: false,
			sites: [ 1 ],
			type: 'new'
		};
		return {
			type: GET_FLAT_PAGE,
			payload: data
		};
	} else {
		const request = axios.get(settingsConfig.host_url + 'storefront/flatpage/' + id + '/');
		return (dispatch) =>
			request
				.then((response) => {
					dispatch({
						type: GET_FLAT_PAGE,
						payload: response.data
					});
				})
				.catch((error) => {
					dispatch(displayError(error));
					return dispatch({
						type: SET_FLAT_PAGE_LOADER,
						payload: false
					});
				});
	}
}
export function setFlatPageLoader(value) {
	return {
		type: SET_FLAT_PAGE_LOADER,
		payload: value
	};
}

export function saveFlatPage(data) {
	let request;
	if (data.type === 'new') {
		request = axios.post(settingsConfig.host_url + 'storefront/flatpage/', data);
	} else {
		request = axios.patch(settingsConfig.host_url + 'storefront/flatpage/' + data.id + '/', data);
	}
	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new') {
					dispatch(showMessage({ message: 'Page Added Successfully.', variant: 'success' }));
				} else {
					dispatch(showMessage({ message: 'Page Updated Successfully.', variant: 'success' }));
				}
				return dispatch({
					type: SAVE_FLAT_PAGE,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_SAVE_FLAT_PAGE_LOADER,
					payload: false
				});
			});
}
export function setSaveFlatPageLoader(value) {
	return {
		type: SET_SAVE_FLAT_PAGE_LOADER,
		payload: value
	};
}
