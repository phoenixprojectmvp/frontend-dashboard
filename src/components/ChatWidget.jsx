import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // ייבוא ה-Hook של האימות

function ChatWidget() {
  const [message, setMessage] = useState('');
  const { token } = useAuth(); // קבלת הטוקן מה-Context הגלובלי

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!token) {
      alert('You must be logged in to send a message.');
      return;
    }

    try {
      // שליחת בקשת POST ל-API ליצירת שיחה
      const response = await axios.post(
        'http://localhost:3001/api/conversations',
        { firstMessage: message }, // גוף הבקשה
        { headers: { 'Authorization': `Bearer ${token}` } } // שליחת הטוקן
      );

      alert(`Successfully created conversation with ID: ${response.data.id}`);
      setMessage(''); // ניקוי תיבת הטקסט
    } catch (error) {
      alert('Failed to create conversation.');
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h4>Customer Chat Widget (Test)</h4>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '80%', padding: '5px' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWidget;