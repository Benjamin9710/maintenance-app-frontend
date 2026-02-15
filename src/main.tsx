import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './lib/auth'
const { default: App } = await import('./App.tsx')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
