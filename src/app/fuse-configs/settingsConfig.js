// function getApiURL() {
// 	let { hostname, protocol } = document.location;
// 	let splits = hostname.split('.');
// 	splits[0] = 'api';
// 	let apiUrl = protocol + '//' + splits.join('.') + '/';
// 	return apiUrl;
// }
// const apiUrl = getApiURL();

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
	// host_url: 'https://manage-test.shopnexhq.com/'
	host_url: 'https://xpi2.meoan.in/'
	// host_url: apiUrl ? apiUrl : getApiURL()

	// for miss india
	// host_url: 'https://api.missindiadesignersarees.com/'
	// host_url: 'https://xpi.missindiadesignersarees.com/'
	// host_url: 'http://api.missindiadesignersarees.local:8000/'

	// for aggana
	// host_url: 'https://xpi.aggana.in/'
	// host_url: 'https://api.aggana.in/'
	// host_url: 'http://api.aggana.local:8000/'

	// for tealand
	// host_url: 'https://xpi.tealand.in/'

	// for seven pillars
	// host_url: 'http://api.sevenpillarsdesign.shopnexhq.com/'

	// for fashionstore
	// host_url: 'http://admin.fashionstore.shopnexhq.com/'
	// host_url: 'http://api.fashionstore.shopnexhq.com/'
};

export default settingsConfig;
