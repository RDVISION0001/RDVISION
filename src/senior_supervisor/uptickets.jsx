import React from 'react';

//components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import Cardinfo from '../components/cardinfo';
// import Worktime from '../components/worktime';


//pages
import Uploaded_tickets from '../pages/uploaded_tickets';



function uptickets() {


  return (

    <>
      <div className="container-fluid mt-3">
        <Cardinfo />
      </div>

      {/* <div className="container-fluid mt-3">
            <Worktime />
          </div> */}

      <div className="container-fluid mt-3">
        <Uploaded_tickets />
      </div>
    </>
  );
}


export default uptickets