import * as Actions from '../actions';

const initialState = {
	data: null,
	loading: true,
	savingVariant: false
};

const variantReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_VARIANT: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.SAVE_VARIANT: {
			return {
				...state,
				data: action.payload,
				savingVariant: 'saved'
			};
		}
		case Actions.SET_VARIANT_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_VARIANT_SAVE_VALUE: {
			return {
				...state,
				savingVariant: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default variantReducer;
