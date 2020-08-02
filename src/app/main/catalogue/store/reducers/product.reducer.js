import * as Actions from '../actions';

const initialState = {
	data: null,
	productSaved: false,
	loading: true,
	prdctRelatedData: null,
	loadingPrdctRelatedData: true
};

const productReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PRODUCT: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.SAVE_PRODUCT: {
			return {
				...state,
				data: action.payload,
				productSaved: 'saved'
			};
		}
		case Actions.SET_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_PRODUCT_SAVE_VALUE: {
			return {
				...state,
				productSaved: action.payload
			};
		}
		case Actions.GET_PRODUCT_RELATED_DATA: {
			return {
				...state,
				prdctRelatedData: action.payload,
				loadingPrdctRelatedData: false
			};
		}
		case Actions.SET_PRODUCT_RELATED_DATA_LOADER: {
			return {
				...state,
				loadingPrdctRelatedData: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default productReducer;
