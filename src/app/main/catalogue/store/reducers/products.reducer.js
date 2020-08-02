import * as Actions from '../actions';

const initialState = {
	data: null,
	searchText: '',
	loading: true,
	searchingProducts: false
};

const productsReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PRODUCTS: {
			return {
				...state,
				data: action.payload,
				loading: false,
				searchingProducts: 'searched'
			};
		}
		case Actions.SET_PRODUCTS_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.payload
			};
		}
		case Actions.SET_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_SEARCH_LOADER: {
			return {
				...state,
				searchingProducts: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default productsReducer;
