import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'bootstrap/dist/css/bootstrap.min.css';

const Worktime = () => {
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds

  // Update loginTime to the current time whenever the component mounts
  const [loginTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - loginTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime]);

  const shiftDurationHours = 12;
  const totalShiftTime = shiftDurationHours * 3600; // convert hours to seconds
  const timeElapsedPercentage = Math.min((timeElapsed / totalShiftTime) * 100, 100);

  const hours = String(Math.floor(timeElapsed / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeElapsed % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeElapsed % 60).padStart(2, '0');

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
            <div className="rank-card top-rankers">
              <h3 className="heading">Working Hours</h3>
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
                <p className="" style={{ fontSize: '20px' }}><strong>{hours} : {minutes} : {seconds}</strong></p>
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
