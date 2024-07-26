import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';


// Components
import Topnav from '../components/topnav';
import Sidenav from '../components/sidenav';
import Worktime from '../components/worktime';


// Authentication context
import { useAuth } from '../auth/AuthContext';

// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Clipboard copy
import { CopyToClipboard } from 'react-copy-to-clipboard';


////highchart///
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const options = {

  chart: {
    type: 'column'
  },
  title: false,
  credits: {
    text: "CEO: Digvijay Singh",
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

function indexss() {
  const { userId } = useAuth();

  // Clipboard copy
  const [copied, setCopied] = useState(false);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form data state
  const [formData, setFormData] = useState({ ticketStatus: '', comment: '' });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [uniqueQueryId, setUniqueQueryId] = useState(null);

  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (queryId) => {
    setUniqueQueryId(queryId);
    setShow(true);
  };

  // Modal state for send price and subscription mail
  const [on, setOn] = useState(false);
  const handleOff = () => setOn(false);
  const handleOn = (queryId) => {
    setUniqueQueryId(queryId);
    setOn(true);
  };

  // Modal for ticket popup
  const [view, setView] = useState(false);
  const handleCloses = () => setView(false);
  const handleView = (queryId) => {
    setUniqueQueryId(queryId);
    setView(true);
  };

  // Active tab state
  const [activeTab, setActiveTab] = useState("allTickets");

  // Define parameters for each tab
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
    followUp: { ticketStatus: 'follow' },
  };

  // Data state
  const [data, setData] = useState(null);

  // Fetch data function
  const fetchData = async (params, page, perPage) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
        params: { ...params, page, size: perPage }
      });
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Masking mobile number
  const maskMobileNumber = (number) => {
    if (number.length < 4) return number;
    return number.slice(0, -4) + 'XXXX';
  };

  // Masking email
  const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
    return `${maskedUser}@${domain}`;
  };

  // Ticket status color
  const getColorByStatus = (ticketStatus) => {
    const colors = {
      'New': 'dodgerblue',
      'Sale': 'green',
      'Follow': 'blue',
      'Interested': 'orange',
      'Not_Interested': 'red',
      'Wrong_Number': 'gray'
    };
    return colors[ticketStatus] || 'white';
  };

  //follow up date and time option
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);

  const handleStatusChange = (event) => {
    handleChange(event);
    if (event.target.value === "Follow") {
      setShowFollowUpDate(true);
    } else {
      setShowFollowUpDate(false);
    }
  };

  //country flage
  const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;


  // useEffect to fetch data whenever the activeTab, currentPage, or itemsPerPage changes
  useEffect(() => {
    fetchData(params[activeTab], currentPage, itemsPerPage);
  }, [activeTab, currentPage, itemsPerPage]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueQueryId) {
      setError('Unique Query ID is not defined');
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
      fetchData()
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };
  //Short Method
  const [shortValue, setShortValue] = useState("")
  const handleShortDataValue = (e) => {
      setShortValue(e.target.value)
  }
  // Handle clicking on tab rows
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchData(params[tabName], 0, itemsPerPage);
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to set items per page
  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(0);
  };

  // Function to generate page numbers
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
                        <h3 className="title">Total Tickets</h3>
                        <span className="sales"
                        >0<span className="indicators">0%</span></span
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
                        <h3 className="title">In negotation</h3>
                        <span className="sales"
                        >0<span className="indicators">0%</span></span
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
                        >0<span className="indicators">0%</span></span
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
                        <h3 className="title">Projected Sales</h3>
                        <span className="sales"
                        >0<span className="indicators">0%</span></span
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
            {/* <!-- user-profile --> */}
            <Worktime />
            {/* <!-- graphs and ranking --> */}
            <section className="map-and-rankings">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-8">
                    <div className="graph-wrapper">
                      <h3 className="title">Weekly Report</h3>
                      {/* <div id="map-container" className="highchart-wrapper" style="width: 100%; height: 100%; min-height: 555px"></div> */}
                      <div id="map-container" className="highchart-wrapper" style={{ width: "180px", height: "180px" }} ></div>
                      <div>
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={options}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="rank-card top-rankers">
                      <h3 className="heading"> Best Selling Teams</h3>
                      <div className="table-wrapper">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
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
                                  <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
                                </div>
                              </td>
                              <td>Flotsam</td>
                              <td>40k+ sales</td>
                              <td>$1.4m revenue</td>
                            </tr>
                            <tr>
                              <td>
                                <div className="profile-wrapper">
                                  <img src="../assets/img/profiles/profile1.png" alt="profile" className="img-fluid" />
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
            <section className="filter-section">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="search-wrapper">
                                            <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search Department or Name..." value={shortValue} onChange={handleShortDataValue}/>
                                            <div className="search-icon">
                                                <i className="fa-solid fa-magnifying-glass"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="filter-wrapper d-flex gap-3">
                                            {/* Filters here */}
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
                        onClick={() => handleRowClick("allTickets")}
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
                        onClick={() => handleRowClick("ongoing")}
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
                        Sale
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "newTickets" ? "active" : ""}`}
                        onClick={() => handleRowClick("newTickets")}
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
                        onClick={() => handleRowClick("followUp")}
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
                              <th tabindex="0">Product Name</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.filter(
                                (item) =>
                                  item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                              ).map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderMobile}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskMobileNumber(item.senderMobile)}</span></td>

                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderEmail}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskEmail(item.senderEmail)}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                      style={{ backgroundColor: getColorByStatus(item.ticketstatus) }}>
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td><span className="text">{item.queryProductName}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={handleView}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        href={`sms:${item.mobileNumber}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <Button
                                        onClick={handleOn}
                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></Button>
                                      <a
                                        href={`https://wa.me/${item.mobileNumber}`}
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
                              <th tabindex="0">Product Name</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>

                              {data.filter(
                                (item) =>
                                  item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                              ).map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderMobile}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskMobileNumber(item.senderMobile)}</span></td>

                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderEmail}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskEmail(item.senderEmail)}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                      style={{ backgroundColor: getColorByStatus(item.ticketstatus) }}>
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td><span className="text">{item.queryProductName}</span></td>

                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={handleView}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        href={`sms:${item.mobileNumber}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <Button
                                        onClick={handleOn}
                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></Button>
                                      <a
                                        href={`https://wa.me/${item.mobileNumber}`}
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
                              <th tabindex="0">Product Name</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.filter(
                                (item) =>
                                  item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                              ).map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderMobile}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskMobileNumber(item.senderMobile)}</span></td>

                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderEmail}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskEmail(item.senderEmail)}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                      style={{ backgroundColor: getColorByStatus(item.ticketstatus) }}>
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td><span className="text">{item.queryProductName}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={handleView}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        hhref={`sms:${item.mobileNumber}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <Button
                                        onClick={handleOn}
                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></Button>
                                      <a
                                        href={`https://wa.me/${item.mobileNumber}`}
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
                              <th tabindex="0">Product Name</th>
                              <th tabindex="0">Action</th>
                              <th tabindex="0">Ticket ID</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data.filter(
                                (item) =>
                                  item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                                  item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                              ).map((item, index) => (
                                <tr key={index}>
                                  <td><span className="text">{item.queryTime}</span></td>
                                  <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td>
                                  <td><span className="text">{item.senderName}</span></td>
                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderMobile}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskMobileNumber(item.senderMobile)}</span></td>

                                  <td> <td>
                                    <CopyToClipboard
                                      text={item.senderEmail}
                                      onCopy={() => setCopied(true)}
                                    >
                                      <button>Copy</button>
                                    </CopyToClipboard>
                                  </td><span className="text">{maskEmail(item.senderEmail)}</span></td>

                                  <div className="dropdown" onClick={() => handleShow(item.uniqueQueryId)} >
                                    <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                      style={{ backgroundColor: getColorByStatus(item.ticketstatus) }}>
                                      {item.ticketstatus}
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                      <li><a className="dropdown-item danger" >Action</a></li>
                                      <li><a className="dropdown-item" >Another action</a></li>
                                      <li><a className="dropdown-item" >Something else here</a></li>
                                    </ul>
                                  </div>

                                  <td><span className="comment">{item.subject}<br /></span></td>
                                  <td><span className="text">{item.queryProductName}</span></td>
                                  <td>
                                    <span className="actions-wrapper">
                                      <Button
                                        onClick={handleView}
                                        data-bs-toggle="modal"
                                        data-bs-target="#followUpModal"
                                        className="btn-action call"
                                        title="Get connect on call"
                                      ><i className="fa-solid fa-phone"></i>
                                      </Button>
                                      <a
                                        hhref={`sms:${item.mobileNumber}`}
                                        className="btn-action message"
                                        title="Get connect on message"
                                      ><i className="fa-solid fa-message"></i></a>
                                      <Button
                                        onClick={handleOn}
                                        // href="mailto:someone@example.com"
                                        className="btn-action email"
                                        title="Get connect on email"
                                      ><i className="fa-solid fa-envelope"></i
                                      ></Button>
                                      <a
                                        href={`https://wa.me/${item.mobileNumber}`}
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
            {/* <!-- -------------- -->

            <!-- ------------------------------------------------------------
            --------------------- Call Status Ticket Modal ---------------------
          -------------------------------------------------------------- --> */}
            <Modal show={show} onHide={handleClose} className="modal assign-ticket-modal fade" id="followUpModal" tabIndex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
              <Modal.Header closeButton>
                <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
                  Call Status
                </h1>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="ticketStatus"
                      value={formData.ticketStatus}
                      onChange={handleStatusChange}
                    >
                      <option>Choose Call-Status</option>
                      <option value="Sale">Sale</option>
                      <option value="New">New</option>
                      <option value="Follow">Follow</option>
                      <option value="Interested">Interested</option>
                      <option value="Not_Interested">Not Interested</option>
                      <option value="Wrong_Number">Wrong Number</option>
                      <option value="Place_with_other">Place with other</option>
                      <option value="Call_Back">Call Back</option>
                    </select>
                  </div>
                  {showFollowUpDate && (
                    <div className="mb-3">
                      <label htmlFor="followUpDateTime" className="form-label">Follow Up Date and Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="followUpDateTime"
                        name="followUpDateTime"
                        value={formData.followUpDateTime}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  <div className="col-12">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Call Status in words"
                      id="comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <div className="modal-footer justify-content-center border-0">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                      Close
                    </button>
                    <button className="btn btn-primary" type="submit">
                      Save Changes
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

            {/* <!-- -------------- -->
            <!-- ------------------------------------------------------------
            --------------------- seed price and mail Modal ---------------------
          -------------------------------------------------------------- --> */}

            <Modal show={on} onHide={handleOff}
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
                <form >
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      type="text"
                      className="form-select"
                      id="status"
                      name="ticketStatus"
                    >
                      <option >Select Options</option>
                      <option value="Sale">Send Price List</option>
                      <option value="New">Send Subscription Mail</option>
                    </select>
                  </div>
                  <div class="modal-footer justify-content-center border-0">
                    <button type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={handleOff}>
                      Close
                    </button>
                    <button class="btn btn-primary" type="submit">
                      Send
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

          </div>
        </div >
      </div >

      {/* <!-- Modal ticket popup --> */}
      < Modal
        show={view} onHide={handleCloses}
        className="modal ticket-modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="ticket-content-spacing">
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
                    <form>
                      <div className="mb-3">
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked />
                          <label class="form-check-label" for="flexSwitchCheckChecked">Checked switch checkbox input</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="comment" className="form-label">Comment</label>
                        <textarea
                          rows="4"
                          className="form-control"
                          placeholder="Call Status in words"
                          id="comment"
                          name="comment"
                        ></textarea>
                      </div>
                      <div className="modal-footer justify-content-center border-0">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloses}>
                          Close
                        </button>
                        <button className="btn btn-primary" type="submit">
                          Save Changes
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default indexss