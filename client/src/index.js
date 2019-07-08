import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
// import './assets-old/assets/scss/black-dashboard-react.scss';
// import './assets-old/assets/demo/demo.css';
// import './assets-old/assets/css/nucleo-icons.css';
import 'jquery';
import 'popper.js';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
