import './App.css';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  // 1. שולפים את סטטוס האימות מה-Context הגלובלי
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      <h1>Phoenix Project Dashboard</h1>
      <hr />

      {/* 2. מציגים קומפוננטה אחרת בהתאם לשאלה אם המשתמש מחובר */}
      {isAuthenticated ? (
        <DashboardPage /> // אם כן, הצג את הדשבורד
      ) : (
        <LoginPage />     // אם לא, הצג את עמוד הלוגין
      )}
    </div>
  )
}

export default App;