import axios from 'axios';
import settingsConfig from 'app/fuse-configs/settingsConfig';

import displayError from 'app/main/commonactions/displayError';

export const GET_ORDERS = '[E-COMMERCE APP] GET ORDERS';
export const SET_ORDERS_LOADER = '[E-COMMERCE APP] SET ORDERS LOADER';
export const SET_ORDERS_SEARCH_TEXT = '[E-COMMERCE APP] SET ORDERS SEARCH TEXT';

export function getOrders(tab) {
	let request;
	if (tab !== 'pending') {
		request = axios.get(
			settingsConfig.host_url + 'order/' + tab + '/list?fields=id,status,email,created,paid,order_total'
		);
	} else {
		request = axios.get(settingsConfig.host_url + 'payment/pending-orders/1');
	}

	return (dispatch) =>
		request
			.then((response) => {
				if (tab !== 'pending') {
					dispatch({
						type: GET_ORDERS,
						payload: response.data
					});
				} else {
					let orders = JSON.parse(response.data).pending_Orders;
					let data = [];
					orders.forEach((order) => {
						let obj = {
							created: order.order_status_date_time,
							email: order.order_bill_email,
							id: order.order_no,
							order_total: order.order_amt,
							paid: 'NA',
							status: 'pending'
						};
						data.push(obj);
					});
					let obj = {
						results: data
					};

					dispatch({
						type: GET_ORDERS,
						payload: obj
					});
				}
			})
			.catch((error) => {
				dispatch({
					type: SET_ORDERS_LOADER,
					payload: false
				});
				dispatch(displayError(error));
			});
}

export function setOrdersSearchText(event) {
	return {
		type: SET_ORDERS_SEARCH_TEXT,
		searchText: event.target.value
	};
}

export function setLoader(value) {
	return {
		type: SET_ORDERS_LOADER,
		payload: value
	};
}
