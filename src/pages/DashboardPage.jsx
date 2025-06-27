import React from 'react';
import InboxList from '../components/InboxList.jsx'; // 1. ייבוא הרכיב החדש

function DashboardPage() {
  return (
    <div>
      <h1>Agent Dashboard</h1>
      <p>This is where the agent's workspace will be.</p>
      <hr />
      <InboxList /> {/* 2. הצגת הרכיב החדש */}
    </div>
  );
}

export default DashboardPage;