import React, { useEffect, useState } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import moment from "moment";
import "moment-timezone";

// Analog Clock Component
const AnalogClock = ({ timezone, isIndianClock }) => {
  const [time, setTime] = useState(new Date().toLocaleString("en-US", { timeZone: timezone }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString("en-US", { timeZone: timezone }));
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const clockBackground = isIndianClock ? "#FFD1DC" : "#B2DFFC"; // Light colors

  return (
    <div
      style={{
        background: clockBackground,
        borderRadius: "50%",
        padding: "15px", // Reduced padding
        marginBottom: "20px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Clock value={new Date(time)} size={120} renderNumbers />
    </div>
  );
};

// Digital Clock Component
const DigitalClock = ({ timezone, country, isIndianClock }) => {
  const [time, setTime] = useState(moment.tz(timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.tz(timezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const digitalTime = time.format("hh:mm:ss A");
  const indianTime = moment.tz("Asia/Kolkata");
  const timeDifference = (time.utcOffset() - indianTime.utcOffset()) / 60;

  const clockBackground = isIndianClock ? "#FFD1DC" : "#E8F8FF"; // Light colors

  return (
    <div
      style={{
        background: clockBackground,
        color: "#333",
        padding: "15px",
        borderRadius: "15px",
        fontFamily: "monospace",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ fontSize: "1.75rem", fontWeight: "bold" }}>{digitalTime}</div>
      <div style={{ fontSize: "1.2rem", marginTop: "5px" }}>{country}</div>
      <div style={{ fontSize: "0.9rem", marginTop: "5px" }}>
        {timeDifference >= 0 ? `+${timeDifference}` : `${timeDifference}`} hours from IST
      </div>
    </div>
  );
};

// Main Component for Displaying Multiple Clocks
const TimezoneClocks = () => {
  const clocks = [
    { timezone: "Asia/Kolkata", country: "India", isIndianClock: true },
    { timezone: "America/New_York", country: "US", isIndianClock: false },
    { timezone: "Europe/London", country: "UK", isIndianClock: false },
    { timezone: "Australia/Sydney", country: "AU", isIndianClock: false },
  ];

  return (
    <div
      style={{
        backgroundColor: "#F8F9FA",
        minHeight: "70vh",
        padding: "30px",
      }}
    >
      <h1
        style={{
          color: "#555",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "2.5rem",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Global Timezone Clocks
      </h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {clocks.map((clock, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnalogClock timezone={clock.timezone} isIndianClock={clock.isIndianClock} />
            <DigitalClock
              timezone={clock.timezone}
              country={clock.country}
              isIndianClock={clock.isIndianClock}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimezoneClocks;
