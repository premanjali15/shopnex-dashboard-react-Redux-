import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import settingsConfig from 'app/fuse-configs/settingsConfig';

export const SET_COMMON_DATA = 'SET COMMON DATA';
export const SUCCESS = 'SUCCESS';

export function setCommonData() {
	const request = axios.get(settingsConfig.host_url + 'data');

	return (dispatch) =>
		request
			.then((response) => {
				dispatch({
					type: SET_COMMON_DATA,
					payload: response.data
				});
			})
			.catch((error) => {
				// dispatch({
				// 	type: SET_LOADER,
				// 	payload: false
				// });
				console.log(error);
				dispatch(showMessage({ message: 'Some error occurred.....', variant: 'error' }));
			});
}
