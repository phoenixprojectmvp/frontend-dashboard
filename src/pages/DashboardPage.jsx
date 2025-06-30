import React, { useState } from 'react';
import InboxList from '../components/InboxList.jsx';
import ConversationView from '../components/ConversationView.jsx';

function DashboardPage() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '20px' }}>
          <InboxList onConversationSelect={setSelectedConversationId} />
        </div>
        <div style={{ flex: 2 }}>
          <ConversationView conversationId={selectedConversationId} setSelectedConversationId={setSelectedConversationId} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;