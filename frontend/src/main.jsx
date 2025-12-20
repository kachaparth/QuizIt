import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import CreateQuiz from './CreateQuiz.jsx'
import RunQuiz from './RunQuiz.jsx'
import Analytics from "./Analytics.jsx";
import UserAnalytics from "./UserAnalytics.jsx";
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/runQuiz/:quizId",
    element: <RunQuiz />
  },
  {
    path: "/quizAnalytics/:quizId",
    element: <UserAnalytics />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
