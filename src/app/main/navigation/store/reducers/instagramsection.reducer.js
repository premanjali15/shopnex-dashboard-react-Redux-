import * as Actions from '../actions';

const initialState = {
	instagramsection: null,
	loading: true,
	deletingInstaPost: false,
	orderingInstaPosts: false
};

const instagramSectionReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_INSTA_SECTION_DETAILS: {
			return {
				...state,
				instagramsection: action.payload,
				loading: false
			};
		}
		case Actions.SET_INSTA_SECTION_DETAILS_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}

		case Actions.DELETE_INSTA_POST: {
			let posts = state.instagramsection ? state.instagramsection.posts : [];
			var filteredPosts = posts.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				instagramsection: { ...state.instagramsection, posts: filteredPosts },
				deletingInstaPost: 'deleted'
			};
		}
		case Actions.SET_DELETE_INSTA_POST_LOADER: {
			return {
				...state,
				deletingInstaPost: action.payload
			};
		}

		case Actions.SET_INSTASECTION_POSTS_ORDER: {
			return {
				...state,
				orderingInstaPosts: 'ordered'
			};
		}
		case Actions.SET_INSTASECTION_POSTS_ORDER_LOADER: {
			return {
				...state,
				orderingInstaPosts: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default instagramSectionReducer;
