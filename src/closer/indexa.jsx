import React from 'react';

//components
import Cardinfo from '../components/cardinfo';
import TaskProgress from '../components/TaskProgress';
import ChartWorktime from '../components/ChartWorktime';


//pages
import Live_tickets from '../pages/live_tickets';


function indexa() {


  return (

    <>
      <div className="container-fluid mt-3">
        <Cardinfo />
      </div>

      <div className="container-fluid mt-3">
        <TaskProgress />
      </div>

      <div className="container-fluid mt-3">
        <ChartWorktime />
      </div>

      <div className="container-fluid mt-3">
        <Live_tickets />
      </div>
    </>
  );
}


export default indexa