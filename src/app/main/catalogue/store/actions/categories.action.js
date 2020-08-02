import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_CATEGORIES = '[E-COMMERCE APP] GET CATEGORIES';
export const SET_CATGORIES_LOADER = '[E-COMMERCE APP] SET CATEGORIES LOADER';
export const CREATE_CATEGORY = '[E-COMMERCE APP] CREATE CATEGORY';
export const UPDATE_CATEGORY = '[E-COMMERCE APP] UPDATE CATEGORY';
export const DELETE_CATEGORY = '[E-COMMERCE APP] DELETE CATEGORY';
export const SET_CREATE_CATEGORY_LOADER = '[E-COMMERCE APP] SET CREATE CATEGORY LOADER';
export const SET_UPDATE_CATEGORY_LOADER = '[E-COMMERCE APP] SET UPDATE CATEGORY LOADER';
export const SET_DELETE_CATEGORY_LOADER = '[E-COMMERCE APP] SET DELETE CATEGORY LOADER';
export const SET_CATEGORIES_SEARCH_TEXT = '[E-COMMERCE APP] SET CATEGORIES SEARCH TEXT';

export const categoriesURl =
	settingsConfig.host_url + 'product/category/?fields=id,name,available_products,total_products,background_image';

export function getCategories() {
	const request = axios.get(categoriesURl);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_CATEGORIES,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CATGORIES_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function createCategory(data) {
	const request = axios.post(settingsConfig.host_url + 'product/category/', data);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Category Created Successfully.', variant: 'success' }));
				return dispatch({
					type: CREATE_CATEGORY,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_CREATE_CATEGORY_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateCategory(obj) {
	const request = axios.patch(settingsConfig.host_url + 'product/category/' + obj.id + '/', obj);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Category Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_CATEGORY,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_CATEGORY_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteCategory(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/category/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Category Deleted Successfully.', variant: 'success' }));
				return dispatch({
					type: DELETE_CATEGORY,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_CATEGORY_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setCategoriesLoader(value) {
	return {
		type: SET_CATGORIES_LOADER,
		payload: value
	};
}
export function setCreateCategoryLoader(value) {
	return {
		type: SET_CREATE_CATEGORY_LOADER,
		payload: value
	};
}
export function setUpdateCategoryLoader(value) {
	return {
		type: SET_UPDATE_CATEGORY_LOADER,
		payload: value
	};
}
export function setDeleteCategoryLoader(value) {
	return {
		type: SET_DELETE_CATEGORY_LOADER,
		payload: value
	};
}
export function setCategoriesSearchText(value) {
	return {
		type: SET_CATEGORIES_SEARCH_TEXT,
		searchText: value
	};
}
