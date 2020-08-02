import * as Actions from '../actions';

const initialState = {
	instagramSections: null,
	loadingInstagramSections: true,
	creatingInstagramSection: false,
	updatingInstagramSection: false,
	deletingInstagramSection: false,
	addingToHome: false
};

const instagramSectionsReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_INSTAGRAM_SECTIONS: {
			return {
				...state,
				instagramSections: action.payload,
				loadingInstagramSections: false
			};
		}
		case Actions.SET_INSTAGRAM_SECTIONS_LOADER: {
			return {
				...state,
				loadingInstagramSections: action.payload
			};
		}

		case Actions.CREATE_INSTAGRAM_SECTION: {
			let instagramSections = state.instagramSections ? state.instagramSections : [];
			let ind = instagramSections.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind === -1) {
				let obj = { id: action.payload.id, title: action.payload.title, item_count: action.payload.item_count };
				instagramSections.push(obj);
			}
			return {
				...state,
				instagramSections: instagramSections,
				creatingInstagramSection: 'created'
			};
		}
		case Actions.SET_CREATE_INSTAGRAM_SECTION_LOADER: {
			return {
				...state,
				creatingInstagramSection: action.payload
			};
		}

		case Actions.UPDATE_INSTAGRAM_SECTION: {
			let instagramSections = state.instagramSections;
			let ind = instagramSections.findIndex((item) => {
				return item.id === action.payload.id;
			});

			instagramSections[ind].title = action.payload.title;
			return {
				...state,
				instagramSections: instagramSections,
				updatingInstagramSection: 'updated'
			};
		}
		case Actions.SET_UPDATE_INSTAGRAM_SECTION_LOADER: {
			return {
				...state,
				updatingInstagramSection: action.payload
			};
		}

		case Actions.DELETE_INSTAGRAM_SECTION: {
			let instagramSections = state.instagramSections;
			var filtered = instagramSections.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				instagramSections: filtered,
				deletingInstagramSection: 'deleted'
			};
		}
		case Actions.SET_DELETE_INSTAGRAM_SECTION_LOADER: {
			return {
				...state,
				deletingInstagramSection: action.payload
			};
		}

		case Actions.ADD_INSTAGRAM_SECTION_TO_HOME: {
			let instagramSections = state.instagramSections ? state.instagramSections : [];
			let ind = instagramSections.findIndex((item) => {
				return item.id === action.payload;
			});
			instagramSections[ind].in_home = true;
			return {
				...state,
				instagramSections: instagramSections,
				addingToHome: 'added'
			};
		}
		case Actions.SET_ADD_INSTAGRAM_SECTION_TO_HOME_LOADER: {
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

export default instagramSectionsReducer;
