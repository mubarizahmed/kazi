import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App'
import './index.css'
import { Home, Notes } from './pages';

declare global {
  interface Window {
      electronAPI:any;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Routes>
  </BrowserRouter>
  </React.StrictMode>,
)
