import * as Actions from '../actions';

const initialState = {
	carousel: null,
	loadingCarousel: true,
	savingCarouselImageObj: false,
	savingCarouselImage: false,
	homeData: null,
	loadingHomeData: false,
	deletingImageObj: false,
	orderingImages: false
};

const carouselReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CAROUSEL: {
			return {
				...state,
				carousel: action.payload,
				loadingCarousel: false
			};
		}
		case Actions.SAVE_CAROUSEL_IMAGE: {
			let images = state.carousel.images ? state.carousel.images : [];
			let ind = images.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind > -1) {
				images[ind] = action.payload;
			} else {
				images.push(action.payload);
			}
			return {
				...state,
				carousel: { ...state.carousel, images },
				savingCarouselImage: 'saved'
			};
		}
		case Actions.SAVE_CAROUSEL_IMAGE_OBJ: {
			let images = state.carousel.images;
			let ind = images.findIndex((item) => {
				return item.id === action.payload.id;
			});
			images[ind] = action.payload;

			return {
				...state,
				carousel: { ...state.carousel, images },
				savingCarouselImageObj: 'saved'
			};
		}
		case Actions.DELETE_IMAGE_OBJ: {
			let images = state.carousel.images;
			var filtered = images.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				carousel: { ...state.carousel, images: filtered },
				deletingImageObj: 'deleted'
			};
		}
		case Actions.GET_HOME_DATA: {
			return {
				...state,
				homeData: action.payload,
				loadingHomeData: false
			};
		}
		case Actions.SET_CAROUSEL_IMG_ORDER: {
			return {
				...state,
				orderingImages: 'ordered'
			};
		}
		case Actions.SET_CAROUSEL_LOADER: {
			return {
				...state,
				loadingCarousel: action.payload
			};
		}
		case Actions.SET_SAVE_CAROUSEL_IMAGE_LOADER: {
			return {
				...state,
				savingCarouselImage: action.payload
			};
		}
		case Actions.SET_HOME_DATA_LOADER: {
			return {
				...state,
				loadingHomeData: action.payload
			};
		}
		case Actions.SET_SAVE_CAROUSEL_IMAGE_OBJ_LOADER: {
			return {
				...state,
				savingCarouselImageObj: action.payload
			};
		}
		case Actions.SET_DELETE_IMAGE_OBJ_LOADER: {
			return {
				...state,
				deletingImageObj: action.payload
			};
		}
		case Actions.SET_CAROUSEL_IMG_ORDER_LOADER: {
			return {
				...state,
				orderingImages: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default carouselReducer;
