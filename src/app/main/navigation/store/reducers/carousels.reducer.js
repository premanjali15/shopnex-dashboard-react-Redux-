import * as Actions from '../actions';

const initialState = {
	carousels: null,
	loadingCarousels: true,
	creatingCarousel: false,
	updatingCarousel: false,
	deletingCarousel: false,
	addingToHome: false
};

const carousels = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CAROUSELS: {
			return {
				...state,
				carousels: action.payload,
				loadingCarousels: false
			};
		}
		case Actions.SET_CAROUSELS_LOADER: {
			return {
				...state,
				loadingCarousels: action.payload
			};
		}

		case Actions.CREATE_CAROUSEL: {
			let carousels = state.carousels ? state.carousels : [];
			let ind = carousels.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind === -1) {
				carousels.push(action.payload);
			}
			return {
				...state,
				carousels: carousels,
				creatingCarousel: 'created'
			};
		}
		case Actions.SET_CREATE_CAROUSEL_LOADER: {
			return {
				...state,
				creatingCarousel: action.payload
			};
		}

		case Actions.UPDATE_CAROUSEL: {
			let carousels = state.carousels;
			let ind = carousels.findIndex((item) => {
				return item.id === action.payload.id;
			});

			carousels[ind].title = action.payload.title;
			return {
				...state,
				carousels: carousels,
				updatingCarousel: 'updated'
			};
		}
		case Actions.SET_UPDATE_CAROUSEL_LOADER: {
			return {
				...state,
				updatingCarousel: action.payload
			};
		}

		case Actions.DELETE_CAROUSEL: {
			let carousels = state.carousels;
			var filtered = carousels.filter(function(carousel) {
				return carousel.id !== action.payload;
			});
			return {
				...state,
				carousels: filtered,
				deletingCarousel: 'deleted'
			};
		}
		case Actions.SET_DELETE_CAROUSEL_LOADER: {
			return {
				...state,
				deletingCarousel: action.payload
			};
		}

		case Actions.ADD_CAROUSEL_TO_HOME: {
			let carousels = state.carousels ? state.carousels : [];
			let ind = carousels.findIndex((item) => {
				return item.id === action.payload;
			});
			carousels[ind].in_home = true;
			return {
				...state,
				carousels: carousels,
				addingToHome: 'added'
			};
		}
		case Actions.SET_ADD_CAROUSEL_TO_HOME_LOADER: {
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

export default carousels;
