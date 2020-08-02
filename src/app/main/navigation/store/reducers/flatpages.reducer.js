import * as Actions from '../actions';

const initialState = {
	flatpages: null,
	loading: true,
	deletingFlatPage: false
};

const flatPagesReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_FLAT_PAGES: {
			return {
				...state,
				flatpages: action.payload,
				loading: false
			};
		}
		case Actions.SET_FLAT_PAGES_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}

		case Actions.DELETE_FLAT_PAGE: {
			let flatpages = state.flatpages;
			let filtered = flatpages.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				flatpages: filtered,
				deletingFlatPage: 'deleted'
			};
		}
		case Actions.SET_DELETE_FLAT_PAGE_LOADER: {
			return {
				...state,
				deletingFlatPage: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default flatPagesReducer;
