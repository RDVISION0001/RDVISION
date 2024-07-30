import React, { useState, useEffect } from 'react';
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import axiosInstance from '../axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Upload ticket state
  const [dataToSave, setDataToSave] = useState({
    csvStringData: "",
    countryIso: ""
  });

  // Fetch uploded csv file tickets
  const fetchTickets = async (params, page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/upload/allTicketsByStatus`, {
        params: { ...params, page }
      });
      setData(response.data.dtoList);
    } catch (error) {
      toast.error("Error fetching tickets.");
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    fetchTickets(params[tabName], 0);
  };

  // Upload ticket
  const handleCountryIso = (e) => setDataToSave({ ...dataToSave, [e.target.name]: e.target.value });
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
    if (dataToSave.csvStringData && dataToSave.countryIso) {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/upload/addCsvTicket", dataToSave);
        response.data === "CSV Tickets uploaded successfully" ? toast.info("Successfully uploaded") : toast.error("Something went wrong. Try again!");
      } catch (error) {
        toast.error("Error uploading data.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.info("Please check if file selected and country filled.");
    }
  };
  useEffect(() => {
    fetchTickets(params[activeTab], 0);
  }, [activeTab]);




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
                    <input type="text" className="form-control mx-3" style={{ flex: '0 0 20%' }} placeholder="Enter Country Iso" name="countryIso" value={dataToSave.countryIso} onChange={handleCountryIso} />
                    {loading ? <div className='w-25 btn ml-3 rounded'><div className='loader '></div></div> : <button className="btn btn-primary ml-3 rounded" style={{ flex: '0 0 25%' }} onClick={handleUploadDataToDB}>Upload Data</button>}
                  </div>
                </div>
              </div>
            </section>
            <section className="followup-table-section py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">All CSV File Uploded Tickets <span class="d-flex justify-content-end"><i class="fa fa-filter" aria-hidden="true"></i></span></h3>
                  <ul
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
                                  <td><span className="text">{item.senderCountryIso}</span></td>
                                  <td><span className="text">{item.firstName}</span></td>
                                  <td><span className="text">{item.mobileNumber}</span></td>
                                  <td><span className="text">{item.senderEmailAlt}</span></td>
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
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}


export default upload_tickets;