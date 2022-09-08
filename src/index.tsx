import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AppProvider} from "./contexts/contexts";

// define forEach for FileList
declare global {
  interface FileList {
    forEach(callback: (f: File) => void): void;
  }
}
FileList.prototype.forEach = function (callback) {
  Array.prototype.forEach.call(this, callback)
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <App/>
    </AppProvider>
  </React.StrictMode>
);
