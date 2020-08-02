import axios from 'axios';
import displayError from 'app/main/commonactions/displayError';

export const GET_DATA = '[E-COMMERCE APP] GET DATA';
export const SET_DATA_LOADER = '[E-COMMERCE APP] SET DATA LOADER';

export function getData(url) {
	const request = axios.get(url);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: GET_DATA,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_DATA_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setDataLoader(value) {
	return {
		type: SET_DATA_LOADER,
		payload: value
	};
}
