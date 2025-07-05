import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function NewConversationForm({ onConversationCreated }) {
  const [endUserId, setEndUserId] = useState('1');
  const [firstMessage, setFirstMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!endUserId || !firstMessage) {
      setError('Please fill out all fields.');
      return;
    }
    try {
      // --- התיקון כאן ---
      // שיניתי את שמות המפתחות כדי שיתאימו למה שהשרת מצפה לקבל
      // endUserId -> end_user_id
      // firstMessage -> first_message
      await axios.post(
        'http://localhost:3001/api/conversations',
        { 
          end_user_id: parseInt(endUserId, 10), 
          first_message: firstMessage 
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setFirstMessage('');
      // קורא לפונקציה שמרעננת את רשימת השיחות בדאשבורד
      if (onConversationCreated) {
        onConversationCreated();
      }
    } catch (err) {
      setError('Failed to create conversation.');
      console.error(err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
      <h4>Create New Conversation</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>End User ID: </label>
          <input type="number" value={endUserId} onChange={(e) => setEndUserId(e.target.value)} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>First Message:</label>
          <textarea value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)} rows="3" style={{ width: '95%' }} />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Create</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default NewConversationForm;
