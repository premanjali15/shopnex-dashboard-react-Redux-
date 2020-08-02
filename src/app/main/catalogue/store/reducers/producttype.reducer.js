import * as Actions from '../actions';

const initialState = {
	data: null,
	loading: true,
	savingProductType: false,
	freePrdctAttrs: null,
	loadingFreePrdctAttrs: false,
	addingPrdctAttr: false,
	deletingPrdctAttr: false,
	addingAttr: false,
	deletingAttr: false
};

const productTypeReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PRODUCT_TYPE: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.SAVE_PRODUCT_TYPE: {
			return {
				...state,
				data: action.payload,
				savingProductType: 'saved'
			};
		}
		case Actions.GET_FREE_PRODUCT_ATTRIBUTES: {
			return {
				...state,
				freePrdctAttrs: action.payload,
				loadingFreePrdctAttrs: false
			};
		}
		case Actions.ADD_PRODUCT_ATTRIBUTE: {
			let freePrdctAttrs = state.freePrdctAttrs;
			if (freePrdctAttrs === null) freePrdctAttrs = [];
			let filteredAttrs = freePrdctAttrs.filter(function(atr) {
				return atr.id !== action.payload.id;
			});

			let productAttributes = state.data.product_attributes;
			if (productAttributes === null) productAttributes = [];
			let obj = {
				id: action.payload.id,
				name: action.payload.name
			};
			let ind = productAttributes.findIndex((patr) => {
				return patr.id === action.payload.id;
			});
			if (ind === -1) {
				productAttributes.push(obj);
			}

			return {
				...state,
				freePrdctAttrs: filteredAttrs,
				data: { ...state.data, product_attributes: productAttributes },
				addingPrdctAttr: 'added'
			};
		}

		case Actions.DELETE_PRODUCT_ATTRIBUTE: {
			let freePrdctAttrs = state.freePrdctAttrs;
			if (freePrdctAttrs === null) freePrdctAttrs = [];
			let obj = { id: action.payload.id, name: action.payload.name };
			let ind = freePrdctAttrs.findIndex((fatr) => {
				return fatr.id === action.payload.id;
			});
			if (ind === -1) {
				freePrdctAttrs.push(obj);
			}

			let productAttributes = state.data.product_attributes;
			if (productAttributes === null) productAttributes = [];
			var filteredPrdctAttrs = productAttributes.filter(function(atr) {
				return atr.id !== action.payload.id;
			});

			let data = { ...state.data, product_attributes: filteredPrdctAttrs };
			return {
				...state,
				freePrdctAttrs: freePrdctAttrs,
				data: data,
				deletingPrdctAttr: 'deleted'
			};
		}

		case Actions.ADD_ATTRIBUTE: {
			let freePrdctAttrs = state.freePrdctAttrs;
			if (freePrdctAttrs === null) freePrdctAttrs = [];
			let filteredAttrs = freePrdctAttrs.filter(function(atr) {
				return atr.id !== action.payload.id;
			});

			let attributes = state.data.variant_attributes;
			if (attributes === null) attributes = [];
			let obj = {
				id: action.payload.id,
				name: action.payload.name
			};
			let ind = attributes.findIndex((aatr) => {
				return aatr.id === action.payload.id;
			});
			if (ind === -1) {
				attributes.push(obj);
			}

			return {
				...state,
				freePrdctAttrs: filteredAttrs,
				data: { ...state.data, variant_attributes: attributes },
				addingAttr: 'added'
			};
		}
		case Actions.DELETE_ATTRIBUTE: {
			let freePrdctAttrs = state.freePrdctAttrs;
			if (freePrdctAttrs === null) freePrdctAttrs = [];
			let obj = { id: action.payload.id, name: action.payload.name };
			let ind = freePrdctAttrs.findIndex((fatr) => {
				return fatr.id === action.payload.id;
			});
			if (ind === -1) {
				freePrdctAttrs.push(obj);
			}

			let variantAttrs = state.data.variant_attributes;
			if (variantAttrs === null) variantAttrs = [];
			var filteredVariantAttrs = variantAttrs.filter(function(atr) {
				return atr.id !== action.payload.id;
			});

			let data = { ...state.data, variant_attributes: filteredVariantAttrs };
			return {
				...state,
				freePrdctAttrs: freePrdctAttrs,
				data: data,
				deletingAttr: 'deleted'
			};
		}
		case Actions.SET_PRODUCT_TYPE_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_PRODUCT_TYPE_SAVE_LOADER: {
			return {
				...state,
				savingProductType: action.payload
			};
		}
		case Actions.SET_FREE_PRODUCT_ATTRS_LOADER: {
			return {
				...state,
				loadingFreePrdctAttrs: action.payload
			};
		}
		case Actions.SET_ADD_PRODUCT_ATTRIBUTE_LOADER: {
			return {
				...state,
				addingPrdctAttr: action.payload
			};
		}
		case Actions.SET_DELETE_PRODUCT_ATTRIBUTE_LOADER: {
			return {
				...state,
				deletingPrdctAttr: action.payload
			};
		}
		case Actions.SET_ADD_ATTRIBUTE_LOADER: {
			return {
				...state,
				addingAttr: action.payload
			};
		}
		case Actions.SET_DELETE_ATTRIBUTE_LOADER: {
			return {
				...state,
				deletingAttr: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default productTypeReducer;
