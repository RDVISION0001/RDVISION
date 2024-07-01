import React from 'react';

////copmponents////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

function invoicesm() {
  return (
    <>
     <div className="superadmin-page">
      {/* <!-- Side-Nav --> */}
      <Sidenav />
      {/* <!-- Main Wrapper --> */}
      <div className="my-container main-content-block2658 active-cont">
        {/* <!-- Top Nav --> */}
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
          {/* <!-- graphs and ranking --> */}
          <section className="map-and-rankings">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8">
                  <div className="graph-wrapper">
                    <h3 className="title">Weekly Report</h3>
                    <div
                      id="map-container"
                      className="highchart-wrapper"
                      // style="width: 100%; height: 100%; min-height: 555px"
                    ></div>
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
                                <img
                                  src="../img/profiles/profile1.png"
                                  alt="profile"
                                  className="img-fluid"
                                />
                              </div>
                            </td>
                            <td>Flotsam</td>
                            <td>40k+ sales</td>
                            <td>$1.4m revenue</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="profile-wrapper">
                                <img
                                  src="../img/profiles/profile1.png"
                                  alt="profile"
                                  className="img-fluid"
                                />
                              </div>
                            </td>
                            <td>Flotsam</td>
                            <td>40k+ sales</td>
                            <td>$1.4m revenue</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="profile-wrapper">
                                <img
                                  src="../img/profiles/profile1.png"
                                  alt="profile"
                                  className="img-fluid"
                                />
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
                                <img
                                  src="../img/profiles/profile1.png"
                                  alt="profile"
                                  className="img-fluid"
                                />
                              </div>
                            </td>
                            <td>Flotsam</td>
                            <td>40k+ sales</td>
                            <td>$1.4m revenue</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="profile-wrapper">
                                <img
                                  src="../img/profiles/profile1.png"
                                  alt="profile"
                                  className="img-fluid"
                                />
                              </div>
                            </td>
                            <td>Flotsam</td>
                            <td>40k+ sales</td>
                            <td>$1.4m revenue</td>
                          </tr>
                          <tr>
                            <td>
                              <div className="profile-wrapper">
                                <img
                                  src="../img/profiles/profile1.png"
                                  alt="profile"
                                  className="img-fluid"
                                />
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
          <section className="data-table-bgs_02x24 py-3">
            <div className="container-fluid">
              <div className="table-wrapper">
                <h3 className="title">Recent Transactions</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th
                        className="selection-cell-header"
                        data-row-selection="true"
                      >
                        <input type="checkbox" className="" />
                      </th>
                      <th tabindex="0">
                        <a data-bs-toggle="modal" data-bs-target="#exampleModal"
                          >Name</a
                        >
                      </th>
                      <th tabindex="0">Ticket ID</th>
                      <th tabindex="0">Type/Status</th>
                      <th tabindex="0">Contact</th>
                      <th tabindex="0">Email</th>
                      <th tabindex="0">Description/Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="selection-cell">
                        <input type="checkbox" className="" />
                      </td>
                      <td>John Skrew</td>
                      <td>#12548796</td>
                      <td><span className="status">new</span></td>
                      <td>+91 XXXXXXXX 90</td>
                      <td>****@gmail.com</td>
                      <td>Lorem ipsum dolor sit amet....</td>
                    </tr>
                    <tr>
                      <td className="selection-cell">
                        <input type="checkbox" className="" />
                      </td>
                      <td>John Skrew</td>
                      <td>#12548796</td>
                      <td><span className="status">new</span></td>
                      <td>+91 XXXXXXXX 90</td>
                      <td>****@gmail.com</td>
                      <td>Lorem ipsum dolor sit amet....</td>
                    </tr>
                    <tr>
                      <td className="selection-cell">
                        <input type="checkbox" className="" />
                      </td>
                      <td>John Skrew</td>
                      <td>#12548796</td>
                      <td><span className="status">new</span></td>
                      <td>+91 XXXXXXXX 90</td>
                      <td>****@gmail.com</td>
                      <td>Lorem ipsum dolor sit amet....</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
          {/* <!-- -------------- --> */}
        </div>
      </div>
    </div>

    {/* <!-- Modal --> */}
    <div
      className="modal ticket-modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-body">
            <div className="row">
              <div className="col-4">
                <div className="heading-area">
                  <div className="vertical-write">
                    <h2 className="title">Jenell D. Matney</h2>
                    <p className="ticket-id">
                      <i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="main-content-area">
                  <div className="contact-info-row">
                    <a href="" className="contact-info phone"
                      ><i className="fa-solid fa-phone"></i> +91 9918293747</a
                    >
                    <a className="contact-info email" href="#"
                      ><i className="fa-solid fa-envelope-open-text"></i>
                      example@email.com</a
                    >
                  </div>
                  <div className="button-grp">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default invoicesm