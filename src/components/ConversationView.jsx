import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ConversationView({ conversationId }) {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState(''); // State חדש עבור ההודעה של הנציג
  const { token } = useAuth();

  useEffect(() => {
    if (!conversationId || !token) {
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
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, token]);

  // --- פונקציה חדשה לשליחת תשובה ---
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3001/api/conversations/${conversationId}/messages`,
        { text: replyText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // עדכון ה-state עם השיחה המעודכנת מהשרת
      setConversation(response.data);
      setReplyText(''); // ניקוי תיבת הטקסט
    } catch (error) {
      alert('Failed to send reply.');
      console.error(error);
    }
  };

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!conversation) return <p>Select a conversation to view its details.</p>;

  const messages = conversation.messages || [];

  return (
    <div>
      <h4>Conversation ID: {conversation.id} (Status: {conversation.status})</h4>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto', background: 'white' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '5px 0', padding: '8px', background: msg.sender === 'agent' ? '#e1f5fe' : '#f0f0f0', borderRadius: '5px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* --- טופס חדש לשליחת תשובה --- */}
      <form onSubmit={handleReplySubmit} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          style={{ width: '80%', padding: '5px' }}
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}

export default ConversationView;