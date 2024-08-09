import React from 'react';

//Components
import Topnav from '../Components/topnav';
import Sidenav from '../Components/sidenav';
import Cardinfo from '../Components/cardinfo';


//pages
import Live_tickets from '../Pages/live_tickets';


function indexs() {


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
            <Live_tickets />
          </div>

        </div>
      </div>
    </>
  );
}


export default indexs