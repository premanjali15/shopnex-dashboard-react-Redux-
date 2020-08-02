import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_TAXES = '[E-COMMERCE APP] GET TAXES';
export const CREATE_TAX = '[E-COMMERCE APP] CREATE TAX';
export const UPDATE_TAX = '[E-COMMERCE APP] UPDATE TAX';
export const DELETE_TAX = '[E-COMMERCE APP] DELETE TAX';
export const SET_TAXES_LOADER = '[E-COMMERCE APP] SET TAXES LOADER';
export const SET_CREATE_TAX_LOADER = '[E-COMMERCE APP] SET CREATE TAX LOADER';
export const SET_UPDATE_TAX_LOADER = '[E-COMMERCE APP] SET UPDATE TAX LOADER';
export const SET_DELETE_TAX_LOADER = '[E-COMMERCE APP] SET DELETE TAX LOADER';

export const taxesURl = settingsConfig.host_url + 'conf/tax/list?fields=id,name,value';

export function getTaxes() {
	const request = axios.get(taxesURl);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_TAXES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_TAXES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function createTax(obj) {
	const request = axios.post(settingsConfig.host_url + 'conf/tax/list', obj);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Tax Created Successfully.', variant: 'success' }));
				return dispatch({
					type: CREATE_TAX,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_TAX_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateTax(obj) {
	const request = axios.patch(settingsConfig.host_url + 'conf/tax/modify/' + obj.id, obj);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Tax Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_TAX,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_TAX_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteTax(id) {
	const request = axios.delete(settingsConfig.host_url + 'conf/tax/modify/' + id);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Tax Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_TAX,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_TAX_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setTaxesLoader(value) {
	return {
		type: SET_TAXES_LOADER,
		payload: value
	};
}
export function setCreateTaxLoader(value) {
	return {
		type: SET_CREATE_TAX_LOADER,
		payload: value
	};
}
export function setUpdateTaxLoader(value) {
	return {
		type: SET_UPDATE_TAX_LOADER,
		payload: value
	};
}
export function setDeleteTaxLoader(value) {
	return {
		type: SET_DELETE_TAX_LOADER,
		payload: value
	};
}
