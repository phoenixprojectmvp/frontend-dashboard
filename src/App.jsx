import { Outlet } from 'react-router-dom'; // 1. ייבוא של קומפוננטת Outlet

function App() {
  return (
    <div>
      <h1>Phoenix Project Dashboard</h1>
      <hr />

      <main>
        {/* 2. כאן יוצגו העמודים שהגדרנו ב-router */}
        <Outlet />
      </main>
    </div>
  )
}

export default App;