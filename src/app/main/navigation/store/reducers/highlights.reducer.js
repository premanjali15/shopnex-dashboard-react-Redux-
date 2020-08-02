import * as Actions from '../actions';

const initialState = {
	highlights: null,
	loadingHighlights: true,
	creatingHighlight: false,
	updatingHighlight: false,
	deletingHighlight: false,
	addingToHome: false
};

const highlights = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_HIGHLIGHTS: {
			return {
				...state,
				highlights: action.payload,
				loadingHighlights: false
			};
		}
		case Actions.SET_HIGHLIGHTS_LOADER: {
			return {
				...state,
				loadingHighlights: action.payload
			};
		}

		case Actions.CREATE_HIGHLIGHT: {
			let highlights = state.highlights ? state.highlights : [];
			let ind = highlights.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind === -1) {
				highlights.push(action.payload);
			}
			return {
				...state,
				highlights: highlights,
				creatingHighlight: 'created'
			};
		}
		case Actions.SET_CREATE_HIGHLIGHT_LOADER: {
			return {
				...state,
				creatingHighlight: action.payload
			};
		}

		case Actions.UPDATE_HIGHLIGHT: {
			let highlights = state.highlights;
			let ind = highlights.findIndex((item) => {
				return item.id === action.payload.id;
			});

			highlights[ind].title = action.payload.title;
			return {
				...state,
				highlights: highlights,
				updatingHighlight: 'updated'
			};
		}
		case Actions.SET_UPDATE_HIGHLIGHT_LOADER: {
			return {
				...state,
				updatingHighlight: action.payload
			};
		}

		case Actions.DELETE_HIGHLIGHT: {
			let highlights = state.highlights;
			var filtered = highlights.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				highlights: filtered,
				deletingHighlight: 'deleted'
			};
		}
		case Actions.SET_DELETE_HIGHLIGHT_LOADER: {
			return {
				...state,
				deletingHighlight: action.payload
			};
		}

		case Actions.ADD_HIGHLIGHT_TO_HOME: {
			let highlights = state.highlights ? state.highlights : [];
			let ind = highlights.findIndex((item) => {
				return item.id === action.payload;
			});
			highlights[ind].in_home = true;
			return {
				...state,
				highlights: highlights,
				addingToHome: 'added'
			};
		}
		case Actions.SET_ADD_HIGHLIGHT_TO_HOME_LOADER: {
			return {
				...state,
				addingToHome: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default highlights;
