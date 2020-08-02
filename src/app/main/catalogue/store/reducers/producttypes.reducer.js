import * as Actions from '../actions';

const initialState = {
	data: null,
	searchText: '',
	loading: true
};

const productTypesReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PRODUCT_TYPES: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.SET_PRODUCT_TYPES_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			};
		}
		case Actions.SET_PRDCT_TYPES_LOADER: {
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

export default productTypesReducer;
