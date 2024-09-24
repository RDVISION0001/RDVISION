import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import R2ZWYCP from '../assets/notification/R2ZWYCP.mp3'

// Authentication context
import { useAuth } from '../auth/AuthContext';

// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Clipboard copy
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TicketJourney from '../components/TicketJourney';

import InvoiceBox from '../components/InvoiceBox';


function live_tickets() {
  const { userId } = useAuth();

  // Clipboard copy
  const [copied, setCopied] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState([]);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form data state
  const [formData, setFormData] = useState({ ticketStatus: '', comment: '', followUpDateTime: '' });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [uniqueQueryId, setUniqueQueryId] = useState(null);

  // Modal state
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState({ id: "", name: "", email: "", mobile: "" });
  const [productsList, setProductsList] = useState([]);
  const [on, setOn] = useState(false);
  const [senderNameForEmail, setSenderNameForEmail] = useState("");
  const [senderEmailFormail, setSenderEmailForMail] = useState("");
  const [senderMobile, setSenderMobile] = useState("");
  const [view, setView] = useState(false);
  const [activeTab, setActiveTab] = useState("newTickets");
  const [data, setData] = useState(null);
  const [newNotifications, setNewNotifications] = useState(0);
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);
  const [showSaleTransaction, setShowTransaction] = useState(false);
  const [callId, setCallId] = useState(0)
  const [selectTicketForInvoice, setSelectTicketForInvoice] = useState(null)
  const [selectNameForInvoice, setSelectNameForInvoice] = useState(null)
  const [selectMobileForInvoice, setSelectMobileForInvoice] = useState(null)
  const [selectEmailForInvoice, setSelectEmailForInvoice] = useState(null)
  const [filterdate, setFilterDate] = useState(null)

  const [countryFilter, setCountryFilter] = useState(null)
  const [productArray, setProductArray] = useState([]);
  const [emailData, setEmailData] = useState({
    ticketId: "",
    name: "",
    email: "",
    mobile: "",
    productList: []
  });


  // Define parameters for each tab
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: 'Sale' },
    newTickets: { ticketStatus: 'New' },
    // followUp: { ticketStatus: 'follow' },
    followUp: {},
  };

  const handleClose = () => setShow(false);
  const handleShow = (queryId) => {
    setUniqueQueryId(queryId);
    setShow(true);
  };

  const handleOff = () => {
    setOn(false)
    setProductArray([])
  };
  const handleOn = (queryId, senderName, email, mobile, product) => {
    setUniqueQueryId(queryId);
    setSenderNameForEmail(senderName);
    setSenderEmailForMail(email);
    setSenderMobile(mobile);
    setProductArray(prevArray => [...prevArray, product]);
    setOn(true);
  };

  const handleCloses = () => setView(false);
  const handleView = (queryId) => {
    setUniqueQueryId(queryId);
    setView(true);
  };
  const [isInvoiceOn, setIsInvoiceOn] = useState(false)
  const handleInvoice = (ticketId, name, email, mobile) => {
    setSelectTicketForInvoice(ticketId)
    setSelectNameForInvoice(name)
    setSelectEmailForInvoice(email)
    setSelectMobileForInvoice(mobile)
    setIsInvoiceOn(!isInvoiceOn)
  }

  const fetchData = async (params, page, perPage) => {
    try {
      const response = await axiosInstance.get('/third_party_api/ticket/ticketByStatus', {
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  //filter tickets base on country
  const filterTickets = (tickets) => {
    const allowedCountries = ['US', 'UK', 'AU']; // ISO country codes for US, UK, and Australia
    const filtered = tickets.filter(ticket => allowedCountries.includes(ticket.senderCountryIso));
    setFilteredTickets(filtered);
  };

  const playNotificationSound = () => {
    const audio = new Audio(R2ZWYCP);
    audio.play();
  };

  //Short Method
  const [shortValue, setShortValue] = useState("")
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value)
  }

  //websocket for notification
  useEffect(() => {
    const socket = new SockJS('https://rdvision.online/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log("Message string is " < str);

      },
      onConnect: () => {
        stompClient.subscribe('/topic/third_party_api/ticket/', (message) => {
          const newProduct = JSON.parse(message.body);
          playNotificationSound()
          setData((prevProducts) => [newProduct, ...prevProducts]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);


  //click to call
  const handleClick = async (number) => {
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/clickToCall', {
        number: number.replace(/[+-]/g, ""),
        userId
      });
      setCallId(response.data.call_id)
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  // Masking mobile number
  const maskMobileNumber = (number) => {
    if (number.length < 4) return number;
    return number.slice(0, -4) + 'XXXX';
  };

  const fetchProducts = async () => {
    const response = await axiosInstance.get("product/getAllProducts");
    setProductsList(response.data.dtoList);
  };

  const handleSelectProduct = (e) => {
    const selectedProduct = e.target.value;

    if (productArray.includes(selectedProduct)) {
      toast.error("Product is already Added");
    } else {
      setProductArray(prevArray => {
        const updatedArray = [...prevArray, selectedProduct];
        setEmailData(prevEmailData => ({
          ...prevEmailData,
          name: senderNameForEmail,
          email: senderEmailFormail,
          ticketId: uniqueQueryId,
          mobile: senderMobile,
          productList: updatedArray
        }));
        return updatedArray;
      });
      toast.success("Product added");
    }
  };

  const fetchDataForEmail = async () => {
    const url = 'email/sendmail';
    const data = {
      name: senderNameForEmail,
      email: senderEmailFormail,
      ticketId: uniqueQueryId,
      mobile: senderMobile,
      productList: productArray
    };

    try {
      const response = await axiosInstance.post(url, data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const maskEmail = (email) => {
    const [user, domain] = email.split('@');
    const maskedUser = user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
    return `${maskedUser}@${domain}`;
  };

  const getColorByStatus = (ticketStatus) => {
    const colors = {
      'New': 'dodgerblue',
      'Sale': 'green',
      'Follow': 'RoyalBlue',
      'Interested': 'orange',
      'Not_Interested': 'red',
      'Wrong_Number': 'gray',
      'Not_Pickup': 'lightblue'
    };
    return colors[ticketStatus] || 'white';
  };

  // Update handleStatusChange function
  const handleStatusChange = (event) => {
    handleChange(event);
    const { value } = event.target;

    // Show folloeupdatetime input when 'Follow' is selected
    if (value === "Follow") {
      setShowFollowUpDate(true);
    } else {
      setShowFollowUpDate(false);
    }

    // Show transaction details input when 'Sale' is selected
    if (value === "Sale") {
      setShowTransaction(true);
    } else {
      setShowTransaction(false);
    }
  };

  const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  useEffect(() => {
    fetchData(params[activeTab], currentPage, itemsPerPage);
  }, [activeTab, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueQueryId) {
      setError('Unique Query ID is not defined');
      return;
    }
    try {
      const params = {
        userId,
        ticketStatus: formData.ticketStatus,
        comment: formData.comment,
        followUpDateTime: formData.followUpDateTime,
        call_id: callId
      };
      const res = await axiosInstance.post(`/third_party_api/ticket/updateTicketResponse/${uniqueQueryId}`, {}, { params });
      setResponse(res.data.dtoList);
      toast.success('Update successfully!');
      handleClose();
      fetchData(params[activeTab], currentPage, itemsPerPage);
      setError(null);
      setCallId(0)
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchData(params[tabName], 0, itemsPerPage);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(0);
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

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await fetchDataForEmail();
      handleOff()
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error("Error sending email");
    }
  };

  //ticket journey
  const [selctedTicketInfo, setSelectedTicketInfo] = useState("")
  const openTicketJourney = (ticketId) => {
    setSelectedTicketInfo(ticketId)
    document.getElementById("ticketjourney").showModal()
  }
  const closeTicketJourney = () => {
    document.getElementById("ticketjourney").close()
  }

  const [followUpStatus, setFollowupStatus] = useState("Follow")
  function formatFollowUpDate(followUpDateTime) {
    // If it's already in the "2024-08-10T13:14" format, return it as is
    return followUpDateTime.split('T')[0]; // Extracts just the date portion (YYYY-MM-DD)

  }

  console.log(countryFilter)

  return (
    <>

      {/* //Filter input */}
      <section className="filter-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5">
              <div className="search-wrapper">
                <input type="text" name="search-user" id="searchUsers" className="form-control" placeholder="Search by Name ,Email, Mobile" value={shortValue} onChange={handleShortDataValue} />
                <div className="search-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
            </div>
            {
              activeTab === "followUp" && <div className="col-md-5">
                <div className="search-wrapper d-flex justify-content-center align-items-center">
                  <input type="date" name="filterdate" className="form-control" placeholder="Search Department or Name..." value={filterdate} onChange={(e) => setFilterDate(e.target.value)} />
                  <div className="search-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>

                  </div>
                  <i
                    className="fa-solid fa-filter-circle-xmark fa-xl ms-2 hover-scale"
                    onClick={() => setFilterDate(null)}
                  ></i>

                </div>

              </div>
            }

          </div>
        </div>
      </section>
      {/* <!-- Tabbed Ticket Table --> */}
      <section className="followup-table-section py-3">
        <div className="container-fluid">
          <div className="table-wrapper tabbed-table">
            <h3 className="title">Live Tickets<span className="d-flex justify-content-end"></span></h3>
            <ul
              className="nav recent-transactions-tab-header nav-tabs"
              id="followUp"
              role="tablist"
            >

              <li className="nav-item d-flex justify-content-between w-100" role="presentation">
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
                  {/* <span> {newNotifications} <i className="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i></span> */}
                  <i className="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i>
                  New Tickets
                </button>
                <div class="input-group mb-3 w-50">
                  <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="form-select" id="inputGroupSelect02">
                    <option value="">All</option>
                    <option value="US">US</option>
                    <option value="AU">AU</option>
                    <option value="UK">UK</option>
                  </select>

                  <label class="input-group-text" for="inputGroupSelect02">Select Country</label>
                </div>
              </li>


            </ul>
            {activeTab === "followUp" ? <div className='d-flex justify-content-center'>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Call_Back" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Call_Back")}>Call Back</div>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Follow" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Follow")}>Follow up</div>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Interested" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Interested")}>Interested</div>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Not_Interested" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Not_Interested")}>Not Interested</div>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Wrong_Number" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Wrong_Number")}>Wrong Number</div>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Place_with_other" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Place_with_other")}>Place with other</div>
              <div className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Not_Pickup" ? "bg-danger" : "bg-primary"} `} style={{ cursor: "Pointer" }} onClick={() => setFollowupStatus("Not_Pickup")}>Not Pickup</div>
            </div> : ""}
            <div
              className="tab-content recent-transactions-tab-body"
              id="followUpContent"
            >
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
                        {data.filter(
                          (item) =>
                            item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()) ||
                            item.senderEmail.toLowerCase().includes(shortValue.toLowerCase()) ||
                            item.senderName.toLowerCase().includes(shortValue.toLowerCase())
                        ).filter((item) => !countryFilter || item.senderCountryIso === countryFilter).map((item, index) => (
                          <tr key={index}>
                            <td><span className="text">{item.queryTime}</span></td>
                            <td><img src={getFlagUrl(item.senderCountryIso === "UK" ? "gb" : item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td>
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

                            <td>
                              <span className="actions-wrapper">
                                <Button
                                  onClick={() => handleClick(item.senderMobile)}
                                  // onClick={handleView}
                                  data-bs-toggle="modal"
                                  data-bs-target="#followUpModal"
                                  className="btn-action call"
                                  title="Get connect on call"
                                ><i className="fa-solid fa-phone"></i>
                                </Button>
                                <a
                                  href={`sms:${item.senderMobile}?&body=${`Hey ${item.senderName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`}`}
                                  className="btn-action message"
                                  title="Get connect on message"
                                ><i className="fa-solid fa-message"></i></a>
                                <Button
                                  onClick={() => handleOn(item.uniqueQueryId, item.senderName, item.senderEmail, item.senderMobile, item.queryProductName)}
                                  // href="mailto:someone@example.com"
                                  className="btn-action email"
                                  title="Get connect on email"
                                ><i className="fa-solid fa-envelope"></i
                                ></Button>
                                <a href={`https://wa.me/${item.senderMobile.split("-")[1]}?text=${`Hey ${item.senderName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`}`}
                                  target='_blank'
                                  className="btn-action whatsapp"
                                  title="Get connect on whatsapp"
                                ><i className="fa-brands fa-whatsapp"></i></a>
                                <Button
                                  onClick={() => handleInvoice(item.uniqueQueryId)}
                                  className="rounded-circle "
                                  title="Get connect on"
                                >
                                  <i className="fa-solid fa-file-invoice"></i>
                                </Button>
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
              <option value="1000">1000</option>
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
                {/* <option value="New">New</option> */}
                <option value="Follow">Follow-up</option>
                <option value="Interested">Interested</option>
                <option value="Not_Interested">Not Interested</option>
                <option value="Wrong_Number">Wrong Number</option>
                <option value="Place_with_other">Place with other</option>
                <option value="Not_Pickup">Not Pickup</option>
              </select>
            </div>

            {showSaleTransaction && (
              <div className="mb-3">
                <label htmlFor="transactionDetails" className="form-label">Transaction ID</label>
                <input
                  type="transaction-details"
                  placeholder="Enter Transaction id "
                  className="form-control"
                  id="transactionDetails"
                  name="transactionDetails"
                  value={formData.SaleTransaction}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

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
                  step="2"
                />
              </div>
            )}
            <div className="col-12">
              <label htmlFor="comment" className="form-label">Comment</label>
              <textarea
                rows="4"
                className="form-control"
                placeholder="Discribe your conversation with client"
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
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

      <Modal show={on} onHide={handleOff} className="modal assign-ticket-modal fade" id="followUpModal" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5 w-100 text-center" id="followUpModalLabel">
            Send mail to Customer
          </h1>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="container mt-4">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Customer Detail</h5>
                      <div className="user-info">
                        <div><strong>Name:</strong> {senderNameForEmail}</div>
                        <div><strong>Ticket ID:</strong> {uniqueQueryId}</div>
                        <div><strong>Email:</strong> {senderEmailFormail}</div>
                        <div><strong>Mobile Number:</strong> {senderMobile}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 mt-4 mt-lg-0">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-4">Product Details</h5>
                      <div className="user-info d-flex flex-wrap">
                        {productArray.map((product, index) => (
                          <React.Fragment key={index}>
                            <div>{product}</div>
                            {index !== productArray.length - 1 && <div className="comma">,</div>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mt-4">
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center justify-content-center p-3">
                    <label htmlFor="status" className="form-label mr-3 mb-0">Add Product:</label>
                    <select className="form-select" onChange={handleSelectProduct}>
                      <option value="">Select products</option>
                      {productsList.map((product, index) => (
                        <option key={index} value={product.name}>{product.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer justify-content-center border-0">
              <Button variant="secondary" data-bs-dismiss="modal" onClick={handleOff}>Close</Button>
              <Button variant="primary" onClick={handleSendEmail}>Send</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>



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
                  <div
                    className="contact-info-row d-flex align-items-center justify-content-between"
                  >
                    <a href="" className="contact-info phone"
                    ><i className="fa-solid fa-phone"></i> +91 9918293747</a
                    >
                    <a className="contact-info email" href="#"
                    ><i className="fa-solid fa-envelope-open-text"></i>
                      example@email.com</a
                    >
                  </div>
                  <div className="main-content-area">
                    <form>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label" for="flexCheckDefault">
                          Default checkbox
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                        <label className="form-check-label" for="flexCheckChecked">
                          Checked checkbox
                        </label>
                      </div>
                      <div className="col-12">
                        <label htmlFor="comment" className="form-label">Comment</label>
                        <textarea
                          rows="4"
                          className="form-control"
                          placeholder="Discribe your conversation with client"
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
      <dialog
        id="ticketjourney"
        className="bg-white rounded shadow"
        style={{ width: '80%', maxWidth: '600px', border: 'none' }}
      >

        <div className="position-fixed vh-100 vw-100 d-flex flex-coloumn justify-content-center align-items-center">
          <TicketJourney tktid={selctedTicketInfo} closeFun={closeTicketJourney} />
        </div>
      </dialog>


      {/* //invoice modal */}
      <Modal show={isInvoiceOn} onHide={handleInvoice} className="" id="followUpModal" tabindex="-1" aria-labelledby="followUpModalLabel" aria-hidden="true">
        <Modal.Header closeButton>
          <h1 className=" w-100 text-center" id="followUpModalLabel">
            <u> Raise Invoice</u>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="card shadow-sm">

              <div>
                <InvoiceBox ticketId={selectTicketForInvoice} name={selectNameForInvoice} email={selectEmailForInvoice} mobile={selectMobileForInvoice} />
              </div>
            </div>
          </div>

        </Modal.Body>
      </Modal>
    </>
  )
}

export default live_tickets;