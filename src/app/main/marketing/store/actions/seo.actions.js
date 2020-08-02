import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';
import displayError from 'app/main/commonactions/displayError';

export const GET_SEO_HOME_DATA = '[E-COMMERCE APP] GET SEO HOME DATA';
export const SET_SEO_HOME_DATA_LOADER = '[E-COMMERCE APP] SET SEO HOME DATA LOADER';

export const UPDATE_SEO_HOME_DATA = '[E-COMMERCE APP] UPDATE SEO HOME DATA';
export const SET_UPDATE_SEO_HOME_DATA_LOADER = '[E-COMMERCE APP] SET UPDATE SEO HOME DATA LOADER';

export const GET_SEO_PAGES = '[E-COMMERCE APP] GET SEO PAGES';
export const SET_SEO_PAGES_LOADER = '[E-COMMERCE APP] SET SEO PAGES LOADER';

export const UPDATE_SEO_PAGE = '[E-COMMERCE APP] UPDATE SEO PAGE';
export const SET_UPDATE_SEO_PAGE_LOADER = '[E-COMMERCE APP] SET UPDATE SEO PAGE LOADER';

export const GET_SEO_PRODUCTS = '[E-COMMERCE APP] GET SEO PRODUCTS';
export const SET_SEO_PRODUCTS_LOADER = '[E-COMMERCE APP] SET SEO PRODUCTS LOADER';

export function getSeoHomeData() {
	const request = axios.get(settingsConfig.host_url + 'seo/home/');
	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_SEO_HOME_DATA,
					payload: response.data[0]
				})
			)
			.catch((err) => {
				console.log(err);
				dispatch({
					type: SET_SEO_HOME_DATA_LOADER,
					payload: false
				});
			});
}
export function setSeoHomeDataLoader(value) {
	return {
		type: SET_SEO_HOME_DATA_LOADER,
		payload: value
	};
}

export function updateSeoHomeData(data) {
	const request = axios.patch(settingsConfig.host_url + 'seo/home/1/', data);
	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Data Updated Successfully.', variant: 'success' }));
				dispatch({
					type: UPDATE_SEO_HOME_DATA,
					payload: response.data
				});
			})
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SET_UPDATE_SEO_HOME_DATA_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateSeoHomeDataLoader(value) {
	return {
		type: SET_UPDATE_SEO_HOME_DATA_LOADER,
		payload: value
	};
}

export function getSeoPages() {
	const request = axios.get(settingsConfig.host_url + 'seo/pages/');
	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_SEO_PAGES,
					payload: response.data
				})
			)
			.catch((err) => {
				console.log(err);
				dispatch({
					type: SET_SEO_PAGES_LOADER,
					payload: false
				});
			});
}
export function setSeoPagesLoader(value) {
	return {
		type: SET_SEO_PAGES_LOADER,
		payload: value
	};
}

export function updateSeoPage(data, type) {
	let request;
	if (type === 'category') {
		request = axios.patch(settingsConfig.host_url + 'seo/category/' + data.id + '/', data);
	} else {
		request = axios.patch(settingsConfig.host_url + 'seo/collection/' + data.id + '/', data);
	}
	return (dispatch) =>
		request
			.then((response) => {
				let obj = {
					payloadData: response.data,
					type: type
				};
				dispatch(showMessage({ message: 'Page Updated Successfully.', variant: 'success' }));
				dispatch({
					type: UPDATE_SEO_PAGE,
					payload: obj
				});
			})
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SET_UPDATE_SEO_PAGE_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}
export function setUpdateSeoPageLoader(value) {
	return {
		type: SET_UPDATE_SEO_PAGE_LOADER,
		payload: value
	};
}

export function getSeoProducts(searchText) {
	const request = axios.get(settingsConfig.host_url + 'seo/product/?search=' + searchText);
	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_SEO_PRODUCTS,
					payload: response.data
				})
			)
			.catch((err) => {
				console.log(err);
				dispatch({
					type: SET_SEO_PAGES_LOADER,
					payload: false
				});
			});
}
export function setSeoProductsLoader(value) {
	return {
		type: SET_SEO_PRODUCTS_LOADER,
		payload: value
	};
}
