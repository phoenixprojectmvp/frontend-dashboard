import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 1. מייבאים את ה-Hook שלנו

function InboxList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { token } = useAuth(); // 2. קוראים ל-Hook כדי לקבל את הטוקן מה-Context

  useEffect(() => {
    // נריץ את הבדיקה רק אם קיים טוקן
    if (!token) {
      setLoading(false);
      // זו לא שגיאה, המשתמש פשוט לא מחובר
      return; 
    }

    const fetchConversations = async () => {
      try {
        // 3. השורה של הטוקן הידני נמחקה!

        const response = await axios.get('http://localhost:3001/api/conversations', {
          headers: {
            // 4. משתמשים בטוקן מה-Context
            'Authorization': `Bearer ${token}`
          }
        });

        setConversations(response.data.conversations);
      } catch (err) {
        setError('Failed to fetch conversations.');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]); // 5. הוספנו את 'token' למערך התלות - הקוד ירוץ מחדש כשהטוקן ישתנה

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // אם אין טוקן, אפשר להציג הודעה למשתמש
  if (!token) {
    return <div>Please log in to see your conversations.</div>
  }

  return (
    <div>
      <h3>Inbox</h3>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {conversations.map(convo => (
            <li key={convo.id}>
              Conversation ID: {convo.id} - Status: {convo.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InboxList;