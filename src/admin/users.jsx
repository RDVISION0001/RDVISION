import React, { useState, useEffect } from 'react';

////components////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function  users() {

  ///pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  ////add member //
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [view, setView] = useState(false);
  const handleOff = () => setView(false);
  const handleView = () => setView(true);

  const [formData, setFormData] = useState({
    userId: 0,
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    phoneNumber: '',
    roleId: 0,
    departmentId: 0,
    teamId: 0,
    profilepic: '',
    createdDate: 0,
    createdBy: 0,
    updatedBy: 0,
    systemIp: '',
    userStatus: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/createUser', formData);
      console.log('Response:', response.data);
      toast.success('User created successfully!');
      handleClose();
      fetchData()
    } catch (error) {
      console.error('Error:', error);
      toast.error('User creation failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  ////all users///
  const [data, setData] = useState([]);

  const fetchData = async (page) => {
    try {
      const response = await axiosInstance.get('/user/getAllUsers', { params: { page } });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchData(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchData(currentPage + 1);
    }
  };

  ///department////////
  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/department/getDepartments');
        setDepartment(response.data.dtoList);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleSelectDepart = (e) => {
    setSelectedDepartment(e.target.value);
  };

  ///team////////
  const [team, setTeam] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosInstance.get('/team/getAllTeams');
        setTeam(response.data.dtoList);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  const handleSelectTeam = (e) => {
    setSelectedTeam(e.target.value);
  };

  ///role////////
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/role/getAllRoles');
        setRole(response.data.dtoList);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleSelectRole = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <>
      <div className="superadmin-page">
        {/* <!-- Side-Nav --> */}
        <Sidenav />
        {/* <!-- Main Wrapper --> */}
        <div className="my-container main-content-block2658 user-management-page active-cont">
          {/* <!-- Top Nav --> */}
          <Topnav />
          {/* <!--End Top Nav --> */}
          <div className="container-fluid mt-3">
            <section className="core-team-section">
              <div className="container-fluid">
                <div className="section-header">
                  <h2 className="title">Teams</h2>
                  <Button className="btn btn-primary" onClick={handleShow} data-bs-toggle="modal" data-bs-target="#addUser">Add New Member</Button>
                </div>
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6">
                    <div className="user-team-card">
                      <div className="profile-thumb">
                        <img src="../img/profiles/profile2.png" alt="profile-img" className="img-fluid" />
                      </div>
                      <div className="content-area">
                        <h3 className="title">Dig Vijay</h3>
                        <p className="sub-title">Department : <strong>Admin's Head</strong></p>
                        <span className="other-info">IP Series : <mark>10.132.30.41</mark></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="user-team-card">
                      <div className="profile-thumb">
                        <img src="../img/profiles/profile2.png" alt="profile-img" className="img-fluid" />
                      </div>
                      <div className="content-area">
                        <h3 className="title">Dig Vijay</h3>
                        <p className="sub-title">Department : <strong>Sale's Head</strong></p>
                        <span className="other-info">IP Series : <mark>10.132.30.41</mark></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="user-team-card">
                      <div className="profile-thumb">
                        <img src="../img/profiles/profile2.png" alt="profile-img" className="img-fluid" />
                      </div>
                      <div className="content-area">
                        <h3 className="title">Dig Vijay</h3>
                        <p className="sub-title">Department : <strong>HR's Head</strong></p>
                        <span className="other-info">IP Series : <mark>10.132.30.41</mark></span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="user-team-card">
                      <div className="profile-thumb">
                        <img src="../img/profiles/profile2.png" alt="profile-img" className="img-fluid" />
                      </div>
                      <div className="content-area">
                        <h3 className="title">Dig Vijay</h3>
                        <p className="sub-title">Department : <strong>Marketing's Head</strong></p>
                        <span className="other-info">IP Series : <mark>10.132.30.41</mark></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

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
                    <div className="search-wrapper">
                      <input
                        type="text"
                        name="search-user"
                        id="searchUsers"
                        className="form-control"
                        placeholder="Search Department or Name..."
                      />
                      <div class="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
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
                            <th tabindex="0">Department</th>
                            <th tabindex="0">Designation</th>
                            <th tabindex="0">Team</th>
                            <th tabindex="0">IP Assigned</th>
                            <th tabindex="0">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item) => (
                            <tr >
                              <td className="selection-cell">
                                <input type="checkbox" className="" />
                              </td>
                              <td key={item.id}>
                                <div className="profile-thumb">
                                  <img src={item.profilepic} alt="profile-icon" className="img-fluid" />
                                </div>
                              </td>
                              <td>{item.firstName} {item.lastName}</td>
                              <td>{item.departmentDto?.deptName}</td>
                              <td>{item.roleDto?.roleName}</td>
                              <td>{item.teamDto?.teamName}</td>
                              <td>{item.systemIp}</td>
                              <td className="action">
                                <Button className="btn btn-outline-secondary" onClick={handleView} data-bs-toggle="modal" data-bs-target="#exampleModal">View</Button>
                                <button type="button" class="btn btn-danger mx-sm-3">Delete</button>
                              </td>
                            </tr>
                          ))}
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
                <div className="pagination-controls">
                  <button className='next_prev' onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                  <span>Page {currentPage + 1} of {totalPages}</span>
                  <button className='next_prev' onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
                </div>
              </div>
            </section>
            {/* <!-- -------------- --> */}
          </div>
        </div>
      </div>

      {/* <!-- Add User Modal --> */}
      <Modal show={show} onHide={handleClose} className="modal user-mmt-modal add-new-user fade" id="addUser" tabindex="-1" aria-labelledby="addUserLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="heading-area text-center">
                <h2 className="title">Add New User</h2>
              </div>
              <div className="main-content-area">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="row p-0">
                    <div className="col-3">
                      <div className="user-profile">
                        <img src="../img/profiles/profile08.png" className="img-fluid" alt="upload-profile" />
                        <div className="upload-profile-wrapper">
                          <input type="file" value={formData.profilepic} onChange={handleChange} name="upload-profile" id="upload-profile-img" hidden />
                          <label for="upload-profile-img" className="form-label"><i className="fa-solid fa-user-pen"></i></label>
                        </div>
                      </div>
                    </div>
                    <div className="col-9 pe-0">
                      <div className="form-group">
                        <label for="fname" className="form-label">First Name</label>
                        <input type="text" className="form-control" placeholder="First Name" id="fname"
                          name="firstName" value={formData.firstName} onChange={handleChange} />
                      </div>
                      <div className="form-group mt-3">
                        <label for="lname" className="form-label">Last Name</label>
                        <input type="text" className="form-control" placeholder="Last Name" id="lname"
                          name="lastName" value={formData.lastName} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label for="inputDepartment" className="form-label">Department</label>
                    {/* <select id="inputDepartment" name="departmentId" value={formData.departmentId} onChange={handleChange} className="form-select"> */}
                    <select
                      id="inputDepartment"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Choose...</option>
                      {department.map(department => (
                        <option key={department.deptId} value={department.deptId}>{department.deptName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="inputTeam" className="form-label">Team</label>
                    {/* <select id="inputTeam" name="teamId" value={formData.teamId} onChange={handleChange} className="form-select"> */}
                    <select
                      className="form-select"
                      id="teamId"
                      name="teamId"
                      value={formData.teamId}
                      onChange={handleChange}
                    >
                      <option value="">Choose...</option>
                      {team.map((team) => (
                        <option key={team.teamId} value={team.teamId}>
                          {team.teamName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="inputContact" className="form-label">Contact</label>
                    <input type="text" className="form-control" id="inputContact" placeholder="+91 0000 001 123"
                      name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label for="inputEmail" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputEmail" placeholder=""
                      name="password" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label for="inputEmail" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail" placeholder="example@email.com"
                      name="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label for="selectRole" className="form-label">Role</label>
                    {/* <select id="selectRole" name="roleId" value={formData.roleId} onChange={handleChange} className="form-select" > */}
                    <select
                      className="form-select"
                      id="roleId"
                      name="roleId"
                      value={formData.roleId}
                      onChange={handleChange}
                    >
                      <option value="">Choose...</option>
                      {role.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label for="assignIP" className="form-label">Assign IP</label>
                    <input type="text" className="form-control" id="assignIP" placeholder="10.255.255.0"
                      name="systemIp" value={formData.systemIp} onChange={handleChange} />
                  </div>

                  <div className="col-12 mt-5 text-center">
                    <div className="button-grp">
                      <button type="button" className="btn btn-secondary" onClick={handleClose} data-bs-dismiss="modal">Close</button>
                      <span className="button-space"></span> {/* Placeholder for space */}
                      <button type="submit" className="btn btn-primary">Add User</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* <!-- User Management Modal --> */}
      <Modal show={view} onHide={handleOff} className="modal user-mmt-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

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
                      <span className="button-space"></span> {/* Placeholder for space */}
                      <button type="submit" className="btn btn-warning">Hold</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>

    </>
  )
}

export default users