import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Components/Game.js';
import {settings} from './Settings.js';

ReactDOM.render(
  <Game settings={settings} />,
  document.getElementById('root')
);
