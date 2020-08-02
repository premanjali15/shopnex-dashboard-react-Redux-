import * as Actions from '../actions';

const initialState = {
	highlight: null,
	loadingHighlight: true,
	savingHighlightItem: false,
	deletingHighlightItem: false,
	orderingItems: false
};

const highlightReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_HIGHLIGHT: {
			return {
				...state,
				highlight: action.payload,
				loadingHighlight: false
			};
		}
		case Actions.SAVE_HIGHLIGHT_ITEM: {
			let items = state.highlight.items ? state.highlight.items : [];
			let ind = items.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind > -1) {
				items[ind] = action.payload;
			} else {
				items.push(action.payload);
			}
			return {
				...state,
				highlight: { ...state.highlight, items },
				savingHighlightItem: 'saved'
			};
		}
		case Actions.DELETE_HIGHLIGHT_ITEM: {
			let items = state.highlight.items;
			var filtered = items.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				highlight: { ...state.highlight, items: filtered },
				deletingHighlightItem: 'deleted'
			};
		}
		case Actions.SET_HIGHLIGHT_ITEM_ORDER: {
			return {
				...state,
				orderingItems: 'ordered'
			};
		}
		case Actions.SET_HIGHLIGHT_LOADER: {
			return {
				...state,
				loadingHighlight: action.payload
			};
		}
		case Actions.SET_SAVE_HIGHLIGHT_ITEM_LOADER: {
			return {
				...state,
				savingHighlightItem: action.payload
			};
		}
		case Actions.SET_DELETE_HIGHLIGHT_ITEM_LOADER: {
			return {
				...state,
				deletingHighlightItem: action.payload
			};
		}
		case Actions.SET_HIGHLIGHT_ITEM_ORDER_LOADER: {
			return {
				...state,
				orderingItems: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default highlightReducer;
