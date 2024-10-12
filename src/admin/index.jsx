import React from 'react';

//components
import Cardinfo from '../components/cardinfo';
import FeatureControl from '../components/FeatureControl';
import InvoiceInfo from '../components/InvoiceInfo';



function index() {


  return (

    <>
      <div className="superadmin-page">

        {/* <div className="container-fluid mt-3">
          <Cardinfo />
        </div> */}

        <div className="container-fluid mt-3">
          <FeatureControl />
        </div>

        <div className="container-fluid mt-3">
          <InvoiceInfo />
        </div>



      </div>
    </>
  );
}


export default index