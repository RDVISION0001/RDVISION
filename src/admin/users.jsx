import React, { useState, useEffect } from 'react';

// Authentication context
import { useAuth } from '../auth/AuthContext';

import profile2 from '../assets/img/profiles/profile2.png'

import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Report from '../components/Report';

function users() {


  const { userId, dark } = useAuth();

  ///pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedUser, setSelectedUser] = useState(0)

  ////add member //
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //user managmeant
  const [view, setView] = useState(false);
  const handleOff = () => setView(false);
  const handleView = (userID) => {
    setView(true)
    setSelectedUser(userID)
  };

  ////change hostinger password//
  const [open, setOpen] = useState(false);
  const handleClosex = () => {
    setOpen(false)
  };
  const handleOpen = (userID) => {
    setOpen(true)
    setSelectedUser(userID)
    setSelectedagent(userID)
  };

  const [hostingerPassword, setHostingerPassword] = useState("");

  const handleHostingerSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: selectedagent,
      password: hostingerPassword
    };
    try {
      const response = await axiosInstance.post("/user/updateHostingerPassword", payload);
      toast.success('Hostinger password added successfully');
      handleZero(); // Close the modal on success
    } catch (error) {
      console.error("Error adding hostinger:", error);
    }
  };

  ////make agent //
  const [selectedagent, setSelectedagent] = useState(0)
  const [one, setOne] = useState(false);
  const handleZero = () => {
    setOne(false)
    setAlreadyAgent(false)
  };
  const handleOne = (userID) => {
    setOne(true)
    setSelectedUser(userID)
    setSelectedagent(userID)
  };

  //agent username
  const [agentUserName, setAgentUserName] = useState("");
  const [agentPassword, setAgentPassword] = useState("");
  const [allredyAgent, setAlreadyAgent] = useState(false)

  const handleAgentSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: selectedagent,
      agentUserName: agentUserName,
      agentPassword: agentPassword,
    };
    try {
      const response = await axiosInstance.post("/user/addagent", payload);
      toast.success('Agent added successfully');
      handleZero(); // Close the modal on success
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  useEffect(() => {
    checkUserIsAgent()
  }, [selectedagent])

  const checkUserIsAgent = async () => {
    if (selectedagent) {
      try {
        const response = await axiosInstance.get(`/user/getAgent/${selectedagent}`);
        setAlreadyAgent(response.data);
      } catch (error) {
        // Error handling
        if (error.response) {
          // Server responded with a status other than 2xx
          setAlreadyAgent(error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          // Request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error setting up the request:", error.message);
        }
      }
    } else {
      console.warn("No agent selected.");
    }
  };

  const [loading, setLoading] = useState(false);

  // Delete user function
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/user/deleteUserbyId/${userId}`);
      toast.success('User deleted successfully!'); // Success toast message
      fetchData(0)
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user!'); // Error toast message
    } finally {
      setLoading(false);
    }
  };

  //taraget assign
  const [white, setWhite] = useState(false);
  const handleBlack = () => setWhite(false);
  const handleWhite = () => setWhite(true);


  //update image
  const [emailForIMage, setEmailForImage] = useState("")
  const [isUpdate, setIsUpdate] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const handleUpdateShow = (email) => {
    setEmailForImage(email)
    setIsUpdate(true)
  };
  const handleUpdateHide = () => setIsUpdate(false);

  const updateImageOfUser = async () => {
    setImageUploading(true)
    if (formData.imageData.length > 10) {
      const response = await axiosInstance.post("/user/updateImage", {
        email: emailForIMage,
        imageData: formData.imageData
      })
      if (response.data === "Image Updated") {
        toast.success("Image updated")
        setImageUploading(false)
        handleUpdateHide()
        fetchData(0)
        setFormData((prevData) => ({
          ...prevData,
          imageData: ""
        }));

      } else {
        toast.error("Some Error Occurs")
      }
    } else {
      toast.info("Please uplaod Image")
    }
    setImageUploading(false)
  }

  //assign target
  const [taskData, setTaskData] = useState({
    taskDesc: "",
    assignedToRoleId: 0,
    assignedBy: userId,
    saleTask: 0
  })

  const handleTargetChange = (e) => {
    setTaskData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

  }

  //assign target
  const handleAddTask = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post('/users_task/addTask', taskData);
      handleBlack()
      // Reset form fields
      // taskDesc('');
      // assignedToRoleId('');
      // saleTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

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
    imageData: "",
    createdDate: 0,
    createdBy: 0,
    updatedBy: 0,
    systemIp: '',
    userStatus: 0,
  });

  //image handling
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        imageData: reader.result.split(",")[1] // Store the Base64 string in imageData
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Convert the file to a Base64 string
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/createUser', formData);
      toast.success('User created successfully!');
      handleClose();
      fetchData(0)
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
        console.log("Roles ", response.data.dtoList)
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // updating picture of user
  const openUpdatePicture = (userId) => {
    document.getElementById("updateImage").showModal()
  }

  const handleSelectRole = (e) => {
    setSelectedRole(e.target.value);
  };


  // Function to handle enable/disable user
  const handleEnableDisableUser = async (userId) => {
    try {
      const response = await axiosInstance.post(`/user/deleteUser/${userId}`);
      toast.success('User status updated successfully!');
      fetchData(currentPage); // Refresh the user list
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  //resuble function to convert byte code to image url
  function convertToImage(imageString) {
    const byteCharacters = atob(imageString); // Decode base64 string
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    return url;

  }


  return (
    <>
      <div className='bg-dark'>
        <div className="superadmin-page ">
          {/* <!-- Main Wrapper --> */}
          <div className={`my-container main-content-block2658 user-management-page ${dark ? "bg-dark" : ""}`}>
            {/* <!--End Top Nav --> */}
            <div className="container-fluid  mt-3">
              <section className="core-team-section">
                <div className="container-fluid">
                  <div className={`section-header ${dark ? "bg-secondary" : ""} `}>
                    <h2 className="title">Teams</h2>
                    <Button className="btn btn-primary" onClick={handleShow} data-bs-toggle="modal" data-bs-target="#addUser">Add New User</Button>
                  </div>
                  <div className='d-flex flex-wrap'>
                    {
                      data.map((item, index) => (
                        <div key={index} className="col-lg-3 col-md-6">
                          <div
                            className={` p-3 m-2 d-flex `}
                            style={{
                              backgroundColor: dark ? "#1c2541" : "",
                              color: dark ? "#fff" : "#000",
                              border: !item.onBreak ? "2px solid red" : "2px solid green", // Adding a border to separate content
                              borderRadius: "10px",
                              height: "80%"
                            }}
                          >
                            {/* Left side for profile image */}
                            <div className="profile-thumb mb-3" style={{ flex: 1 }}>
                              <img
                                src={convertToImage(item.imageData)}
                                className="img-fluid "
                                alt="profile"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover", // Ensures the image covers the div without stretching
                                }}
                              />
                            </div>

                            {/* Right side for user info */}
                            <div
                              className="content-area d-flex flex-column justify-content-between text-center"
                              style={{
                                flex: 2,
                                marginLeft: "5px",
                                borderLeft: "2px solid black", // Adding a thick black line between the image and content
                                paddingLeft: "15px",
                              }}
                            >
                              <h4 className="title">{item.firstName} {item.lastName}</h4>
                              <p className="sub-title">
                                Designation: <strong> {role.find((role) => role.roleId === item.roleId) && role.find((role) => role.roleId === item.roleId).roleName}
                                </strong>
                              </p>
                              {/* Action Button at the bottom */}
                              <div className="mt-3 d-flex justify-content-between fw-bold" style={{ marginLeft: "20px" }}>
                                <div className={!item.onBreak ? "text-danger" : "text-success"}>{item.onBreak ? "Online" : "Offline"}</div>
                                <button
                                  style={{
                                    backgroundColor: "#FFEAC5",
                                    width: "25%",
                                    padding: "3px",
                                    borderRadius: "5px",
                                    color: "black",
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                  onClick={() => handleUpdateShow(item.email)}
                                  className="btn"
                                >
                                  <i class="fas fa-edit"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                      ))
                    }
                  </div>
                </div>
              </section>
              {/* <!-- User Table --> */}
              <section className={`user-table-section py-3 ${dark ? "bg-dark" : ""}`}>
                <div className="container-fluid ">
                  <div className={`table-wrapper tabbed-table text-center  ${dark ? "bg-dark text-light" : ""}`}>
                    <h6 className={`${dark ? "text-light" : "text-dark"} m-3`}>Users Table <span className="d-flex justify-content-end"><button onClick={handleWhite}>Target Assigin</button></span> </h6>
                    <nav className="recent-transactions-tab-header">
                      {/* <div className="nav nav-item nav-tabs gap-2 py-2" id="nav-tab" role="tablist">
                        <button className={`"nav-link active ${dark?"text-light":""}`} id="nav-all-users-tab" data-bs-toggle="tab" data-bs-target="#nav-all-users" type="button" role="tab" aria-controls="nav-all-users" aria-selected="true">All Users</button>
                        <button className={`"nav-link active ${dark?"text-light":""}`}  id="nav-new-users-tab" data-bs-toggle="tab" data-bs-target="#nav-new-users" type="button" role="tab" aria-controls="nav-new-users" aria-selected="false">New Users</button>
                        <button className={`"nav-link active ${dark?"text-light":""}`}  id="nav-restricted-tab" data-bs-toggle="tab" data-bs-target="#nav-restricted" type="button" role="tab" aria-controls="nav-restricted" aria-selected="false">Restricted Users</button>
                      </div> */}
                    </nav>
                    <div className="tab-content recent-transactions-tab-body" id="nav-tabContent">
                      <div className="tab-pane table-responsive all-users-tab fade show active" id="nav-all-users" role="tabpanel" aria-labelledby="nav-all-users-tab" tabindex="0">
                        <table className={`"table table-bordered w-100 users-table text-light ${dark ? "table-dark text-light " : "text-dark"}`}>
                          <thead>
                            <tr className='py-1'>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} data-row-selection="true">
                                S.no
                              </th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">Profile</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">User Name</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">User Email</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">Department</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">Designation</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">Team</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">IP Assigned</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">Status</th>
                              <th className={`"text-center ${dark ? "bg-secondary text-light" : "bg-dark text-light"}`} tabindex="0">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, index) => (
                              <tr key={item.id}>
                                <td className="selection-cell text-center">
                                  {index + 1}
                                </td>
                                <td className='text-center'>
                                  <div className="profile-thumb text-center">
                                    <img
                                      src={convertToImage(item.imageData)}
                                      alt="profile-icon"
                                      className="img-fluid"
                                      style={{ maxWidth: '50px', height: 'auto', borderRadius: "50%", margin: "5px" }} // Ensures responsive image size
                                    />
                                  </div>
                                </td>
                                <td className='text-center'>
                                  {item.firstName} {item.lastName}
                                </td>
                                <td className='text-center'>
                                  {item.email}
                                </td>
                                <td className="d-none d-sm-table-cell text-center"> {/* Hidden on xs, visible on sm and larger */}
                                  {department.find((dep) => dep.deptId === item.departmentId) && department.find((dep) => dep.deptId === item.departmentId).deptName}
                                </td>
                                <td className="d-none d-md-table-cell text-center"> {/* Hidden on xs and sm, visible on md and larger */}
                                  {role.find((role) => role.roleId === item.roleId) && role.find((role) => role.roleId === item.roleId).roleName}
                                </td>
                                <td className="d-none d-lg-table-cell text-center"> {/* Hidden on xs, sm, md, visible on lg and larger */}
                                  {team.find((team) => team.teamId === item.teamId) && team.find((team) => team.teamId === item.teamId).teamName}
                                </td>
                                <td className='text-center'>
                                  {item.systemIp}
                                </td>
                                <td className="d-flex justify-content-center align-items-center" style={{ height: "60px" }}>
                                  <div className=' p-2 rounded-circle' style={{ width: "20px", height: "20px", backgroundColor: `${item.onBreak ? "red" : "green"}` }}></div>
                                </td>
                                <td className="action text-center">
                                  <Button className="btn-outline-secondary" onClick={() => handleView(item.userId)} data-bs-toggle="modal" data-bs-target="#exampleModal">View</Button>
                                  <Button
                                    className="mx-sm-3"
                                    style={{
                                      backgroundColor: item.userStatus === 'F' ? 'red' : 'green',
                                      color: 'white'
                                    }}
                                    onClick={() => handleEnableDisableUser(item.userId)}
                                  >
                                    {item.userStatus === 'F' ? 'Disable' : 'Enable'}
                                  </Button>
                                  <Button className="btn-outline-secondary" onClick={() => handleOne(item.userId)}>
                                    Make Agent
                                  </Button>
                                  <i className="fa-solid fa-trash fa-2xl mx-sm-3"
                                    onClick={() => handleDeleteUser(item.userId)}
                                    style={{ color: "#dd081d" }}>
                                  </i>
                                  <button type="button" class="btn btn-warning" onClick={() => handleOpen(item.userId)}>
                                    Hostinger
                                  </button>
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
                      <div className="user-profile d-flex justify-content-center align-items-center position-relative mb-3">
                        <img
                          src={convertToImage(formData.imageData)}
                          className="img-fluid "

                          style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <div className=" position-absolute bottom-0 end-0">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            name="upload-profile"
                            id="upload-profile-img"
                            hidden
                          />
                          <label htmlFor="upload-profile-img" className="btn btn-sm btn-light rounded-circle">
                            <i className="fa-solid fa-user-pen"></i>
                          </label>
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
          <Report user={selectedUser} />
        </Modal>

        {/* <!-- Target assign --> */}
        <Modal show={white} onHide={handleBlack} className="modal user-mmt-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <div className="heading-area text-center">
                  <h2 className="title">Target Assign</h2>
                </div>
                <div className="main-content-area">
                  <form className="row g-3" onSubmit={handleAddTask}>
                    <div className="col-md-6">
                      <label for="inputDepartment" className="form-label">Select User Type</label>
                      <select id="inputDepartment" name='assignedToRoleId' value={taskData.assignedToRoleId} onChange={handleTargetChange}
                        className="form-select">
                        <option selected>Choose...</option>
                        <option value="5">Senior Supervisor</option>
                        <option value="3">Captain</option>
                        <option value="4">Closer</option>
                        <option value="6">Project Coordinator</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label for="fname" className="form-label">Target</label>
                      <input type="number" name='saleTask' value={taskData.saleTask} onChange={handleTargetChange}
                        className="form-control" placeholder="Target" id="fname" />
                    </div>
                    <div className="col-md-6">
                      <label for="fname" className="form-label">Description</label>
                      <textarea type="text" name='taskDesc' value={taskData.taskDesc} onChange={handleTargetChange}
                        className="form-control" placeholder="Description" id="fname" />
                    </div>
                    <div className="col-12 mt-5 text-center">
                      <div className="button-grp">
                        <button type="button" className="btn btn-secondary" onClick={handleBlack} data-bs-dismiss="modal">Close</button>
                        <span className="button-space"></span> {/* Placeholder for space */}
                        <button type="submit" className="btn btn-warning">Assign</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Modal show={isUpdate} className="d-flex justify-content-center align-items-center">
          <div className="p-4 bg-white rounded">
            <div className="d-flex flex-wrap justify-content-center align-items-center">
              {/* User Profile Container */}
              <div className="user-profile d-flex justify-content-center align-items-center position-relative mb-3">
                {/* Profile Image */}
                <img
                  src={convertToImage(formData.imageData)}
                  className="img-fluid rounded-circle"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                  alt="profile"
                />

                {/* Edit Button */}
                <div className="position-absolute bottom-0 end-0 p-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="upload-profile"
                    id="upload-profile-img"
                    hidden
                  />
                  <label htmlFor="upload-profile-img" className="btn btn-sm btn-light rounded-circle">
                    <i className="fa-solid fa-user-pen"></i>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer with Close and Update Buttons */}
            <div className="mt-4 d-flex justify-content-end">
              <button className="btn btn-secondary" onClick={handleUpdateHide}>
                Close
              </button>
              {imageUploading ? (
                "Loading..."
              ) : (
                <button className="btn btn-success ms-3" onClick={updateImageOfUser}>
                  Update Image
                </button>
              )}
            </div>
          </div>
        </Modal>


        {/* make agent modal */}
        <Modal show={one} onHide={handleZero} className="modal user-mmt-modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                {allredyAgent && <div className='text-danger fw-bold alert alert-warning text-center'>This user is allready added to agent </div>}
                <div className="heading-area text-center">
                  <h2 className="title">Make Agent</h2>
                </div>
                <div className="main-content-area">
                  <form className="row g-3" onSubmit={handleAgentSubmit}>
                    <div className="col-md-6">
                      <label for="fname" className="form-label">UserName</label>
                      <input type="text"
                        className="form-control"
                        placeholder="Agent UserName"
                        id="fname"
                        value={agentUserName}
                        onChange={(e) => setAgentUserName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label for="lname" className="form-label">Password</label>
                      <input type="text"
                        className="form-control"
                        placeholder="password"
                        id="lname"
                        value={agentPassword}
                        onChange={(e) => setAgentPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-12 mt-5 text-center">
                      <div className="button-grp">
                        <button type="button" className="btn btn-secondary" onClick={handleZero} data-bs-dismiss="modal">Close</button>
                        <span className="button-space"></span> {/* Placeholder for space */}
                        <button type="submit" className="btn btn-warning">Submit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Change hostinger password*/}
        <Modal show={open} onHide={handleClosex} className="modal user-mmt-modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body">
                <h5 className="title text-center">Change Hostinger Password</h5>
                <div className="main-content-area">
                  <form className="row g-3" onSubmit={handleHostingerSubmit}>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter Password"
                        id="password"
                        value={hostingerPassword}
                        onChange={(e) => setHostingerPassword(e.target.value)}
                      />
                    </div>
                    <div className="col-12 mt-5 text-center">
                      <div className="button-grp">
                        <button type="button" className="btn btn-secondary" onClick={handleClosex} data-bs-dismiss="modal">Close</button>
                        <span className="button-space"></span>
                        <button type="submit" className="btn btn-warning">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal>


      </div>

    </>
  )
}

export default users