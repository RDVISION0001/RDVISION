import React from 'react';

//components

import Cardinfo from '../components/cardinfo';
import ChartWorktime from '../components/ChartWorktime';
import FloatingButton from '../components/FloatingButton';


//pages
import Live_tickets from '../pages/live_tickets';


function indexss() {


  return (

    <>

      <div className="container-fluid mt-3">
        <Cardinfo />
      </div>

      <div>
        <FloatingButton />
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


export default indexss