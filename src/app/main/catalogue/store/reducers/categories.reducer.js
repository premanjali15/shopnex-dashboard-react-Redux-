import * as Actions from '../actions';

const initialState = {
	data: null,
	loading: true,
	creatingCategory: false,
	updatingCategory: false,
	deletingCategory: false,
	searchText: ''
};

const categories = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CATEGORIES: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.CREATE_CATEGORY: {
			let categories = state.data ? state.data : [];
			let ind = categories.findIndex((cat) => {
				return cat.id === action.payload.id;
			});
			if (ind === -1) {
				categories.push(action.payload);
			}
			return {
				...state,
				data: categories,
				creatingCategory: 'created'
			};
		}
		case Actions.UPDATE_CATEGORY: {
			let categories = state.data;
			let ind = categories.findIndex((cat) => {
				return cat.id === action.payload.id;
			});
			categories[ind] = action.payload;
			return {
				...state,
				data: categories,
				updatingCategory: 'updated'
			};
		}
		case Actions.DELETE_CATEGORY: {
			let categories = state.data;
			var filteredCategories = categories.filter(function(cat) {
				return cat.id !== action.payload;
			});
			return {
				...state,
				data: filteredCategories,
				deletingCategory: 'deleted'
			};
		}
		case Actions.SET_CREATE_CATEGORY_LOADER: {
			return {
				...state,
				creatingCategory: action.payload
			};
		}
		case Actions.SET_UPDATE_CATEGORY_LOADER: {
			return {
				...state,
				updatingCategory: action.payload
			};
		}
		case Actions.SET_DELETE_CATEGORY_LOADER: {
			return {
				...state,
				deletingCategory: action.payload
			};
		}
		case Actions.SET_CATGORIES_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_CATEGORIES_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			};
		}
		default: {
			return state;
		}
	}
};

export default categories;
