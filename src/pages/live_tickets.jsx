import React, { useState, useEffect } from "react";
import { Modal, Button, Dropdown } from "react-bootstrap";
import axiosInstance from "../axiosInstance";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import R2ZWYCP from "../assets/notification/R2ZWYCP.mp3";
import temp1 from "../assets/emailtemp/temp1.png";
import temp2 from "../assets/emailtemp/temp2.png";
import temp3 from "../assets/emailtemp/temp3.png";

// Authentication context
import { useAuth } from "../auth/AuthContext";

// Toast notification
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Clipboard copy
import { CopyToClipboard } from "react-copy-to-clipboard";
import TicketJourney from "../components/TicketJourney";
import InvoiceBox from "../components/InvoiceBox";
import QuotationBox from "../components/QuotationBox";
import TicketTrack from "../components/TicketTrack";
import SaleConframtion from "../components/SaleConframtion";
import EmailCompose from "../components/EmailCompose";


function live_tickets() {
  const { roleName, dark, userId } = useAuth();
  const { setFolowupUpdate } = useAuth();
  const { setUserReportReloader } = useAuth();

  const [selectedKey, setSelectedKey] = useState(null);
  const [isCompoeseOpen, setIsComposeOpen] = useState(false)

  const [emailBody, setEmailBody] = useState("")

  // Clipboard copy
  const [copied, setCopied] = useState(false);
  const [filteredTickets, setFilteredTickets] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Form data state
  const [formData, setFormData] = useState({
    ticketStatus: "",
    comment: "",
    followUpDateTime: "",
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [uniqueQueryId, setUniqueQueryId] = useState(null);

  // Modal state
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState({
    id: "",
    name: "",
    email: "",
    mobile: "",
  });
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
  const [callId, setCallId] = useState(0);
  const [selectTicketForInvoice, setSelectTicketForInvoice] = useState(null);
  const [selectNameForInvoice, setSelectNameForInvoice] = useState(null);
  const [selectMobileForInvoice, setSelectMobileForInvoice] = useState(null);
  const [selectEmailForInvoice, setSelectEmailForInvoice] = useState(null);
  const [filterdate, setFilterDate] = useState(null);
  const { noOfNweticketsRecevied, setNoOfnewticketsReceived } = useAuth();
  const [countryFilter, setCountryFilter] = useState([]);
  const [productArray, setProductArray] = useState([]);
  const [dropdownCountries, setDropDownCountries] = useState([]);
  const [assignedTo, setAssignedTo] = useState(0);
  const [emailData, setEmailData] = useState({
    ticketId: "",
    name: "",
    email: "",
    mobile: "",
    productList: [],
  });

  const [showModal, setShowModal] = useState(false);
  const handleClosee = () => {
    setShowModal(false);
  };

  const addCopyRecord = async (ticketId, text) => {
    // toast.info("Copied" + text);
    const response = await axiosInstance.post("/history/copyhistory", {
      updatedBy: userId,
      status:
        "Copeid by" +
        localStorage.getItem("firstName") +
        " " +
        localStorage.getItem("lastName"),
      ticketIdWhichUpdating: ticketId,
      comment: "Copied" + " " + text,
      userName:
        localStorage.getItem("firstName") +
        " " +
        localStorage.getItem("lastName"),
      recordingFile: null,
    });
    setUserReportReloader((prev) => prev + 1);
  };

  // Define parameters for each tab
  const params = {
    allTickets: {},
    ongoing: { ticketStatus: "Sale" },
    newTickets: { ticketStatus: "New" },
    // followUp: { ticketStatus: 'follow' },
    followUp: {},
  };

  const handleClose = () => {
    setShow(false);
    setFormData((prev) => ({
      ...prev,
      ticketStatus: "",
    }));
  };
  const handleShow = (queryId) => {
    setUniqueQueryId(queryId);
    setShow(true);
  };

  const handleOff = () => {
    setOn(false);
    setProductArray([]);
  };

  const handleOn = (ticketId, email, body) => {
    // setSelectTicketForInvoice(ticketId);
    // setSelectNameForInvoice(name);
    setSelectEmailForInvoice(email);
    setEmailBody(body)
    // setSelectMobileForInvoice(mobile);
    setIsComposeOpen(true)
  };
  const handleCloses = () => setView(false);
  const handleView = (queryId) => {
    setUniqueQueryId(queryId);
    setView(true);
  };
  const [isInvoiceOn, setIsInvoiceOn] = useState(false);
  const [ticketinvoicedata, setTicketInvoiceData] = useState([]);
  const handleInvoice = (item) => {
    console.log("function", item);
    setTicketInvoiceData(item);
    setIsInvoiceOn(!isInvoiceOn);
  };

  const [isQuotationOn, setIsQuotationOn] = useState(false);
  const [ticketquattiondata, setTicketQutationData] = useState([]);
  const handleQuotation = (item) => {
    setTicketQutationData(item);
    setIsQuotationOn(!isQuotationOn);
  };

  const fetchData = async () => {
    const response = await axiosInstance.get(
      `/third_party_api/ticket/${assignedTo !== 0 ? `getAllNewTickets/${userId}` : `getAllNewTickets`
      }`
    );
    setData(response.data);
    const allData = response.data;
    console.log(allData.length);
    setCurrentPage(0);
    setTotalPages(Math.ceil(response.data.length / itemsPerPage));
  };

  //filter tickets base on country
  const filterTickets = (tickets) => {
    const allowedCountries = ["US", "UK", "AU"]; // ISO country codes for US, UK, and Australia
    const filtered = tickets.filter((ticket) =>
      allowedCountries.includes(ticket.senderCountryIso)
    );
    setFilteredTickets(filtered);
  };

  const playNotificationSound = () => {
    const audio = new Audio(R2ZWYCP);
    audio.play();
  };

  //Short Method
  const [shortValue, setShortValue] = useState("");
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value);
  };

  //websocket for notification
  useEffect(() => {
    const socket = new SockJS("https://rdvision.in/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => { },
      onConnect: () => {
        stompClient.subscribe("/topic/third_party_api/ticket/", (message) => {
          const newProduct = JSON.parse(message.body);
          setData((prevProducts) => [newProduct, ...prevProducts]);
          setSelectedKey((prevKey) => prevKey + 1);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const [agentDetails, setAgentDetails] = useState();

  const getAgentDetails = async () => {
    const response = await axiosInstance.get(`/user/getAgent/${userId}`);
    setAgentDetails(response.data);
  };

  useEffect(() => {
    getAgentDetails();
  }, []);

  const handleSelecteRow = (index, ticketId) => {
    setSelectedKey(index);

    // Retrieve the existing list of selected ticket IDs from localStorage
    let selectedTickets = JSON.parse(localStorage.getItem("selectedLive"));

    // If there is no valid list, initialize it as an empty array
    if (!Array.isArray(selectedTickets)) {
      selectedTickets = [];
    }

    // Add the new ticketId to the list if it's not already in the list
    if (!selectedTickets.includes(ticketId)) {
      selectedTickets.push(ticketId);
    }

    // Save the updated list back to localStorage
    localStorage.setItem("selectedLive", JSON.stringify(selectedTickets));
  };

  //click to call
  const handleClick = async (number, ticketId) => {
    try {
      const response = await axiosInstance.post(
        "/third_party_api/ticket/clickToCall",
        {
          number: formatNumberAccordingToHodu(number),
          userId,
          ticketId,
        }
      );
      setCallId(response.data.call_id);
      setUserReportReloader((prev) => prev + 1);
    } catch (error) {
      console.error("Error during API call:", error);
      setUserReportReloader((prev) => prev + 1);
    }
  };

  const formatNumberAccordingToHodu = (number) => {
    if (number.includes("+")) {
      return number.replace(/[+-]/g, "");
    } else {
      return "1" + number;
    }
  };

  // Masking mobile number
  const maskMobileNumber = (number) => {
    if (number.length < 4) return number;
    return number.slice(0, -4) + "XXXX";
  };

  // Masking email
  const maskEmail = (email) => {
    const [user, domain] = email.split("@");
    const maskedUser =
      user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
    return `${maskedUser}@${domain}`;
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
      setProductArray((prevArray) => {
        const updatedArray = [...prevArray, selectedProduct];
        setEmailData((prevEmailData) => ({
          ...prevEmailData,
          name: senderNameForEmail,
          email: senderEmailFormail,
          ticketId: uniqueQueryId,
          mobile: senderMobile,
          productList: updatedArray,
        }));
        return updatedArray;
      });
      toast.success("Product added");
    }
  };

  const fetchDataForEmail = async () => {
    const url = "email/sendmail";
    const data = {
      name: senderNameForEmail,
      email: senderEmailFormail,
      ticketId: uniqueQueryId,
      mobile: senderMobile,
      productList: productArray,
    };

    try {
      const response = await axiosInstance.post(url, data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getColorByStatus = (ticketStatus) => {
    const colors = {
      New: "dodgerblue",
      Sale: "green",
      Follow: "RoyalBlue",
      Interested: "orange",
      Not_Interested: "red",
      Wrong_Number: "gray",
      Not_Pickup: "lightblue",
      " hang_up": "yellow",
    };
    return colors[ticketStatus] || "white";
  };

  const handleStatusChange = (event) => {
    handleChange(event);
    const { value } = event.target;

    if (value === "Sale") {
      setShowModal(true);
      handleClose();
    } else {
      setShowTransaction(false);
    }

    if (value === "Follow") {
      setShowFollowUpDate(true);
    } else {
      setShowFollowUpDate(false);
    }
  };

  const fetchCountries = async () => {
    const response = await axiosInstance.get(
      "/third_party_api/ticket/getDistinctCountries"
    );
    setDropDownCountries(response.data);
  };

  const getFlagUrl = (countryIso) =>
    `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;

  useEffect(() => {
    fetchData();
  }, [assignedTo]);

  useEffect(() => {
    fetchProducts();
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueQueryId) {
      setError("Unique Query ID is not defined");
      return;
    }
    if (!formData.ticketStatus || formData.ticketStatus.length === 0) {
      setError("Ticket Status cannot be empty");
      return;
    }
    try {
      const params = {
        userId,
        ticketStatus: formData.ticketStatus,
        comment: formData.comment,
        followUpDateTime: formData.followUpDateTime,
        call_id: callId,
      };
      const res = await axiosInstance.post(
        `/third_party_api/ticket/updateTicketResponse/${uniqueQueryId}`,
        {},
        { params }
      );
      setResponse(res.data.dtoList);
      toast.success("Update successfully!");
      handleClose();
      fetchData(params[activeTab], currentPage, itemsPerPage);
      setError(null);
      setCallId(0);
      setFolowupUpdate(uniqueQueryId);
      setUserReportReloader((prev) => prev + 1);
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
    setCurrentPage(0); // Reset to the first page
  };

  const generatePageNumbers = () => {
    const totalPages = Math.ceil(data && data.length / itemsPerPage); // Calculate total pages
    const pageNumbers = [];
    const maxPagesToShow = 9; // Maximum number of page buttons to display
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
      handleOff();
      toast.success("📧 Email sent successfully");
    } catch (error) {
      toast.error("Error sending email");
    }
  };

  //ticket journey
  const [selctedTicketInfo, setSelectedTicketInfo] = useState("");
  const [isTicketJourneyOpen, setIsTicketJourneyOpen] = useState(false);
  const openTicketJourney = (ticketId) => {
    setSelectedTicketInfo(ticketId);
    setIsTicketJourneyOpen(true);
    // document.getElementById("ticketjourney").showModal()
  };
  const closeTicketJourney = () => {
    // document.getElementById("ticketjourney").close()
    setIsTicketJourneyOpen(false);
  };

  const [followUpStatus, setFollowupStatus] = useState("Follow");
  function formatFollowUpDate(followUpDateTime) {
    // If it's already in the "2024-08-10T13:14" format, return it as is
    return followUpDateTime.split("T")[0]; // Extracts just the date portion (YYYY-MM-DD)
  }

  const convertNumberToStringMonth = (number) => {
    switch (number) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Ap";
      case 5:
        return "May";
      case 6:
        return "June";
      case 7:
        return "July";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "Invalid month";
    }
  };
  function convertTo12HourFormat(time) {
    if (time) {
      // Split the input time into hours, minutes, and seconds
      let [hours, minutes, seconds] = time.split(":");

      // Convert the string values to numbers
      hours = parseInt(hours);

      // Determine AM or PM based on the hour
      let period = hours >= 12 ? "PM" : "AM";

      // Convert the hour from 24-hour to 12-hour format
      hours = hours % 12 || 12; // Use 12 for 0 (midnight) and 12 (noon)

      // Return the time in 12-hour format
      return `${hours}:${minutes}:${seconds} ${period}`;
    }
  }

  //templates email
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [text, setText] = useState("");
  const [serchValue, setserchValue] = useState("");
  const [productsIds, setProductIds] = useState([]);

  const handleInputChange = (e) => {
    setserchValue(e.target.value); // Update state with the input's value
    console.log("Input Value:", e.target.value); // Log the current input value
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
      toast.info("Please Select one Template ");
    } else if (productsIds.length < 1) {
      toast.info("Please Select At least one Product ");
    } else if (text.length < 1) {
      toast.info("Please Enter Message");
    } else {
      try {
        const response = await axiosInstance.post("/email/sendsugetionmail", {
          ticket: {
            uniqueQueryId: selectTicketForInvoice,
          },
          text: text,
          temp: selectedTemplate,
          productsIds: productsIds,
          userId,
        });
        toast.success("📧 Email Sent");
      } catch (e) {
        toast.error("Some Error Occurs");
      }
    }
  };

  const [copiedId, setCopiedId] = useState(null); // Track copied uniqueQueryId
  const [copiedType, setCopiedType] = useState(null); // Track if mobile or email is copied

  const handleCopy = (uniqueQueryId, text, type) => {
    setCopiedId(uniqueQueryId); // Set the copied ID
    setCopiedType(type); // Track whether it's a mobile number or email
    addCopyRecord(uniqueQueryId, text); // Log the copied record
  };

  const handleCountryFilter = (country) => {
    if (country) {
      if (countryFilter.includes(country)) {
        setCountryFilter(countryFilter.filter((item) => item !== country)); // Remove country
      } else {
        setCountryFilter([...countryFilter, country]); // Add country
      }
    } else {
      setCountryFilter([]); // Clear selection if "All" is clicked
    }
  };

  const handleCloseCompose = () => {
    setIsComposeOpen(false)
  }

  return (
    <>
      <div className={`${dark ? `bg-dark text-white` : `bg-white text-dark`}`}>
        <div>
          <div>
            {/* <!-- Tabbed Ticket Table --> */}
            <section className={`followup-table-section d-flex ${dark ? `bg-dark text-white` : `bg-white text-dark`}`}>
              <div className="container-fluid">
                <div className={`table-wrapper ${dark ? `bg-dark text-white` : `bg-white text-dark`}`}>
                  {/* <h3 className="title">Live Tickets<span className="d-flex justify-content-end"></span></h3> */}
                  <ul
                    className="nav recent-transactions-tab-header nav-tabs"
                    id="followUp"
                    role="tablist"
                  >
                    <li
                      className="nav-item d-flex justify-content-between align-items-center w-100"
                      role="presentation"
                    >
                      {/* <span> {newNotifications} <i className="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i></span> */}
                      {/* <i className="fa-solid fa-bell fa-shake fa-2xl" style={{ color: "#74C0FC" }}></i> */}
                      <div className={`${dark ? `bg-dark text-white` : `bg-white text-dark`}`} style={{ fontWeight: "bold", fontSize: "20px" }}>
                        {" "}
                        Live Tickets
                      </div>

                      <div className="col-md-5">
                        <div className="search-wrapper">
                          <input
                            type="text"
                            name="search-user"
                            id="searchUsers"
                            className="form-control"
                            placeholder="Search by Name ,Email, Mobile"
                            value={shortValue}
                            onChange={handleShortDataValue}
                          />
                          <div className="search-icon">
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className=" d-flex justify-content-center ">
                          <div
                            className="form-check"
                            style={{ marginLeft: "10px" }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckDefault"
                              checked={assignedTo === userId}
                              onChange={() => setAssignedTo(userId)} // Call toggle method on change
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                            >
                              Assigned to me
                            </label>
                          </div>
                          <div
                            className="form-check"
                            style={{ marginLeft: "10px" }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="flexCheckChecked"
                              checked={assignedTo === 0} // Checked if 'list' is false
                              onChange={() => setAssignedTo(0)} // Call toggle method on change
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckChecked"
                            >
                              All New tickets
                            </label>
                          </div>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="primary"
                            id="dropdown-basic"
                          >
                            Filter by Country
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1200 }}
                          >
                            <Dropdown.Item
                              className={
                                countryFilter.length === 0
                                  ? "bg-primary text-white"
                                  : ""
                              }
                              onClick={() => handleCountryFilter()}
                            >
                              {`${countryFilter.length === 0 ? "✅" : ""}`} All
                            </Dropdown.Item>
                            {dropdownCountries.map((item, index) => (
                              <Dropdown.Item
                                key={index}
                                className={
                                  countryFilter.includes(
                                    dropdownCountries[index]
                                  )
                                    ? "bg-primary text-white"
                                    : ""
                                }
                                onClick={() =>
                                  handleCountryFilter(dropdownCountries[index])
                                }
                              >
                                {`${countryFilter.includes(
                                  dropdownCountries[index]
                                )
                                  ? "✅"
                                  : ""
                                  }`}{" "}
                                {dropdownCountries[index]}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </li>
                  </ul>
                  {activeTab === "followUp" ? (
                    <div className={`d-flex justify-content-center ${dark ? `bg-dark text-white` : `bg-white text-dark`}`}>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Call_Back"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Call_Back")}
                      >
                        Call Back
                      </div>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Follow"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Follow")}
                      >
                        Follow up
                      </div>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Interested"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Interested")}
                      >
                        Interested
                      </div>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Not_Interested"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Not_Interested")}
                      >
                        Not Interested
                      </div>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Wrong_Number"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Wrong_Number")}
                      >
                        Wrong Number
                      </div>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Place_with_other"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Place_with_other")}
                      >
                        Place with other
                      </div>
                      <div
                        className={`mx-4 border rounded p-2 text-white font-bold my-1 ${followUpStatus === "Not_Pickup"
                          ? "bg-danger"
                          : "bg-primary"
                          } `}
                        style={{ cursor: "Pointer" }}
                        onClick={() => setFollowupStatus("Not_Pickup")}
                      >
                        Not Pickup
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    className="tab-content recent-transactions-tab-body"
                    id="followUpContent"
                  >
                    <div
                      className={`tab-pane fade ${activeTab === "newTickets" ? "show active" : ""
                        }`}
                      // className="tab-pane fade"
                      id="new-arrivals-tkts-tab-pane"
                      role="tabpanel"
                      aria-labelledby="new-arrivals-tkts-tab"
                      tabindex="0"
                    >
                      <div
                        className={`followups-table table-responsive table-height border rounded ${dark ? `bg-dark text-white` : `bg-white text-dark`}`}
                        
                      >
                        <table className={`table table-border ${dark ? `table-dark text-white` : ``}`}>
                          <thead className="sticky-top">
                            <tr>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">S.No.</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Date/Time</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Country</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Customer Name</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Customer Number</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Customer Email</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Status</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Requirement</th>
                              <th className={`${dark ? `bg-secondary text-white` : ``}`} tabindex="0">Action</th>
                            </tr>
                          </thead>
                          {data ? (
                            <tbody>
                              {data
                                .filter(
                                  (item) =>
                                    item.senderMobile
                                      .toLowerCase()
                                      .includes(shortValue.toLowerCase()) ||
                                    item.senderEmail
                                      .toLowerCase()
                                      .includes(shortValue.toLowerCase()) ||
                                    item.senderName
                                      .toLowerCase()
                                      .includes(shortValue.toLowerCase())
                                )
                                .filter(
                                  (item) =>
                                    countryFilter.length === 0 ||
                                    countryFilter.includes(
                                      item.senderCountryIso
                                    )
                                )
                                .filter(
                                  (item) => item.senderCountryIso !== "IN"
                                )
                                .slice(
                                  itemsPerPage * currentPage,
                                  itemsPerPage * (currentPage + 1)
                                ) // Paginate the data
                                .map((item, index) => (
                                  <tr
                                    key={index}
                                    className={`${localStorage.getItem("selectedLive") &&
                                      localStorage
                                        .getItem("selectedLive")
                                        .includes(item.uniqueQueryId)
                                      ? "table-success"
                                      : ""
                                      }`}
                                    // style={{
                                    //   boxShadow: localStorage.getItem("selectedLive") === item.uniqueQueryId ? "0px 5px 15px 0px gray" : "",
                                    //   zIndex: localStorage.getItem("selectedLive") === item.uniqueQueryId ? 1 : "auto",
                                    //   position: localStorage.getItem("selectedLive") === item.uniqueQueryId ? "relative" : "static"
                                    // }}
                                    onClick={() =>
                                      handleSelecteRow(
                                        index,
                                        item.uniqueQueryId
                                      )
                                    }
                                  >
                                    <td>
                                      {itemsPerPage * currentPage + (index + 1)}
                                      .
                                    </td>
                                    <td>
                                      <span className="text">
                                        {
                                          item.queryTime
                                            .split(" ")[0]
                                            .split("-")[2]
                                        }
                                        -
                                        {convertNumberToStringMonth(
                                          parseInt(
                                            item.queryTime
                                              .split(" ")[0]
                                              .split("-")[1]
                                          )
                                        )}
                                        -
                                        {
                                          item.queryTime
                                            .split(" ")[0]
                                            .split("-")[0]
                                        }
                                      </span>
                                      <br />
                                      <span>
                                        {convertTo12HourFormat(
                                          item.queryTime.split(" ")[1]
                                        )}
                                      </span>
                                    </td>

                                    <td>
                                      <img
                                        style={{ height: 14 }}
                                        src={getFlagUrl(
                                          item.senderCountryIso === "UK"
                                            ? "gb"
                                            : item.senderCountryIso
                                        )}
                                        alt={`${item.senderCountryIso} flag`}
                                      />{" "}
                                      <span>{item.senderCountryIso}</span>
                                    </td>
                                    <td>
                                      <span>{item.senderName}</span>
                                    </td>
                                    <td>
                                      {/* For Mobile Number */}
                                      <CopyToClipboard
                                        text={item.senderMobile}
                                        onCopy={() =>
                                          handleCopy(
                                            item.uniqueQueryId,
                                            item.senderMobile,
                                            "mobile"
                                          )
                                        }
                                      >
                                        <button
                                          style={{
                                            backgroundColor:
                                              copiedId === item.uniqueQueryId &&
                                                copiedType === "mobile"
                                                ? "green"
                                                : "black",
                                            color:
                                              copiedId === item.uniqueQueryId &&
                                                copiedType === "mobile"
                                                ? "white"
                                                : "white",
                                          }}
                                        >
                                          {copiedId === item.uniqueQueryId &&
                                            copiedType === "mobile"
                                            ? "Copied!"
                                            : "Copy"}
                                        </button>
                                      </CopyToClipboard>
                                      <span className="text">
                                        {(roleName === 'Admin' || roleName === 'SuperAdmin')
                                          ? item.senderMobile
                                          : maskMobileNumber(item.senderMobile)}
                                      </span>
                                    </td>
                                    <td>
                                      {/* For Email */}
                                      <CopyToClipboard
                                        text={item.senderEmail}
                                        onCopy={() =>
                                          handleCopy(
                                            item.uniqueQueryId,
                                            item.senderEmail,
                                            "email"
                                          )
                                        }
                                      >
                                        <button
                                          style={{
                                            backgroundColor:
                                              copiedId === item.uniqueQueryId &&
                                                copiedType === "email"
                                                ? "green"
                                                : "black",
                                            color:
                                              copiedId === item.uniqueQueryId &&
                                                copiedType === "email"
                                                ? "white"
                                                : "white",
                                          }}
                                        >
                                          {copiedId === item.uniqueQueryId &&
                                            copiedType === "email"
                                            ? "Copied!"
                                            : "Copy"}
                                        </button>
                                      </CopyToClipboard>
                                      <span className="text">
                                        {(roleName === 'Admin' || roleName === 'SuperAdmin')
                                          ? item.senderEmail
                                          : maskEmail(item.senderEmail)}
                                      </span>
                                    </td>
                                    <td
                                      onClick={() =>
                                        handleShow(item.uniqueQueryId)
                                      }
                                    >
                                      <a
                                        className="btn btn-info dropdown-toggle"
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{
                                          backgroundColor: getColorByStatus(
                                            item.ticketstatus
                                          ),
                                        }}
                                      >
                                        {item.ticketstatus}
                                      </a>
                                    </td>

                                    <td className="hover-cell">
                                      <span className="comment">
                                        {item.subject.length > 30
                                          ? item.subject.slice(0, 30) + "..." // Slice text and add ellipsis if longer than 30 characters
                                          : item.subject}
                                        <br />
                                      </span>

                                      {/* Hidden message span that will show on hover */}
                                      <span className="message">
                                        {item.subject}
                                      </span>
                                    </td>

                                    {/* <span className='text-primary' style={{cursor:"Pointer"}}>see more...</span> */}

                                    <td>
                                      <span className="actions-wrapper">
                                        <Button
                                          onClick={() =>
                                            openTicketJourney(
                                              item.uniqueQueryId
                                            )
                                          }
                                          // onClick={handleView}
                                          data-bs-toggle="modal"
                                          data-bs-target="#followUpModal"
                                          className="btn-action call bg-danger"
                                          title="Get connect on call"
                                        >
                                          <i className="fa-solid fa-info "></i>
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleClick(
                                              item.senderMobile,
                                              item.uniqueQueryId
                                            )
                                          }
                                          // onClick={handleView}
                                          data-bs-toggle="modal"
                                          data-bs-target="#followUpModal"
                                          className="btn-action call rounded-circle"
                                          title="Get connect on call"
                                        >
                                          <i className="fa-solid fa-phone"></i>
                                        </Button>

                                        {/* skype */}
                                        <a
                                          href={`skype:${item.senderMobile}?call`}
                                          data-bs-toggle="modal"
                                          data-bs-target="#followUpModal"
                                          className="btn-action skype-btn rounded-circle"
                                        >
                                          <i class="fa-brands fa-skype fa-xl text-white"></i>
                                        </a>


                                        <a
                                          href={`sms:${item.senderMobile
                                            }?&body=${`Hey ${item.senderName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`}`}
                                          className="btn-action message"
                                          title="Get connect on message"
                                        >
                                          <i className="fa-solid fa-message"></i>
                                        </a>
                                        <Button
                                          onClick={() =>
                                            handleOn(item.uniqueQueryId, item.senderEmail, `Hey ${item.senderName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`)
                                          }
                                          // href="mailto:someone@example.com"
                                          className="btn-action email"
                                          title="Get connect on email"
                                        >
                                          <i className="fa-solid fa-envelope"></i>
                                        </Button>
                                        <a
                                          href={`https://wa.me/${item.senderMobile.replace(
                                            /[+-]/g,
                                            ""
                                          )}?text=${`Hey ${item.senderName}, I just received the inquiry from your ${item.subject}. if you're looking for good deal please type YES👍`}`}
                                          target="_blank"
                                          className="btn-action whatsapp"
                                          title="Get connect on whatsapp"
                                        >
                                          <i className="fa-brands fa-whatsapp"></i>
                                        </a>
                                        <Button
                                          onClick={() => handleQuotation(item)}
                                          className="rounded-circle "
                                          title="Get connect on"
                                        >
                                          <i class="fa-share-from-square"></i>
                                        </Button>

                                        <Button
                                          onClick={() => handleInvoice(item)}
                                          className="rounded-circle "
                                          title="Get connect on"
                                        >
                                          <i className="fa-solid fa-file-invoice"></i>
                                        </Button>
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
                <div className="pagination-controls">
                  <button
                    className="next_prev"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`next_prev ${page === currentPage ? "active" : ""
                        }`}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    className="next_prev"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next
                  </button>
                  <span> Items per page:</span>{" "}
                  <select
                    className="next_prev"
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  >
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
          </div>

          {/* <!-- -------------- -->

 <!-- ------------------------------------------------------------
 --------------------- Call Status Ticket Modal ---------------------
-------------------------------------------------------------- --> */}
          <Modal
            show={show}
            onHide={handleClose}
            className="modal assign-ticket-modal fade"
            id="followUpModal"
            tabIndex="-1"
            aria-labelledby="followUpModalLabel"
            aria-hidden="true"
          >
            <Modal.Header
              closeButton
              className="bg-primary text-white text-center"
            >
              <h1 className="modal-title fs-5 w-100" id="followUpModalLabel">
                Update Ticket Status
              </h1>
            </Modal.Header>
            <Modal.Body
              className="p-4"
              style={{
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select border-0 shadow-sm"
                    id="status"
                    name="ticketStatus"
                    value={formData.ticketStatus}
                    onChange={handleStatusChange}
                    style={{ borderRadius: "4px" }}
                  >
                    <option>Choose Call-Status</option>
                    <option value="Sale">Sale</option>
                    <option value="Follow">Follow-up</option>
                    <option value="Interested">Interested</option>
                    <option value="Not_Interested">Not Interested</option>
                    <option value="Wrong_Number">Wrong Number</option>
                    <option value="Place_with_other">Place with other</option>
                    <option value="Not_Pickup">Not Pickup</option>
                    <option value="hang_up">Hang_up</option>
                  </select>
                </div>

                {showSaleTransaction && (
                  <div className="mb-3">
                    <label htmlFor="transactionDetails" className="form-label">
                      Transaction ID
                    </label>
                    <input
                      type="transaction-details"
                      placeholder="Enter Transaction ID"
                      className="form-control border-0 shadow-sm"
                      id="transactionDetails"
                      name="transactionDetails"
                      value={formData.SaleTransaction}
                      onChange={handleChange}
                      style={{ borderRadius: "4px" }}
                    />
                  </div>
                )}

                {showFollowUpDate && (
                  <div className="mb-3">
                    <label htmlFor="followUpDateTime" className="form-label">
                      Follow Up Date and Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control border-0 shadow-sm"
                      id="followUpDateTime"
                      name="followUpDateTime"
                      value={formData.followUpDateTime}
                      onChange={handleChange}
                      onClick={(e) => e.target.showPicker()}
                      step="2"
                      style={{ borderRadius: "4px" }}
                    />
                  </div>
                )}

                <div className="col-12 mb-3">
                  <label htmlFor="comment" className="form-label">
                    Comment
                  </label>
                  <textarea
                    rows="4"
                    className="form-control border-0 shadow-sm"
                    placeholder="Describe your conversation with client"
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: "4px" }}
                  ></textarea>
                </div>

                {error && <p className="text-danger">{error}</p>}

                <div className="modal-footer justify-content-center border-0 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    data-bs-dismiss="modal"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                  <button className="btn btn-primary px-4" type="submit">
                    Save Changes
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>

          <Modal
            show={on}
            onHide={handleOff}
            className="modal assign-ticket-modal fade"
            id="followUpModal"
            tabindex="-1"
            aria-labelledby="followUpModalLabel"
            aria-hidden="true"
          >
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
                    <div className="d-flex justify-content-between px-5">
                      <input
                        type="text"
                        placeholder="Enter product Name"
                        value={serchValue}
                        onChange={handleInputChange}
                        className="p-2 bg-white text-black"
                      />
                      {productsIds.length > 0 && (
                        <div
                          className="bg-primary text-white rounded p-2 hover:shadow-lg"
                          style={{
                            height: "30px",
                            fontSize: "12px",
                            cursor: "Pointer",
                          }}
                          onClick={() => setProductIds([])}
                        >
                          Deselect All
                        </div>
                      )}
                    </div>

                    <div className="container mt-3 border p-3 rounded">
                      <div className="row" style={{ height: "500px" }}>
                        {productsList &&
                          productsList
                            .filter((product) =>
                              serchValue.length > 0
                                ? product.name
                                  .toLowerCase()
                                  .includes(serchValue.toLowerCase())
                                : true
                            )
                            .filter((product) => product.images !== null)
                            .map((product, index) => (
                              <div
                                key={index}
                                className="col-12 col-md-6 mb-3 d-flex justify-content-center "
                                onClick={() =>
                                  handleToggleProduct(product.productId)
                                }
                              >
                                <div
                                  className={`card p-2 position-relative ${productsIds.includes(product.productId) &&
                                    "shadow-lg bg-info"
                                    }`}
                                  style={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    height: "80px",
                                  }}
                                >
                                  {/* Brand Tag */}
                                  <div
                                    className="position-absolute bottom-0 start-0 bg-success text-white px-2 py-1"
                                    style={{
                                      fontSize: "10px",
                                      borderTopLeftRadius: "4px",
                                      borderBottomRightRadius: "4px",
                                    }}
                                  >
                                    {product.brand}
                                  </div>

                                  <div className="d-flex flex-column flex-md-row align-items-center">
                                    <div>
                                      <img
                                        src={
                                          product.images && product.images[0]
                                        }
                                        alt="Product"
                                        className="img-fluid rounded"
                                        style={{ maxWidth: "60px" }}
                                      />
                                    </div>

                                    {/* Product Details Section */}
                                    <div className="ms-2 w-100 ">
                                      <h6
                                        className="card-title mb-1"
                                        style={{ fontSize: "12px" }}
                                      >
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

                  <div className="mt-3">
                    <label
                      htmlFor="textarea fw-bold"
                      style={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      Enter Message
                    </label>
                    <textarea
                      style={{ height: "150px", width: "100%" }}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="text-black bg-white p-3"
                      placeholder="PLease Enter Meassage To Client"
                    ></textarea>
                  </div>

                  <button onClick={() => handleSendTemplateMail()}>
                    Send Mail
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>

          {/* <!-- Modal ticket popup --> */}
          <Modal
            show={view}
            onHide={handleCloses}
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
                            <i className="fa-solid fa-ticket"></i>{" "}
                            TKTID:MEDEQ089N
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="contact-info-row d-flex align-items-center justify-content-between">
                        <a href="" className="contact-info phone">
                          <i className="fa-solid fa-phone"></i> +91 9918293747
                        </a>
                        <a className="contact-info email" href="#">
                          <i className="fa-solid fa-envelope-open-text"></i>
                          example@email.com
                        </a>
                      </div>
                      <div className="main-content-area">
                        <form>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label"
                              for="flexCheckDefault"
                            >
                              Default checkbox
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckChecked"
                              checked
                            />
                            <label
                              className="form-check-label"
                              for="flexCheckChecked"
                            >
                              Checked checkbox
                            </label>
                          </div>
                          <div className="col-12">
                            <label htmlFor="comment" className="form-label">
                              Comment
                            </label>
                            <textarea
                              rows="4"
                              className="form-control"
                              placeholder="Discribe your conversation with client"
                              id="comment"
                              name="comment"
                            ></textarea>
                          </div>
                          <div className="modal-footer justify-content-center border-0">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                              onClick={handleCloses}
                            >
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
            style={{ width: "80%", maxWidth: "600px", border: "none" }}
          >
            <div className="position-fixed vh-100 vw-100 d-flex flex-coloumn justify-content-center align-items-center">
              <TicketJourney
                tktid={selctedTicketInfo}
                closeFun={closeTicketJourney}
              />
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
            <div className="d-flex justify-content-between align-items-center p-3">
              <h1 className="w-100 text-center mb-3" id="followUpModalLabel">
                <u>Raise Invoice</u>
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleInvoice}
              ></button>
            </div>
            <InvoiceBox ticket={ticketinvoicedata} />
          </Modal>
          <Modal
            show={isQuotationOn}
            onHide={handleQuotation}
            id="followUpModal"
            tabIndex="-1"
            aria-labelledby="followUpModalLabel"
            aria-hidden="true"
            dialogClassName="fullscreen-modal" // Add a custom class here
          >
            {/* Modal Header with Close Button */}
            <div className="d-flex justify-content-between align-items-center p-3">
              <h1 className="w-100 text-center mb-3" id="followUpModalLabel">
                <u>Send Quotation</u>
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleQuotation}
              ></button>
            </div>

            {/* Modal Body */}
            <QuotationBox ticket={ticketquattiondata} />
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
            <TicketJourney
              tktid={selctedTicketInfo}
              closeFun={closeTicketJourney}
            />
          </Modal>
        </div>
      </div>

      {/* when select Sale */}
      <Modal
        show={showModal}
        onHide={handleClosee}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <SaleConframtion ticketId={uniqueQueryId} />
        <div className="modal-body">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClosee}
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        show={isCompoeseOpen}
        // onHide={() => setIsComposeOpen(false)}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        className="rounded-lg"  // Add Tailwind class to make the modal rounded
      >
        <EmailCompose autoClose={handleCloseCompose} email={selectEmailForInvoice} body={emailBody} />
        <div className="modal-body">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsComposeOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}

export default live_tickets;