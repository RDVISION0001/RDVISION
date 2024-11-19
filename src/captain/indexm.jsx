import React from 'react';

//components
import Cardinfo from '../components/cardinfo';
import ChartWorktime from "../components/ChartWorktime";
import TicketTrack from '../components/TicketTrack';


//pages
import Live_tickets from '../pages/live_tickets';

function indexm() {


  return (

    <>
      <div className="d-flex" style={{ width: '100%', overflowX: 'auto' }}>
        {/* <TicketTrack /> */}
        <div className="container-fluid mt-3">
          <Cardinfo />
        </div>

        <div className="container-fluid mt-3">
          <ChartWorktime />
        </div>


        <div className="container-fluid mt-3">
          <Live_tickets />
        </div>
      </div>
    </>
  );
}


export default indexm