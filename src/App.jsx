import './App.css';
import LoginPage from './pages/LoginPage.jsx'; // ייבוא העמוד החדש

function App() {
  return (
    <div>
      <h1>Phoenix Project Dashboard</h1>
      <hr />
      <LoginPage /> {/* הצגת העמוד החדש */}
    </div>
  )
}

export default App;