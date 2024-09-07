import React from 'react';

//components
import Cardinfo from '../components/cardinfo';
import FloatingButton from '../components/FloatingButton';
import FeatureControl from '../components/FeatureControl';


//pages
import Live_tickets from '../pages/live_tickets';


function index() {


  return (

    <>
      <div className="superadmin-page">

        <div className="container-fluid mt-3">
          <Cardinfo />
        </div>

        <div className="container-fluid mt-3">
          <FloatingButton />
        </div>

        <div className="container-fluid mt-3">
          <FeatureControl />
        </div>

        <div className="container-fluid mt-3">
          <Live_tickets />
        </div>


      </div>
    </>
  );
}


export default index