function getApiURL() {
	let { hostname, protocol } = document.location;
	let splits = hostname.split('.');
	splits[0] = 'api';
	let apiUrl = protocol + '//' + splits.join('.') + '/';
	return apiUrl;
	// return 'http://api2.zeoan.in:8000/'
}
const apiUrl = getApiURL();

const settingsConfig = {
	layout: {
		style: 'layout1', // layout-1 layout-2 layout-3
		config: {} // checkout layout configs at app/fuse-configs/layout-1/Layout1Config.js
	},
	customScrollbars: true,
	theme: {
		main: 'default',
		navbar: 'mainThemeDark',
		toolbar: 'mainThemeLight',
		footer: 'mainThemeDark'
	},
	host_url: apiUrl
};

export default settingsConfig;
