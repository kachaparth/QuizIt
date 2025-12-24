import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import CreateQuiz from './CreateQuiz.jsx'
import RunQuiz from './RunQuiz.jsx'
import UserAnalytics from "./UserAnalytics.jsx";
import { createBrowserRouter, RouterProvider } from 'react-router'
import LandingPage from './LandingPage.jsx'
import AuthPage from './AuthPage.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/auth",
    element: <AuthPage />
  },
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
