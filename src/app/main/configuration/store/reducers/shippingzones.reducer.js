import * as Actions from '../actions';

const initialState = {
	shippingZones: null,
	loading: true,
	deletingShippingZone: false
};
const shippingZonesReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SHIPPING_ZONES: {
			return {
				...state,
				shippingZones: action.payload,
				loading: false
			};
		}
		case Actions.DELETE_SHIPPING_ZONE: {
			let shippingZones = state.shippingZones.results;
			var filtered = shippingZones.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				shippingZones: { ...state.shippingZones, results: filtered },
				deletingShippingZone: 'deleted'
			};
		}
		case Actions.SET_SHIPPING_ZONES_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_DELETE_SHIPPING_ZONE_LOADER: {
			return {
				...state,
				deletingShippingZone: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
export default shippingZonesReducer;
