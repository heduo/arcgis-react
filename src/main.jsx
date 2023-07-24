import React from 'react'
import ReactDOM from 'react-dom/client'
import { WrappedApp } from './components/App';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <WrappedApp />
  </React.StrictMode>
)
