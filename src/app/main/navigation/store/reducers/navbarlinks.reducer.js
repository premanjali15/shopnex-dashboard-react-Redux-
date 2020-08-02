import * as Actions from '../actions';

const initialState = {
	navbarLinks: null,
	loadingLinks: true,
	creatingNavbarlink: false,
	updatingNavbarlink: false,
	deletingNavbarlink: false,
	orderingLinks: false
};

const navlinks = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_NAVBAR_LINKS: {
			return {
				...state,
				navbarLinks: action.payload,
				loadingLinks: false
			};
		}

		case Actions.CREATE_NAVBAR_LINK: {
			let links = state.navbarLinks ? state.navbarLinks : [];
			let ind = links.findIndex((item) => {
				return item.id === action.payload.id;
			});
			if (ind === -1) {
				links.push(action.payload);
			}

			return {
				...state,
				navbarLinks: links,
				creatingNavbarlink: 'created'
			};
		}

		case Actions.UPDATE_NAVBAR_LINK: {
			let links = state.navbarLinks;
			let ind = links.findIndex((item) => {
				return item.id === action.payload.id;
			});
			links[ind] = action.payload;

			return {
				...state,
				navbarLinks: links,
				updatingNavbarlink: 'updated'
			};
		}
		case Actions.DELETE_NAVBAR_LINK: {
			let links = state.navbarLinks;
			var filtered = links.filter(function(item) {
				return item.id !== action.payload;
			});
			return {
				...state,
				navbarLinks: filtered,
				deletingNavbarlink: 'deleted'
			};
		}
		case Actions.SET_NAVBAR_LINK_ORDER: {
			return {
				...state,
				orderingLinks: 'ordered'
			};
		}

		case Actions.SET_NAVBAR_LINKS_LOADER: {
			return {
				...state,
				loadingLinks: action.payload
			};
		}
		case Actions.SET_CREATE_NAVBAR_LINK_LOADER: {
			return {
				...state,
				creatingNavbarlink: action.payload
			};
		}
		case Actions.SET_UPDATE_NAVBAR_LINK_LOADER: {
			return {
				...state,
				updatingNavbarlink: action.payload
			};
		}
		case Actions.SET_DELETE_NAVBAR_LINK_LOADER: {
			return {
				...state,
				deletingNavbarlink: action.payload
			};
		}
		case Actions.SET_NAVBAR_LINK_ORDER_LOADER: {
			return {
				...state,
				orderingLinks: action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default navlinks;
