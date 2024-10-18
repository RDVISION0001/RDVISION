import React, { useEffect, useRef, useState } from 'react';
import LiveCalander from './LiveCalander';
import TimezoneClocks from './TimezoneClocks';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
import FloatingButton from './FloatingButton';
import Enotebook from './Enotebook';
// import TimeZone from './TimeZone';

function topnav() {
  const { takingBreak } = useAuth()
  const { followupState } = useAuth()
  //handle Open Calender
  const handleOpenCalender = () => {
    const dialog = document.getElementById("calender");
    if (dialog) {
      dialog.showModal();
    }
  };
  const handleOpenNote = () => {
    const dialog = document.getElementById("notebook");
    if (dialog) {
      dialog.showModal();
    }
  };
  //handle close Calender
  const handleClose = () => {
    const dialog = document.getElementById("calender");
    const note = document.getElementById("notebook")
    if (dialog) {
      dialog.close();
      note.close()
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
    // Check if 'workTime' and 'breakTime' exist in localStorage
    if (localStorage.getItem("workTime") === null) {
      localStorage.setItem("workTime", 0);
    }
    if (localStorage.getItem("breakTime") === null) {
      localStorage.setItem("breakTime", 0);
    }
  }, []);


  useEffect(() => {
    if (!takingBreak) {
      if (localStorage.getItem("userId")) {
        // axiosInstance.post(`/attendance/addworkingseconds/${localStorage.getItem("attendanceId")}`);
        let workTime = parseInt(localStorage.getItem("workTime"))
        localStorage.setItem("workTime", workTime += 1)
      }
    } else {
      // axiosInstance.post(`/attendance/addBreakSeconds/${localStorage.getItem("attendanceId")}`);
      let breakTime = parseInt(localStorage.getItem("breakTime"))
      localStorage.setItem("breakTime", breakTime += 1)
    }
  }, [seconds]);


  const [todayFollowups, setTodayFollowups] = useState(0)
  useEffect(() => {
    fetchTodayFollowups()
  }, [followupState])
  const fetchTodayFollowups = async () => {
    const response = await axiosInstance.get(`/third_party_api/ticket/todayfollowup/${localStorage.getItem("userId")}`)
    setTodayFollowups(response.data)
  }
  return (
    <>
      {localStorage.getItem("userId") &&
        <div className="topnav">
          <nav className="navbar top-navbar navbar-light bg-white container-fluid">
            <div className="left-part">
              <a className="btn border-0 ms-2" id="menu-btn"><i className="fa-solid fa-bars"></i></a>
              <span className="page-title">Dashboard</span>
            </div>
            <TimezoneClocks />
            <div className="right-part">



            </div>
            <div className="right-part">
              <div className="global-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" name="search" id="globalSearch" className="form-control" placeholder="Search" />
              </div>

              <a href="#" className="notification" style={{ position: "relative", display: "inline-block" }}>
                <i class="fa-solid fa-book fa-2xl" onClick={handleOpenNote}></i>
                
              </a>
              <a href="#" className="notification" style={{ position: "relative", display: "inline-block" }}>
                <i className="fa-solid fa-calendar-days fa-2xl pointer" onClick={handleOpenCalender}></i>
                <span className='bg-danger text-white rounded-circle text-center' style={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: "-20px",
                  right: "-20px"
                }}>
                  {todayFollowups}
                </span>
              </a>


            </div>
          </nav>
          <div>
            <FloatingButton />
          </div>
          <dialog
            id="calender"
            className="noteebook-modal bg-light text-black"
            style={{
              height: "80vh",
              width: "80vw",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: "none",
              borderRadius: "8px",
              padding: "5px"
            }}
          >
            <div className="modal-content" style={{ width: "100%", height: "100%" }}>
              <i
                className="fa-solid fa-times fa-xl pointer close-icon"
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer"
                }}
              ></i>
              <LiveCalander />
            </div>
          </dialog>

          <dialog
            id="notebook"
            className="noteebook-modal bg-light text-black"
            style={{
              height: "70vh",
              width: "70vw",
              alignItems: "center",
              justifyContent: "center",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: "none",
              borderRadius: "8px",
              padding: "5px"
            }}
          >
            <div className="modal-content" style={{ width: "100%", height: "100%" }}>
              <i
                className="fa-solid fa-times fa-xl pointer close-icon"
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer"
                }}
              ></i>
              <Enotebook />
            </div>
          </dialog>

        </div>}
    </>
  );
}

export default topnav;