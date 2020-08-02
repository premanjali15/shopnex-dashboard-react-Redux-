import { combineReducers } from 'redux';
import user from './user.reducer';
import login from './login.reducer';
import commondata from './commondata.reducer';

const authReducers = combineReducers({
	user,
	login,
	commondata
});

export default authReducers;
