import React, { useEffect, useRef, useState } from 'react';
import LiveCalander from './LiveCalander';
import TimezoneClocks from './TimezoneClocks';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';
import FloatingButton from './FloatingButton';
import Enotebook from './Enotebook';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import R2ZWYCP from '../assets/notification/R2ZWYCP.mp3'
import TicketDistribution from './TicketDistribution';

// import TimeZone from './TimeZone';

function topnav() {
  const { takingBreak } = useAuth()
  const { setUserReportReloader } = useAuth()
  const { followupState } = useAuth()
  const { noOfNweticketsRecevied, setNoOfnewticketsReceived } = useAuth()
  const { isSideBarOpen, setIsSideBarOpen } = useAuth()

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
  // /topic/invoice/paid/
  //websocket for notification
  useEffect(() => {
    const socket = new SockJS('https://rdvision.in/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log("Message string is " < str);

      },
      onConnect: () => {
        stompClient.subscribe('/topic/third_party_api/ticket/', (message) => {
          const newProduct = JSON.parse(message.body);
          toast.info("New Ticket Recevived")
          setNoOfnewticketsReceived(prevCount => prevCount + 1);
          playNotificationSound()
          // setData((prevProducts) => [newProduct, ...prevProducts]);
          // setSelectedKey((prevKey) => prevKey + 1);
        });

        stompClient.subscribe('/topic/invoice/paid/', (message) => {
          const updateData = JSON.parse(message.body);
          if (localStorage.getItem("roleName") === "SeniorSuperVisor") {
            toast.info("Received an Paid Invoice");
          }
        });

        // Subscribe to the second endpoint
        stompClient.subscribe('/topic/invoice/verified/', (message) => {
          const updateData = JSON.parse(message.body);
          if (parseInt(localStorage.getItem("userId")) === updateData) {
            toast.success("You invoice is Verified");

          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);


  const playNotificationSound = () => {
    const audio = new Audio(R2ZWYCP);
    audio.play();
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

  const toggleSidbar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }
  return (
    <>
      {localStorage.getItem("userId") &&
        <div className="topnav">
          <nav className="navbar top-navbar navbar-light bg-white container-fluid">
            <div className="left-part">
              <a className="btn border-0 ms-2 bg-white text-black" style={{ fontSize: "30px" }} onClick={toggleSidbar} id="menu-btn">{isSideBarOpen ? <i class="fa-solid fa-chevron-left fa-xl"></i> : <i class="fa-solid fa-chevron-right fa-xl"></i>}</a>
            </div>
            <div className="right-part">
              <div href="/timezone" target='_blanck' className="notification" style={{ position: "relative", display: "inline-block" }}>
                <span className="page-title"  >
                  <i class="fa-solid fa-clock fa-2xl" onClick={handleOpenTimezone}></i>
                </span>
              </div>
              <a href="/action_mode" target='_blanck' className="notification" style={{ position: "relative", display: "inline-block" }}>
                <span className="page-title"  >
                  <i className="fa-solid fa-jet-fighter-up fa-2xl"></i>
                </span>
              </a>
              <a href="/live_tickets" target='_blanck' className="notification" style={{ position: "relative", display: "inline-block" }}>
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
              </a>
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
