import * as Actions from '../actions';

const initialState = {
	instagrampost: null,
	loading: true,
	savingInstaPost: false,
	searchedInstaProducts: null,
	loadingSearchedInstaPrdcts: false
};

const instagramSectionReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_INSTA_POST: {
			return {
				...state,
				instagrampost: action.payload,
				loading: false
			};
		}
		case Actions.SET_INSTA_POST_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}

		case Actions.SAVE_INSTA_POST: {
			return {
				...state,
				instagrampost: action.payload,
				savingInstaPost: 'saved'
			};
		}
		case Actions.SET_SAVE_INSTA_POST_LOADER: {
			return {
				...state,
				savingInstaPost: action.payload
			};
		}

		case Actions.GET_SEARCHED_INSTA_PRODUCTS: {
			return {
				...state,
				searchedInstaProducts: action.payload,
				loadingSearchedInstaPrdcts: false
			};
		}
		case Actions.SET_SEARCHED_INSTA_PRODUCTS_LOADER: {
			return {
				...state,
				loadingSearchedInstaPrdcts: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default instagramSectionReducer;
