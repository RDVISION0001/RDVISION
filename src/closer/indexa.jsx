import React from 'react';
import { useAuth } from '../auth/AuthContext';

//components
import TaskProgress from '../components/TaskProgress';
import ChartWorktime from '../components/ChartWorktime';
import TicketTrack from '../components/TicketTrack';
import EmailCompose from '../components/EmailCompose';


function indexa() {
  const {dark} = useAuth()


  return (

    <>
      <div className={`d-flex ${dark ? `bg-dark`:`bg-white`} `} style={{ width: '100%', overflowX: 'auto' }}>
        {/* <TicketTrack /> */}
        <div className="container-fluid mt-3">
          <TaskProgress />
          <ChartWorktime />
          <EmailCompose/>
        </div>
      </div>
    </>
  );
}


export default indexa
