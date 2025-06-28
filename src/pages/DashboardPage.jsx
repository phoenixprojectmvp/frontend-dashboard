import React, { useState } from 'react';
import InboxList from '../components/InboxList.jsx';
import ConversationView from '../components/ConversationView.jsx';
import ChatWidget from '../components/ChatWidget.jsx';

function DashboardPage() {
  // State שיחזיק את ה-ID של השיחה שנבחרה
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  return (
    <div>
      <h1>Agent Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '20px' }}>
          <InboxList onConversationSelect={setSelectedConversationId} />
        </div>
        <div style={{ flex: 2 }}>
          <ConversationView conversationId={selectedConversationId} />
        </div>
        <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;