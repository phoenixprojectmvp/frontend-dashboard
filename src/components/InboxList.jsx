import React from 'react';

function InboxList({ conversations, onConversationSelect, selectedConversationId }) {
  if (!conversations || conversations.length === 0) {
    return <p>No active conversations.</p>;
  }

  return (
    <div>
      <h3>Inbox</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {conversations.map(convo => (
          <li
            key={convo.id}
            onClick={() => onConversationSelect(convo.id)}
            style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee', 
              cursor: 'pointer',
              // שינוי צבע הרקע אם השיחה נבחרה
              backgroundColor: convo.id === selectedConversationId ? '#e1f5fe' : 'transparent'
            }}
          >
            Conversation ID: {convo.id} - Status: {convo.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InboxList;