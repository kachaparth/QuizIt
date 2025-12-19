import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import CreateQuiz from './CreateQuiz.jsx'
import RunQuiz from './RunQuiz.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CreateQuiz />

    
  </StrictMode>,
)
