import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Phoenix Project</h1>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;