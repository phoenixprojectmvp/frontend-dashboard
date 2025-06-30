import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

function ConversationView({ conversationId, onReply }) {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { token } = useAuth();

  const fetchConversation = useCallback(async () => {
    if (!conversationId || !token) {
      setConversation(null);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/conversations/${conversationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversation(response.data);
    } catch (err) {
      console.error('Failed to fetch conversation details.', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, token]);

  useEffect(() => {
    fetchConversation();
    
    const socket = io('http://localhost:3001');
    const room = `conversation:${conversationId}`;
    if(conversationId) {
        socket.emit('join_conversation', conversationId);
    }

    socket.on('new_message', (newMessage) => {
      // עדכון השיחה רק אם היא השיחה הנוכחית שמוצגת
      setConversation(prev => {
        if (!prev || prev.id !== conversationId) return prev;
        return { ...prev, messages: [...prev.messages, newMessage] };
      });
    });

    return () => socket.disconnect();
  }, [conversationId, fetchConversation]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await axios.post(
        `http://localhost:3001/api/conversations/${conversationId}/messages`,
        { text: replyText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setReplyText('');
      // אנחנו לא מעדכנים כאן את ה-state, כי השרת ישדר את העדכון חזרה
    } catch (error) {
      alert('Failed to send reply.');
    }
  };

  if (!conversationId) return <p>Select a conversation from the list to see details.</p>;
  if (loading) return <p>Loading conversation...</p>;
  if (!conversation) return <p>Could not load conversation.</p>;
  
  return (
    <div>
      <h4>Conversation ID: {conversation.id} (Status: {conversation.status})</h4>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'auto' }}>
        {(conversation.messages || []).map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'agent' ? 'right' : 'left' }}>
            <p style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '10px',
              background: msg.sender === 'agent' ? '#007bff' : '#f0f0f0',
              color: msg.sender === 'agent' ? 'white' : 'black'
            }}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleReplySubmit} style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}

export default ConversationView;