import React from 'react';

// The component now accepts `unreadIds` to know which conversations have new messages.
function InboxList({ conversations, onConversationSelect, selectedConversationId, onClaimConversation, unreadIds = [] }) {
  if (!conversations || conversations.length === 0) {
    return <p>No active conversations.</p>;
  }

  const handleClaimClick = (e, convoId) => {
    e.stopPropagation();
    onClaimConversation(convoId);
  };

  return (
    <div>
      <h3>Inbox</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {conversations.map(convo => {
          const isUnread = unreadIds.includes(convo.id);

          return (
            <li
              key={convo.id}
              onClick={() => onConversationSelect(convo.id)}
              style={{ 
                padding: '12px 10px', 
                borderBottom: '1px solid #eee', 
                cursor: 'pointer',
                backgroundColor: convo.id === selectedConversationId ? '#e1f5fe' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {/* Display conversation info */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* --- THIS IS THE KEY CHANGE: Notification Dot --- */}
                {isUnread && (
                  <span style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%',
                    marginRight: '10px'
                  }}></span>
                )}
                <div>
                  <span>Conversation ID: {convo.id}</span>
                  <br />
                  <small style={{ color: '#666' }}>
                    Agent: {convo.agent_id ? convo.agent_name || `Agent ${convo.agent_id}` : <strong>Unclaimed</strong>}
                  </small>
                </div>
              </div>

              {/* Conditionally render the "Claim" button */}
              {!convo.agent_id && (
                <button 
                  onClick={(e) => handleClaimClick(e, convo.id)}
                  style={{
                    padding: '5px 10px',
                    border: 'none',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Claim
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default InboxList;
