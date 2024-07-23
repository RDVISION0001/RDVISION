import React from 'react';
import { render } from 'react-dom'

////copmponents////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import Worktime from '../components/worktime';


////highchart///
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const options = {

  chart: {
    type: 'column'
  },
  title: false,
  credits: {
    text: "CEO : Digvijay Singh",
    href: "",
  },

  xAxis: {
    categories: ['A', 'B', 'C', 'D', 'E', '5'],
    crosshair: true,
    accessibility: {
      description: 'Countries'
    }
  },

  yAxis: {
    min: 0,
    title: {
      text: 'Values'
    }
  },

  tooltip: {
    valueSuffix: ' (1000 MT)'
  },

  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },

  series: [
    {
      name: 'Approach',
      data: [406292, 260000, 107000, 68300, 27500, 14500]
    },
    {
      name: 'Sale',
      data: [51086, 136000, 5500, 141000, 107180, 77000]
    }
  ]

};

function index() {
  return (
    <>
      {/* <!-- Side-Nav --> */}
      <div className="admin-page">
        <Sidenav />

        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 dashboard active-cont">
          <Topnav />

          {/* <!--End Top Nav --> */}
          <div className="container-fluid mt-3">
            {/* <!-- Section one --> */}
            <section className="sadmin-top-section">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">0<span className="indicators">0%</span></span>
                        </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- user-profile --> */}
            <Worktime />
            {/* <!-- graphs and ranking --> */}
            <section className="map-and-rankings">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-8">
                    <div className="graph-wrapper">
                      <h3 className="title">Weekly Report</h3>
                      {/* <div id="map-container" className="highchart-wrapper" style="width: 100%; height: 100%; min-height: 555px"></div> */}
                      <div id="map-container" className="highchart-wrapper" style={{ width: "180px", height: "180px" }} ></div>
                      <div>
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={options}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="rank-card top-rankers">
                      <h3 className="heading">Best Selling Teams</h3>
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
                    {/* <!-- best departments --> */}
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

            {/* <!-- section 2 --> */}

            <section className="data-table-bgs_02x24 tickets-table-section py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">All Tickets</h3>
                  <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabIndex="-1">Ongoing</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabIndex="-1">New Tickets</button>
                    </li>
                  </ul>
                  <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                    <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabIndex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabIndex="0">Ticket ID</th>
                              <th tabIndex="0">Client Name</th>
                              <th tabIndex="0">Category/Department</th>
                              <th tabIndex="0">Status</th>
                              <th tabIndex="0">Source</th>
                              <th tabIndex="0">Contact</th>
                              <th tabIndex="0">Email</th>
                              <th tabIndex="0">Description/Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Equipments</td>
                              <td>New</td>
                              <td><span className="status">GAds</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>IT Softwares</td>
                              <td>No Answer</td>
                              <td><span className="status">FB</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Drug</td>
                              <td>Recall schedule</td>
                              <td><span className="status">IG</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabIndex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabIndex="0">Ticket ID</th>
                              <th tabIndex="0">Client Name</th>
                              <th tabIndex="0">Category/Department</th>
                              <th tabIndex="0">Source</th>
                              <th tabIndex="0">Contact</th>
                              <th tabIndex="0">Email</th>
                              <th tabIndex="0">Status</th>
                              <th tabIndex="0">Description/Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Equipments</td>
                              <td><span className="status">GAds</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Connected</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>IT Softwares</td>
                              <td><span className="status">FB</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>No Response</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Drug</td>
                              <td><span className="status">IG</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>No Answer</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabIndex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabIndex="0">Ticket ID</th>
                              <th tabIndex="0">Client Name</th>
                              <th tabIndex="0">Category/Department</th>
                              <th tabIndex="0">Source</th>
                              <th tabIndex="0">Contact</th>
                              <th tabIndex="0">Email</th>
                              <th tabIndex="0">Description/Comment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Equipments</td>
                              <td><span className="status">GAds</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>IT Softwares</td>
                              <td><span className="status">FB</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                            <tr>
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td>#12548796</td>
                              <td>John Skrew</td>
                              <td>Medical Drug</td>
                              <td><span className="status">IG</span></td>
                              <td>+91 XXXXXXXX 90</td>
                              <td>****@gmail.com</td>
                              <td>Lorem ipsum dolor sit amet....</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- -------------- --> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default index