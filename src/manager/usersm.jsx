import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

function usersm() {
  // Define parameters for each tab
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
  };

  // Action modal active
  const [activeTab, setActiveTab] = useState('allTickets');

  // Function to handle tab click
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    fetchTickets(params[tabName]);
  };

  // Post assign
  const [apiResponse, setApiResponse] = useState(null);

  // State for selected tickets
  const [selectedTickets, setSelectedTickets] = useState([]);

  // Function to handle ticket selection
  const handleTicketSelect = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    }
  };

  // Function to send POST request
  const sendPostRequest = async () => {
    try {
      const payload = selectedTickets;
      const config = {
        headers: {
          // 'userId': parseInt(selectedUser)
        }
      };

      // Construct the URL with the ticketId
      const url = `/third_party_api/ticket/assignToUser/${selectedUser}`;
      const response = await axiosInstance.post(url, payload, config);
      setApiResponse(response.data);
      toast.success('Tickets assigned successfully!');
      handleClose();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 6000); 
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign tickets.');
    }
  };

  // State for modal visibility
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Users
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedTeam] = useState('');

  // Fetch users on component 
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/user/getAllUsers', {
        params: { roleId: 4 }
      });
      setUser(response.data.dtoList);
    };

    fetchData();
  }, []);

  // Handle user selection
  const handleSelectTeam = (e) => {
    setSelectedTeam(e.target.value);
  };

  // State for tickets
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus');
      setData(response.data.dtoList);
    };
    fetchData();
  }, []);

  // Function to fetch tickets based on parameters
  const fetchTickets = async (params) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', { params });
      setData(response.data.dtoList);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Fetch all tickets on component mount
  useEffect(() => {
    fetchTickets(params.allTickets);
  }, []);


  return (
    <>
      <div className="admin-page tickets-page">
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
            {/* <!-- Filter Section --> */}
            <section className="filter-section">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-5">
                    <div className="search-wrapper">
                      <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search Department or Name..." />
                      <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="filter-wrapper d-flex gap-3">
                      {/* <!-- Department filter --> */}
                      <div className="btn-group department">
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Department</button>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Action</a></li>
                          <li><a className="dropdown-item" href="#">Another action</a></li>
                          <li><a className="dropdown-item" href="#">Something else here</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item" href="#">Separated link</a></li>
                        </ul>
                      </div>
                      {/* <!-- Date filter --> */}
                      <div className="btn-group date">
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Date</button>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Action</a></li>
                          <li><a className="dropdown-item" href="#">Another action</a></li>
                          <li><a className="dropdown-item" href="#">Something else here</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item" href="#">Separated link</a></li>
                        </ul>
                      </div>
                      {/* <!-- Order Status filter --> */}
                      <div className="btn-group order-status">
                        <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Order Status</button>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" href="#">Action</a></li>
                          <li><a className="dropdown-item" href="#">Another action</a></li>
                          <li><a className="dropdown-item" href="#">Something else here</a></li>
                          <li><hr className="dropdown-divider" /></li>
                          <li><a className="dropdown-item" href="#">Separated link</a></li>
                        </ul>
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
                  <div className="heading-wrapper">
                    <h3 className="title">All Tickets</h3>
                    <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal">Assign Ticket</Button>
                  </div>
                  <ul className="nav recent-transactions-tab-header nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("allTickets")} id="all-transactions-tab" data-bs-toggle="tab" data-bs-target="#all-transactions-tab-pane" type="button" role="tab" aria-controls="all-transactions-tab-pane" aria-selected="true">All Tickets</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                        onClick={() => handleRowClick("ongoing")} id="pendings-tab" data-bs-toggle="tab" data-bs-target="#pendings-tab-pane" type="button" role="tab" aria-controls="pendings-tab-pane" aria-selected="false" tabindex="-1">Ongoing</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("newTickets")} id="new-arrivals-tab" data-bs-toggle="tab" data-bs-target="#new-arrivals-tab-pane" type="button" role="tab" aria-controls="new-arrivals-tab-pane" aria-selected="false" tabindex="-1">New Tickets</button>
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
                              <th tabindex="0">Query ID</th>
                              <th tabindex="0">Query McatName</th>
                              <th tabindex="0">Sender Company</th>
                              <th tabindex="0">Sender Name</th>
                              <th tabindex="0">Sender Mobile</th>
                              <th tabindex="0">Sender Address</th>
                              <th tabindex="0">Query Message</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item) => (
                              <tr>
                                <td className="selection-cell">
                                  <input
                                    type="checkbox"
                                    checked={selectedTickets.includes(item.uniqueQueryId)}
                                    onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                                  />
                                </td>
                                <td>{item.uniqueQueryId}</td>
                                <td>{item.queryMcatName}</td>
                                <td>{item.senderCompany}</td>
                                <td>{item.senderName}</td>
                                <td>{item.senderMobile}</td>
                                <td>{item.senderAddress}</td>
                                <td>{item.queryMessage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <!-- pending tab --> */}
                    <div className="tab-pane fade" id="pendings-tab-pane" role="tabpanel" aria-labelledby="pendings-tab" tabindex="0">
                      <div className="tickets-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" />
                              </th>
                              <th tabindex="0">Query ID</th>
                              <th tabindex="0">Client Name</th>
                              <th tabindex="0">Query Type</th>
                              <th tabindex="0">Ticket Status</th>
                              <th tabindex="0">Source</th>
                              <th tabindex="0">Sender Mobile</th>
                              <th tabindex="0">Sender Email</th>
                              <th tabindex="0"> Message/Comment</th>
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
                    {/* <!-- new tab --> */}
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
            {/* <!-- -------------- --> */}
          </div>
        </div>
      </div>

      {/* <!-- Assign Ticket Modal --> */}
      <Modal show={show} onHide={handleClose} id="assignTicketModal" tabindex="-1" aria-labelledby="assignTicketModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h1 className="modal-title fs-5 w-100 text-center" id="assignTicketModalLabel">Assign Ticket</h1>
              <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form action="#">
                <div className="row g-3">
                  <div className="col-6">
                    <label for="department" className="form-label">Choose Department</label>
                    <select name="department" className="form-select" id="department">
                      {/* Options for departments */}
                    </select>
                  </div>
                  <div className="col-6">
                    <label for="user" className="form-label">Choose User</label>
                    <select
                      id="inputTeam"
                      name="userId"
                      value={selectedUser}
                      onChange={handleSelectTeam}
                      className="form-select"
                    >
                      <option value="">Choose User</option>
                      {user.map(user => (
                        <option key={user.userId} value={user.userId}>{user.firstName} {user.lastName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label for="Role" className="form-label">Choose Role</label>
                    <select name="Role" className="form-select" id="Role">
                      {/* Options for roles */}
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer justify-content-center border-0">
              <button type="button" className="btn btn-secondary" onClick={handleClose} data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={sendPostRequest}>Save changes</button>
            </div>
          </div>
        </div>
      </Modal>

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

export default usersm