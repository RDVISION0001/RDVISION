import React, { useState, useEffect, useRef } from 'react';
import profile1 from '../assets/img/profiles/profile1.png'


function worktime() {
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('timerTime');
    return savedTime ? Number(savedTime) : 12 * 60 * 60;
  });
  const [isRunning, setIsRunning] = useState(() => {
    const savedIsRunning = localStorage.getItem('timerIsRunning');
    return savedIsRunning === 'true';
  });
  const [isOnBreak, setIsOnBreak] = useState(() => {
    const savedIsOnBreak = localStorage.getItem('timerIsOnBreak');
    return savedIsOnBreak === 'true';
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && !isOnBreak) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime > 0 ? prevTime - 1 : 0;
          localStorage.setItem('timerTime', newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isOnBreak]);

  useEffect(() => {
    localStorage.setItem('timerIsRunning', isRunning);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem('timerIsOnBreak', isOnBreak);
  }, [isOnBreak]);

  const formatTime = (seconds) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleBreak = () => {
    setIsOnBreak((prev) => !prev);
  };


    return (
        <div>
            {/* <!-- user-profile --> */}
            <section className="user-details-section mt-5">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-7 flex-v-center">
                            <div className="profile-card-wrapper">
                                <div className="img-wrapper">
                                    <img src={profile1} className="img-fluid" alt="profile-image" />
                                </div>
                                <div className="content-block">
                                    <h3 className="title">Rober Downy Jr.</h3>
                                    <p className="sub-title">Admins | Department Name</p>
                                    <span className="ip"><i className="fa-solid fa-desktop"></i> 10.135.30.41</span>
                                    <a href="#" className="btn btn-break">Take Break</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 flex-v-center justify-content-center">
                            <div className="coundown-timer">
                                <div id="workTimer" style={{ width: "180px", height: "180px" }}></div>
                                <div className="timing-wrapper">
                                    <small>Total Working Hours | Countdown</small>
                                    <p><span className="work-timer">12:00:00</span> / <span className="break-timer">{formatTime(time)}</span></p>
                                    <button className="btn btn-success rounded mx-sm-3" onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
                                    <button className="btn btn-danger rounded mx-sm-3" onClick={handleBreak}>{isOnBreak ? 'End Break' : 'Lunch Break'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default worktime