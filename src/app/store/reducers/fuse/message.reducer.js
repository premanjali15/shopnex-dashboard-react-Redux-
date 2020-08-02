import * as Actions from '../../actions/fuse/index';

const initialState = {
	state: null,
	options: {
		anchorOrigin: {
			vertical: 'top',
			horizontal: 'right'
		},
		autoHideDuration: 5000,
		message: 'Hi',
		variant: 'success'
	}
};

const message = function(state = initialState, action) {
	switch (action.type) {
		case Actions.SHOW_MESSAGE: {
			return {
				state: true,
				options: {
					...initialState.options,
					...action.options
				}
			};
		}
		case Actions.HIDE_MESSAGE: {
			return {
				...state,
				state: null
			};
		}
		default: {
			return state;
		}
	}
};

export default message;
