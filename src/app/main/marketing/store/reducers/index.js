import { combineReducers } from 'redux';
import seoproduct from './seoproduct.reducer';
import seo from './seo.reducer';

const reducer = combineReducers({
	seoproduct,
	seo
});

export default reducer;
