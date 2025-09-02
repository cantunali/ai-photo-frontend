import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'  // Test yerine App
import './output.css'  // output.css kullanmaya devam

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)