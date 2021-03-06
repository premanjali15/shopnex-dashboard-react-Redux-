import 'babel-polyfill';
import 'typeface-muli';
import './react-table-defaults';
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import * as serviceWorker from './serviceWorker';
import App from 'app/App';

ReactDOM.render(
	<SnackbarProvider maxSnack={10}>
		<App />
	</SnackbarProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
