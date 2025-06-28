import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InboxList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // התיקון: הוספנו מירכאות סביב הטוקן כדי להפוך אותו למחרוזת חוקית
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudElkIjo3LCJhY2NvdW50SWQiOjEsIm5hbWUiOiJUYW1pciIsImlhdCI6MTc1MTA4OTI5MCwiZXhwIjoxNzUxMDkyODkwfQ.1Z_wW-cKmjyBKE1ybXh-0sUGa1Um2CX-cWRCeIzFNtc"; 

        const response = await axios.get('http://localhost:3001/api/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setConversations(response.data.conversations);
      } catch (err) {
        setError('Failed to fetch conversations.');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h3>Inbox</h3>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {conversations.map(convo => (
            <li key={convo.id}>
              Conversation with user ID: {convo.end_user_id} - Status: {convo.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InboxList;