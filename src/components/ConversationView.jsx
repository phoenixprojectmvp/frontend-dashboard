import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ConversationView({ conversationId }) {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    // אל תעשה כלום אם לא נבחרה שיחה
    if (!conversationId) {
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
  }, [conversationId, token]); // ה-Hook ירוץ מחדש כל פעם שבוחרים שיחה אחרת

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!conversation) return <p>Select a conversation to view its details.</p>;

  // אם אין הודעות, נציג מערך ריק כדי למנוע קריסה
  const messages = conversation.messages || [];

  return (
    <div>
      <h4>Conversation ID: {conversation.id} (Status: {conversation.status})</h4>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto', background: 'white' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} style={{ margin: '5px 0' }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))
        ) : (
          <p>No messages in this conversation yet.</p>
        )}
      </div>
    </div>
  );
}

export default ConversationView;