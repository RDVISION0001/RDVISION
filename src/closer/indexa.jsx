import React from 'react';

//components
import Cardinfo from '../components/cardinfo';
import TaskProgress from '../components/TaskProgress';
import ChartWorktime from '../components/ChartWorktime';


function indexa() {


  return (

    <>
{/*       <div className="container-fluid mt-3">
        <Cardinfo />
      </div>
 */}
      <div className="container-fluid mt-3">
        <TaskProgress />
      </div>

      <div className="container-fluid mt-3">
        <ChartWorktime />
      </div>
    </>
  );
}


export default indexa
