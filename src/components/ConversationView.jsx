import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

// Helper function to format time
function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function ConversationView({ conversationId, onUpdateStatus }) {
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isClientTyping, setIsClientTyping] = useState(false); // NEW: State for client typing
  const { token } = useAuth();
  
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref to scroll to bottom

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversation) {
        scrollToBottom();
    }
  }, [conversation?.messages, isClientTyping]);


  useEffect(() => {
    if (!conversationId) {
      setIsClientTyping(false); // Reset typing status when no conversation is selected
      return;
    }

    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_conversation', conversationId);
    });

    const handleNewMessage = (newMessage) => {
      setIsClientTyping(false); // Client sent a message, so they stopped typing
      if (newMessage.conversationId === conversationId) {
        setConversation(prev => {
          if (prev && !prev.messages.some(msg => msg.timestamp === newMessage.timestamp)) {
            return { ...prev, messages: [...prev.messages, newMessage] };
          }
          return prev;
        });
      }
    };
    
    const handleConversationUpdate = (updatedConversation) => {
      if (updatedConversation.id === conversationId) {
        setConversation(updatedConversation);
      }
    };

    // --- NEW: Listen for client typing events ---
    const handleClientTyping = (data) => {
      if (data.conversationId === conversationId) {
        setIsClientTyping(true);
      }
    };

    const handleClientStoppedTyping = (data) => {
      if (data.conversationId === conversationId) {
        setIsClientTyping(false);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('conversation_updated', handleConversationUpdate);
    socket.on('client_is_typing', handleClientTyping);
    socket.on('client_stopped_typing', handleClientStoppedTyping);

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

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
  }, [fetchConversation]);


  const handleTyping = (e) => {
    setReplyText(e.target.value);
    
    if (!socketRef.current || !socketRef.current.connected) return;

    socketRef.current.emit('agent_is_typing', { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('agent_stopped_typing', { conversationId });
      }
    }, 2000);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (socketRef.current) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketRef.current.emit('agent_stopped_typing', { conversationId });
    }

    try {
      await axios.post(
        `http://localhost:3001/api/conversations/${conversationId}/messages`,
        { text: replyText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setReplyText('');
    } catch (error) {
      alert('Failed to send reply.');
    }
  };

  const handleStatusButtonClick = () => {
    const newStatus = conversation.status === 'open' ? 'closed' : 'open';
    onUpdateStatus(conversationId, newStatus);
  };

  if (!conversationId) return <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>בחר שיחה מהרשימה כדי להתחיל</div>;
  if (loading) return <p>טוען שיחה...</p>;
  if (!conversation) return <p>לא ניתן לטעון את פרטי השיחה.</p>;
  
  const clientName = conversation.end_user_name || 'Client';
  const clientInitial = clientName.charAt(0).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', padding: '10px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
        <h4 style={{ margin: 0, fontWeight: 600 }}>{clientName}</h4>
        <button 
          onClick={handleStatusButtonClick}
          style={{
            padding: '8px 15px',
            border: 'none',
            backgroundColor: conversation.status === 'open' ? '#dc3545' : '#28a745',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {conversation.status === 'open' ? 'סגור שיחה' : 'פתח מחדש'}
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
        {(conversation.messages || []).map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'agent' ? 'agent' : 'client'}`} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '15px', justifyContent: msg.sender === 'agent' ? 'flex-end' : 'flex-start' }}>
            {msg.sender === 'client' && <div className="avatar" style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', flexShrink: 0}}>{clientInitial}</div>}
            <div className="message-content" style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'agent' ? 'flex-end' : 'flex-start' }}>
                <p className="bubble" style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  background: msg.sender === 'agent' ? '#007bff' : '#f0f0f0',
                  color: msg.sender === 'agent' ? 'white' : 'black',
                  margin: 0,
                  maxWidth: '400px'
                }}>
                  {msg.text}
                </p>
                <span className="timestamp" style={{fontSize: '11px', color: '#888', marginTop: '4px'}}>{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        {isClientTyping && (
            <div className="message client" style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '15px' }}>
                <div className="avatar" style={{width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e4e6eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', flexShrink: 0}}>{clientInitial}</div>
                <div style={{fontStyle: 'italic', color: '#888', fontSize: '14px', padding: '10px 15px'}}>
                    מקליד/ה...
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Form */}
      <form onSubmit={handleReplySubmit} style={{ display: 'flex', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
        <input
          type="text"
          value={replyText}
          onChange={handleTyping}
          placeholder="הקלד/י תשובה..."
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px' }}
          disabled={conversation.status === 'closed'}
        />
        <button type="submit" style={{padding: '10px 15px', borderRadius: '20px', border: 'none', backgroundColor: '#007bff', color: 'white'}} disabled={conversation.status === 'closed'}>שלח</button>
      </form>
    </div>
  );
}

export default ConversationView;
