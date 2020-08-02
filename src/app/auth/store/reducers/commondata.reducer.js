import * as Actions from '../actions';

const initialState = {
	commondata: null
};

const commondata = function(state = initialState, action) {
	switch (action.type) {
		case Actions.SET_COMMON_DATA: {
			return {
				...initialState,
				commondata: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default commondata;
