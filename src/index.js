import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TPC from './TPC/TPC'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<TPC />, document.getElementById('root'));
registerServiceWorker();
