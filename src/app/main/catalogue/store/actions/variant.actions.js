import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_VARIANT = '[E-COMMERCE APP] GET VARIANT';
export const SET_VARIANT_LOADER = '[E-COMMERCE APP] SET VARIANT LOADER';
export const SAVE_VARIANT = '[E-COMMERCE APP] SAVE VARIANT';
export const SET_VARIANT_SAVE_VALUE = '[E-COMMERCE APP] SET VARIANT SAVE VALUE';

export function getVariant(id) {
	const request = axios.get(settingsConfig.host_url + 'product/variant/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_VARIANT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_VARIANT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function newVariant(id) {
	const data = {
		sku: '',
		price_override: '',
		attributes: {},
		quantity: '',
		cost_price: '',
		weight: '',
		product: id,
		type: 'new'
	};

	return {
		type: GET_VARIANT,
		payload: data
	};
}

export function saveVariant(data) {
	let request;
	if (data.type === 'new') request = axios.post(settingsConfig.host_url + 'product/variant/', data);
	else request = axios.put(settingsConfig.host_url + 'product/variant/' + data.id + '/', data);
	return (dispatch) =>
		request
			.then((response) => {
				if (data.type === 'new')
					dispatch(showMessage({ message: 'Variant Saved Successfully.', variant: 'success' }));
				else dispatch(showMessage({ message: 'Variant Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: SAVE_VARIANT,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch(displayError(error));
				return dispatch({
					type: SET_VARIANT_SAVE_VALUE,
					payload: false
				});
			});
}

export function setVariantLoader(value) {
	return {
		type: SET_VARIANT_LOADER,
		payload: value
	};
}
export function setVariantSaveValue(value) {
	return {
		type: SET_VARIANT_SAVE_VALUE,
		payload: value
	};
}
