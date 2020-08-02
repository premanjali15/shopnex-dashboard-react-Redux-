import * as Actions from '../actions';

const initialState = {
	data: null,
	loadingDetails: true
};
const transactionReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_TRANSACTION_DETAILS: {
			return {
				...state,
				data: action.payload,
				loadingDetails: false
			};
		}
		case Actions.SET_TRANSACTION_DETAILS_LOADER: {
			return {
				...state,
				loadingDetails: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
export default transactionReducer;
