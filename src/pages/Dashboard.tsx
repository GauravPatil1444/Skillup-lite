import React from 'react';
import Navbar from './components/Navbar';

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>My Learning Dashboard</h2>
        {/* Course cards showing status: not_started | in_progress | completed */}
        <p>You have 3 courses in progress.</p>
      </div>
    </div>
  );
};

export default Dashboard;