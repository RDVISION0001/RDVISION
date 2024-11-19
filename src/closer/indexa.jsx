import React from 'react';

//components
import TaskProgress from '../components/TaskProgress';
import ChartWorktime from '../components/ChartWorktime';
import TicketTrack from '../components/TicketTrack';


function indexa() {


  return (

    <>
      <div className="d-flex" style={{ width: '100%', overflowX: 'auto' }}>
        {/* <TicketTrack /> */}
        <div className="container-fluid mt-3">
          <TaskProgress />
          <ChartWorktime />
        </div>
      </div>
    </>
  );
}


export default indexa
