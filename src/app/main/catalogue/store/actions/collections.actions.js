import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_COLLECTIONS = '[E-COMMERCE APP] GET COLLECTIONS';
export const SET_COLLECTIONS_LOADER = '[E-COMMERCE APP] SET COLLECTIONS LOADER';
export const DELETE_COLLECTION = '[E-COMMERCE APP] DELETE COLLECTION';
export const SET_DELETE_COLLECTION_VALUE = '[E-COMMERCE APP] SET DELETE COLLECTION VALUE';

export const collectionsURl =
	settingsConfig.host_url + 'product/collection/?fields=id,name,name,is_published,available_products,total_products';

export function getCollections() {
	const request = axios.get(collectionsURl);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_COLLECTIONS,
					payload: response.data
				});
			})
			.catch((error) => {
				console.log(error);
				dispatch({
					type: SET_COLLECTIONS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function deleteCollection(id) {
	const request = axios.delete(settingsConfig.host_url + 'product/collection/' + id + '/');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: DELETE_COLLECTION,
					payload: id
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DELETE_COLLECTION_VALUE,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setCollectionsLoader(value) {
	return {
		type: SET_COLLECTIONS_LOADER,
		payload: value
	};
}
export function setDeleteCollectionValue(value) {
	return {
		type: SET_DELETE_COLLECTION_VALUE,
		payload: value
	};
}
