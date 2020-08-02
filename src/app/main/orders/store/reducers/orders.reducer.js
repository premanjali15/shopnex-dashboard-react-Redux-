import * as Actions from '../actions';

const initialState = {
	data: null,
	searchText: '',
	loading: true
};

const ordersReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ORDERS: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.SET_ORDERS_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			};
		}
		case Actions.SET_ORDERS_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default ordersReducer;
