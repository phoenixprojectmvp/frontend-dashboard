import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // 1. ייבוא של useNavigate

function LoginPage() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate(); // 2. יצירת פונקציית הניווט

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      login(response.data.token); // שומרים את הטוקן ב-Context הגלובלי

      // 3. אחרי שהתחברנו, נווט אוטומטית לדשבורד
      navigate('/dashboard'); 

    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : 'Login failed!');
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
    </div>
  );
}

export default LoginPage;