import * as Actions from '../actions';

const initialState = {
	videoSections: null,
	loadingVideoSections: true,
	creatingVideoSection: false,
	updatingVideoSection: false,
	deletingVideoSection: false,
	addingToHome: false
};

const videos = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_VIDEO_SECTIONS: {
			return {
				...state,
				videoSections: action.payload,
				loadingVideoSections: false
			};
		}
		case Actions.SET_VIDEO_SECTIONS_LOADER: {
			return {
				...state,
				loadingVideoSections: action.payload
			};
		}

		case Actions.CREATE_VIDEO_SECTION: {
			let videoSections = state.videoSections ? state.videoSections : [];
			let ind = videoSections.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind === -1) {
				let obj = { id: action.payload.id, title: action.payload.title, item_count: action.payload.item_count };
				videoSections.push(obj);
			}
			return {
				...state,
				videoSections: videoSections,
				creatingVideoSection: 'created'
			};
		}
		case Actions.SET_CREATE_VIDEO_SECTION_LOADER: {
			return {
				...state,
				creatingVideoSection: action.payload
			};
		}

		case Actions.UPDATE_VIDEO_SECTION: {
			let videoSections = state.videoSections;
			let ind = videoSections.findIndex((item) => {
				return item.id === action.payload.id;
			});

			videoSections[ind].title = action.payload.title;
			return {
				...state,
				videoSections: videoSections,
				updatingVideoSection: 'updated'
			};
		}
		case Actions.SET_UPDATE_VIDEO_SECTION_LOADER: {
			return {
				...state,
				updatingVideoSection: action.payload
			};
		}

		case Actions.DELETE_VIDEO_SECTION: {
			let videoSections = state.videoSections;
			var filtered = videoSections.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				videoSections: filtered,
				deletingVideoSection: 'deleted'
			};
		}
		case Actions.SET_DELETE_VIDEO_SECTION_LOADER: {
			return {
				...state,
				deletingVideoSection: action.payload
			};
		}

		case Actions.ADD_VIDEO_SECTION_TO_HOME: {
			let videoSections = state.videoSections ? state.videoSections : [];
			let ind = videoSections.findIndex((item) => {
				return item.id === action.payload;
			});
			videoSections[ind].in_home = true;
			return {
				...state,
				videoSections: videoSections,
				addingToHome: 'added'
			};
		}
		case Actions.SET_ADD_VIDEO_SECTION_TO_HOME_LOADER: {
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

export default videos;
