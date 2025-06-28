import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from "socket.io-client";

function InboxList({ onConversationSelect }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return; 
    }

    const fetchConversations = async () => {
      // --- זה החלק שתוקן ---
      try {
        const response = await axios.get('http://localhost:3001/api/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setConversations(response.data.conversations);
      } catch (err) {
        setError('Failed to fetch conversations.');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
      // --- סוף החלק שתוקן ---
    };

    fetchConversations();

    const socket = io('http://localhost:3001');
    
    socket.on('new_conversation', (newConversation) => {
      console.log('Real-time update received!', newConversation);
      setConversations(prev => [newConversation, ...prev]);
    });

    return () => {
      socket.off('new_conversation');
      socket.disconnect();
    };
    
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!token) return <div>Please log in to see conversations.</div>;

  return (
    <div>
      <h3>Inbox</h3>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {conversations.map(convo => (
            <li 
              key={convo.id} 
              onClick={() => onConversationSelect(convo.id)}
              style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
            >
              Conversation ID: {convo.id} - Status: {convo.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InboxList;