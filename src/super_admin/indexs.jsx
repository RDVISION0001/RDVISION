import React from 'react';

//Components
import Cardinfo from '../components/cardinfo';
import TicketTrack from '../components/TicketTrack';


function indexs() {


  return (

    <>
      <div className="d-flex" style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ flex: 1 }}>
          <Cardinfo />
        </div>
      </div>
    </>
  );
}


export default indexs