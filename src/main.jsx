import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"; // הוספנו Navigate
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // <<< זה החלק החדש והחשוב
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);