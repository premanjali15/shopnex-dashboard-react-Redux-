import * as Actions from '../actions';

const initialState = {
	homeData: null,
	loadingHomeData: true,
	updatingHomeData: false,

	pages: null,
	loadingPages: false,
	updatingPage: false,

	products: null,
	loadingProducts: false
};

const seoReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SEO_HOME_DATA: {
			return {
				...state,
				homeData: action.payload,
				loadingHomeData: false
			};
		}
		case Actions.SET_SEO_HOME_DATA_LOADER: {
			return {
				...state,
				loadingHomeData: action.payload
			};
		}

		case Actions.UPDATE_SEO_HOME_DATA: {
			return {
				...state,
				homeData: action.payload,
				updatingHomeData: 'updated'
			};
		}
		case Actions.SET_UPDATE_SEO_HOME_DATA_LOADER: {
			return {
				...state,
				updatingHomeData: action.payload
			};
		}

		case Actions.GET_SEO_PAGES: {
			return {
				...state,
				pages: action.payload,
				loadingPages: false
			};
		}
		case Actions.SET_SEO_PAGES_LOADER: {
			return {
				...state,
				loadingPages: action.payload
			};
		}

		case Actions.UPDATE_SEO_PAGE: {
			let pages = state.pages;
			let { payloadData, type } = action.payload;
			let updatedData = {
				id: payloadData.id,
				seo_title: payloadData.seo_title,
				seo_description: payloadData.seo_description,
				keywords: payloadData.keywords
			};
			if (type === 'category') {
				let categories = pages.category ? pages.category : [];
				let index = categories.findIndex(function(item) {
					return item.id === payloadData.id;
				});
				categories[index] = updatedData;
				pages = { ...pages, category: categories };
			} else if (type === 'collection') {
				let collections = pages.collection ? pages.collection : [];
				let index = collections.findIndex(function(item) {
					return item.id === payloadData.id;
				});
				collections[index] = updatedData;
				pages = { ...pages, collection: collections };
			}
			return {
				...state,
				pages: pages,
				updatingPage: 'updated'
			};
		}
		case Actions.SET_UPDATE_SEO_PAGE_LOADER: {
			return {
				...state,
				updatingPage: action.payload
			};
		}

		case Actions.GET_SEO_PRODUCTS: {
			return {
				...state,
				products: action.payload,
				loadingProducts: false
			};
		}
		case Actions.SET_SEO_PRODUCTS_LOADER: {
			return {
				...state,
				loadingProducts: action.payload
			};
		}

		default: {
			return state;
		}
	}
};

export default seoReducer;
