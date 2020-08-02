import * as Actions from '../actions';

const initialState = {
	taxes: null,
	loading: true,
	creatingTax: false,
	updatingTax: false,
	deletingTax: false
};
const taxesReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_TAXES: {
			return {
				...state,
				taxes: action.payload,
				loading: false
			};
		}
		case Actions.CREATE_TAX: {
			let taxes = state.taxes.results ? state.taxes.results : [];
			let ind = taxes.findIndex((tax) => {
				return tax.id === action.payload.id;
			});
			if (ind === -1) {
				taxes.push(action.payload);
			}
			return {
				...state,
				taxes: { ...state.taxes, results: taxes },
				creatingTax: 'created'
			};
		}
		case Actions.UPDATE_TAX: {
			let taxes = state.taxes.results;
			let ind = taxes.findIndex((tax) => {
				return tax.id === action.payload.id;
			});
			taxes[ind] = action.payload;
			return {
				...state,
				taxes: { ...state.taxes, results: taxes },
				updatingTax: 'updated'
			};
		}
		case Actions.DELETE_TAX: {
			let taxes = state.taxes.results;
			var filtered = taxes.filter(function(tax) {
				return tax.id !== action.payload;
			});
			return {
				...state,
				taxes: { ...state.taxes, results: filtered },
				deletingTax: 'deleted'
			};
		}
		case Actions.SET_TAXES_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_CREATE_TAX_LOADER: {
			return {
				...state,
				creatingTax: action.payload
			};
		}
		case Actions.SET_UPDATE_TAX_LOADER: {
			return {
				...state,
				updatingTax: action.payload
			};
		}
		case Actions.SET_DELETE_TAX_LOADER: {
			return {
				...state,
				deletingTax: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
export default taxesReducer;
