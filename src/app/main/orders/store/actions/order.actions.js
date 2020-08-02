import axios from 'axios';
import { showMessage } from 'app/store/actions/fuse';
import displayError from 'app/main/commonactions/displayError';

import settingsConfig from 'app/fuse-configs/settingsConfig';

export const GET_ORDER = '[E-COMMERCE APP] GET ORDER';
export const UPDATE_ORDER = '[E-COMMERCE APP] UPDATE ORDER';
export const SET_ORDER_LOADER = '[E-COMMERCE APP] SET ORDER LOADER';
export const GET_ORDER_TRANSACTIONS = '[E-COMMERCE APP] GET ORDER TRANSACTIONS';
export const SET_ORDER_TRANSACTIONS_LOADER = '[E-COMMERCE APP] SET ORDER TRANSACTIONS LOADER';
export const SET_ORDER_TRANSACTIONS = '[E-COMMERCE APP] SET ORDER TRANSACTIONS';
export const SET_UPDATE_ORDER_LOADER = '[E-COMMERCE APP] SET UPDATE ORDER LOADER';
export const CONFIRM_PAYMENT = '[E-COMMERCE APP] CONFIRM PAYMENT';
export const CANCEL_PAYMENT = '[E-COMMERCE APP] CANCEL PAYMENT';
export const REFUND_PAYMENT = '[E-COMMERCE APP] REFUND PAYMENT';
export const GET_REFUNDS_DATA = '[E-COMMERCE APP] GET REFUNDS DATA';
export const SET_CONFIRM_PAYMENT_LOADER = '[E-COMMERCE APP] SET CONFIRM PAYMENT LOADER';
export const SET_CANCEL_PAYMENT_LOADER = '[E-COMMERCE APP] SET CANCEL PAYMENT LOADER';
export const SET_REFUND_PAYMENT_LOADER = '[E-COMMERCE APP] SET REFUND PAYMENT LOADER';
export const SET_REFUNDS_DATA_LOADER = '[E-COMMERCE APP] SET REFUNDS DATA LOADER';

export function getOrder(id) {
	const request = axios.get(settingsConfig.host_url + 'order/' + id);

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_ORDER,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_ORDER_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function getTransactions(id) {
	const request = axios.get(
		settingsConfig.host_url +
			'order/' +
			id +
			'/trxn?fields=id,tracking_id,order_status,payment_mode,card_name,amount,created'
	);
	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_ORDER_TRANSACTIONS,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_ORDER_TRANSACTIONS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function updateOrder(obj) {
	const request = axios.patch(settingsConfig.host_url + 'order/' + obj.id, obj);

	return (dispatch) =>
		request
			.then((response) => {
				dispatch(showMessage({ message: 'Status Updated Successfully.', variant: 'success' }));
				return dispatch({
					type: UPDATE_ORDER,
					payload: response.data
				});
			})
			.catch((error) => {
				dispatch({
					type: SET_UPDATE_ORDER_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function confirmPayment(trxn) {
	const request = axios.post(settingsConfig.host_url + 'payment/confirm/' + trxn.id, { amount: trxn.amount });

	return (dispatch) =>
		request
			.then((response) => {
				if (response.data.success_count === 0) {
					let msg = response.data.failed_List[0].reason;
					dispatch(showMessage({ message: msg, variant: 'error' }));
					dispatch({
						type: SET_CONFIRM_PAYMENT_LOADER,
						payload: false
					});
				} else {
					dispatch(showMessage({ message: 'Confirmed Successfully', variant: 'success' }));
					dispatch({
						type: CONFIRM_PAYMENT,
						payload: response.data
					});
				}
			})
			.catch((error) => {
				dispatch({
					type: SET_CONFIRM_PAYMENT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function cancelPayment(trxn) {
	const request = axios.post(settingsConfig.host_url + 'payment/cancel/' + trxn.id, { amount: trxn.amount });

	return (dispatch) =>
		request
			.then((response) => {
				if (response.data.success_count === 0) {
					let msg = response.data.failed_List[0].reason;
					dispatch(showMessage({ message: msg, variant: 'error' }));
					dispatch({
						type: SET_CANCEL_PAYMENT_LOADER,
						payload: false
					});
				} else {
					dispatch(showMessage({ message: 'Canceled Successfully', variant: 'success' }));
					dispatch({
						type: CANCEL_PAYMENT,
						payload: response.data
					});
				}
			})
			.catch((error) => {
				dispatch({
					type: SET_CANCEL_PAYMENT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function refundPayment(trxn) {
	const request = axios.post(settingsConfig.host_url + 'payment/refund/' + trxn.id, { amount: trxn.amount });

	return (dispatch) =>
		request
			.then((response) => {
				if (response.data.refund_status === '1') {
					let msg = response.data.reason + ' : ' + response.data.error_code;
					dispatch(showMessage({ message: msg, variant: 'error' }));
					dispatch({
						type: SET_REFUND_PAYMENT_LOADER,
						payload: false
					});
				} else {
					dispatch(showMessage({ message: 'Refunded Successfully', variant: 'success' }));
					dispatch({
						type: REFUND_PAYMENT,
						payload: response.data
					});
				}
			})
			.catch((error) => {
				dispatch({
					type: SET_REFUND_PAYMENT_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function getRefundsData(id) {
	const request = axios.get(settingsConfig.host_url + 'payment/refund/' + id);

	return (dispatch) =>
		request
			.then((response) =>
				dispatch({
					type: GET_REFUNDS_DATA,
					payload: response.data
				})
			)
			.catch((error) => {
				dispatch({
					type: SET_REFUNDS_DATA_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setOrderTransactions(data) {
	return {
		type: SET_ORDER_TRANSACTIONS,
		payload: data
	};
}
export function setOrderLoader(value) {
	return {
		type: SET_ORDER_LOADER,
		payload: value
	};
}
export function setOrderTransactionsLoader(value) {
	return {
		type: SET_ORDER_TRANSACTIONS_LOADER,
		payload: value
	};
}
export function setUpdateOrderLoader(value) {
	return {
		type: SET_UPDATE_ORDER_LOADER,
		payload: value
	};
}
export function setConfirmPaymentLoader(data) {
	return {
		type: SET_CONFIRM_PAYMENT_LOADER,
		payload: data
	};
}
export function setCancelPaymentLoader(data) {
	return {
		type: SET_CANCEL_PAYMENT_LOADER,
		payload: data
	};
}
export function setRefundPaymentLoader(data) {
	return {
		type: SET_REFUND_PAYMENT_LOADER,
		payload: data
	};
}
export function setRefundsDataLoader(value) {
	return {
		type: SET_REFUNDS_DATA_LOADER,
		payload: value
	};
}
