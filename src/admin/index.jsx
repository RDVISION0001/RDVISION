import React from 'react';

//components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import Cardinfo from '../components/cardinfo';

//pages
import Live_tickets from '../pages/live_tickets';


function index() {

  
  return (
    <>
      <div className="superadmin-page">
        {/* Side-Nav */}
        <Sidenav />

        {/* Main Wrapper */}
        <div className="my-container main-content-block2658 active-cont">
          {/* Top Nav */}
          <Topnav />

          {/* Main Content */}
          <div className="container-fluid mt-3">
            {/* Section One */}
            <Cardinfo />

          </div>
        </div>
        {/* live tickets pages */}
        <Live_tickets />
      </div>
    </>
  );
}

export default index;
