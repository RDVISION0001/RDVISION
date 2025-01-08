import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function OnBreak({ breakHours, breakMinutes, breakSeconds ,Whours, Wminutes, Wseconds }) {
  const { setTakingBreak } = useAuth();
  const [seconds, setSeconds] = useState(0);

  console.log("Break:", breakHours, breakMinutes, breakSeconds);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleEndBreak = () => {
    setTakingBreak(false);
  };

  function convertToImage(imageString) {
    const byteCharacters = atob(imageString); // Decode base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  // Calculate minutes, hours, and seconds
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const displaySeconds = seconds % 60;
  const displayMinutes = minutes % 60;

  // Format time as hh:mm:ss
  const formattedTime = `${hours > 0 ? `${hours}:` : ""}${
    displayMinutes < 10 && hours > 0
      ? `0${displayMinutes}:`
      : `${displayMinutes}:`
  }${displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}`;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light m-0">
      {/* Break alert */}
      <div
        className="text-center w-100  text-white rounded p-4 shadow-lg bg-danger"
        
      >
        <div className="d-flex justify-content-between align-items-center" >
        <p
       
            className="text-light text-left px-4 rounded"
            style={{
                backgroundColor:'#c7f9cc',
              fontSize: "20px",
              fontFamily: "monospace", // Monospace font
              minWidth: "140px", // Set a minimum width for the container
            }}
          >
            <p style={{ fontSize: 14 ,fontWeight:600 , color:'#264248'}}>
              <span>Total Work-</span> {Whours} : {Wminutes} :{Wseconds}
              
            </p>
          </p>
          <p
            className="text-light text-left px-4 rounded"
            style={{
                backgroundColor:'#d7e3fc',
              fontSize: "20px",
              fontFamily: "monospace", // Monospace font
              minWidth: "140px", // Set a minimum width for the container
            }}
          >
            <p style={{ fontSize: 14 ,fontWeight:600 , color:'#264248'}}>
              <span>Total Break-</span> {breakHours} : {breakMinutes} :{" "}
              {breakSeconds}
            </p>
          </p>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div
            className="profile-icon d-flex justify-content-center align-items-center overflow-hidden rounded-circle border p-1"
            style={{ width: "60px", height: "60px" }}
          >
            {localStorage.getItem("imageData") === null ? (
              <img
                className="img-fluid rounded-circle"
                src={convertToImage(localStorage.getItem("imageData"))}
                alt="Profile"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/128/1077/1077012.png"
                alt="Default Profile"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            )}
          </div>
        </div>

        <h1 className="mb-2 fw-bold">
          {`${localStorage.getItem("firstName")} ${localStorage.getItem(
            "lastName"
          )} You Are On a Break`}
        </h1>

        <p className="fs-5 mb-2">Take a moment to recharge!</p>
        <div
          className="display-5 fw-bold bg-white text-danger py-2 px-4 rounded-pill shadow-sm"
          style={{ fontFamily: "monospace", fontSize: "2rem" }} // Monospaced font and fixed size
        >
          {/* Show formatted time */}
          Break Time: {formattedTime}
        </div>
        <button
        style={{ backgroundColor: "#bf0603" }}
          className="btn  border border-white btn-lg mt-4 shadow text-light fw-bold border-2"
          onClick={handleEndBreak}
        >
          End Break
        </button>
      </div>
    </div>
  );
}

export default OnBreak;
