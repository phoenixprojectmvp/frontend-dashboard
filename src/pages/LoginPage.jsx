import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 1. מייבאים את ה-Hook שלנו

function LoginPage() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const { login, token } = useAuth(); // 2. משתמשים ב-Hook כדי לקבל את פונקציית ה-login ואת הטוקן

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      // 3. במקום לשמור ב-state מקומי, אנחנו קוראים לפונקציית ה-login מה-Context
      login(response.data.token);

      console.log('Login successful! Token stored in context.');

    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data : 'Login failed!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Login</button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {/* 4. מציגים את הטוקן מה-Context הגלובלי, לא ממקומי */}
      {token && <p style={{ color: 'green' }}>Login Successful! Token is now stored globally.</p>}
    </div>
  );
}

export default LoginPage;