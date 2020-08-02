import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_TRANSACTION_DETAILS = '[E-COMMERCE APP] GET TRANSACTION DETAILS';
export const SET_TRANSACTION_DETAILS_LOADER = '[E-COMMERCE APP] SET TRANSACTION DETAILS LOADER';

export function getTransactionDetails(id) {
	const request = axios.get(settingsConfig.host_url + 'order/trxn/' + id);

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_TRANSACTION_DETAILS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_TRANSACTION_DETAILS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setTransactionDetailsLoader(value) {
	return {
		type: SET_TRANSACTION_DETAILS_LOADER,
		payload: value
	};
}
