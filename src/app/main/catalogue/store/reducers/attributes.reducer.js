import * as Actions from '../actions';

const initialState = {
	data: null,
	searchText: '',
	loading: true,
	creatingAttr: false
};

const attributesReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ATTRIBUTES: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.CREATE_ATTRIBUTE: {
			let attrs = state.data.results ? state.data.results : [];
			let ind = attrs.findIndex((atr) => {
				return atr.id === action.payload.id;
			});
			if (ind === -1) {
				attrs.push(action.payload);
			}
			return {
				...state,
				data: { ...state.data, results: attrs },
				creatingAttr: 'created'
			};
		}
		case Actions.SET_ATTRIBUTES_SEARCH_TEXT: {
			return {
				...state,
				searchText: action.searchText
			};
		}
		case Actions.SET_ATTRIBUTES_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_CREATE_ATTRIBUTE_LOADER: {
			return {
				...state,
				creatingAttr: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default attributesReducer;
