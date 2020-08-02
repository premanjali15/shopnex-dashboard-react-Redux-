import * as Actions from '../actions';

const initialState = {
	collections: null,
	loading: true,
	deletingCollection: false
};

const categories = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_COLLECTIONS: {
			return {
				...state,
				collections: action.payload,
				loading: false
			};
		}
		case Actions.SET_COLLECTIONS_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.DELETE_COLLECTION: {
			let collectoins = state.collections.results;
			var filtered = collectoins.filter(function(collection) {
				return collection.id !== action.payload;
			});
			return {
				...state,
				collections: { ...state.collections, results: filtered },
				deletingCollection: 'deleted'
			};
		}
		case Actions.SET_DELETE_COLLECTION_VALUE: {
			return {
				...state,
				deletingCollection: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default categories;
