import React from 'react';
import LiveCalander from './LiveCalander';
// import TimeZone from './TimeZone';

function topnav() {

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



  //handle Open Clock
  // const handleOnClock = () => {
  //   const dialog = document.getElementById("clock");
  //   if (dialog) {
  //     dialog.showModal();
  //   }
  // };

  //handle close Clock
  // const handleOff = () => {
  //   const dialog = document.getElementById("clock");
  //   if (dialog) {
  //     dialog.close();
  //   }
  // };



  return (
    <>
      <nav className="navbar top-navbar navbar-light bg-white container-fluid">
        <div className="left-part">
          <a className="btn border-0 ms-2" id="menu-btn"><i className="fa-solid fa-bars"></i></a>
          <span className="page-title">Dashboard</span>
        </div>
        <div className="right-part">
          <div className="global-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" name="search" id="globalSearch" className="form-control" placeholder="Search" />
          </div>
          <a href="#" className="notification">
            <i className="fa-solid fa-calendar-days fa-xl pointer" onClick={handleOpenCalender}></i>
          </a>
          <a href="#" className="notification">
            <i class="fa-solid fa-clock fa-xl" ></i>
          </a>
        </div>
      </nav>


      <dialog id="calender" className="calender-modal">
        <div className="modal-content">
          <i className="fa-solid fa-times fa-xl pointer close-icon" onClick={handleClose}></i>
          <LiveCalander />
        </div>
      </dialog>

      {/* <dialog id="clock" className="calender-modal">
        <div className="modal-content">
          <i className="fa-solid fa-times fa-xl pointer close-icon" onClick={handleOff}></i>
          <TimeZone />
        </div>
      </dialog> */}

    </>
  );
}

export default topnav;
