import React, { useState, useEffect } from 'react';
//components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal } from 'react-bootstrap';

function upload_tickets() {
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
  };

  // Data state
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("allTickets");
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [seletedUserType, setSelectedUserType] = useState(0)
  const [selectedUserOfSelectedUserType, setSelectedUserOfSelectedUserType] = useState(0)
  const [user, setUser] = useState([])

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSelectUserType = (e) => {
    setSelectedUserType(e.target.value)

  }

  //handl paggination
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  //selecting user type
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/user/dropdown', {
        params: { roleId: seletedUserType }
      });
      setUser(response.data.dtoList);
    };
    fetchData();
  }, [seletedUserType]);

  //selecting user of selected type
  const handleSelectUserOfSelectedUserType = (e) => {
    setSelectedUserOfSelectedUserType(e.target.value)

  }
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 9;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(currentPage - halfMaxPagesToShow, 0);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 0);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  // Upload ticket state
  const [dataToSave, setDataToSave] = useState({
    csvStringData: ""
  });

  // Fetch uploded csv file tickets
  const fetchTickets = async (params, page, perPage) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/upload/allTicketsByStatus', {
        params: { ...params, page, size: perPage }
      });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);

      // Update notification count based on totalElement
      if (params.ticketStatus === 'New') {
        const newCount = response.data.totalElement;
        if (newCount > newNotifications) {
          playNotificationSound();
        }
        setNewNotifications(newCount);
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false)
    }
    setLoading(false)
  };

  // Handle tab change
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    fetchTickets(params[tabName], 0);
  };

  // Upload ticket
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setDataToSave(prevState => ({ ...prevState, csvStringData: event.target.result }));
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast.error("Failed to read the file.");
      };
      reader.readAsText(file);
    } else {
      toast.error("No file selected.");
    }
  };

  const handleUploadDataToDB = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/upload/addCsvTicket", dataToSave);
      response.data === "CSV Tickets uploaded successfully" ? toast.info("Successfully uploaded") : toast.error("Something went wrong. Try again!");
    } catch (error) {
      toast.error("Error uploading data.");
    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    fetchTickets(params[activeTab], currentPage, itemsPerPage);
  }, [activeTab, itemsPerPage, currentPage]);

  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(0);
  };
  //hanlde select tickets
  const [selectedTickets, setSelectedTickets] = useState([]);
  const handleTicketSelect = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedTickets([...selectedTickets, id]);
    } else {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    }
  };
  // handling multiple selection
  const handleMultipleTicketSelection = (e) => {
    const checked = e.target.checked; // Use `checked` instead of `value` to determine if the checkbox is checked
    if (checked) {
      let newSelectedTickets = [...selectedTickets]; // Start with the current state
      for (let i = 0; i < data.length; i++) {
        newSelectedTickets.push(data[i].uniqueQueryId); // Add the new elements
      }
      setSelectedTickets(newSelectedTickets); // Update the state once with the new array
    } else {
      setSelectedTickets([]); // Reset to an empty array
    }
  };
  ///assign function

  const sendPostRequest = async () => {
    try {
      const payload = selectedTickets;
      const config = {
        headers: {
          // 'teamId': parseInt(selectedTeam)
        }
      };
      const url = `/upload/assignToUser/${selectedUserOfSelectedUserType}`;
      const response = await axiosInstance.post(url, payload, config);
      toast.success('Tickets assigned successfully!');
      handleClose();
      fetchTickets()
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign tickets.');
    }
  };

  //show modal to assign tickets
  const handleShow = () => {
    if (selectedTickets.length > 0) {
      setShow(true)
    } else {
      toast.info("Please select at least One Ticket")
    }
  }
  return (
    <>
      <ToastContainer />
      <div className="admin-page tickets-page">
        <Sidenav />
        <div className="my-container main-content-block2658 active-cont">
          <Topnav />
          <div className="container-fluid mt-3">
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <div className="heading-wrapper">
                    <h3 className="title">Upload Tickets File</h3>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <input type="file" accept=".csv" className="form-control mr-3" id="customFile" onChange={handleFileUpload} />
                    {loading ? <div className='w-25 btn rounded'><div className='loader '></div></div> : <button className="btn btn-primary ml-3 rounded" style={{ flex: '0 0 25%' }} onClick={handleUploadDataToDB}>Upload Data</button>}
                  </div>
                </div>
              </div>
            </section>
            <section className="data-table-bgs_02x24 py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <div className="heading-wrapper">
                    <h3 className="title">All Tickets</h3>
                    <Button onClick={handleShow} className="btn btn-assign" data-bs-toggle="modal" data-bs-target="#assignTicketModal" id="assignButton">Assign Ticket</Button>
                  </div>                  <ul
                    className="nav recent-transactions-tab-header nav-tabs"
                    id="followUp"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("allTickets")}
                        id="all-tkts-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#all-tkts-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="all-tkts-tab-pane"
                        aria-selected="true"
                      >
                        All Tickets
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "ongoing" ? "active" : ""}`}
                        onClick={() => handleRowClick("ongoing")}
                        id="old-tkts-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#old-tkts-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="old-tkts-tab-pane"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        Sale
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("newTickets")}
                        id="new-arrivals-tkts-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#new-arrivals-tkts-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="new-arrivals-tkts-tab-pane"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        {/* <span> {newNotifications} <i class="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i></span> */}
                        New Tickets
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "followUp" ? "active" : ""}`}
                        onClick={() => handleRowClick("followUp")}
                        id="new-arrivals-tkts-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#new-arrivals-tkts-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="new-arrivals-tkts-tab-pane"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        Follow-up
                      </button>
                    </li>
                  </ul>
                  <div
                    className="tab-content recent-transactions-tab-body"
                    id="followUpContent"
                  >
                    <div
                      className={`tab-pane fade ${activeTab === "allTickets" ? "show active" : ""}`}
                      id="all-tkts-tab-pane"
                      role="tabpanel"
                      aria-labelledby="all-transactions-tab"
                      tabindex="0"
                    >
                      <div className="followups-table table-responsive table-height">
                        <table className="table">
                          <thead className="sticky-header">
                            <tr>
                              <th className="selection-cell-header" data-row-selection="true">
                                <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                              </th>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Country</th>
                              <th tabindex="0">Customer Name</th>
                              <th tabindex="0">Customer Number</th>
                              <th tabindex="0">Customer Email</th>
                              <th tabindex="0">Status</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td className="selection-cell">
                                    <input
                                      type="checkbox"
                                      checked={selectedTickets.includes(item.uniqueQueryId)}
                                      onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                                    />
                                  </td>
                                  <td><span className="text">{item.uploadDate[2]}-{item.uploadDate[1]}-{item.uploadDate[0]}/{item.queryTime.split(".")[0]}</span></td>
                                  <td><span className="text">{item.senderCountryIso}</span></td>
                                  <td><span className="text">{item.firstName} {item.lastName}</span></td>
                                  <td><span className="text">{item.mobileNumber}</span></td>
                                  <td><span className="text">{item.email}</span></td>
                                  <td><span className="text">{item.ticketstatus}</span></td>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </a>
                                      <a
                                        href={`sms:${item.senderMobile}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <a
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href={`https://wa.me/${item.senderMobile}`}
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i></a>
                                    </span>
                                  </td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <p>Loading...</p>
                          )}
                        </table>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade ${activeTab === "ongoing" ? "show active" : ""}`}
                      // className="tab-pane fade"
                      id="new-arrivals-tkts-tab-pane"
                      role="tabpanel"
                      aria-labelledby="new-arrivals-tkts-tab"
                      tabindex="0"
                    >
                      <div className="followups-table table-responsive">
                        <table className="table">
                          <thead className="sticky-header">
                            <tr>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Country</th>
                              <th tabindex="0">Customer Name</th>
                              <th tabindex="0">Customer Number</th>
                              <th tabindex="0">Customer Email</th>
                              <th tabindex="0">Status</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>

                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  {/* <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td> */}
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>

                                  </td><span className="text">{item.senderMobile}</span></td>

                                  <td> <td>

                                  </td><span className="text">{item.senderEmail}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                    >
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </a>
                                      <a
                                        href={`sms:${item.senderMobile}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <a
                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href={`https://wa.me/${item.senderMobile}`}
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i></a>
                                    </span>
                                  </td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <p>Loading...</p>
                          )}
                        </table>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade ${activeTab === "newTickets" ? "show active" : ""}`}
                      // className="tab-pane fade"
                      id="new-arrivals-tkts-tab-pane"
                      role="tabpanel"
                      aria-labelledby="new-arrivals-tkts-tab"
                      tabindex="0"
                    >
                      <div className="followups-table table-responsive table-height">
                        <table className="table">
                          <thead className="sticky-header">
                            <tr>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Country</th>
                              <th tabindex="0">Customer Name</th>
                              <th tabindex="0">Customer Number</th>
                              <th tabindex="0">Customer Email</th>
                              <th tabindex="0">Status</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  {/* <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td> */}
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>
                                  </td><span className="text">{item.senderMobile}</span></td>

                                  <td> <td>
                                  </td><span className="text">{item.senderEmail}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                    >
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>

                                  <td>
                                    <span className="actions-wrapper">
                                      <a

                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </a>
                                      <a
                                        hhref={`sms:${item.senderMobile}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <a

                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href={`https://wa.me/${item.senderMobile}`}
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i></a>
                                    </span>
                                  </td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <p>Loading...</p>
                          )}
                        </table>
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade ${activeTab === "followUp" ? "show active" : ""}`}
                      // className="tab-pane fade"
                      id="new-arrivals-tkts-tab-pane"
                      role="tabpanel"
                      aria-labelledby="new-arrivals-tkts-tab"
                      tabindex="0"
                    >
                      <div className="followups-table table-responsive table-height">
                        <table className="table">
                          <thead className="sticky-header">
                            <tr>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Country</th>
                              <th tabindex="0">Customer Name</th>
                              <th tabindex="0">Customer Number</th>
                              <th tabindex="0">Customer Email</th>
                              <th tabindex="0">Status</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  {/* <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td> */}
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>

                                  </td><span className="text">{item.senderMobile}</span></td>

                                  <td> <td>

                                  </td><span className="text">{item.senderEmail}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                    >
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </a>
                                      <a
                                        hhref={`sms:${item.senderMobile}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <a

                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href={`https://wa.me/${item.senderMobile}`}
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i></a>
                                    </span>
                                  </td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <p>Loading...</p>
                          )}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pagination-controls">
                  <button className="next_prev" onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`next_prev ${page === currentPage ? 'active' : ''}`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button className="next_prev" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>

                  <span> Items per page:</span>{' '}
                  <select className="next_prev" value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(e.target.value)}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </section>
            <Modal show={show} onHide={handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Assign Tickets to Team</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <div className="form-group">
                    <label htmlFor="teamSelect">Select User Type</label>
                    <select className="form-control" id="teamSelect" onChange={handleSelectUserType} value={seletedUserType}>
                      <option value="">Choose...</option>
                      <option value="3">Captain</option>
                      <option value="4">Closer</option>
                      <option value="5">Senior SuperVisor</option>

                    </select>
                    <label htmlFor="teamSelect">Select Team</label>
                    <select className="form-control" id="teamSelect" onChange={handleSelectUserOfSelectedUserType} value={selectedUserOfSelectedUserType}>
                      <option value="">Choose...</option>
                      {user.map((t) => (
                        <option key={t.userId} value={t.userId}>{t.firstName + " " + t.lastName}</option>
                      ))}
                    </select>
                  </div>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={sendPostRequest}>
                  Assign Tickets
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}


export default upload_tickets;