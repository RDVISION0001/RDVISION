import React from 'react';

//Components
import Cardinfo from '../components/cardinfo';
import FloatingButton from '../components/FloatingButton';



//pages
import Live_tickets from '../pages/live_tickets';


function indexs() {


  return (

    <>
      <div className="container-fluid mt-3">
        <Cardinfo />
      </div>

      <div>
        <FloatingButton />
      </div>

      <div className="container-fluid mt-3">
        <Live_tickets />
      </div>
    </>
  );
}


export default indexs