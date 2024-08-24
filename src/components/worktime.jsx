import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Worktime = ({ shiftDurationHours = 12 }) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds

  // Update loginTime to the current time whenever the component mounts
  const [loginTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - loginTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime]);

  const totalShiftTime = shiftDurationHours * 3600; // convert hours to seconds
  const timeElapsedPercentage = Math.min((timeElapsed / totalShiftTime) * 100, 100);

  const hours = String(Math.floor(timeElapsed / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeElapsed % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeElapsed % 60).padStart(2, '0');

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4 w-25">
      <div className="position-relative d-flex align-items-center justify-content-center">
        <svg width="160" height="160">
          <circle
            cx="80"
            cy="80"
            r="65"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="10"
          />
          <circle
            cx="80"
            cy="80"
            r="65"
            fill="none"
            stroke="#007bff"
            strokeWidth="10"
            strokeDasharray="408"
            strokeDashoffset={408 - (408 * timeElapsedPercentage) / 100}
            transform="rotate(90 80 80)" // Start from the bottom
          />
        </svg>
        <div className="position-absolute text-center d-flex flex-column">
          <strong style={{ fontWeight: 'bold', fontSize: '24px' }}>{hours} : {minutes}</strong>
          <strong>Hrs.</strong>
        </div>
      </div>
      <p className="" style={{ fontSize: '20px' }}><strong>{hours} : {minutes} : {seconds}</strong></p>
    </div>
  );
};

export default Worktime;
