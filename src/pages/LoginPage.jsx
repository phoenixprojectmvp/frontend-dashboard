import React, { useState } from 'react';
import axios from 'axios'; // 1. ייבוא של ספריית axios

function LoginPage() {
  const [email, setEmail] = useState('test@test.com'); // נשים ערכי ברירת מחדל לנוחות
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(''); // State להצגת הודעות שגיאה
  const [token, setToken] = useState('');   // State לשמירת הטוקן שנקבל

  // 2. הפכנו את הפונקציה לאסינכרונית כדי שנוכל להשתמש ב-await
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // איפוס שגיאות קודמות
    setToken(''); // איפוס טוקן קודם

    try {
      // 3. שליחת בקשת POST ל-API שלנו עם האימייל והסיסמה
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      // 4. אם הבקשה הצליחה, נשמור את הטוקן מהתגובה
      const receivedToken = response.data.token;
      console.log('Login successful! Token:', receivedToken);
      setToken(receivedToken);

    } catch (err) {
      // 5. אם השרת החזיר שגיאה, נציג אותה
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
      
      {/* 6. הצגת הודעת שגיאה או הצלחה למשתמש */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {token && <p style={{ color: 'green' }}>Login Successful! Token received.</p>}
    </div>
  );
}

export default LoginPage;