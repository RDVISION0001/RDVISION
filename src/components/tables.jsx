import React from 'react'

function tables() {
  return (
    <>
      <div className="table-components">
        {/* <!-- Tabbed Ticket Table --> */}
        <section className="tickets-table-section py-3">
          <div className="container-fluid">
            <div className="table-wrapper tabbed-table">
              <h3 className="title">All Tickets</h3>
              <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabindex="-1">Ongoing</button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabindex="-1">New Tickets</button>
                </li>
              </ul>
              <div className="tab-content recent-transactions-tab-body" id="myTabContent">
                <div className="tab-pane fade show active" id="all-transactions-tab-pane" role="tabpanel" aria-labelledby="all-transactions-tab" tabindex="0">
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
                          <th tabindex="0">Status</th>
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
                <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabindex="0">
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
                <div className="tab-pane fade" id="new-arrivals-tab-pane" role="tabpanel" aria-labelledby="new-arrivals-tab" tabindex="0">
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
        {/* <!-- Seprator --> */}
        <div className="seprator"></div>
        {/* <!-- Tabbed Ticket Table --> */}
        <section className="followup-table-section py-3">
          <div className="container-fluid">
            <div className="table-wrapper tabbed-table">
              <h3 className="title">All Tickets (Agent)</h3>
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
        {/* <!-- Seprator --> */}
        <div className="seprator"></div>
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
        {/* <!-- Seprator --> */}
        <div className="seprator"></div>
        {/* <!-- Orders Overview --> */}
        <section className="payment-table-section py-3">
          <div className="container-fluid">
            <div className="table-wrapper tabbed-table">
              <h3 className="title">Payment Table</h3>
              <div className="table-responsive payment-table">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>Smith</td>
                    </tr>
                    <tr>
                      <td>Transaction ID</td>
                      <td>2456X45F12B</td>
                    </tr>
                    <tr>
                      <td>Payment Via</td>
                      <td>Net Banking</td>
                    </tr>
                    <tr>
                      <td>Payment Date</td>
                      <td>17 Apr, 2024</td>
                    </tr>
                    <tr>
                      <td>Payment Amount</td>
                      <td>5000 /- INR</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Seprator --> */}
        <div className="seprator"></div>
        {/* <!-- User Table --> */}
        <section className="user-table-section py-3">
          <div className="container-fluid">
            <div className="table-wrapper tabbed-table">
              <h3 className="title">Users Table</h3>
              <nav className="recent-transactions-tab-header">
                <div className="nav nav-item nav-tabs" id="nav-tab" role="tablist">
                  <button className="nav-link active" id="nav-all-users-tab" data-bs-toggle="tab" data-bs-target="#nav-all-users" type="button" role="tab" aria-controls="nav-all-users" aria-selected="true">All Users</button>
                  <button className="nav-link" id="nav-new-users-tab" data-bs-toggle="tab" data-bs-target="#nav-new-users" type="button" role="tab" aria-controls="nav-new-users" aria-selected="false">New Users</button>
                  <button className="nav-link" id="nav-restricted-tab" data-bs-toggle="tab" data-bs-target="#nav-restricted" type="button" role="tab" aria-controls="nav-restricted" aria-selected="false">Restricted Users</button>
                </div>
              </nav>

              <div className="tab-content recent-transactions-tab-body" id="nav-tabContent">
                <div className="tab-pane table-responsive all-users-tab fade show active" id="nav-all-users" role="tabpanel" aria-labelledby="nav-all-users-tab" tabindex="0">
                  <table className="table users-table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" />
                        </th>
                        <th tabindex="0">Profile</th>
                        <th tabindex="0">User Name</th>
                        <th tabindex="0">department</th>
                        <th tabindex="0">post</th>
                        <th tabindex="0">Team</th>
                        <th tabindex="0">IP Assigned</th>
                        <th tabindex="0">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>10.124.30.32</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>10.124.30.32</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>10.124.30.32</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>10.124.30.32</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>10.124.30.32</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* <!-- new users tab --> */}
                <div className="tab-pane new-users-tab fade table-responsive" id="nav-new-users" role="tabpanel" aria-labelledby="nav-new-users-tab" tabindex="0">
                  <table className="table users-table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" />
                        </th>
                        <th tabindex="0">Profile</th>
                        <th tabindex="0">User Name</th>
                        <th tabindex="0">department</th>
                        <th tabindex="0">post</th>
                        <th tabindex="0">Team</th>
                        <th tabindex="0">IP Assigned</th>
                        <th tabindex="0">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>-</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Approve User</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>
                          <div className="profile-thumb">
                            <img src="../img/profiles/profile3.png" alt="profile-icon" className="img-fluid" />
                          </div>
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>Admin</td>
                        <td><span className="status">DigV Sales</span></td>
                        <td>-</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Approve User</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="tab-pane restricted-tab fade table-responsive" id="nav-restricted" role="tabpanel" aria-labelledby="nav-restricted-tab" tabindex="0">
                  <table className="table users-table">
                    <thead>
                      <tr>
                        <th className="selection-cell-header" data-row-selection="true">
                          <input type="checkbox" className="" />
                        </th>
                        <th tabindex="0">User Name</th>
                        <th tabindex="0">department</th>
                        <th tabindex="0">Status</th>
                        <th tabindex="0">By</th>
                        <th tabindex="0">IP Assigned</th>
                        <th tabindex="0">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="selection-cell">
                          <input type="checkbox" className="" />
                        </td>
                        <td>John Skrew</td>
                        <td>Sales</td>
                        <td>
                          <span className="status bg-danger text-white">Blocked</span>
                        </td>
                        <td>Admin : Digvijay</td>
                        <td>10.124.30.32</td>
                        <td className="action">
                          <button className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">Action</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* <!--  --> */}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default tables