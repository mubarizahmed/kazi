import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App'
import './index.css'
import { Home, Notes, Settings } from './pages';

declare global {
  interface Window {
      electronAPI:any;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="notes" element={<Notes />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
  </HashRouter>
  </React.StrictMode>,
)
