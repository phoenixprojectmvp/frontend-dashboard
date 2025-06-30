import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import InboxList from '../components/InboxList.jsx';
import ConversationView from '../components/ConversationView.jsx';
import NewConversationForm from '../components/NewConversationForm.jsx';

function DashboardPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { token } = useAuth();

  const fetchConversations = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get('http://localhost:3001/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(response.data.conversations || []);
    } catch (err) {
      setError('Failed to fetch conversations.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConversations();
    
    const socket = io('http://localhost:3001');

    socket.on('new_conversation', (newConversation) => {
        // הוספת השיחה החדשה לראש הרשימה
        setConversations(prev => [newConversation, ...prev]);
    });

    return () => {
        socket.disconnect();
    };
  }, [fetchConversations]);

  // פונקציה שתטפל ביצירת שיחה ותבחר אותה אוטומטית
  const handleConversationCreated = () => {
    fetchConversations();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <NewConversationForm onConversationCreated={handleConversationCreated} />
          <hr style={{ margin: '20px 0' }} />
          <InboxList 
            conversations={conversations} 
            onConversationSelect={setSelectedConversationId}
            selectedConversationId={selectedConversationId} // מעבירים את ה-ID הנבחר
          />
        </div>
        <div style={{ flex: 2 }}>
          <ConversationView 
            conversationId={selectedConversationId} 
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;