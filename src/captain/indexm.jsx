import React from 'react';

//components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import Cardinfo from '../components/cardinfo';
import ChartWorktime from "../components/ChartWorktime"


//pages
import Live_tickets from '../pages/live_tickets';


function indexm() {


  return (

    <>
      <div className="superadmin-page">

        <Sidenav />

        <div className="my-container main-content-block2658 active-cont">
          <Topnav />

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
      </div>
    </>
  );
}


export default indexm