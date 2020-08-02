import { combineReducers } from 'redux';
import products from './products.reducer';
import product from './product.reducer';
import categories from './categories.reducer';
import collections from './collections.reducer';
import collection from './collection.reducer';
import producttypes from './producttypes.reducer';
import producttype from './producttype.reducer';
import attributes from './attributes.reducer';
import attribute from './attribute.reducer';
import productInfo from './productinfo.reducer';
import variant from './variant.reducer';
import productimages from './productimages.reducer';

const reducer = combineReducers({
	products,
	product,
	categories,
	collections,
	collection,
	producttypes,
	producttype,
	attributes,
	attribute,
	productInfo,
	variant,
	productimages
});

export default reducer;
