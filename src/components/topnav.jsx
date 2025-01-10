import React, { useEffect, useRef, useState } from "react";
import LiveCalander from "./LiveCalander";
import TimezoneClocks from "./TimezoneClocks";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../auth/AuthContext";
import FloatingButton from "./FloatingButton";
import Enotebook from "./Enotebook";
import WebsocketService from "./WebsocketServices";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../Redux/features/ThemeSlice";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

// import TimeZone from './TimeZone';

function topnav() {
  const { takingBreak } = useAuth();
  const { setUserReportReloader } = useAuth();
  const { followupState } = useAuth();
  const { noOfNweticketsRecevied, setNoOfnewticketsReceived } = useAuth();
  const { isSideBarOpen, setIsSideBarOpen } = useAuth();
  const [isChatBotOPen, setIsChatBotOpen] = useState(false);
  const dispatch = useDispatch();

  // Update the handle functions for the notebook
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  const handleOpenNote = () => {
    setIsNotebookOpen(!isNotebookOpen);
  };

  const handleCloseNotebook = () => {
    setIsNotebookOpen(false);
  };

  //handle Open Calender
  const handleOpenCalender = () => {
    const dialog = document.getElementById("calender");
    if (dialog) {
      dialog.showModal();
    }
  };
  //handle Open Timezone clock
  const handleOpenTimezone = () => {
    const dialog = document.getElementById("timezone");
    if (dialog) {
      dialog.showModal();
    }
  };
  //handle close Timezone
  const handletCloseTimezone = () => {
    const dialog = document.getElementById("timezone");
    if (dialog) {
      dialog.close();
    }
  };
  //handle Open Calender
  // const handleOpenNote = () => {
  //   const dialog = document.getElementById("notebook");
  //   if (dialog) {
  //     dialog.showModal();
  //   }
  // };
  //handle close Calender
  const handleClose = () => {
    const dialog = document.getElementById("calender");
    const note = document.getElementById("notebook");
    if (dialog) {
      dialog.close();
      note.close();
    }
  };

  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!takingBreak) {
      if (localStorage.getItem("userId")) {
        // axiosInstance.post(`/attendance/addworkingseconds/${localStorage.getItem("attendanceId")}`);
        let workTime = parseInt(localStorage.getItem("workTime"));
        localStorage.setItem("workTime", (workTime += 1));
      }
    } else {
      // axiosInstance.post(`/attendance/addBreakSeconds/${localStorage.getItem("attendanceId")}`);
      let breakTime = parseInt(localStorage.getItem("breakTime"));
      localStorage.setItem("breakTime", (breakTime += 1));
    }
  }, [seconds]);

  const [todayFollowups, setTodayFollowups] = useState(0);
  useEffect(() => {
    fetchTodayFollowups();
  }, [followupState]);
  const fetchTodayFollowups = async () => {
    const response = await axiosInstance.get(
      `/third_party_api/ticket/todayfollowup/${localStorage.getItem("userId")}`
    );
    setTodayFollowups(response.data);
  };

  const toggleSidbar = () => {
    setIsSideBarOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem("collapse", JSON.stringify(newState));
      return newState;
    });
  };

  const { dark, setDrak } = useAuth();

  const handleThemeToggler = () => {
    setDrak(!dark);
    dispatch(toggleTheme());
  };

  return (
    <>
      {localStorage.getItem("userId") && (
        <div className="topnav  sticky-top z-4 ">
          <nav
            className={`navbar top-navbar navbar-light ${
              dark ? `bg-dark` : "bg-white"
            }  container-fluid `}
          >
            <div className="left-part">
              <a
                className={`btn border-0 ms-2 ${
                  dark ? `bg-dark` : `bg-white`
                }  text-black`}
                style={{ fontSize: "30px" }}
                onClick={toggleSidbar}
                id="menu-btn"
              >
                {isSideBarOpen ? (
                  <i
                    class={`fa-solid fa-chevron-left fa-xl ${
                      dark ? `text-light` : `text-dark`
                    }`}
                  ></i>
                ) : (
                  <i
                    class={`fa-solid fa-chevron-right fa-xl ${
                      dark ? `text-light` : `text-dark`
                    }`}
                  ></i>
                )}
              </a>
            </div>
            <div className="right-part">
              <div>
                <img
                
                  src={
                    dark
                      ? "https://cdn-icons-png.flaticon.com/128/11457/11457488.png" // Icon for dark mode
                      : "https://cdn-icons-png.flaticon.com/128/466/466249.png" // Icon for light mode
                  }
                  alt="theme-icon"
                  onClick={handleThemeToggler}
                  style={{
                    height: 42,
                    marginRight: "10px",
                    cursor: "pointer",
                    transition: "transform 0.5s ease, opacity 0.5s ease",
                    opacity: dark ? 0.5 : 1,
                  }}
                />
              </div>

              <div
                href="/timezone"
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  onClick={handleOpenTimezone}
                  style={{ height: 36, cursor: "pointer" }}
                  src="https://cdn-icons-png.flaticon.com/128/2784/2784459.png"
                  alt=""
                />
                {/* <span className="page-title">
                  <i
                    class={`fa-solid fa-clock fa-2xl ${
                      dark ? `text-light` : `text-dark`
                    }  `}
                    onClick={handleOpenTimezone}
                  ></i>
                </span> */}
              </div>
              <a
                href="/action_mode"
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  style={{ height: 36, cursor: "pointer" }}
                  src="https://cdn-icons-png.flaticon.com/128/1183/1183967.png"
                  alt=""
                />
              </a>
              {/* <a href="/live_tickets"  className="notification" style={{ position: "relative", display: "inline-block" }}>
                <i className="fa-solid fa-ticket fa-2xl pointer"></i>
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
                  {noOfNweticketsRecevied}
                </span>
              </a> */}
              <a
                href="#"
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  onClick={handleOpenNote}
                  style={{ height: 36, cursor: "pointer" }}
                  src="https://cdn-icons-png.flaticon.com/128/3561/3561424.png"
                  alt=""
                />
                {/* <i
                  class={`fa-solid fa-book fa-2xl ${
                    dark ? `text-light` : `text-dark`
                  } `}
                  onClick={handleOpenNote}
                ></i> */}
              </a>

              <div
                style={{
                  marginRight: 20,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <img
                  onClick={handleOpenCalender}
                  style={{ height: 38 }}
                  src="https://cdn-icons-png.flaticon.com/128/5968/5968499.png"
                  alt="calendar"
                />
                <span
                  style={{
                    position: "absolute",
                    top: -12,
                    right: -5,
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "0px 9px",
                    fontSize: 16,
                  }}
                >
                  {todayFollowups}
                </span>
              </div>

              {/* <a
                href="#"
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <i
                  className={`fa-solid fa-calendar-days fa-2xl pointer ${
                    dark ? `text-light` : `text-dark`
                  }`}
                  onClick={handleOpenCalender}
                ></i>
                <span
                  className="bg-danger text-white rounded-circle text-center"
                  style={{
                    height: "32px",
                    width: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                  }}
                >
                  {todayFollowups}
                </span>
              </a> */}
            </div>
          </nav>

          <div>
            <FloatingButton />
          </div>

          {/* for calander */}
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
              padding: "5px",
            }}
          >
            <div
              className="modal-content"
              style={{ width: "100%", height: "100%" }}
            >
              <i
                className="fa-solid fa-times fa-xl pointer close-icon"
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                }}
              ></i>
              <LiveCalander model={true} />
            </div>
          </dialog>

          {/* for tomezone */}
          <dialog
            id="timezone"
            className="noteebook-modal bg-light text-black"
            style={{
              height: "20vh",
              width: "30vw",
              // display: "flex", // Center content within the dialog
              alignItems: "center", // Vertically center
              justifyContent: "center", // Horizontally center
              position: "fixed",
              top: "30%",
              left: "50%", // Adjusted for proper centering
              transform: "translate(-50%, -50%)",
              border: "none",
              borderRadius: "8px",
              padding: "5px",
            }}
          >
            <div
              className="modal-content"
              style={{
                width: "100%",
                height: "100%",
                position: "relative", // Ensure proper positioning for close icon
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fa-solid fa-times fa-xl pointer close-icon"
                onClick={handletCloseTimezone}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                }}
              ></i>
              <TimezoneClocks />
            </div>
          </dialog>

          {/* for notebook */}
          {/* <dialog
            id="notebook"
            className="noteebook-modal bg-light text-black"
            style={{
              height: "100vh",
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
          </dialog> */}

          <div
            className={`text-black mt-10 rounded shadow py-1 ${
              dark ? "bg-dark" : ""
            }`}
            style={{
              position: "fixed",
              bottom: "300px",
              right: "10px",
              width: isNotebookOpen ? "350px" : "5px", // Full width when open, small when hidden
              height: isNotebookOpen ? "600px" : "5px", // Full height when open, small when hidden
              border: "none",
              zIndex: 10,
              backgroundColor: isNotebookOpen ? "#fff" : "#f0f0f0", // Change background if needed
              cursor: "pointer", // Indicate clickable when minimized
              overflow: isNotebookOpen ? "auto" : "hidden", // Add scrolling when open
            }}
            onClick={() => {
              if (!isNotebookOpen) {
                setIsNotebookOpen(true); // Open chat when clicking minimized window
              }
            }}
          >
            {isNotebookOpen && <Enotebook />}
          </div>

          <div
            className="text-black"
            style={{
              position: "fixed",
              bottom: "100px",
              right: "10px",
              width: isChatBotOPen ? "350px" : "5px", // Full width when open, small when hidden
              height: isChatBotOPen ? "500px" : "5px", // Full height when open, small when hidden
              border: "none",
              zIndex: 1000,
              overflow: "hidden",
              backgroundColor: isChatBotOPen ? "#fff" : "#f0f0f0", // Change background if needed
              cursor: "pointer", // Indicate clickable when minimized
            }}
            onClick={() => {
              if (!isChatBotOPen) {
                setIsChatBotOpen(true); // Open chat when clicking minimized window
              }
            }}
          >
            {isChatBotOPen && <WebsocketService />}
          </div>

          <div
            className="chatbot-toggle-button"
            onClick={() => setIsChatBotOpen(!isChatBotOPen)}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#007bff",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            <i className="fa-solid fa-comments fa-lg"></i>
          </div>
        </div>
      )}
    </>
  );
}

export default topnav;
