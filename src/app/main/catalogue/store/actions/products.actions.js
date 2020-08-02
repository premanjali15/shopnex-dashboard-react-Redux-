import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_PRODUCTS = '[E-COMMERCE APP] GET PRODUCTS';
export const SET_PRODUCTS_SEARCH_TEXT = '[E-COMMERCE APP] SET PRODUCTS SEARCH TEXT';
export const SET_GETTING_PRODUCTS = '[E-COMMERCE APP] SET GETTING PRODUCTS';
export const SET_LOADER = '[E-COMMERCE APP] SET LOADER';
export const SET_SEARCH_LOADER = '[E-COMMERCE APP] SET_SEARCH_LOADER';

export function getProducts(searchText) {
	const request = axios.get(
		settingsConfig.host_url +
			'product/?fields=id,name,slug,price,category,top_image,stock,available,category_name,sku&search=' +
			searchText
	);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_PRODUCTS,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_LOADER,
					payload: false
				});
				dispatch({
					type: SET_SEARCH_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setProductsSearchText(value) {
	return {
		type: SET_PRODUCTS_SEARCH_TEXT,
		payload: value
	};
}

export function setLoader(value) {
	return {
		type: SET_LOADER,
		payload: value
	};
}
export function setSearchLoader(value) {
	return {
		type: SET_SEARCH_LOADER,
		payload: value
	};
}
