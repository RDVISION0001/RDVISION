import React from 'react'
import Topnav from '../Components/Topnav';
import Sidenav from '../Components/Sidenav';

function orders() {
  return (
    <>
      <div className="superadmin-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 orders-status-page active-cont">
          {/* <!-- Top Nav --> */}
          <Topnav />
          {/* <!--End Top Nav --> */}
          <div className="container-fluid mt-3">
            {/* <!-- Section one --> */}

            <section className="sadmin-top-section">
              <div className="container-fluid">
                <div className="row g-3">
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales">$3,181 <span className="indicators">+55%</span></span>
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
                        <span className="sales">$3,181 <span className="indicators">+55%</span></span>
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
                        <span className="sales">$3,181 <span className="indicators">+55%</span></span>
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
                        <span className="sales">$3,181 <span className="indicators">+55%</span></span>
                      </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* <!-- Orders Overview --> */}
            <section className="oreders-overview py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">Order Overview</h3>
                  <div className="tickets-table table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="selection-cell-header" data-row-selection="true">
                            <input type="checkbox" className="" />
                          </th>
                          <th tabindex="0">Ticket ID</th>
                          <th tabindex="0">Client Name</th>
                          <th tabindex="0">Deal Locked</th>
                          <th tabindex="0">Old Reference</th>
                          <th tabindex="0">Order Status</th>
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
                          <td>#12548796</td>
                          <td>John Skrew</td>
                          <td>Digvijay (Sales Dept.)</td>
                          <td>N/A</td>
                          <td><span className="badge preparing">Preparing</span></td>
                          <td>+91 XXXXXXXX 90</td>
                          <td>****@gmail.com</td>
                          <td>Lorem ipsum dolor sit amet....</td>
                        </tr>
                        <tr>
                          <td className="selection-cell">
                            <input type="checkbox" className="" />
                          </td>
                          <td>#12548796</td>
                          <td>Smith</td>
                          <td>Hanuman (Sales Dept.)</td>
                          <td>N/A</td>
                          <td><span className="badge ofd">Out For Delivery</span></td>
                          <td>+91 XXXXXXXX 90</td>
                          <td>****@gmail.com</td>
                          <td>Lorem ipsum dolor sit amet....</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- -------------- --> */}
          </div>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div className="modal ticket-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <div className="heading-area">
                    <div className="vertical-write">
                      <h2 className="title">Jenell D. Matney</h2>
                      <p className="ticket-id"><i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N</p>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div className="main-content-area">
                    <div className="contact-info-row">
                      <a href="" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                      <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                    </div>
                    <div className="button-grp">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary">Save changes</button>
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

export default orders