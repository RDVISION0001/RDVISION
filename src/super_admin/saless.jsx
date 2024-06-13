import React from 'react'
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';


function saless() {
  return (
    <>
      <div className="superadmin-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 sales-status-page active-cont">
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

            {/* <!-- section 2 --> */}
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">Recent Sales</h3>
                  <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Sales</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false">Pending Due to Payment</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false">Revised Orders</button>
                    </li>
                  </ul>
                  <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                    <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabindex="0">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="selection-cell-header" data-row-selection="true">
                              <input type="checkbox" className="" />
                            </th>
                            <th tabindex="0">Name</th>
                            <th tabindex="0">Ticket ID</th>
                            <th tabindex="0">Payment Status</th>
                            <th tabindex="0">Contact</th>
                            <th tabindex="0">Email</th>
                            <th tabindex="0">Order Details</th>
                            <th tabindex="0">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td>
                              <span className="status new">Payment Pending</span>
                            </td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>
                              <div className="order-short-desc">
                                <a href="#" className="order-detail-btn"><i className="fa-solid fa-receipt"></i> </a>
                                <span className="text">Lorem ipsum dolor sit amet....</span>
                              </div>
                            </td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabindex="0">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="selection-cell-header" data-row-selection="true">
                              <input type="checkbox" className="" />
                            </th>
                            <th tabindex="0">Name</th>
                            <th tabindex="0">Ticket ID</th>
                            <th tabindex="0">Type/Status</th>
                            <th tabindex="0">Contact</th>
                            <th tabindex="0">Email</th>
                            <th tabindex="0">Description/Comment</th>
                            <th tabindex="0">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status new">new</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status sale">sale</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status">old</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status">old</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status">old</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabindex="0">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="selection-cell-header" data-row-selection="true">
                              <input type="checkbox" className="" />
                            </th>
                            <th tabindex="0">Name</th>
                            <th tabindex="0">Ticket ID</th>
                            <th tabindex="0">Type/Status</th>
                            <th tabindex="0">Contact</th>
                            <th tabindex="0">Email</th>
                            <th tabindex="0">Description/Comment</th>
                            <th tabindex="0">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status new">new</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status sale">sale</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status">old</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status">old</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="selection-cell">
                              <input type="checkbox" className="" />
                            </td>
                            <td>John Skrew</td>
                            <td>#12548796</td>
                            <td><span className="status">old</span></td>
                            <td>+91 XXXXXXXX 90</td>
                            <td>****@gmail.com</td>
                            <td>Lorem ipsum dolor sit amet....</td>
                            <td className="action">
                              <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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

export default saless