import * as Actions from '../actions';

const initialState = {
	data: null,
	loadingSeoProduct: true,
	savingSeoProduct: false
};

const seoProductReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SEO_PRODUCT: {
			return {
				...state,
				data: action.payload,
				loadingSeoProduct: false
			};
		}
		case Actions.SET_SEO_PRODUCT_LOADER: {
			return {
				...state,
				loadingSeoProduct: action.payload
			};
		}

		case Actions.SAVE_SEO_PRODUCT: {
			return {
				...state,
				data: action.payload,
				savingSeoProduct: 'saved'
			};
		}
		case Actions.SET_SAVE_SEO_PRODUCT_LOADER: {
			return {
				...state,
				savingSeoProduct: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default seoProductReducer;
