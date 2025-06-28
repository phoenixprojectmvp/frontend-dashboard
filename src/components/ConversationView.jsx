import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ConversationView({ conversationId }) {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!conversationId || !token) {
      setLoading(false);
      setConversation(null);
      return;
    }

    const fetchConversation = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:3001/api/conversations/${conversationId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setConversation(response.data);
      } catch (err) {
        setError('Failed to fetch conversation details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, token]);

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!conversation) return <p>Select a conversation to view its details.</p>;

  // --- התיקון נמצא כאן ---
  // ה-messages כבר מגיע מהשרת כמערך, אין צורך ב-JSON.parse
  const messages = conversation.messages;

  return (
    <div>
      <h4>Conversation ID: {conversation.id} (Status: {conversation.status})</h4>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto', background: 'white' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '5px 0', padding: '8px', background: '#f0f0f0', borderRadius: '5px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationView;