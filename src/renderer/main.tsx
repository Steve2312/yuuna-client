import * as ReactDOM from 'react-dom';
import App from './components/App'
import './styles/index.scss';
import * as ReactDOMClient from 'react-dom/client';

const rootElement = document.getElementById('root');
// @ts-ignore
const root = ReactDOMClient.createRoot(rootElement);
root.render(<App/>);
