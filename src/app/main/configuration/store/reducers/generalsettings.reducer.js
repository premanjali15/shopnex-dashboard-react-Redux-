import * as Actions from '../actions';

const initialState = {
	generalSettings: null,
	loading: true,
	updating: false
};
const generalSettingsReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_GENERAL_SETTINGS: {
			return {
				...state,
				generalSettings: action.payload,
				loading: false
			};
		}
		case Actions.UPDATE_GENERAL_SETTINGS: {
			return {
				...state,
				generalSettings: action.payload,
				updating: 'updated'
			};
		}
		case Actions.SET_GENERAL_SETTINGS_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_SETTINGS_UPDATE_LOADER: {
			return {
				...state,
				updating: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
export default generalSettingsReducer;
