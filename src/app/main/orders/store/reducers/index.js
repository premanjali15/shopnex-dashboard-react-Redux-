import { combineReducers } from 'redux';
import orders from './orders.reducer';
import order from './order.reducer';
import transaction from './transaction.reducer';

const reducer = combineReducers({
	orders,
	order,
	transaction
});

export default reducer;
