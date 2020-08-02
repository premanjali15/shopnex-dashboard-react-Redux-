import { combineReducers } from 'redux';
import taxes from './taxes.reducer';
import shippingzones from './shippingzones.reducer';
import shippingzone from './shippingzone.reducer';
import generalSettings from './generalsettings.reducer';

const reducer = combineReducers({
	taxes,
	shippingzones,
	shippingzone,
	generalSettings
});

export default reducer;
