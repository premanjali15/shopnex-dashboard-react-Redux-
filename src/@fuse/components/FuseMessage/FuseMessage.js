import React, { Component } from 'react';
import { IconButton, withStyles, Icon } from '@material-ui/core';
import { green, amber, blue } from '@material-ui/core/colors';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withSnackbar } from 'notistack';
import * as Actions from 'app/store/actions';

const styles = (theme) => ({
	root: {},
	success: {
		backgroundColor: green[600],
		color: '#ffffff'
	},
	error: {
		backgroundColor: theme.palette.error.dark,
		color: theme.palette.getContrastText(theme.palette.error.dark)
	},
	info: {
		backgroundColor: blue[600],
		color: '#ffffff'
	},
	warning: {
		backgroundColor: amber[600],
		color: '#ffffff'
	}
});

const variantIcon = {
	success: 'check_circle',
	warning: 'warning',
	error: 'error_outline',
	info: 'info'
};

class FuseMessage extends Component {
	closeSnackBar = (key) => {
		this.props.hideMessage();
		this.props.closeSnackbar(key);
	};

	componentDidUpdate() {
		let { options, classes, state } = this.props;

		if (this.props.state) {
			setTimeout(() => {
				this.props.hideMessage();
			}, 5000);
		}

		let children = (key) => (
			<div id={key} className={classNames(classes[options.variant], 'px-24 py-4 rounded-4')}>
				<div className="flex items-center w-full">
					{variantIcon[options.variant] && (
						<Icon className="mr-8" color="inherit">
							{variantIcon[options.variant]}
						</Icon>
					)}
					{options.message}
					<IconButton
						aria-label="cancel"
						onClick={() => this.closeSnackBar(key)}
						style={{ color: '#ffffff', marginLeft: '10px' }}
					>
						<Icon>close</Icon>
					</IconButton>
				</div>
			</div>
		);

		options['children'] = children;
		options['preventDuplicate'] = true;

		if (state) {
			this.props.enqueueSnackbar(options.message, options);
		}
	}
	render() {
		return null;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			hideMessage: Actions.hideMessage
		},
		dispatch
	);
}

function mapStateToProps({ fuse }) {
	return {
		state: fuse.message.state,
		options: fuse.message.options
	};
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withSnackbar(FuseMessage)));
