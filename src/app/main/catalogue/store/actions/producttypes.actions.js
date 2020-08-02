import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_PRODUCT_TYPES = '[E-COMMERCE APP] GET PRODUCT TYPES';
export const SET_PRODUCT_TYPES_SEARCH_TEXT = '[E-COMMERCE APP] SET PRODUCT TYPES SEARCH TEXT';
export const SET_PRDCT_TYPES_LOADER = '[E-COMMERCE APP] SET LOADER PRODUCT TYPES LOADER';

export const productTypesURl =
	settingsConfig.host_url + 'product/type/?fields=id,name,product_attributes,variant_attributes';

export function getProductTypes() {
	const request = axios.get(productTypesURl);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCT_TYPES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_PRDCT_TYPES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setProductTypesSearchText(value) {
	return {
		type: SET_PRODUCT_TYPES_SEARCH_TEXT,
		searchText: value
	};
}
export function setProductTypesLoader(value) {
	return {
		type: SET_PRDCT_TYPES_LOADER,
		payload: value
	};
}
