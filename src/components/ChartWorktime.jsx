import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../auth/AuthContext';

const Worktime = () => {
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
        setTimeElapsed(initialWorkingTime + Math.floor((Date.now() - loginTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [initialWorkingTime, takingBreak]); // Removed `loginTime` from dependencies as it's a static value

  // Start/continue the break timer when takingBreak is true
  useEffect(() => {
    if (takingBreak && breakStartTime) {
      const interval = setInterval(() => {
        setBreakTime(prev => prev + 1); // Increment by 1 second
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [takingBreak, breakStartTime]);

  // Fetch initial working hours and break hours on component load
  useEffect(() => {
    todayWorkingHour();
    todayBreakHour();
  }, []);

  const todayWorkingHour = async () => {
    try {
      const response = await axiosInstance.get(`/attendance/workinhourbyattendanceid/${localStorage.getItem("attendanceId")}`);
      setInitialWorkingTime(response.data); // Assuming the API returns time in seconds
    } catch (error) {
      console.error("Error fetching working hour:", error);
    }
  };

  const todayBreakHour = async () => {
    try {
      const response = await axiosInstance.get(`/attendance/BreakSecondbyattendanceid/${localStorage.getItem("attendanceId")}`);
      setBreakTime(response.data); // Assuming the API returns time in seconds
    } catch (error) {
      console.error("Error fetching break hour:", error);
    }
  };

  const shiftDurationHours = 12;
  const totalShiftTime = shiftDurationHours * 3600;
  const timeElapsedPercentage = Math.min((timeElapsed / totalShiftTime) * 100, 100);

  const hours = String(Math.floor(timeElapsed / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeElapsed % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeElapsed % 60).padStart(2, '0');

  const breakHours = String(Math.floor(breakTime / 3600)).padStart(2, '0');
  const breakMinutes = String(Math.floor((breakTime % 3600) / 60)).padStart(2, '0');
  const breakSeconds = String(breakTime % 60).padStart(2, '0');

  const options = {
    chart: { type: 'column' },
    title: false,
    credits: { text: "CEO: Anuj Partap Singh", href: "https://wa.me/917080906913" },
    xAxis: {
      categories: ['A', 'B', 'C', 'D', 'E', '5'],
      crosshair: true,
      accessibility: { description: 'Countries' }
    },
    yAxis: { min: 0, title: { text: 'Values' } },
    tooltip: { valueSuffix: ' (1000 MT)' },
    plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
    series: [
      { name: 'Approach', data: [406292, 260000, 107000, 68300, 27500, 14500] },
      { name: 'Sale', data: [51086, 136000, 5500, 141000, 107180, 77000] }
    ]
  };

  const toggleBreak = () => {
    toggleBreakOnServer()
    if (!takingBreak) {
      // Starting the break
      setBreakStartTime(Date.now());
    } else {
      // Ending the break: update the break time based on how long the break was
      if (breakStartTime) {
        const timeSpentOnBreak = Math.floor((Date.now() - breakStartTime) / 1000); // in seconds
        setBreakTime(prev => prev + timeSpentOnBreak); // add the time spent on break to the total break time
        setBreakStartTime(null); // reset the break start time
      }
    }
    setTakingBreak(!takingBreak); // toggle the break state
  };

  const toggleBreakOnServer = async () => {
    const response = axiosInstance.get(`/attendance/toggleBreak/${localStorage.getItem("attendanceId")}`)
    console.log((await response).data,"toggle data is ")
  }

  return (
    <section className="map-and-rankings">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div className="graph-wrapper">
              <h3 className="title">Weekly Report</h3>
              <div id="map-container" className="highchart-wrapper" style={{ width: "100%", height: "100%", minHeight: "555px" }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white border">
              <div className=''>
                <div className='bg-light d-flex align-items-center justify-content-between' style={{ padding: '10px' }}>
                  <div className='d-flex flex-column p-4 bg-light'>
                    <span style={{ fontSize: "15px", fontWeight: "semibold", color: "gray" }}>Work Tracker</span>
                    <span>
                      <button className='' style={{ fontSize: "12px", backgroundColor: "rgb(255, 0, 0)", padding: "1px 20px", borderRadius: "5px" }} onClick={toggleBreak}>
                        {takingBreak ? "Continue" : "Take Break"}
                      </button>
                    </span>
                  </div>
                  <div className=' p-2 rounded-circle' style={{ width: "20px", height: "20px", marginRight: "20px", backgroundColor: `${takingBreak ? "red" : "green"}` }}></div>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center p-4 w-100">
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
                <div>
                  <div className='d-flex mt-2 items-content-center p-1'>
                    <p className=" " style={{ fontSize: '20px' }}><strong>{hours} : {minutes} : {seconds}</strong></p>  <span className='mx-2 ' style={{ fontSize: "20px", color: "gray" }}>| </span>
                    <p className='text-danger ' style={{ fontSize: '20px' }}><strong>{breakHours} : {breakMinutes} : {breakSeconds}</strong></p>
                  </div>
                  <div className='d-flex mt-2 justify-content-center' style={{ color: "gray" }}>
                    <p className=" " style={{ fontSize: '15px' }}>Working Hours</p>  <span className='mx-2 ' style={{ fontSize: "15px", color: "gray" }}>| </span>
                    <p className=' ' style={{ fontSize: '15px' }}>Break</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rank-card top-rankers">
              <h3 className="heading">Best Selling Department</h3>
              <div className="table-wrapper">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <div className="profile-wrapper">
                          <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                        </div>
                      </td>
                      <td>Flotsam</td>
                      <td>40k+ sales</td>
                      <td>$1.4m revenue</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="profile-wrapper">
                          <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                        </div>
                      </td>
                      <td>Flotsam</td>
                      <td>40k+ sales</td>
                      <td>$1.4m revenue</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="profile-wrapper">
                          <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                        </div>
                      </td>
                      <td>Flotsam</td>
                      <td>40k+ sales</td>
                      <td>$1.4m revenue</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Worktime;
