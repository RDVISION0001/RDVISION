import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import axiosInstance from '../axiosInstance';


import R2ZWYCP from '../assets/notification/R2ZWYCP.mp3';
import temp1 from '../assets/emailtemp/temp1.png';
import temp2 from '../assets/emailtemp/temp2.png';
import temp3 from '../assets/emailtemp/temp3.png';


// Authentication context
import { useAuth } from '../auth/AuthContext';

// Toast notification
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Clipboard copy
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TicketJourney from '../components/TicketJourney';

import InvoiceBox from '../components/InvoiceBox';
import QuotationBox from '../components/QuotationBox';
import TicketTrack from '../components/TicketTrack';
import SaleConframtion from '../components/SaleConframtion';

function uploaded_tickets() {
  const { userId } = useAuth();
  const { setUserReportReloader } = useAuth();
  const [selectedKey, setSelectedKey] = useState(null)

  // Clipboard copy
  const [copied, setCopied] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterdate, setFilterDate] = useState(null)
  // Form data state
  const [formData, setFormData] = useState({ ticketStatus: '', comment: '', followUpDateTime: '' });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [uniqueQueryId, setUniqueQueryId] = useState(null);

  const [selectTicketForInvoice, setSelectTicketForInvoice] = useState(null)
  const [selectNameForInvoice, setSelectNameForInvoice] = useState(null)
  const [selectMobileForInvoice, setSelectMobileForInvoice] = useState(null)
  const [selectEmailForInvoice, setSelectEmailForInvoice] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const handleClosee = () => {
    setShowModal(false);
  };

  // Modal state
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState({ id: "", name: "", email: "", mobile: "" });
  const [productsList, setProductsList] = useState([]);
  const [on, setOn] = useState(false);
  const [senderNameForEmail, setSenderNameForEmail] = useState("");
  const [emailFormail, setemailForMail] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [view, setView] = useState(false);
  const [activeTab, setActiveTab] = useState("newTickets");
  const [data, setData] = useState(null);
  const [newNotifications, setNewNotifications] = useState(0);
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);
  const [showSaleTransaction, setShowTransaction] = useState(false);
  const [isOpendAssign, setIsOpnnedAssign] = useState(false)
  const [seletedUserType, setSelectedUserType] = useState(0)
  const [selectedUserOfSelectedUserType, setSelectedUserOfSelectedUserType] = useState(0)
  const [user, setUser] = useState([])
  const [productArray, setProductArray] = useState([]);
  const [showAlltickets, setShowAllTiuckets] = useState(localStorage.getItem("roleName"))
  const [files, setFiles] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [callId, setCallId] = useState(0)
  const { setFolowupUpdate } = useAuth()
  const [emailData, setEmailData] = useState({
    ticketId: "",
    name: "",
    email: "",
    mobile: "",
    productList: []
  });

  // handling ticket selection
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

  //hnadling multiple selection
  const handleMultipleTicketSelection = (e) => {
    setSelectedTickets([])
    const checked = e.target.checked;
    if (checked) {
      let newSelectedTickets = [...selectedTickets];
      for (let i = 0; i < data.length; i++) {
        newSelectedTickets.push(data[i].uniqueQueryId);
      }
      setSelectedTickets(newSelectedTickets);
    } else {
      setSelectedTickets([]);
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
  // Define parameters for each tab

  const params = {
    newTickets: { ticketStatus: 'New' },
  };

  const handleClose = () => {
    setShow(false)
    setIsOpnnedAssign(false)
    setFormData((prev)=>({
      ...prev,
      ticketStatus:""
    }))
  };
  const handleShow = (queryId) => {
    setUniqueQueryId(queryId);
    setShow(true);
  };

  const handleOff = () => {
    setOn(false)
    setProductArray([])
  };
  const handleOn = (queryId, firstName, email, mobile, product) => {
    setUniqueQueryId(queryId);
    setSenderNameForEmail(firstName);
    setemailForMail(email);
    setmobileNumber(mobile);
    setProductArray(prevArray => [...prevArray, product]);
    setOn(true);
  };

  const [isInvoiceOn, setIsInvoiceOn] = useState(false)
  const handleInvoice = (ticketId, name, email, mobile) => {
    setSelectTicketForInvoice(ticketId)
    setSelectNameForInvoice(name)
    setSelectEmailForInvoice(email)
    setSelectMobileForInvoice(mobile)
    setIsInvoiceOn(!isInvoiceOn)
  }

  const [isQuotationOn, setIsQuotationOn] = useState(false)
  const handleQuotation = (ticketId, name, email, mobile) => {
    setSelectTicketForInvoice(ticketId)
    setSelectNameForInvoice(name)
    setSelectEmailForInvoice(email)
    setSelectMobileForInvoice(mobile)
    setIsQuotationOn(!isQuotationOn)
  }

  const handleCloses = () => setView(false);
  const handleView = (queryId) => {
    setUniqueQueryId(queryId);
    setView(true);
  };

  const fetchData = async (params, page, perPage) => {
    if (localStorage.getItem("roleName") !== "Closer") {
      try {
        const response = await axiosInstance.get(`/upload/getByDate/${selectedDate ? selectedDate : ""}`, {
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
    } else {
      const response = await axiosInstance.get("upload/getAssignedTickets", {
        params: { ...params, userId, page, size: perPage }
      })
      setData(response.data.dtoList);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    }

  };

  //click to call
  const handleClick = async (number) => {
    try {
      const response = await axiosInstance.post('/third_party_api/ticket/clickToCall', {
        number: checkTextStart(number),
        userId
      });
      setUserReportReloader((prev) => prev + 1)
      setCallId(response.data.call_id)
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  const checkTextStart = (inputText) => {
    if (!inputText || inputText.length === 0) {
      return "Input text is empty";
    }

    const firstChar = inputText.charAt(0);
    console.log(inputText, firstChar)
    if (!isNaN(firstChar)) {
      console.log("1" + inputText)
      return "1" + inputText;
    } else if (/^[a-zA-Z]$/.test(firstChar)) {
      console.log("if", "1" + inputText.split(" ")[1])
      return "1" + inputText.split(" ")[1];
    }
  };
  //notification
  const playNotificationSound = () => {
    const audio = new Audio(R2ZWYCP);
    audio.play();
  };

  //Short Method
  const [shortValue, setShortValue] = useState("")
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value)
  }

  // Masking mobile number
  const maskMobileNumber = (mobileNumber) => {
    return mobileNumber.slice(0, -4) + 'XXXX';
  };

  // Masking email
  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    const maskedName = name[0] + '*'.repeat(Math.max(name.length - 2, 0)) + name.slice(-1);
    return `${maskedName}@${domain}`;
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
          email: emailFormail,
          ticketId: uniqueQueryId,
          mobile: mobileNumber,
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
      email: emailFormail,
      ticketId: uniqueQueryId,
      mobile: mobileNumber,
      productList: productArray
    };

    try {
      const response = await axiosInstance.post(url, data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
      setShowModal(true);
      handleClose()
    } else {
      setShowTransaction(false);
    }
  };

  const getFlagUrl = (countryIso) => `https://flagcdn.com/32x24/${countryIso && countryIso.toLowerCase()}.png`;

  //iteam par page
  useEffect(() => {
    fetchData(params[activeTab], currentPage, itemsPerPage);
  }, [activeTab, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    axiosInstance.get(`/upload/filesByDate`).then((resp) => {
      setFiles(resp.data.response)
    })

    if (localStorage.getItem("roleName" === "Closer")) {
      fetchData()
    }
  }, [])

  //Open file
  const setDateToOpenFile = (file) => {
    setSelectedDate(file[0]);
    setShowAllTiuckets(true);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

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
      const res = await axiosInstance.post(`/upload/updateTicketResponse/${uniqueQueryId}`, {}, { params });
      setResponse(res.data.dtoList);
      toast.success('Update successfully!');
      setUserReportReloader((prev) => prev + 1)
      handleClose();
      fetchData(params[activeTab], currentPage, itemsPerPage);
      setFolowupUpdate(uniqueQueryId)
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  //handle row click
  const handleRowClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(0);
    fetchData(params[tabName], 0, itemsPerPage);
  };

  //handle Previous Page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  //handle handle Next Page
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  //handle Items Per Page Change
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
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error("Error sending email");
    }
  };

  // assign handling 

  const handleOpenAssignTicket = () => {
    if (selectedTickets.length > 0) {
      setIsOpnnedAssign(true)
    } else {
      toast.info("Please select at least One Ticket")
    }
  }

  const handleSelectUserType = (e) => {
    setSelectedUserType(e.target.value)

  }
  //selecting user of selected type
  const handleSelectUserOfSelectedUserType = (e) => {
    setSelectedUserOfSelectedUserType(e.target.value)

  }
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
      fetchData()
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assign tickets.');
    }
  };

  //ticket journey
  const [selctedTicketInfo, setSelectedTicketInfo] = useState("")
  const [isTicketJourneyOpen, setIsTicketJourneyOpen] = useState(false)
  const openTicketJourney = (ticketId) => {
    setSelectedTicketInfo(ticketId)
    setIsTicketJourneyOpen(true)
    // document.getElementById("ticketjourney").showModal()
  }
  const closeTicketJourney = () => {
    // document.getElementById("ticketjourney").close()
    setIsTicketJourneyOpen(false)
  }

  const [followUpStatus, setFollowupStatus] = useState("Follow")

  function formatFollowUpDate(followUpDateTime) {
    const [year, month, day] = followUpDateTime;
    // Convert month to 2-digit format and day to 2-digit format
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  const handleSelecteRow = (index) => {
    setSelectedKey(index)
    console.log(selectedKey)
  }

  const addCopyRecord = async (ticketId, text) => {
    toast.info("Copied" + text);
    const response = await axiosInstance.post("/history/copyhistory", {
      updatedBy: userId,
      status: 'Copeid by' + localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
      ticketIdWhichUpdating: ticketId,
      comment: 'Copied' + " " + text,
      userName: localStorage.getItem("firstName") + " " + localStorage.getItem("lastName"),
      recordingFile: null
    })
    setUserReportReloader((prev) => prev + 1)
  }

  //templates email
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [text, setText] = useState("")
  const [serchValue, setserchValue] = useState("")
  const [productsIds, setProductIds] = useState([])


  const handleInputChange = (e) => {
    setserchValue(e.target.value); // Update state with the input's value
    console.log('Input Value:', e.target.value); // Log the current input value
  };

  const handleToggleProduct = (id) => {
    setProductIds((prevIds) => {
      if (prevIds.includes(id)) {
        // Remove the ID if it already exists
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        // Add the ID if it does not exist
        return [...prevIds, id];
      }
    });
  };
  const handleSendTemplateMail = async () => {
    if (selectedTemplate < 1) {
      toast.info("Please Select one Template ")
    } else if (productsIds.length < 1) {
      toast.info("Please Select At least one Product ")

    } else if (text.length < 1) {
      toast.info("Please Enter Message")
    } else {
      try {
        const response = await axiosInstance.post("/email/sendsugetionmail", {
          uploadTicket: {
            uniqueQueryId: uniqueQueryId
          },
          text: text,
          temp: selectedTemplate,
          productsIds: productsIds,
          userId
        })
        setUserReportReloader((prev) => prev + 1)

        toast.success("Email Sent")
      } catch (e) {
        toast.error("Some Error Occurs")
      }
    }

  }

  return (
    <div className='d-flex'>

      <div style={{ width: "100vw" }}>

        {/* <!-- Tabbed Ticket Table --> */}
        {localStorage.getItem("roleName") !== "Closer" && <section className="card-body m-3">
          <div className="row ">
            {files.map((file, index) => (
              <div className="col-12 col-md-8 col-lg-6 col-xl-4 mb-3" onClick={() => setDateToOpenFile(file)}>
                <div className="d-flex align-items-center border p-3 rounded hoverTickets shadow-sm">
                  <i className="fa-solid fa-file fa-2x me-3 text-info"></i>
                  <div>
                    <h5 className="mb-1 text-dark fw-bold">Assign Date: {file[0]}</h5>
                    <small className="text-secondary">
                      Total tickets: <span className="text-danger fw-bold">{file[1]}</span>
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>}
        {/* //Filter input */}
        {showAlltickets &&
          <section class="filter-section">
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
          </section>}
        {showAlltickets ?
          <section className="followup-table-section py-3">
            <div className="container-fluid">
              <div className="table-wrapper tabbed-table">
                <h3 className="title">Uploaded Tickets</h3>
                <div className="d-flex justify-content-between align-items-center">
                  {localStorage.getItem("roleName") === "Admin" && (
                    <Button
                      onClick={handleOpenAssignTicket}
                      className="btn btn-assign"
                      data-bs-toggle="modal"
                      data-bs-target="#assignTicketModal"
                      id="assignButton"
                    >
                      Assign Ticket
                    </Button>
                  )}
                </div>            <ul
                  className="nav recent-transactions-tab-header nav-tabs"
                  id="followUp"
                  role="tablist"
                >

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
                      {/* <span> {newNotifications} <i class="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i></span> */}
                      <i class="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i>
                      New Tickets
                    </button>
                  </li>
                </ul>
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
                            {localStorage.getItem("roleName") === "Admin" ? <th className="selection-cell-header" data-row-selection="true">
                              <input type="checkbox" className="" onChange={(e) => handleMultipleTicketSelection(e)} />
                            </th> : ""}
                            <th tabindex="0">Se n.</th>
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
                                item.mobileNumber.toLowerCase().includes(shortValue.toLowerCase()) ||
                                item.email.toLowerCase().includes(shortValue.toLowerCase()) ||
                                item.firstName.toLowerCase().includes(shortValue.toLowerCase())
                            ).filter((item) => item.ticketstatus === "New").map((item, index) => (
                              <tr key={index}
                                style={{
                                  boxShadow: index === selectedKey ? "0px 5px 15px 0px gray" : "",
                                  zIndex: index === selectedKey ? 1 : "auto",
                                  position: index === selectedKey ? "relative" : "static"
                                }}
                                onClick={() => handleSelecteRow(index)}
                              >
                                {localStorage.getItem("roleName") === "Admin" ? <td className="selection-cell">
                                  <input
                                    type="checkbox"
                                    checked={selectedTickets.includes(item.uniqueQueryId)}
                                    onChange={(e) => handleTicketSelect(e, item.uniqueQueryId)}
                                  />
                                </td> : ""}
                                <td><span className="text">{itemsPerPage * currentPage + (index + 1)}.</span></td>

                                <td><span className="text">{`${item.uploadDate[2]}-${item.uploadDate[1]}-${item.uploadDate[0]}\n${item.queryTime.split(".")[0]}`}</span></td>
                                <td><img src={getFlagUrl(item.senderCountryIso)} alt={`${item.senderCountryIso} flag`} /><span className="text">{item.senderCountryIso}</span></td>
                                <td><span className="text">{item.firstName} {item.lastName}</span></td>
                                <td> <td>
                                  <CopyToClipboard
                                    text={item.mobileNumber}
                                    onCopy={() => setCopied(true)}
                                  >
                                    <button onClick={() => addCopyRecord(item.uniqueQueryId, item.mobileNumber)}>Copy</button>
                                  </CopyToClipboard>
                                </td><span className="text">{maskMobileNumber(item.mobileNumber)}</span></td>

                                <td> <td>
                                  <CopyToClipboard
                                    text={item.email}
                                    onCopy={() => setCopied(true)}
                                  >
                                    <button onClick={() => addCopyRecord(item.uniqueQueryId, item.email)}>Copy</button>
                                  </CopyToClipboard>
                                </td><span className="text">{maskEmail(item.email)}</span></td>

                                <td onClick={() => handleShow(item.uniqueQueryId)} >
                                  <a className="btn btn-info dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ backgroundColor: getColorByStatus(item.ticketstatus) }}>
                                    {item.ticketstatus}
                                  </a>
                                </td>
                                <td className="hover-cell"><span className="comment">{item.productEnquiry.slice(0, 15)}<br />
                                  <span className="message">{item.productEnquiry}</span>
                                </span></td>

                                <td>
                                  <span className="actions-wrapper">
                                    <Button
                                      onClick={() => openTicketJourney(item.uniqueQueryId)}
                                      // onClick={handleView}
                                      data-bs-toggle="modal"
                                      data-bs-target="#followUpModal"
                                      className="btn-action call bg-danger"
                                      title="Get connect on call"
                                    ><i className="fa-solid fa-info "></i>
                                    </Button>
                                    <Button
                                      onClick={() => handleClick(item.mobileNumber)}
                                      data-bs-toggle="modal"
                                      data-bs-target="#followUpModal"
                                      className="btn-action call"
                                      title="Get connect on call"
                                    ><i className="fa-solid fa-phone"></i>
                                    </Button>
                                    <a
                                      href={`sms:${item.mobileNumber}?&body=${`Hey ${item.firstName} {item.lastName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`}`}
                                      className="btn-action message"
                                      title="Get connect on message"
                                    ><i className="fa-solid fa-message"></i></a>
                                    <Button
                                      onClick={() => handleOn(item.uniqueQueryId, item.senderName, item.senderEmail, item.senderMobile, item.productEnquiry)}
                                      // href="mailto:someone@example.com"
                                      className="btn-action email"
                                      title="Get connect on email"
                                    ><i className="fa-solid fa-envelope"></i
                                    ></Button>
                                    <a href={`https://wa.me/${item.mobileNumber.split("-")[1]}?text=${`Hey ${item.firstName} {item.lastName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`}`}
                                      target='_blank'
                                      className="btn-action whatsapp"
                                      title="Get connect on whatsapp"
                                    ><i className="fa-brands fa-whatsapp"></i></a>
                                    <Button
                                      onClick={() => handleQuotation(item.uniqueQueryId)}
                                      className="rounded-circle "
                                      title="Get connect on"
                                    >
                                      <i class="fa-share-from-square" ></i>
                                    </Button>
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
          </section> : ""}
        <Modal show={isOpendAssign} onHide={handleClose} centered>
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
                  <option value="Follow">Follow</option>
                  <option value="Interested">Interested</option>
                  <option value="Not_Interested">Not Interested</option>
                  <option value="Wrong_Number">Wrong Number</option>
                  <option value="Place_with_other">Place with other</option>
                  <option value="Call_Back">Call Back</option>
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
            <h4 className="w-100 text-center" id="followUpModalLabel">
              Send Quotation Mail to Customer
            </h4>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <div className="shadow p-3 mb-5 bg-white rounded">
                    <div className="card-body d-flex flex-column align-items-start">
                      <input
                        type="checkbox"
                        className="bg-info mt-2"
                        style={{ height: "40px", fontSize: "12px" }}
                        checked={selectedTemplate === 1}
                        onChange={() => handleToggleProduct(1)}
                        onClick={() => setSelectedTemplate(1)}
                      />
                      <img
                        onClick={() => setSelectedTemplate(1)}
                        src={temp1}
                        style={{ height: "150px", cursor: "pointer" }}
                        alt="Template 1"
                        className="img-fluid hoverEffectToTemp"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="shadow p-3 mb-5 bg-white rounded">
                    <div className="card-body d-flex flex-column align-items-start">
                      <input
                        type="checkbox"
                        className="bg-info mt-2"
                        style={{ height: "40px", fontSize: "12px" }}
                        checked={selectedTemplate === 2}
                        onChange={() => handleToggleProduct(2)}
                        onClick={() => setSelectedTemplate(2)}
                      />
                      <img
                        onClick={() => setSelectedTemplate(2)}
                        src={temp2}
                        style={{ height: "150px", cursor: "pointer" }}
                        alt="Template 2"
                        className="img-fluid hoverEffectToTemp"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="shadow p-3 mb-5 bg-white rounded">
                    <div className="card-body d-flex flex-column align-items-start">
                      <input
                        type="checkbox"
                        className="bg-info mt-2"
                        style={{ height: "40px", fontSize: "12px" }}
                        checked={selectedTemplate === 3}
                        onChange={() => handleToggleProduct(3)}
                        onClick={() => setSelectedTemplate(3)}
                      />
                      <img
                        onClick={() => setSelectedTemplate(3)}
                        src={temp3}
                        style={{ height: "150px", cursor: "pointer" }}
                        alt="Template 3"
                        className="img-fluid hoverEffectToTemp"
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div>
                <>
                  <div className='d-flex justify-content-between px-5'>
                    <input
                      type='text'
                      placeholder='Enter product Name'
                      value={serchValue}
                      onChange={handleInputChange}
                      className='p-2 bg-white text-black'
                    />
                    {productsIds.length > 0 && (
                      <div
                        className='bg-primary text-white rounded p-2 hover:shadow-lg'
                        style={{ height: "30px", fontSize: "12px", cursor: "Pointer" }}
                        onClick={() => setProductIds([])}
                      >
                        Deselect All
                      </div>
                    )}


                  </div>

                  <div className="container mt-3 border p-3 rounded">
                    <div className="row" style={{ height: "500px" }}>
                      {productsList && productsList
                        .filter(product =>
                          serchValue.length > 0
                            ? product.name.toLowerCase().includes(serchValue.toLowerCase())
                            : true
                        )
                        .filter((product) => product.images !== null).map((product, index) => (
                          <div key={index} className="col-12 col-md-6 mb-3 d-flex justify-content-center " onClick={() => handleToggleProduct(product.productId)}>
                            <div className={`card p-2 position-relative ${productsIds.includes(product.productId) && "shadow-lg bg-info"}`} style={{ width: '100%', maxWidth: '300px', height: '80px' }}>
                              {/* Brand Tag */}
                              <div
                                className="position-absolute bottom-0 start-0 bg-success text-white px-2 py-1"
                                style={{ fontSize: '10px', borderTopLeftRadius: '4px', borderBottomRightRadius: '4px' }}
                              >
                                {product.brand}
                              </div>

                              <div className="d-flex flex-column flex-md-row align-items-center">
                                <div>
                                  <img
                                    src={product.images && product.images[0]}
                                    alt="Product"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: '60px' }}
                                  />
                                </div>

                                {/* Product Details Section */}
                                <div className="ms-2 w-100 ">
                                  <h6 className="card-title mb-1" style={{ fontSize: '12px' }}>
                                    {product.name} {product.Price}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>

                        ))}
                    </div>
                  </div>
                </>

                <div className='mt-3'>
                  <label htmlFor="textarea fw-bold" style={{ fontSize: "20px", fontWeight: "bold" }}>Enter Message</label>
                  <textarea style={{ height: "150px", width: "100%" }} value={text} onChange={(e) => setText(e.target.value)} className='text-black bg-white p-3' placeholder='PLease Enter Meassage To Client' ></textarea>
                </div>

                <button onClick={() => handleSendTemplateMail()}>Send Mail</button>
              </div>

            </div>
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
                      class="contact-info-row d-flex align-items-center justify-content-between"
                    >
                      <a href="" class="contact-info phone"
                      ><i class="fa-solid fa-phone"></i> +91 9918293747</a
                      >
                      <a class="contact-info email" href="#"
                      ><i class="fa-solid fa-envelope-open-text"></i>
                        example@email.com</a
                      >
                    </div>
                    <div className="main-content-area">
                      <form>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                          <label class="form-check-label" for="flexCheckDefault">
                            Default checkbox
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked />
                          <label class="form-check-label" for="flexCheckChecked">
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
        <Modal
          show={isInvoiceOn}
          onHide={handleInvoice}
          id="followUpModal"
          tabindex="-1"
          aria-labelledby="followUpModalLabel"
          aria-hidden="true"
          dialogClassName="fullscreen-modal" // Add a custom class here
        >
          <h1 className="w-100 text-center mb-3" id="followUpModalLabel">
            <u> Raise Invoice</u>
          </h1>
          <InvoiceBox
            ticketId={selectTicketForInvoice}
            name={selectNameForInvoice}
            email={selectEmailForInvoice}
            mobile={selectMobileForInvoice}
          />
        </Modal>
        <Modal
          show={isTicketJourneyOpen}
          onHide={closeTicketJourney}
          id="followUpModal"
          tabindex="-1"
          aria-labelledby="followUpModalLabel"
          aria-hidden="true"
          dialogClassName="fullscreen-modal rounded-modal" // Add custom classes
        >
          <TicketJourney tktid={selctedTicketInfo} closeFun={closeTicketJourney} />
        </Modal>
        <Modal
          show={isQuotationOn}
          onHide={handleQuotation}
          id="followUpModal"
          tabindex="-1"
          aria-labelledby="followUpModalLabel"
          aria-hidden="true"
          dialogClassName="fullscreen-modal" // Add a custom class here
        >
          <h1 className="w-100 text-center mb-3" id="followUpModalLabel">
            <u> Raise Invoice</u>
          </h1>
          <QuotationBox
            ticketId={selectTicketForInvoice}
            name={selectNameForInvoice}
            email={selectEmailForInvoice}
            mobile={selectMobileForInvoice}
          />
        </Modal>
      </div>
      {/* when select Sale */}
      <Modal show={showModal} onHide={handleClosee} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <SaleConframtion ticketId={uniqueQueryId} />
        <div className="modal-body">
          <button type="button" className="btn btn-secondary" onClick={handleClosee}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default uploaded_tickets