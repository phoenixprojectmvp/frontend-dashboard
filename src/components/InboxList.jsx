import React from 'react';

// קומפוננטה זו מקבלת את רשימת השיחות כ-prop
function InboxList({ conversations, onConversationSelect }) {
  if (conversations.length === 0) {
    return <p>No conversations yet.</p>;
  }

  return (
    <div>
      <h3>Inbox</h3>
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
    </div>
  );
}

export default InboxList;