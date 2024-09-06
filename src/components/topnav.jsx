import React, { useEffect, useRef, useState } from 'react';
import LiveCalander from './LiveCalander';
import TimezoneClocks from './TimezoneClocks';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
// import TimeZone from './TimeZone';

function topnav() {
  const { takingBreak } = useAuth()
  //handle Open Calender
  const handleOpenCalender = () => {
    const dialog = document.getElementById("calender");
    if (dialog) {
      dialog.showModal();
    }
  };

  //handle close Calender
  const handleClose = () => {
    const dialog = document.getElementById("calender");
    if (dialog) {
      dialog.close();
    }
  };

  //working time api

  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    if (!takingBreak) {
      axiosInstance.post(`/attendance/addworkingseconds/${localStorage.getItem("attendanceId")}`);
    }else{
      axiosInstance.post(`/attendance/addBreakSeconds/${localStorage.getItem("attendanceId")}`);
    }
  }, [seconds]);



  return (
    <>
      <nav className="navbar top-navbar navbar-light bg-white container-fluid">
        <div className="left-part">
          <a className="btn border-0 ms-2" id="menu-btn"><i className="fa-solid fa-bars"></i></a>
          <span className="page-title">Dashboard</span>
        </div>
        <TimezoneClocks />
        <div className="right-part">
          <div className="global-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" name="search" id="globalSearch" className="form-control" placeholder="Search" />
          </div>
          <a href="#" className="notification">
            <i className="fa-solid fa-calendar-days fa-xl pointer" onClick={handleOpenCalender}></i>
          </a>
        </div>
      </nav>


      <dialog id="calender" className="calender-modal">
        <div className="modal-content">
          <i className="fa-solid fa-times fa-xl pointer close-icon" onClick={handleClose}></i>
          <LiveCalander />
        </div>
      </dialog>

    </>
  );
}

export default topnav;
