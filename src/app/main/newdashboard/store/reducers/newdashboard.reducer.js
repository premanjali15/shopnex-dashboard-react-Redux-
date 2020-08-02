import * as Actions from '../actions';

const initialState = {
	statistics: null,
	loadingStatistics: true
};

const statistics = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_STATISTICS: {
			return {
				...state,
				statistics: action.payload,
				loadingStatistics: false
			};
		}
		case Actions.SET_STATISTICS_LOADER: {
			return {
				...state,
				loadingStatistics: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default statistics;
