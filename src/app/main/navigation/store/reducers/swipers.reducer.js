import * as Actions from '../actions';

const initialState = {
	swipers: null,
	loadingSwipers: true,
	creatingSwiper: false,
	updatingSwiper: false,
	deletingSwiper: false,
	addingToHome: false
};

const swipers = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SWIPERS: {
			return {
				...state,
				swipers: action.payload,
				loadingSwipers: false
			};
		}
		case Actions.SET_SWIPERS_LOADER: {
			return {
				...state,
				loadingSwipers: action.payload
			};
		}

		case Actions.CREATE_SWIPER: {
			let swipers = state.swipers ? state.swipers : [];
			let ind = swipers.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind === -1) {
				swipers.push(action.payload);
			}

			return {
				...state,
				swipers: swipers,
				creatingSwiper: 'created'
			};
		}
		case Actions.SET_CREATE_SWIPER_LOADER: {
			return {
				...state,
				creatingSwiper: action.payload
			};
		}

		case Actions.UPDATE_SWIPER: {
			let swipers = state.swipers;
			let ind = swipers.findIndex((item) => {
				return item.id === action.payload.id;
			});
			swipers[ind] = action.payload;

			return {
				...state,
				swipers: swipers,
				updatingSwiper: 'updated'
			};
		}
		case Actions.SET_UPDATE_SWIPER_LOADER: {
			return {
				...state,
				updatingSwiper: action.payload
			};
		}

		case Actions.DELETE_SWIPER: {
			let swipers = state.swipers;
			var filtered = swipers.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				swipers: filtered,
				deletingSwiper: 'deleted'
			};
		}
		case Actions.SET_DELETE_SWIPER_LOADER: {
			return {
				...state,
				deletingSwiper: action.payload
			};
		}

		case Actions.ADD_SWIPER_TO_HOME: {
			let swipers = state.swipers ? state.swipers : [];
			let ind = swipers.findIndex((item) => {
				return item.id === action.payload;
			});
			swipers[ind].in_home = true;
			return {
				...state,
				swipers: swipers,
				addingToHome: 'added'
			};
		}
		case Actions.SET_ADD_SWIPER_TO_HOME_LOADER: {
			return {
				...state,
				addingToHome: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default swipers;
