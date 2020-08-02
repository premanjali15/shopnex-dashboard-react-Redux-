import React, { Component } from 'react';
import { Button, InputAdornment, Icon } from '@material-ui/core';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import * as authActions from 'app/auth/store/actions';
import jwtService from 'app/services/jwtService';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
	root: {
		display: 'flex',
		alignItems: 'center'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -5,
		marginLeft: -12
	}
});

class JWTLoginTab extends Component {
	state = {
		canSubmit: false,
		loading: false,
		error: null,
		valuesChanged: true
	};

	form = React.createRef();

	disableButton = () => {
		this.setState({ canSubmit: false });
	};

	enableButton = () => {
		this.setState({ canSubmit: true });
	};

	onSubmit = (model) => {
		this.setState({ loading: true });
		this.props.submitLogin(model);
	};

	componentDidMount() {
		let token = localStorage.getItem('jwt_access_token');
		let loggedIn;
		if (token !== undefined && token !== null) {
			if (jwtService.isAuthTokenValid(token)) {
				loggedIn = true;
				jwtService.setSession(token);
			} else loggedIn = false;
		} else {
			loggedIn = false;
		}
		if (loggedIn === true) {
			this.props.history.replace('/');
		}
	}

	componentDidUpdate() {
		if (this.props.login.error) {
			// this.form.updateInputsWithError({
			// 	...this.props.login.error
			// });
			// this.disableButton();
			if (!this.state.error) this.setState({ error: this.props.login.error });
			this.props.login.error = null;
			if (this.state.valuesChanged) this.setState({ valuesChanged: false });
			if (this.state.loading) this.setState({ loading: false });
		}
		if (this.props.user.status === 'success') {
			this.props.history.replace('/');
		}
		return null;
	}

	onChange = () => {
		this.setState({ error: null, valuesChanged: true });
	};

	render() {
		const { canSubmit } = this.state;
		const { classes } = this.props;
		return (
			<div className="w-full">
				<Formsy
					onValidSubmit={this.onSubmit}
					onValid={this.enableButton}
					onInvalid={this.disableButton}
					ref={(form) => (this.form = form)}
					className="flex flex-col justify-center w-full"
				>
					<TextFieldFormsy
						className="mb-16"
						type="text"
						name="email"
						label="Username/Email"
						validations={{
							minLength: 4
						}}
						validationErrors={{
							minLength: 'Min character length is 4'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										email
									</Icon>
								</InputAdornment>
							)
						}}
						onChange={this.onChange}
						variant="outlined"
						required
					/>

					<TextFieldFormsy
						className="mb-16"
						type="password"
						name="password"
						label="Password"
						validations={{
							minLength: 4
						}}
						validationErrors={{
							minLength: 'Min character length is 4'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										vpn_key
									</Icon>
								</InputAdornment>
							)
						}}
						onChange={this.onChange}
						variant="outlined"
						required
					/>
					{this.state.error && <p className="text-red text-center">{this.state.error}</p>}
					<div className={classes.wrapper}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16 normal-case"
							aria-label="LOG IN"
							disabled={!canSubmit || this.state.loading || !this.state.valuesChanged}
							value="legacy"
						>
							Login
						</Button>
						{this.state.loading && (
							<CircularProgress size={24} className={classes.buttonProgress} color="secondary" />
						)}
					</div>
				</Formsy>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			submitLogin: authActions.submitLogin
		},
		dispatch
	);
}

function mapStateToProps({ auth }) {
	return {
		login: auth.login,
		user: auth.user
	};
}

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(JWTLoginTab)));
