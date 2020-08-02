import * as Actions from '../actions';

const initialState = {
	flatpage: null,
	loadingFlatpage: true,
	savingFlatpage: false
};

const flatpageReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_FLAT_PAGE: {
			return {
				...state,
				flatpage: action.payload,
				loadingFlatpage: false
			};
		}
		case Actions.SET_FLAT_PAGE_LOADER: {
			return {
				...state,
				loadingFlatpage: action.payload
			};
		}

		case Actions.SAVE_FLAT_PAGE: {
			return {
				...state,
				flatpage: action.payload,
				savingFlatpage: 'saved'
			};
		}
		case Actions.SET_SAVE_FLAT_PAGE_LOADER: {
			return {
				...state,
				savingFlatpage: action.payload
			};
		}

		default: {
			return state;
		}
	}
};
export default flatpageReducer;
