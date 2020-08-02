import * as Actions from '../actions';

const initialState = {
	data: null,
	loadingData: false
};

const paginationReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_DATA: {
			return {
				...state,
				data: action.payload,
				loadingData: 'loaded'
			};
		}
		case Actions.SET_DATA_LOADER: {
			return {
				...state,
				loadingData: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default paginationReducer;
