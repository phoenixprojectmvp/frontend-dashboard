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
  const [filter, setFilter] = useState('open');
  
  // --- NEW: State to track unread conversations ---
  const [unreadIds, setUnreadIds] = useState([]);

  const fetchConversations = useCallback(async (status) => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = `http://localhost:3001/api/conversations${status ? `?status=${status}` : ''}`;
    
    try {
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setConversations(response.data.conversations || []);
      setSelectedConversationId(prevId => {
        const isSelectedInNewList = response.data.conversations.some(c => c.id === prevId);
        return isSelectedInNewList ? prevId : null;
      });
    } catch (err) {
      setError('Failed to fetch conversations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleClaimConversation = useCallback(async (conversationId) => {
    if (!token) return;
    try {
      await axios.patch(
        `http://localhost:3001/api/conversations/${conversationId}/claim`,
        {}, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to claim conversation:', err);
      alert('Could not claim conversation. It might have already been taken.');
    }
  }, [token]);

  const handleUpdateConversationStatus = useCallback(async (conversationId, status) => {
    if (!token) return;
    try {
      await axios.patch(
        `http://localhost:3001/api/conversations/${conversationId}/status`,
        { status: status },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(`Failed to update status for conversation ${conversationId}:`, err);
      alert('Could not update conversation status.');
    }
  }, [token]);

  // --- NEW: Function to handle selecting a conversation and marking it as read ---
  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    // Remove the ID from the unread list when it's selected
    setUnreadIds(prev => prev.filter(id => id !== conversationId));
  };

  useEffect(() => {
    fetchConversations(filter);
  }, [filter, fetchConversations]);

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('new_conversation', (newConversation) => {
      if (filter === 'all' || filter === newConversation.status) {
        setConversations(prev => [newConversation, ...prev]);
        // Mark the new conversation as unread
        setUnreadIds(prev => [...prev, newConversation.id]);
      }
    });

    socket.on('conversation_updated', (updatedConversation) => {
        // --- UPDATED: Logic to handle unread notifications ---
        if (updatedConversation.id !== selectedConversationId) {
            setUnreadIds(prev => {
                // Avoid adding duplicates
                return prev.includes(updatedConversation.id) ? prev : [...prev, updatedConversation.id];
            });
        }

        setConversations(prev => {
            const doesMatchFilter = filter === 'all' || filter === updatedConversation.status;
            const existsInList = prev.some(c => c.id === updatedConversation.id);

            if (doesMatchFilter) {
                return existsInList 
                    ? prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
                    : [updatedConversation, ...prev];
            } else {
                return prev.filter(c => c.id !== updatedConversation.id);
            }
        });
    });

    return () => {
      socket.disconnect();
    };
  }, [filter, selectedConversationId]); // Add selectedConversationId to dependency array

  if (loading && conversations.length === 0) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const FilterButton = ({ status, children }) => (
    <button 
      onClick={() => setFilter(status)}
      style={{
        padding: '8px 16px',
        margin: '0 5px',
        border: '1px solid #ccc',
        borderRadius: '20px',
        cursor: 'pointer',
        backgroundColor: filter === status ? '#007bff' : 'white',
        color: filter === status ? 'white' : 'black'
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: '20px' }}>
          <NewConversationForm onConversationCreated={() => fetchConversations(filter)} />
          <hr />
          <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'center' }}>
            <FilterButton status={'open'}>Open</FilterButton>
            <FilterButton status={'closed'}>Closed</FilterButton>
            <FilterButton status={null}>All</FilterButton>
          </div>
          <InboxList 
            conversations={conversations} 
            // --- UPDATED: Pass the new handler and the unread list ---
            onConversationSelect={handleSelectConversation}
            selectedConversationId={selectedConversationId}
            onClaimConversation={handleClaimConversation}
            unreadIds={unreadIds}
          />
        </div>
        <div style={{ flex: 2 }}>
          <ConversationView 
            conversationId={selectedConversationId} 
            onUpdateStatus={handleUpdateConversationStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
