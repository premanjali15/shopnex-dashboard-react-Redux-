import * as Actions from '../actions';

const initialState = {
	data: null,
	refundsData: null,
	loadingOrder: true,
	transactions: null,
	loadingTransactions: true,
	updatingOrder: false,
	confirmingPayment: false,
	cancelingPayment: false,
	refundingPayment: false,
	loadingRefundsData: true
};

const orderReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ORDER: {
			return {
				...state,
				data: action.payload,
				loadingOrder: false
			};
		}
		case Actions.GET_ORDER_TRANSACTIONS: {
			return {
				...state,
				transactions: action.payload,
				loadingTransactions: false
			};
		}
		case Actions.UPDATE_ORDER: {
			return {
				...state,
				data: action.payload,
				updatingOrder: 'updated'
			};
		}
		case Actions.CONFIRM_PAYMENT: {
			return {
				...state,
				confirmingPayment: 'confirmed'
			};
		}
		case Actions.CANCEL_PAYMENT: {
			return {
				...state,
				cancelingPayment: 'canceled'
			};
		}
		case Actions.REFUND_PAYMENT: {
			return {
				...state,
				refundingPayment: 'refunded'
			};
		}
		case Actions.SET_ORDER_TRANSACTIONS: {
			return {
				...state,
				transactions: action.payload
			};
		}
		case Actions.GET_REFUNDS_DATA: {
			return {
				...state,
				refundsData: action.payload,
				loadingRefundsData: false
			};
		}
		case Actions.SET_ORDER_LOADER: {
			return {
				...state,
				loadingOrder: action.payload
			};
		}
		case Actions.SET_ORDER_TRANSACTIONS_LOADER: {
			return {
				...state,
				loadingTransactions: action.payload
			};
		}
		case Actions.SET_UPDATE_ORDER_LOADER: {
			return {
				...state,
				updatingOrder: action.payload
			};
		}
		case Actions.SET_CONFIRM_PAYMENT_LOADER: {
			return {
				...state,
				confirmingPayment: action.payload
			};
		}
		case Actions.SET_CANCEL_PAYMENT_LOADER: {
			return {
				...state,
				cancelingPayment: action.payload
			};
		}
		case Actions.SET_REFUND_PAYMENT_LOADER: {
			return {
				...state,
				refundingPayment: action.payload
			};
		}
		case Actions.SET_REFUNDS_DATA_LOADER: {
			return {
				...state,
				loadingRefundsData: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default orderReducer;
