import React from 'react'
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

function users() {
  return (
    <>
      <div className="admin-page user-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 user-management-page active-cont">
          {/* <!-- Top Nav --> */}
          <Topnav />
          {/* <!--End Top Nav --> */}
          <div className="container-fluid mt-3">
            {/* <!-- user-profile --> */}
            <section className="user-details-section mt-3">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-5">
                    <div className="profile-card-wrapper">
                      <div className="img-wrapper">
                        <img src="../img/thumb-img.png" className="img-fluid" alt="profile-image" />
                      </div>
                      <div className="content-block">
                        <h3 className="title">Rober Downy Jr.</h3>
                        <p className="sub-title">Admins | Department Name</p>
                        <span className="ip"><i className="fa-solid fa-desktop"></i> 10.135.30.41</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="row justify-content-end">
                      <div className="col-md-6">
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
                      <div className="col-md-6 mt-3">
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
                </div>
              </div>
            </section>
            {/* <!-- section 2 -->
            <!-- User Table --> */}
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
            {/* <!-- -------------- --> */}
          </div>
        </div>
      </div>

      {/* <!-- Add User Modal --> */}
      <div className="modal user-mmt-modal add-new-user fade" id="addUser" tabindex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="heading-area text-center">
                <h2 className="title">Add New User</h2>
              </div>

              <div className="main-content-area">
                <form className="row g-3">
                  <div className="row p-0">
                    <div className="col-3">
                      <div className="user-profile">
                        <img src="../img/profiles/profile08.png" className="img-fluid" alt="upload-profile" />
                        <div className="upload-profile-wrapper">
                          <input type="file" name="upload-profile" id="upload-profile-img" hidden />
                          <label for="upload-profile-img" className="form-label"><i className="fa-solid fa-user-pen"></i></label>
                        </div>
                      </div>
                    </div>
                    <div className="col-9 pe-0">
                      <div className="form-group">
                        <label for="fname" className="form-label">First Name</label>
                        <input type="text" className="form-control" placeholder="First Name" id="fname" />
                      </div>
                      <div className="form-group mt-3">
                        <label for="lname" className="form-label">Last Name</label>
                        <input type="text" className="form-control" placeholder="Last Name" id="lname" />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label for="inputDepartment" className="form-label">Department</label>
                    <select id="inputDepartment" className="form-select">
                      <option selected>Choose...</option>
                      <option>HR</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>IT</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="inputTeam" className="form-label">Team</label>
                    <select id="inputTeam" className="form-select">
                      <option selected>Choose...</option>
                      <option>Dig A</option>
                      <option>Dig B</option>
                      <option>Dig C</option>
                      <option>Dig D</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="inputContact" className="form-label">Contact</label>
                    <input type="text" className="form-control" id="inputContact" placeholder="+91 0000 001 123" />
                  </div>

                  <div className="col-md-6">
                    <label for="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="example@email.com" />
                  </div>

                  <div className="col-12 mt-5 text-center">
                    <div className="button-grp">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" className="btn btn-primary">Add User</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- User Management Modal --> */}
      <div className="modal user-mmt-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="heading-area text-center">
                <h2 className="title">User Management</h2>
              </div>
              <div className="main-content-area">
                <form className="row g-3">
                  <div className="col-md-6">
                    <label for="fname" className="form-label">First Name</label>
                    <input type="text" className="form-control" placeholder="First Name" id="fname" />
                  </div>
                  <div className="col-md-6">
                    <label for="lname" className="form-label">Last Name</label>
                    <input type="text" className="form-control" placeholder="Last Name" id="lname" />
                  </div>

                  <div className="col-md-6">
                    <label for="inputDepartment" className="form-label">Department</label>
                    <select id="inputDepartment" className="form-select">
                      <option selected>Choose...</option>
                      <option>HR</option>
                      <option>Sales</option>
                      <option>Marketing</option>
                      <option>IT</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="inputTeam" className="form-label">Team</label>
                    <select id="inputTeam" className="form-select">
                      <option selected>Choose...</option>
                      <option>Dig A</option>
                      <option>Dig B</option>
                      <option>Dig C</option>
                      <option>Dig D</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="inputContact" className="form-label">Post</label>
                    <input type="text" className="form-control" id="inputContact" placeholder="+91 0000 001 123" />
                  </div>

                  <div className="col-md-6">
                    <label for="inputEmail" className="form-label">IP</label>
                    <input type="email" className="form-control" id="inputEmail" value="10.135.2.21" />
                  </div>

                  <div className="col-12 mt-5 text-center">
                    <div className="button-grp">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" className="btn btn-warning">Hold</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default users