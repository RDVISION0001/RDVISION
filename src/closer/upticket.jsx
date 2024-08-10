import React from 'react';

//Components
import Topnav from '../Components/Topnav';
import Sidenav from '../Components/Sidenav';
import Cardinfo from '../Components/Cardinfo';
import Worktime from '../Components/Worktime';


//pages
import Uploaded_tickets from '../Pages/uploaded_tickets';



function indexa() {


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
            <Worktime />
          </div>


          <div className="container-fluid mt-3">
            <Uploaded_tickets />
          </div>

        </div >
        </div >
      </>
      );
}


      export default indexa