import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
    <a className='text-base m-5 absolute top-0 right-0 visited:text-text-300 text-text-300' href="https://mail.google.com/mail/u/0/">Gmail</a>
  </React.StrictMode>,
)
