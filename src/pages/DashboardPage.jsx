import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import InboxList from '../components/InboxList';
import ConversationView from '../components/ConversationView';

function DashboardPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true); // מתחילים במצב טעינה
  const [error, setError] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { token, isAuthenticated } = useAuth(); // קבלת הטוקן והסטטוס

  useEffect(() => {
    // אם אין טוקן, אין מה לטעון. נסיים את הטעינה.
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setConversations(response.data.conversations);
      } catch (err) {
        setError('Failed to fetch conversations.');
        console.error('Error fetching conversations:', err);
      } finally {
        // בסיום הבקשה (הצלחה או כישלון), נסיים את מצב הטעינה
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]); // ה-Hook יפעל רק כשהטוקן משתנה

  // הצגת הודעת טעינה רק אם אנחנו באמת בתהליך טעינה
  if (loading) {
    return <div>Loading conversations...</div>;
  }

  // הצגת הודעת שגיאה אם הבקשה נכשלה
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  
  // אם המשתמש לא מחובר, אין מה להציג
  if (!isAuthenticated) {
    return <p>Please log in to view the dashboard.</p>
  }

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', padding: '20px', background: '#f9f9f9' }}>
        <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '20px' }}>
          <InboxList 
            conversations={conversations} 
            onConversationSelect={setSelectedConversationId} 
          />
        </div>
        <div style={{ flex: 2 }}>
          <ConversationView conversationId={selectedConversationId} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;