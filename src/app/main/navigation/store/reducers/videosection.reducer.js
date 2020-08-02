import * as Actions from '../actions';

const initialState = {
	videosection: null,
	loading: true,
	creatingVideo: false,
	updatingVideo: false,
	deletingVideo: false,
	orderingVideos: false
};

const videos = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_VIDEO_SECTION_DETAILS: {
			return {
				...state,
				videosection: action.payload,
				loading: false
			};
		}
		case Actions.SET_VIDEO_SECTION_DETAILS_LOADER: {
			return {
				...state,
				loading: action.payload
			};
		}

		case Actions.CREATE_VIDEO: {
			let videos = state.videosection ? state.videosection.videos : [];
			let ind = videos.findIndex((video) => {
				return video.id === action.payload.id;
			});
			if (ind === -1) {
				videos.push(action.payload);
			}
			return {
				...state,
				videosection: { ...state.videosection, videos: videos },
				creatingVideo: 'created'
			};
		}
		case Actions.SET_CREATE_VIDEO_LOADER: {
			return {
				...state,
				creatingVideo: action.payload
			};
		}

		case Actions.UPDATE_VIDEO: {
			let videos = state.videosection ? state.videosection.videos : [];
			let ind = videos.findIndex((item) => {
				return item.id === action.payload.id;
			});
			videos[ind] = action.payload;

			return {
				...state,
				videosection: { ...state.videosection, videos: videos },
				updatingVideo: 'updated'
			};
		}
		case Actions.SET_UPDATE_VIDEO_LOADER: {
			return {
				...state,
				updatingVideo: action.payload
			};
		}

		case Actions.DELETE_VIDEO: {
			let videos = state.videosection ? state.videosection.videos : [];
			var filteredVideos = videos.filter(function(video) {
				return video.id !== action.payload;
			});
			return {
				...state,
				videosection: { ...state.videosection, videos: filteredVideos },
				deletingVideo: 'deleted'
			};
		}
		case Actions.SET_DELETE_VIDEO_LOADER: {
			return {
				...state,
				deletingVideo: action.payload
			};
		}

		case Actions.SET_VIDEOSECTION_VIDEOS_ORDER: {
			return {
				...state,
				orderingVideos: 'ordered'
			};
		}
		case Actions.SET_VIDEOSECTION_VIDEOS_ORDER_LOADER: {
			return {
				...state,
				orderingVideos: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default videos;
