import React from 'react';

// Components
import InvoiceInfo from '../components/InvoiceInfo';
import TicketTrack from '../components/TicketTrack';

function Dashboard() {
  return (
    <div className="d-flex" style={{ width: '100%', overflowX: 'auto' }}>
 
      <div style={{ flex: 1 }}>
        <InvoiceInfo />
      </div>
    </div>
  );
}

export default Dashboard;
