import * as Actions from '../actions';

const initialState = {
	data: null,
	loading: true,
	savingImage: false,
	toppingImage: false,
	deletingImage: false,
	savingImgColor: false,
	updatingImgColor: false,
	deletingImgColor: false,
	orderingImages: false
};

const productImages = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_PRODUCT_IMAGES: {
			return {
				...state,
				data: action.payload,
				loading: false
			};
		}
		case Actions.SAVE_IMAGE: {
			return {
				...state,
				savingImage: 'saved'
			};
		}
		case Actions.TOP_IMAGE: {
			let images = state.data.images;
			let prevInd = images.findIndex((img) => img.order === 0);
			let currentInd = images.findIndex((img) => img.id === action.payload);
			if (prevInd !== -1) images[prevInd].order = images[currentInd].order;
			images[currentInd].order = 0;
			return {
				...state,
				data: { ...state.data, images: images },
				toppingImage: 'topped'
			};
		}
		case Actions.DELETE_IMAGE: {
			let images = state.data.images;
			var filteredImages = images.filter(function(image) {
				return image.id !== action.payload;
			});
			return {
				...state,
				data: { ...state.data, images: filteredImages },
				deletingImage: 'deleted'
			};
		}
		case Actions.SAVE_IMAGE_COLOR: {
			let data = { ...state.data, color: action.payload };
			return {
				...state,
				data: data,
				savingImgColor: 'saved'
			};
		}
		case Actions.UPDATE_IMAGE_COLOR: {
			return {
				...state,
				data: { ...state.data, color: action.payload },
				updatingImgColor: 'updated'
			};
		}
		case Actions.DELETE_IMAGE_COLOR: {
			let data = state.data;
			data['color'] = null;
			return {
				...state,
				data: data,
				deletingImgColor: 'deleted'
			};
		}
		case Actions.SET_IMAGES_ORDER: {
			return {
				...state,
				orderingImages: 'ordered'
			};
		}
		case Actions.SET_PRODUCT_IMAGES_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}
		case Actions.SET_SAVE_IMAGE_LOADER: {
			return {
				...state,
				savingImage: action.payload
			};
		}
		case Actions.SET_TOP_IMAGE_LOADER: {
			return {
				...state,
				toppingImage: action.payload
			};
		}
		case Actions.SET_DELETE_IMAGE_LOADER: {
			return {
				...state,
				deletingImage: action.payload
			};
		}
		case Actions.SET_SAVE_IMAGE_COLOR_LOADER: {
			return {
				...state,
				savingImgColor: action.payload
			};
		}
		case Actions.SET_UPDATE_IMAGE_COLOR_LOADER: {
			return {
				...state,
				updatingImgColor: action.payload
			};
		}
		case Actions.SET_DELETE_IMAGE_COLOR_LOADER: {
			return {
				...state,
				deletingImgColor: action.payload
			};
		}
		case Actions.SET_IMAGES_ORDER_LOADER: {
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

export default productImages;
