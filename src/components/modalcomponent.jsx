import React from 'react'

function modalcomponent() {
  return (
    <>
      <div className="modal-component">
        <section className="tickets-modal m-5">
          <div className="container">
            <div className="row">
              <div className="col-md-2">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#assignTicketModal">Assign Tickets</button>
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#approveUserModal">Assign IP/ Block User</button>
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#BlockingModal">Assign IP/ Block User</button>
              </div>
            </div>
            {/* <!-- -------------------------------------------------------- -->

          <!-- ------------------------------------------------------------
            --------------------- Assign Ticket Modal ---------------------
          -------------------------------------------------------------- --> */}
            <div className="modal assign-ticket-modal fade" id="assignTicketModal" tabindex="-1" aria-labelledby="assignTicketModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h1 className="modal-title fs-5 w-100 text-center" id="assignTicketModalLabel">Assign Ticket</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form action="#">
                      <div className="row g-3">
                        <div className="col-6">
                          <label for="department" className="form-label">Department</label>
                          <select name="department" className="form-select" id="department">
                            <option value="0">Choose Department</option>
                            <option value="0">Department A</option>
                            <option value="0">Department B</option>
                            <option value="0">Department C</option>
                            <option value="0">Department D</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <label for="team" className="form-label">Team</label>
                          <select name="team" id="team" className="form-select">
                            <option value="0">Choose Team</option>
                            <option value="0">Team A</option>
                            <option value="0">Team B</option>
                            <option value="0">Team C</option>
                            <option value="0">Team D</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label for="Role" className="form-label">Team Members</label>
                          <select name="Role" id="Role" className="form-select">
                            <option value="0">Choose Member</option>
                            <option value="0">Member A</option>
                            <option value="0">Member B</option>
                            <option value="0">Member C</option>
                            <option value="0">Member D</option>
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer justify-content-center border-0">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- ------------------------------------------------------------
            ------------------ Approve/Reject User Modal -----------------
          -------------------------------------------------------------- --> */}
            <div className="modal approve-user-modal fade" id="approveUserModal" tabindex="-1" aria-labelledby="approveUserModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h1 className="modal-title fs-5 w-100 text-center" id="approveUserModalLabel">Approve User</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form action="#">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="card">
                            <div className="row">
                              <div className="col-8 flex-v-center">
                                <div className="user-details-card">
                                  <div className="img-wrapper">
                                    <img src="../img/thumb-img.png" className="img-fluid" alt="profile-image" />
                                  </div>
                                  <div className="content-block">
                                    <h3 className="title">Rober Downy Jr.</h3>
                                    <p className="sub-title">Admins</p>
                                    <small>Department Name</small>
                                  </div>
                                </div>
                              </div>
                              <div className="col-4 flex-v-center">
                                <div className="card-user">
                                  <div className="icon-wrapper">
                                    <i className="fa-solid fa-wallet"></i>
                                  </div>
                                  <div className="div-top">
                                    <h3 className="title">Total Sales</h3>
                                    <span className="sales">$3,181 </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="contact-info-row">
                            <a href="#" className="contact-info phone"><i className="fa-solid fa-phone"></i> +91 9918293747</a>
                            <a className="contact-info email" href="#"><i className="fa-solid fa-envelope-open-text"></i> example@email.com</a>
                          </div>
                        </div>
                        <div className="col-12">
                          <label for="assignIP" className="form-label">Assign IP</label>
                          <select className="form-select" name="assignIP" id="assignIP">
                            <option value="0">Choose IP</option>
                            <option value="0">10.135.30.01</option>
                            <option value="0">10.135.30.02</option>
                            <option value="0">10.135.30.03</option>
                            <option value="0">10.135.30.04</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label for="holdAccount" className="form-label">Comment</label>
                          <textarea className="form-control" name="commentHold" id="holdAccount" cols="30" rows="4" placeholder="Explain the Reason for holding the account..."></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer justify-content-center border-0">
                    <button type="button" className="btn btn-primary">Approve User</button>
                    <button type="button" className="btn btn-warning">Hold User</button>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- ------------------------------------------------------------
            --------------------- Assign Ticket Modal ---------------------
          -------------------------------------------------------------- --> */}
            <div className="modal block-modal fade" id="BlockingModal" tabindex="-1" aria-labelledby="BlockingModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h1 className="modal-title fs-5 w-100 text-center" id="assignTicketModalLabel">Hold Ticket</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <form action="#">
                      <div className="row g-3">
                        <div className="col-12">
                          <p className="text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum, neque! (10 descriptive words)</p>
                        </div>
                        <div className="col-12">
                          <label for="Role" className="form-label">Role</label>
                          <textarea className="form-control" name="commentHold" id="holdAccount" cols="30" rows="4" placeholder="Explain the Reason for holding..."></textarea>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer justify-content-center border-0">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-danger">Hold</button>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- -------------------------------- ends here modals part ---------------------------------------------- --> */}
          </div>
        </section>
      </div>
    </>
  )
}

export default modalcomponent