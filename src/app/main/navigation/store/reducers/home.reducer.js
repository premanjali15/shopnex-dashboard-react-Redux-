import * as Actions from '../actions';

const initialState = {
	homeData: null,
	loadingHomeData: true,
	deletingHomeData: false,
	orderingItems: false
};

const homeData = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_NAV_HOME_DATA: {
			return {
				...state,
				homeData: action.payload,
				loadingHomeData: false
			};
		}
		case Actions.SET_NAV_HOME_DATA_LOADER: {
			return {
				...state,
				loadingHomeData: action.payload
			};
		}

		case Actions.DELETE_NAV_HOME_DATA_ITEM: {
			let homeData = state.homeData;
			var filtered = homeData.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				homeData: filtered,
				deletingHomeData: 'deleted'
			};
		}
		case Actions.SET_DELETE_NAV_HOME_DATA_ITEM_LOADER: {
			return {
				...state,
				deletingHomeData: action.payload
			};
		}

		case Actions.SET_HOME_DATA_ITEM_ORDER: {
			return {
				...state,
				orderingItems: 'ordered'
			};
		}
		case Actions.SET_HOME_DATA_ITEM_ORDER_LOADER: {
			return {
				...state,
				orderingItems: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default homeData;
