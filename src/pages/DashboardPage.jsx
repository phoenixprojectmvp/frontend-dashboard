import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import InboxList from '../components/InboxList';
import ConversationView from '../components/ConversationView';
import NewConversationForm from '../components/NewConversationForm';

function DashboardPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { token } = useAuth();

  // עטפנו את קריאת ה-API בפונקציה שנוכל לקרוא לה שוב
  const fetchConversations = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('http://localhost:3001/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(response.data.conversations);
    } catch (err) {
      setError('Failed to fetch conversations.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ה-useEffect רץ פעם אחת כשהדף נטען
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <div style={{ flex: 1 }}>
          {/* העברנו את הפונקציה לרענון הרשימה לטופס */}
          <NewConversationForm onConversationCreated={fetchConversations} />
          <hr style={{ margin: '20px 0' }} />
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