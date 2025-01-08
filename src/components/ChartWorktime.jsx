import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";
import Report from "./Report";
import UserWorkTimeReport from "./UserWorkTimeReport";
import LiveCalander from "../components/LiveCalander";
// Authentication context
import { useAuth } from "../auth/AuthContext";
import { Modal } from "react-bootstrap";
import OnBreak from "./OnBreak";

const ChartWorktime = () => {
  const { userId } = useAuth();

  const [teammates, setTeammates] = useState([]);
  const [liveClosers, setliveClosers] = useState([]);

  const [timeElapsed, setTimeElapsed] = useState(0); // Working time in seconds
  const [initialWorkingTime, setInitialWorkingTime] = useState(0); // Initial working time in seconds
  const [breakTime, setBreakTime] = useState(0); // Break time in seconds
  const [breakStartTime, setBreakStartTime] = useState(null); // When the break started
  const [loginTime] = useState(Date.now());
  const { takingBreak, setTakingBreak } = useAuth();

  // Update the working timer only if the user is not taking a break
  useEffect(() => {
    if (initialWorkingTime > 0 && !takingBreak) {
      const interval = setInterval(() => {
        setTimeElapsed(
          initialWorkingTime + Math.floor((Date.now() - loginTime) / 1000)
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [initialWorkingTime, takingBreak]); // Removed `loginTime` from dependencies as it's a static value

  // Start/continue the break timer when takingBreak is true
  useEffect(() => {
    if (takingBreak && breakStartTime) {
      const interval = setInterval(() => {
        setBreakTime((prev) => prev + 1); // Increment by 1 second
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [takingBreak, breakStartTime]);

  // Fetch initial working hours and break hours on component load
  useEffect(() => {
    setInitialWorkingTime(parseInt(localStorage.getItem("workTime")));
    setBreakTime(parseInt(localStorage.getItem("breakTime")));
  }, []);

  const shiftDurationHours = 12;
  const totalShiftTime = shiftDurationHours * 3600;
  const timeElapsedPercentage = Math.min(
    (timeElapsed / totalShiftTime) * 100,
    100
  );

  const hours = String(Math.floor(timeElapsed / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeElapsed % 3600) / 60)).padStart(
    2,
    "0"
  );
  const seconds = String(timeElapsed % 60).padStart(2, "0");

  const breakHours = String(Math.floor(breakTime / 3600)).padStart(2, "0");
  const breakMinutes = String(Math.floor((breakTime % 3600) / 60)).padStart(
    2,
    "0"
  );
  const breakSeconds = String(breakTime % 60).padStart(2, "0");
  const today = new Date();
  const formatedToday = new Date().toISOString().split("T")[0];
  const pastDate = new Date(today); // Create a new Date object based on today
  pastDate.setDate(pastDate.getDate() - 7); // Subtract 30 days
  const formattedPastDate = pastDate.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(formattedPastDate);
  const [endDate, setEndDate] = useState(formatedToday);

  const options = {
    chart: { type: "column" },
    title: false,
    credits: {
      text: "CEO: Anuj Partap Singh",
      href: "https://wa.me/917080906913",
    },
    xAxis: {
      categories: ["A", "B", "C", "D", "E", "5"],
      crosshair: true,
      accessibility: { description: "Countries" },
    },
    yAxis: { min: 0, title: { text: "Values" } },
    tooltip: { valueSuffix: " (1000 MT)" },
    plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
    series: [
      { name: "Approach", data: [406292, 260000, 107000, 68300, 27500, 14500] },
      { name: "Sale", data: [51086, 136000, 5500, 141000, 107180, 77000] },
    ],
  };

  const toggleBreak = () => {
    toggleBreakOnServer();
    if (!takingBreak) {
      // Starting the break
      setBreakStartTime(Date.now());
    } else {
      // Ending the break: update the break time based on how long the break was
      if (breakStartTime) {
        const timeSpentOnBreak = Math.floor(
          (Date.now() - breakStartTime) / 1000
        ); // in seconds
        setBreakTime((prev) => prev + timeSpentOnBreak); // add the time spent on break to the total break time
        setBreakStartTime(null); // reset the break start time
      }
    }
    setTakingBreak(!takingBreak); // toggle the break state
  };

  const toggleBreakOnServer = async () => {
    const response = await axiosInstance.get(
      `/user/toggleBreak/${localStorage.getItem("userId")}`
    );
    
  };

  useEffect(() => {
    // Function to call the API and set the data
    const fetchBestSellingTeammates = async () => {
      try {
        const response = await axiosInstance.get(
          `/team/bestsellingTeammates/${userId}`
        );
        setTeammates(response.data); // Assuming the data is in response.data
      } catch (error) {
        console.error("Error fetching best selling teammates", error);
      }
    };
    const fetchLiveStatus = async () => {
      try {
        const response = await axiosInstance.get(
          `/user/getLiveTeammates/${userId}`
        );
        setliveClosers(response.data); // Assuming the data is in response.data
      } catch (error) {
        console.error("Error fetching best selling teammates", error);
      }
    };
    fetchLiveStatus();
    fetchBestSellingTeammates();
  }, [userId]);
  const checkuserLive = (userName) => {
    if (
      liveClosers.filter(
        (closer) => closer.firstName === userName.split(" ")[0]
      ).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <section className="">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <LiveCalander />
          </div>
          <div className="col-md-4 ">
            <div className="bg-white  d-flex justify-content-evenly align-items-center">
              <div>
                <UserWorkTimeReport
                  user={userId}
                  start={startDate}
                  end={endDate}
                  isShowingToUser={true}
                />
              </div>
              <div className="" style={{ width: "120px" }}>
                <div className=" d-flex flex-column align-items-center justify-content-between ">
                  <div className="position-relative d-flex align-items-center justify-content-center">
                    <svg width="160" height="160">
                      <circle
                        cx="80"
                        cy="80"
                        r="40"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="10"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="40"
                        fill="none"
                        stroke="#007bff"
                        strokeWidth="10"
                        strokeDasharray="408"
                        strokeDashoffset={
                          408 - (408 * timeElapsedPercentage) / 100
                        }
                        transform="rotate(90 80 80)" // Start from the bottom
                      />
                    </svg>
                    <div className="position-absolute text-center d-flex flex-row">
                      <strong style={{ fontWeight: "bold", fontSize: "10px" }}>
                        {hours} : {minutes}
                      </strong>
                      <strong style={{ fontWeight: "bold", fontSize: "10px" }}>
                        Hrs.
                      </strong>
                    </div>
                  </div>
                  <div className="d-flex flex-column  bg-light">
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "semibold",
                        color: "gray",
                      }}
                    >
                      Work Tracker
                    </span>
                    <span>
                      <button
                        className=""
                        style={{
                          fontSize: "12px",
                          backgroundColor: "rgb(255, 0, 0)",
                          padding: "1px 20px",
                          borderRadius: "5px",
                        }}
                        onClick={toggleBreak}
                      >
                        {takingBreak ? "Continue" : "Take Break"}
                      </button>
                    </span>
                  </div>
                  {/* <div className=' p-2 rounded-circle' style={{ width: "20px", height: "20px", marginRight: "20px", backgroundColor: `${takingBreak ? "red" : "green"}` }}></div> */}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center  w-100">
                  <div>
                    <div className=" mt-2 items-content-center p-1">
                      <p className=" " style={{ fontSize: "20px" }}>
                        <strong>
                          {hours} : {minutes} : {seconds}
                        </strong>
                      </p>
                      <p className="text-danger " style={{ fontSize: "20px" }}>
                        <strong>
                          {breakHours} : {breakMinutes} : {breakSeconds}
                        </strong>
                      </p>
                    </div>
                    <div
                      className="d-flex mt-2 justify-content-center"
                      style={{ color: "gray" }}
                    >
                      <p className=" " style={{ fontSize: "15px" }}>
                        Working{" "}
                      </p>{" "}
                      <span
                        className="mx-2 "
                        style={{ fontSize: "15px", color: "gray" }}
                      >
                        |{" "}
                      </span>
                      <p className=" " style={{ fontSize: "15px" }}>
                        Break
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rank-card top-rankers">
              <h3 className="heading">Best Selling Closer</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="text-center">Closer Name</th>
                      <th className="text-center">Sales Count</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teammates && teammates.length > 0 ? (
                      teammates.map((teammate, index) => (
                        <>
                          <tr>
                            <td className="text-center">{teammate.userName}</td>
                            <td className="text-center">{teammate.count}</td>
                            <td
                              className={`${checkuserLive(teammate.userName)
                                ? "text-success"
                                : "text-danger"
                                } fw-bold text-center`}
                            >
                              {checkuserLive(teammate.userName)
                                ? "Online"
                                : "Offline"}
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      < Modal show={takingBreak}  centered dialogClassName="custom-modal-width p-0 rounded" >
        <OnBreak breakHours={breakHours} breakMinutes={breakMinutes} breakSeconds={breakSeconds}  Whours={hours}  Wminutes={minutes} Wseconds={seconds} />
      </Modal >
    </section>
  );
};

export default ChartWorktime;
