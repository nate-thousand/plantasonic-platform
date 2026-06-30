import '@ds/css/variables.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/main.scss';
import { mountApp } from './app';

const root = document.querySelector('#app');
if (root) mountApp(root as HTMLElement);
