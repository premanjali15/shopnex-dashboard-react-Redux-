import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_STATISTICS = '[E-COMMERCE APP] GET STATISTICS';
export const SET_STATISTICS_LOADER = '[E-COMMERCE APP] SET STATISTICS LOADER';

export function getStatistics() {
	const request = axios.get(settingsConfig.host_url + 'home/');

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_STATISTICS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_STATISTICS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setStatisticsLoader(value) {
	return {
		type: SET_STATISTICS_LOADER,
		payload: value
	};
}
