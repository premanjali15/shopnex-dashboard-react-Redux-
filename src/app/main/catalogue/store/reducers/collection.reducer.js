import * as Actions from '../actions';

const initialState = {
	collection: null,
	savingCollection: false,
	loadingCollection: true,
	searchedProducts: null,
	loadingSearchPrdcts: false
};

const collectionReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_COLLECTION: {
			return {
				...state,
				collection: action.payload,
				loadingCollection: false
			};
		}
		case Actions.SAVE_COLLECTION: {
			return {
				...state,
				collection: action.payload,
				savingCollection: 'saved'
			};
		}
		case Actions.SET_COLLECTION_SAVE_VALUE: {
			return {
				...state,
				savingCollection: action.payload
			};
		}
		case Actions.SET_COLLECTION: {
			return {
				...state,
				collection: null
			};
		}
		case Actions.SET_COLLECTION_LOADING_VALUE: {
			return {
				...state,
				loadingCollection: action.payload
			};
		}
		case Actions.GET_SEARCHED_PRODUCTS: {
			return {
				...state,
				searchedProducts: action.payload,
				loadingSearchPrdcts: false
			};
		}
		case Actions.SET_SEARCHED_PRODUCTS_LOADER: {
			return {
				...state,
				loadingSearchPrdcts: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
export default collectionReducer;
