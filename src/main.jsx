import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// ייבוא העמודים והרכיבים
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 1. ייבוא שומר הסף

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      // 2. יצרנו נתיב חדש שעוטף את כל הנתיבים המאובטחים
      {
        element: <ProtectedRoute />, // כל מה ש"בפנים" יהיה מאובטח
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          // נוכל להוסיף פה עוד נתיבים מאובטחים בעתיד
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