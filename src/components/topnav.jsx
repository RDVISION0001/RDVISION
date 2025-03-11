import React, { useEffect, useState } from "react";
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
import { Modal } from "react-bootstrap";
import EmailCompose from "./EmailCompose";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function topnav() {
  const { takingBreak } = useAuth();
  const { followupState } = useAuth();
  const { isSideBarOpen, setIsSideBarOpen } = useAuth();
  const [isChatBotOPen, setIsChatBotOpen] = useState(false);
  const dispatch = useDispatch();
  const [isCompoeseOpen, setIsComposeOpen] = useState(false);

  // Notebook state and handlers
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const handleOpenNote = () => setIsNotebookOpen(!isNotebookOpen);

  // Calendar state and handlers
  const [showCalendar, setShowCalendar] = useState(false);
  const handleOpenCalender = () => setShowCalendar(true);
  const handleCloseCalender = () => setShowCalendar(false);

  // Timezone state and handlers
  const [showTimezone, setShowTimezone] = useState(false);
  const handleOpenTimezone = () => setShowTimezone(true);
  const handleCloseTimezone = () => setShowTimezone(false);

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
        let workTime = parseInt(localStorage.getItem("workTime"), 10) || 0;
        localStorage.setItem("workTime", workTime + 1);
      }
    } else {
      let breakTime = parseInt(localStorage.getItem("breakTime"), 10) || 0;
      localStorage.setItem("breakTime", breakTime + 1);
    }
  }, [seconds, takingBreak]);

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

  const handleCloseCompose = () => setIsComposeOpen(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);


  const handleExportLive = async () => {
    try {
      const response = await axiosInstance.get("/export/excel/tickets", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export_live.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Live Export successful");
    } catch (error) {
      console.error("Live Export error:", error);
      toast.error("Live Export failed");
    }
  };

  const handleExportABC = async () => {
    try {
      const response = await axiosInstance.get("/export/excel/upload-tickets", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "export_ABC.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("ABC Export successful");
    } catch (error) {
      console.error("ABC Export error:", error);
      toast.error("ABC Export failed");
    }
  };

  return (
    <>
      {localStorage.getItem("userId") && (
        <div className="topnav sticky-top z-4">
          <nav
            className={`navbar top-navbar navbar-light ${dark ? "bg-dark" : "bg-white"
              } container-fluid`}
          >
            <div className="left-part">
              <a
                className={`btn border-0 ms-2 ${dark ? "bg-dark" : "bg-white"
                  } text-black`}
                style={{ fontSize: "30px" }}
                onClick={toggleSidbar}
                id="menu-btn"
              >
                {isSideBarOpen ? (
                  <i
                    className={`fa-solid fa-chevron-left fa-xl ${dark ? "text-light" : "text-dark"
                      }`}
                  ></i>
                ) : (
                  <i
                    className={`fa-solid fa-chevron-right fa-xl ${dark ? "text-light" : "text-dark"
                      }`}
                  ></i>
                )}
              </a>
            </div>
            <div className="right-part">
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/7915/7915323.png"
                  alt="compose-email"
                  onClick={() => setIsComposeOpen(true)}
                  style={{
                    height: 42,
                    marginRight: "10px",
                    cursor: "pointer",
                    transition: "transform 0.5s ease, opacity 0.5s ease",
                    opacity: dark ? 0.5 : 1,
                  }}
                />
              </div>
              <div>
                <img
                  src={
                    dark
                      ? "https://cdn-icons-png.flaticon.com/128/11457/11457488.png"
                      : "https://cdn-icons-png.flaticon.com/128/466/466249.png"
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
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  onClick={handleOpenTimezone}
                  style={{ height: 36, cursor: "pointer" }}
                  src="https://cdn-icons-png.flaticon.com/128/2784/2784459.png"
                  alt="timezone"
                />
              </div>
              <a
                href="/action_mode"
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  style={{ height: 36, cursor: "pointer" }}
                  src="https://cdn-icons-png.flaticon.com/128/1183/1183967.png"
                  alt="action-mode"
                />
              </a>
              <a
                href="#"
                className="notification"
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  onClick={handleOpenNote}
                  style={{ height: 36, cursor: "pointer" }}
                  src="https://cdn-icons-png.flaticon.com/128/3561/3561424.png"
                  alt="notebook"
                />
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
                  style={{ height: 38, cursor: "pointer" }}
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
              {(localStorage.getItem("roleName") === "Admin" || localStorage.getItem("roleName") === "SuperAdmin") && (
                <div className="topnav sticky-top z-4">
                  <nav className="navbar top-navbar navbar-light container-fluid">
                    <div className="right-part">
                      <button className="btn btn-secondary me-2" onClick={() => setIsExportModalOpen(true)}>
                        Export
                      </button>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </nav>

          {/* Modal for Calendar */}
          <Modal show={showCalendar} onHide={handleCloseCalender} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Calendar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LiveCalander model={true} />
            </Modal.Body>
          </Modal>

          {/* Modal for Timezone */}
          <Modal show={showTimezone} onHide={handleCloseTimezone} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Timezone</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TimezoneClocks model={true} />
            </Modal.Body>
          </Modal>

          {/* Chatbot and Notebook Components */}
          <div
            className={`text-black mt-10 rounded shadow py-1 ${dark ? "bg-dark" : ""
              }`}
            style={{
              position: "fixed",
              bottom: "200px",
              right: "10px",
              width: isNotebookOpen ? "350px" : "5px",
              height: isNotebookOpen ? "600px" : "5px",
              border: "none",
              zIndex: 10,
              backgroundColor: isNotebookOpen ? "#fff" : "#f0f0f0",
              cursor: "pointer",
              overflow: isNotebookOpen ? "auto" : "hidden",
            }}
            onClick={() => {
              if (!isNotebookOpen) {
                setIsNotebookOpen(true);
              }
            }}
          >
            {isNotebookOpen && <Enotebook model={true} />}
          </div>

          <div
            className="text-black"
            style={{
              position: "fixed",
              bottom: "100px",
              right: "10px",
              width: isChatBotOPen ? "350px" : "5px",
              height: isChatBotOPen ? "500px" : "5px",
              border: "none",
              zIndex: 1000,
              overflow: "hidden",
              backgroundColor: isChatBotOPen ? "#fff" : "#f0f0f0",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!isChatBotOPen) {
                setIsChatBotOpen(true);
              }
            }}
          >
            {isChatBotOPen && <WebsocketService model={true} />}
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

      <Modal
        show={isCompoeseOpen}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        className="rounded-lg"
      >
        <EmailCompose autoClose={handleCloseCompose} />
        <div className="modal-body">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsComposeOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal show={isExportModalOpen} onHide={() => setIsExportModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Export Data</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <button className="btn btn-danger mb-2 w-50" onClick={handleExportLive}>
            Export Live
          </button>
          <button className="btn btn-warning w-50" onClick={handleExportABC}>
            Export ABC
          </button>
        </Modal.Body>
      </Modal>


      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default topnav;
