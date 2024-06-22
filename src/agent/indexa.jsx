import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';

////copmponents////
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';

////auth
import { useAuth } from '../auth/AuthContext';

////highchart///
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = {

  chart: {
    type: 'column'
  },
  title: false,
  credits: {
    text: "ram",
    href: "",
  },

  xAxis: {
    categories: ['A', 'B', 'C', 'D', 'E', '5'],
    crosshair: true,
    accessibility: {
      description: 'Countries'
    }
  },

  yAxis: {
    min: 0,
    title: {
      text: 'Values'
    }
  },

  tooltip: {
    valueSuffix: ' (1000 MT)'
  },

  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0
    }
  },

  series: [
    {
      name: 'Approach',
      data: [406292, 260000, 107000, 68300, 27500, 14500]
    },
    {
      name: 'Sale',
      data: [51086, 136000, 5500, 141000, 107180, 77000]
    }
  ]

};

function indexa() {

  const { userId } = useAuth();


  //////form data
  const [formData, setFormData] = useState({ ticketStatus: '', comment: '' });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [uniqueQueryId, setUniqueQueryId] = useState(null); // Ensure uniqueQueryId is defined


  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!uniqueQueryId) {
  //     setError("Unique Query ID is not defined");
  //     return;
  //   }
  //   try {
  //     const res = await axiosInstance.post(`/third_party_api/ticket/updateTicketResponse/${uniqueQueryId}`, formData);
  //     setResponse(res.data.dtoList);
  //     handleClose();
  //     setError(null); 
  //   } catch (err) {
  //     setError(err.message); 
  //     setResponse(null); 
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueQueryId) {
      setError("Unique Query ID is not defined");
      return;
    }
    try {
      const params = {
        ticketStatus: formData.ticketStatus,
        comment: formData.comment,
      };
      const res = await axiosInstance.post(`/third_party_api/ticket/updateTicketResponse/${uniqueQueryId}`, {}, { params });
      setResponse(res.data.dtoList);
      toast.success('Update successfully!');
      handleClose();
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };


  ////action modal //
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (queryId) => {
    setUniqueQueryId(queryId);
    setShow(true);
  };


  ////actipn modal active //
  const [activeTab, setActiveTab] = useState("allTickets");

  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Define parameters for each tab
  const params = {
    allTickets: { userId },
    ongoing: { userId, ticketStatus: 'Sale' },
    newTickets: { userId, ticketStatus: 'New' },
    followUp: { userId, ticketStatus: 'follow' },

  };

  const [data, setData] = useState(null);


  // Function to make the API call
  const fetchData = async (params) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', { params });
      setData(response.data.dtoList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to fetch data whenever the activeTab changes
  useEffect(() => {
    fetchData(params[activeTab]);
  }, [activeTab]);



  return (
    <>
      <div className="superadmin-page">
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
                <div className="row">
                  <div className="col-md-3">
                    <div className="card">
                      <div className="div-top">
                        <h3 className="title">Total Sales</h3>
                        <span className="sales"
                        >$3,181 <span className="indicators">+55%</span></span
                        >
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
                        <span className="sales"
                        >$3,181 <span className="indicators">+55%</span></span
                        >
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
                        <span className="sales"
                        >$3,181 <span className="indicators">+55%</span></span
                        >
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
                        <span className="sales"
                        >$3,181 <span className="indicators">+55%</span></span
                        >
                      </div>
                      <div className="icon-wrapper">
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- graphs and ranking --> */}
            <section className="map-and-rankings">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-8">
                    <div className="graph-wrapper">
                      <h3 className="title">Weekly Report</h3>
                      <div
                        id="map-container"
                        className="highchart-wrapper"
                      // style="width: 100%; height: 100%; min-height: 555px"
                      ></div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="rank-card top-rankers">
                      <h3 className="heading">Best Selling Teams</h3>
                      <div className="table-wrapper">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img
                                    src="../img/profiles/profile1.png"
                                    alt="profile"
                                    className="img-fluid"
                                  />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img
                                    src="../img/profiles/profile1.png"
                                    alt="profile"
                                    className="img-fluid"
                                  />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img
                                    src="../img/profiles/profile1.png"
                                    alt="profile"
                                    className="img-fluid"
                                  />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* <!-- best departments --> */}
                    <div className="rank-card top-rankers">
                      <h3 className="heading">Best Selling Department</h3>
                      <div className="table-wrapper">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img
                                    src="../img/profiles/profile1.png"
                                    alt="profile"
                                    className="img-fluid"
                                  />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img
                                    src="../img/profiles/profile1.png"
                                    alt="profile"
                                    className="img-fluid"
                                  />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img
                                    src="../img/profiles/profile1.png"
                                    alt="profile"
                                    className="img-fluid"
                                  />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* <!-- Tabbed Ticket Table --> */}
            <section className="followup-table-section py-3">
              <div className="container-fluid">
                <div className="table-wrapper tabbed-table">
                  <h3 className="title">All Tickets (Agent)</h3>
                  <ul
                    className="nav recent-transactions-tab-header nav-tabs"
                    id="followUp"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "allTickets" ? "active" : ""}`}
                        onClick={() => setActiveTab("allTickets")}
                        // className="nav-link active"
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
                        onClick={() => setActiveTab("ongoing")}
                        // className="nav-link"
                        id="old-tkts-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#old-tkts-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="old-tkts-tab-pane"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        Ongoing
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                        onClick={() => setActiveTab("newTickets")}
                        // className="nav-link"
                        id="new-arrivals-tkts-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#new-arrivals-tkts-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="new-arrivals-tkts-tab-pane"
                        aria-selected="false"
                        tabindex="-1"
                      >
                        New Tickets
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "followUp" ? "active" : ""}`}
                        onClick={() => setActiveTab("followUp")}
                        // className="nav-link"
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
                      // className="tab-pane fade show active"
                      id="all-tkts-tab-pane"
                      role="tabpanel"
                      aria-labelledby="all-transactions-tab"
                      tabindex="0"
                    >
                      <div className="followups-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Costomer Name</th>
                              <th tabindex="0">Costomer Number</th>
                              <th tabindex="0">Query ID</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td><span className="text">{item.senderMobile}</span></td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                  <td><span className="comment">{item.queryMessage}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={() => handleShow(item.uniqueQueryId)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action other"
                                        title="Write Status"
                                      >
                                        <i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i></a>
                                      <a
                                        href="sms:+150000000?body=Share%20this%20message%20on%20sms"
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <a
                                        href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i></a>
                                      <a
                                        href="https://wa.me/9795189922?text=Hi%20I'm%20Interested%20to%20connect%20with%20you%20for%20my%20project"
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i></a>
                                    </span>
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
                          <thead>
                            <tr>
                              <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Costomer Name</th>
                              <th tabindex="0">Costomer Number</th>
                              <th tabindex="0">Query ID</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td><span className="text">{item.senderMobile}</span></td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                  <td><span className="comment">{item.queryMessage}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={() => handleShow(item.uniqueQueryId)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action other"
                                        title="Write Status"
                                      >
                                        <i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i
                                      ></a>
                                      <a
                                        href="sms:+150000000?body=Share%20this%20message%20on%20sms"
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i
                                      ></a>
                                      <a
                                        href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href="https://wa.me/9795189922?text=Hi%20I'm%20Interested%20to%20connect%20with%20you%20for%20my%20project"
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i
                                      ></a>
                                    </span>
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
                      <div className="followups-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                            <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Costomer Name</th>
                              <th tabindex="0">Costomer Number</th>
                              <th tabindex="0">Query ID</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>           
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td><span className="text">{item.senderMobile}</span></td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                  <td><span className="comment">{item.queryMessage}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={() => handleShow(item.uniqueQueryId)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action other"
                                        title="Write Status"
                                      >
                                        <i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i
                                      ></a>
                                      <a
                                        href="sms:+150000000?body=Share%20this%20message%20on%20sms"
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i
                                      ></a>
                                      <a
                                        href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href="https://wa.me/9795189922?text=Hi%20I'm%20Interested%20to%20connect%20with%20you%20for%20my%20project"
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i
                                      ></a>
                                    </span>
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
                      <div className="followups-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                            <th tabindex="0">Date/Time</th>
                              <th tabindex="0">Costomer Name</th>
                              <th tabindex="0">Costomer Number</th>
                              <th tabindex="0">Query ID</th>
                              <th tabindex="0">Requirement</th>
                              <th tabindex="0">Action</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td><span className="text">{item.senderMobile}</span></td>
                                  <td className="ticket-id">
                                    <i className="fa-solid fa-ticket"></i>{item.uniqueQueryId}
                                  </td>
                                  <td><span className="comment">{item.queryMessage}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={() => handleShow(item.uniqueQueryId)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action other"
                                        title="Write Status"
                                      >
                                        <i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i
                                      ></a>
                                      <a
                                        href="sms:+150000000?body=Share%20this%20message%20on%20sms"
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i
                                      ></a>
                                      <a
                                        href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></a>
                                      <a
                                        href="https://wa.me/9795189922?text=Hi%20I'm%20Interested%20to%20connect%20with%20you%20for%20my%20project"
                                        className="btn-action whatsapp"
                                        title="Get connect on whatsapp"
                                      ><i className="fa-brands fa-whatsapp"></i
                                      ></a>
                                    </span>
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
            {/* <!-- -------------- -->

            <!-- ------------------------------------------------------------
            --------------------- Followup Ticket Modal ---------------------
          -------------------------------------------------------------- --> */}
            <Modal show={show} onHide={handleClose}
              class="modal assign-ticket-modal fade"
              id="followUpModal"
              tabindex="-1"
              aria-labelledby="followUpModalLabel"
              aria-hidden="true">
              <Modal.Header closeButton>
                <h1
                  class="modal-title fs-5 w-100 text-center"
                  id="followUpModalLabel"
                >
                  Call Status
                </h1>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      type="text"
                      className="form-select"
                      id="status"
                      name="ticketStatus"
                      value={formData.ticketStatus}
                      onChange={handleChange}
                    >
                      <option >Choose Call-Status</option>
                      <option value="Sale">Sale</option>
                      <option value="New">New</option>
                      <option value="Follow">Follow</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label for="Comment" class="form-label">Comment</label>
                    <textarea
                      rows="4"
                      class="form-control"
                      placeholder="Call Status in words"
                      className="form-control"
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <div class="modal-footer justify-content-center border-0">

                    <button type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={handleClose}>
                      Close
                    </button>
                    <button class="btn btn-primary" type="submit">
                      Save Changes
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          </div>
        </div >
      </div >

      {/* <!-- Modal --> */}
      < div
        className="modal ticket-modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <div className="heading-area">
                    <div className="vertical-write">
                      <h2 className="title">Jenell D. Matney</h2>
                      <p className="ticket-id">
                        <i className="fa-solid fa-ticket"></i> TKTID:MEDEQ089N
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-8">
                  <div className="main-content-area">
                    <div className="contact-info-row">
                      <a href="" className="contact-info phone"
                      ><i className="fa-solid fa-phone"></i> +91 9918293747</a
                      >
                      <a className="contact-info email" href="#"
                      ><i className="fa-solid fa-envelope-open-text"></i>
                        example@email.com</a
                      >
                    </div>
                    <div className="button-grp">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button type="button" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default indexa