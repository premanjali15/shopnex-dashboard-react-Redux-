import axios from 'axios';
import jwtDecode from 'jwt-decode';
import FuseUtils from '@fuse/FuseUtils';
import settingsConfig from 'app/fuse-configs/settingsConfig';

class jwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			(response) => {
				return response;
			},
			(err) => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		let access_token = this.getAccessToken();

		if (!access_token) {
			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = (data) => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then((response) => {
				if (response.data.token) {
					this.setSession(response.data.token);
					resolve(response.data.token);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post(settingsConfig.host_url + 'get_token/', {
					username: email,
					password: password
				})
				.then((response) => {
					if (response.data.token) {
						this.setSession(response.data.token);
						const decoded = jwtDecode(response.data.token);
						resolve(decoded);
					} else {
						reject(response.data.error);
					}
				})
				.catch((error) => {
					let obj;
					if (error.response && error.response.data) {
						obj = Object.values(error.response.data)[0].toString();
					} else {
						obj = 'Some error occured';
					}
					reject(obj);
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get('/api/auth/access-token', {
					data: {
						access_token: this.getAccessToken()
					}
				})
				.then((response) => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						reject(response.data.error);
					}
				});
		});
	};

	updateUserData = (user) => {
		return axios.post('/api/auth/user/update', {
			user: user
		});
	};

	setSession = (access_token) => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common['Authorization'] = 'JWT ' + access_token;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common['Authorization'];
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = (access_token) => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		} else {
			return true;
		}
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new jwtService();

export default instance;
