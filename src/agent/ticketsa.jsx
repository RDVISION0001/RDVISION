import React from 'react';
////copmponents////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

function ticketsa() {
  return (
    <>
      <div className="superadmin-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 tickets-page active-cont">
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

            {/* <!-- followups 2 --> */}

            <section className="followup-table-section py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">All Tickets</h3>
                  <ul className="nav recent-transactions-tab-header nav-tabs" id="followUp" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="all-tkts-tab" data-bs-toggle="tab" data-bs-target="#all-tkts-tab-pane" type="button" role="tab" aria-controls="all-tkts-tab-pane" aria-selected="true">All Tickets</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="old-tkts-tab" data-bs-toggle="tab" data-bs-target="#old-tkts-tab-pane" type="button" role="tab" aria-controls="old-tkts-tab-pane" aria-selected="false" tabindex="-1">Ongoing</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="new-arrivals-tkts-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tkts-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tkts-tab-pane" aria-selected="false" tabindex="-1">New Tickets</button>
                    </li>
                  </ul>
                  <div className="tab-content recent-transactions-tab-body" id="followUpContent">
                    <div className="tab-pane fade show active" id="all-tkts-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabindex="0">
                      <div className="followups-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th tabindex="0">Ticket ID</th>
                              <th tabindex="0">Client Name</th>
                              <th tabindex="0">Status</th>
                              <th tabindex="0">Status Comments</th>
                              <th tabindex="0">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="ticket-id"><i className="fa-solid fa-ticket"></i> #12548796</td>
                              <td>
                                <span className="client-details">
                                  <h3 className="card-title">Jenell D. Matney</h3>
                                  <small><i className="fa-regular fa-clock"></i> <span>today</span></small>
                                </span>
                              </td>
                              <td><span className="badge new">new</span></td>
                              <td><span className="comment">--</span></td>
                              <td>
                                <span className="actions-wrapper">
                                  <a href="tel:+919918293747" className="btn-action call" title="Get connect on call"><i className="fa-solid fa-phone"></i></a>
                                  <a href="sms:+150000000?body=Share%20this%20message%20on%20sms" className="btn-action message" title="Get connect on message"><i className="fa-solid fa-message"></i></a>
                                  <a href="mailto:someone@example.com" className="btn-action email" title="Get connect on email"><i className="fa-solid fa-envelope"></i></a>
                                  <a href="https://wa.me/919918293747?text=Hi%20I'm%20Interested%20to%20connect%20with%20you%20for%20my%20project" className="btn-action whatsapp" title="Get connect on whatsapp"><i className="fa-brands fa-whatsapp"></i></a>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="ticket-id"><i className="fa-solid fa-ticket"></i> #12548796</td>
                              <td>
                                <span className="client-details">
                                  <h3 className="card-title">Matney Jenell</h3>
                                  <small><i className="fa-regular fa-clock"></i> <span>month ago</span></small>
                                </span>
                              </td>
                              <td><span className="badge sale">sale</span></td>
                              <td><span className="comment">Invoice Raised</span></td>
                              <td>
                                <span className="actions-wrapper">
                                  <a href="tel:+919918293747" className="btn-action call" title="Get connect on call"><i className="fa-solid fa-phone"></i></a>
                                  <a href="sms:+150000000?body=Share%20this%20message%20on%20sms" className="btn-action message" title="Get connect on message"><i className="fa-solid fa-message"></i></a>
                                  <a href="mailto:someone@example.com" className="btn-action email" title="Get connect on email"><i className="fa-solid fa-envelope"></i></a>
                                  <a href="https://wa.me/919918293747?text=Hi%20I'm%20Interested%20to%20connect%20with%20you%20for%20my%20project" className="btn-action whatsapp" title="Get connect on whatsapp"><i className="fa-brands fa-whatsapp"></i></a>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="old-tkts-tab-pane" role="tabpanel" aria-labelledby="old-tkts-tab" tabindex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabindex="0">Ticket ID</th>
                              <th tabindex="0">Client Name</th>
                              <th tabindex="0">Category/Department</th>
                              <th tabindex="0">Source</th>
                              <th tabindex="0">Contact</th>
                              <th tabindex="0">Email</th>
                              <th tabindex="0">Status</th>
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
                    <div className="tab-pane fade" id="new-arrivals-tkts-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tkts-tab" tabindex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabindex="0">Ticket ID</th>
                              <th tabindex="0">Client Name</th>
                              <th tabindex="0">Category/Department</th>
                              <th tabindex="0">Source</th>
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

export default ticketsa