import * as Actions from '../actions';

const initialState = {
	data: null,
	loading: true,
	updatingAttr: false,
	deletingAttr: false,
	savingAttrValue: false,
	updatingAttrValue: false,
	deletingAttrValue: false
};

const attributeReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ATTRIBUTE_DETAILS: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.UPDATE_ATTRIBUTE: {
			return {
				...state,
				data: action.payload,
				updatingAttr: 'updated'
			};
		}
		case Actions.SAVE_ATTRIBUTE_VALUE: {
			let values = state.data.values ? state.data.values : [];
			let ind = values.findIndex((val) => {
				return val.id === action.payload.id;
			});
			if (ind === -1) {
				values.push(action.payload);
			}
			return {
				...state,
				data: { ...state.data, values: values },
				savingAttrValue: 'saved'
			};
		}
		case Actions.UPDATE_ATTRIBUTE_VALUE: {
			let values = state.data.values;
			let ind = values.findIndex((val) => {
				return val.id === action.payload.id;
			});
			values[ind].name = action.payload.name;
			values[ind].slug = action.payload.slug;
			return {
				...state,
				data: { ...state.data, values: values },
				updatingAttrValue: 'updated'
			};
		}
		case Actions.DELETE_ATTRIBUTE_VALUE: {
			let values = state.data.values;
			var filtered = values.filter(function(val) {
				return val.id !== action.payload;
			});
			return {
				...state,
				data: { ...state.data, values: filtered },
				deletingAttrValue: 'deleted'
			};
		}
		case Actions.SET_ATTRIBUTE_DETAILS_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_UPDATE_ATTRIBUTE_LOADER: {
			return {
				...state,
				updatingAttr: action.payload
			};
		}
		case Actions.SET_DELETE_ATTRIBUTE_LOADER: {
			return {
				...state,
				deletingAttr: action.payload
			};
		}
		case Actions.SET_SAVE_ATTRIBUTE_VALUE_LOADER: {
			return {
				...state,
				savingAttrValue: action.payload
			};
		}
		case Actions.SET_UPDATE_ATTRIBUTE_VALUE_LOADER: {
			return {
				...state,
				updatingAttrValue: action.payload
			};
		}
		case Actions.SET_DELETE_ATTRIBUTE_VALUE_LOADER: {
			return {
				...state,
				deletingAttrValue: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default attributeReducer;
