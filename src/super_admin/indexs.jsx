import React from 'react';

//Components
import Cardinfo from '../components/cardinfo';
import FloatingButton from '../components/FloatingButton';


function indexs() {


  return (

    <>
      <div className="container-fluid mt-3">
        <Cardinfo />
      </div>

      <div>
        <FloatingButton />
      </div>
    </>
  );
}


export default indexs