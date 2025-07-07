// ====================================================================
// קובץ: frontend-dashboard/src/pages/LoginPage.jsx
// סטטוס: הקוד תקין. אין צורך בשינויים.
// אבחון: בעיית הבקשות המרובות נבעה מתקלה בשרת שגרמה לו לא להגיב.
// התיקון שבוצע ב-backend-api/index.js פותר את שורש הבעיה.
// ====================================================================

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });
      login(response.data.token);
      navigate('/dashboard'); // נווט לדשבורד אחרי התחברות מוצלחת
    } catch (err) {
      setError('Login failed! Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email: </label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="password">Password: </label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LoginPage;