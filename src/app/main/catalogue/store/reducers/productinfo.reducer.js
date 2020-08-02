import * as Actions from '../actions';

const initialState = {
	data: null,
	loading: true,
	deletingProduct: false,
	deletingVariant: false,
	savingPrdctStatus: false
};

const productInfo = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PRODUCT_INFO: {
			return {
				...state,
				data: action.payload,
				loading: 'loaded'
			};
		}
		case Actions.DELETE_PRODUCT: {
			return {
				...state,
				data: null,
				deletingProduct: 'deleted'
			};
		}
		case Actions.DELETE_VARIANT: {
			let variants = state.data.variants;
			var filtered = variants.filter(function(variant) {
				return variant.id !== action.payload;
			});
			return {
				...state,
				data: { ...state.data, variants: filtered },
				deletingVariant: 'deleted'
			};
		}
		case Actions.SET_PRODUCT_INFO_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_DELETE_PRODUCT_LOADER: {
			return {
				...state,
				deletingProduct: action.payload
			};
		}
		case Actions.SET_DELETE_VARIANT_LOADER: {
			return {
				...state,
				deletingVariant: action.payload
			};
		}
		case Actions.SAVE_PRODUCT_STATUS: {
			return {
				...state,
				data: action.payload,
				savingPrdctStatus: 'saved'
			};
		}
		case Actions.SET_SAVE_PRODUCT_STATUS_LOADER: {
			return {
				...state,
				savingPrdctStatus: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default productInfo;
