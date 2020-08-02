import * as Actions from '../actions';

const initialState = {
	shippingZone: null,
	shippingStates: null,
	loadingShippingZone: true,
	loadingShippingStates: true,
	savingZone: false,
	modifyingStates: false
};
const shippingZoneReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SHIPPING_ZONE: {
			return {
				...state,
				shippingZone: action.payload,
				loadingShippingZone: false
			};
		}
		case Actions.GET_SHIPPING_STATES: {
			return {
				...state,
				shippingStates: action.payload,
				loadingShippingStates: false
			};
		}
		case Actions.SAVE_SHIPPING_ZONE: {
			return {
				...state,
				shippingZone: action.payload,
				savingZone: 'saved'
			};
		}
		case Actions.MODIFY_SHIPPING_ZONE_STATES: {
			return {
				...state,
				shippingZone: action.payload,
				modifyingStates: false
			};
		}
		case Actions.SET_SHIPPING_ZONE_LOADER: {
			return {
				...state,
				loadingShippingZone: action.payload
			};
		}
		case Actions.SET_SHIPPING_STATES_LOADER: {
			return {
				...state,
				loadingShippingStates: action.payload
			};
		}
		case Actions.SET_SAVE_SHIPPING_ZONE_LOADER: {
			return {
				...state,
				savingZone: action.payload
			};
		}
		case Actions.SET_MODIFY_SHIPPING_ZONE_STATES_LOADER: {
			return {
				...state,
				modifyingStates: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
export default shippingZoneReducer;
