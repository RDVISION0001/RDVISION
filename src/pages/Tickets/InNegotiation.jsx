import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axiosInstance from "../../axiosInstance";
import temp1 from "../../assets/emailtemp/temp1.png";
import temp2 from "../../assets/emailtemp/temp2.png";
import temp3 from "../../assets/emailtemp/temp3.png";
import SaleProductInfo from '../../components/SaleProductInfo'


// Clipboard copy
import { CopyToClipboard } from "react-copy-to-clipboard";

// Authentication context
import { useAuth } from "../../auth/AuthContext";
import TicketJourney from "../../components/TicketJourney";
import InvoiceBox from "../../components/InvoiceBox";

import { toast } from "react-toastify";
import QuotationBox from "../../components/QuotationBox";
import InvoiceInfo from "../../components/InvoiceInfo";
import { useParams } from "react-router-dom";
import TicketTrack from "../../components/TicketTrack";
import SaleConframtion from "../../components/SaleConframtion";
import EmailCompose from "../../components/EmailCompose";

function InNegotiation() {
  const [isCompoeseOpen, setIsComposeOpen] = useState(false)

  const { date } = useParams(); // Retrieve the 'date' parameter
  const [selectedKey, setSelectedKey] = useState(null);
  const { setFolowupUpdate, dark } = useAuth();
  const { setUserReportReloader } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const handleClosee = () => setShowModal(false);

  const [list, setlist] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStage, setSelectedStage] = useState(2); // Default stage is 2
  const { userId } = useAuth();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    ticketStatus: "",
    comment: "",
    followUpDateTime: "",
  });
  const [showSaleTransaction, setShowTransaction] = useState(false);
  const [showFollowUpDate, setShowFollowUpDate] = useState(false);
  const [on, setOn] = useState(false);
  const [senderNameForEmail, setSenderNameForEmail] = useState("");
  const [uniqueQueryId, setUniqueQueryId] = useState(null);
  const [senderEmailFormail, setSenderEmailForMail] = useState("");
  const [senderMobile, setSenderMobile] = useState("");
  const [productArray, setProductArray] = useState([]);
  const [assignedTo, setAssignedTo] = useState(
    localStorage.getItem("roleName") === "SeniorSuperVisor" ? 0 : userId
  );
  const [buttonFilterValue, setbuttonFilterValue] = useState("");
  const [emailData, setEmailData] = useState({
    ticketId: "",
    name: "",
    email: "",
    mobile: "",
    productList: [],
  });
  const [productsList, setProductsList] = useState([]);
  const [view, setView] = useState(false);
  const [selctedTicketInfo, setSelectedTicketInfo] = useState("");
  const [selectTicketForInvoice, setSelectTicketForInvoice] = useState(null);
  const [selectNameForInvoice, setSelectNameForInvoice] = useState(null);
  const [selectMobileForInvoice, setSelectMobileForInvoice] = useState(null);
  const [selectEmailForInvoice, setSelectEmailForInvoice] = useState(null);
  const [filterdate, setFilterDate] = useState(date);
  const [callId, setCallId] = useState(0);
  const [response, setResponse] = useState(null);
  const [shortValue, setShortValue] = useState("");
  const handleShortDataValue = (e) => {
    setShortValue(e.target.value);
  };

  const extracxtDate = (localdatetime) => {
    if (filterdate && localdatetime) {
      const a =
        parseInt(localdatetime[0]) ===
        parseInt(filterdate && filterdate.split("-")[0]);
      const b =
        parseInt(localdatetime[1]) ===
        parseInt(filterdate && filterdate.split("-")[1]);
      const c =
        parseInt(localdatetime[2]) ===
        parseInt(filterdate && filterdate.split("-")[2]);
      return a && b && c;
    }
  };
  const toggleCheckbox = () => {
    setlist(!list); // Toggle the state
  };
  const getFlagUrl = (countryIso) =>
    `https://flagcdn.com/32x24/${countryIso.toLowerCase()}.png`;
  const [isInvoiceOn, setIsInvoiceOn] = useState(false);
  const [negodata, setNegoData] = useState([]);
  const handleInvoice = (nego) => {
    setNegoData(nego);
    setIsInvoiceOn(!isInvoiceOn);
  };

  const [isQuotationOn, setIsQuotationOn] = useState(false);
  const [negoquotation, setNegoQuotation] = useState([]);
  const handleQuotation = (nego) => {
    setNegoQuotation(nego);
    setIsQuotationOn(!isQuotationOn);
  };
  const [dorpedInStage, setDropedinStage] = useState(null);
  const handleClose = () => {
    setShow(false);
    setShowTransaction(false);
    setFormData((prev) => ({
      ...prev,
      ticketStatus: "",
    }));
  };
  const handleShow = (queryId, targetStage) => {
    setDropedinStage(targetStage);
    setUniqueQueryId(queryId);
    setShow(true);
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

      const apiPath =
        uniqueQueryId.length < 15 ? "third_party_api/ticket" : "upload";
      const res = await axiosInstance.post(
        `/${apiPath}/updateTicketResponse/${uniqueQueryId}`,
        {},
        { params }
      );
      setResponse(res.data.dtoList);
      toast.success("Update successfully!");
      setFolowupUpdate(uniqueQueryId);
      handleClose();
      fetchData(params[activeTab], currentPage, negosPerPage);
      setError(null);
      setCallId(0);
      setUserReportReloader((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }

    if (!list) {
      fetchDatas1();
      fetchDatas2();
      fetchDatas3();
    }

    setDropedinStage(null);
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
      handleClose();
    } else {
      setShowTransaction(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOff = () => {
    setOn(false);
    setProductArray([]);
  };
  const handleOn = (email, body) => {

    setSelectEmailForInvoice(email);
    setIsComposeOpen(!isCompoeseOpen);
    setEmailBody(body)
  };

  const [stage1Data, setSatge1Data] = useState([]);
  const [stage2Data, setSatge2Data] = useState([]);
  const [stage3Data, setSatge3Data] = useState([]);

  useEffect(() => {
    if (!list) {
      fetchDatas1();
      fetchDatas2();
      fetchDatas3();
    }
  }, [list, assignedTo]);
  const fetchDatas1 = async (stage) => {
    try {
      const response = await axiosInstance.post(
        "/third_party_api/ticket/negotiationstagebased",
        {
          user: assignedTo,
          stage: 1,
        }
      );
      setSatge1Data(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };
  const fetchDatas2 = async (stage) => {
    try {
      const response = await axiosInstance.post(
        "/third_party_api/ticket/negotiationstagebased",
        {
          user: assignedTo,
          stage: 2,
        }
      );
      setSatge2Data(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };
  const fetchDatas3 = async (stage) => {
    try {
      const response = await axiosInstance.post(
        "/third_party_api/ticket/negotiationstagebased",
        {
          user: assignedTo,
          stage: 3,
        }
      );
      setSatge3Data(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };

  const handleSelecteRow = (index, ticketId) => {
    setSelectedKey(index);

    // Get the current list of selected tickets from localStorage
    let selectedTickets =
      JSON.parse(localStorage.getItem("selectedNego")) || [];
    // Add the new ticket ID if it doesn't already exist
    if (!selectedTickets.includes(ticketId)) {
      selectedTickets.push(ticketId);
    }

    // Update localStorage with the updated list
    localStorage.setItem("selectedNego", JSON.stringify(selectedTickets));
  };

  // Define stages
  const stages = [
    {
      name: " Not Pickup, Not interested,Wrong Number",
      color: "#ed1c24",
      stage: 1,
    },
    {
      name: "Palce With Others, Followup, Interested,",
      color: "#f7941e",
      stage: 2,
    },
    { name: "Sale", color: "#8dc63f", stage: 3 },
    { name: "Tracking", color: "#d6009b", stage: 4 },
    { name: "ASS", color: "#00aeef", stage: 5 },
  ];

  // Fetch data from API
  const fetchData = async (stage) => {
    try {
      const response = await axiosInstance.post(
        "/third_party_api/ticket/negotiationstagebased",
        {
          user: assignedTo,
          stage: stage,
        }
      );
      setTicketData(response.data);
    } catch (error) {
      setError(error);
      console.error("There was an error making the request!", error);
    }
  };

  //handle select products
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
  //handle send email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await fetchDataForEmail();
      handleOff();
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error("Error sending email");
    }
  };
  //handle close
  const handleCloses = () => setView(false);
  const handleView = (queryId) => {
    setUniqueQueryId(queryId);
    setView(true);
  };

  useEffect(() => {
    fetchData(selectedStage);
  }, [selectedStage, assignedTo]);

  //masking mobile
  const maskMobileNumber = (number) => {
    if (!number || number.length < 4) return number;
    return number.slice(0, -4) + "XXXX";
  };

  //masking EMail
  const maskEmail = (email) => {
    if (email) {
      const [user, domain] = email.split("@");
      const maskedUser =
        user.length > 4 ? `${user.slice(0, 4)}****` : `${user}****`;
      return `${maskedUser}@${domain}`;
    }
  };

  //click to call
  const handleClick = async (number) => {
    try {
      const response = await axiosInstance.post(
        "/third_party_api/ticket/clickToCall",
        {
          number: formatNumberAccordingToHodu(number),
          userId,
        }
      );
      setCallId(response.data.call_id);
      setUserReportReloader((prev) => prev + 1);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  //close ticket journey
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

  const formatNumberAccordingToHodu = (number) => {
    if (number.includes("+")) {
      return number.replace(/[+-]/g, "");
    } else {
      return "1" + number;
    }
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

  const rowcolor = (ticketStatus) => {
    const colors = {
      New: "table-primary",
      Sale: "table-success",
      Follow: "table-info",
      Interested: "table-warning",
      Not_Interested: "table-danger",
      Wrong_Number: "table-secondary",
      Not_Pickup: "table-secondary",
    };
    return colors[ticketStatus] || "white";
  };
  //color of styatus
  const getColorByStatus = (ticketStatus) => {
    const colors = {
      New: "dodgerblue",
      Sale: "green",
      Follow: "#37d6d6",
      Interested: "orange",
      Not_Interested: "red",
      Wrong_Number: "gray",
      Not_Pickup: "lightblue",
    };
    return colors[ticketStatus] || "white";
  };

  function formatFollowUpDate(followUpDateTime) {
    const [year, month, day] = followUpDateTime;
    // Convert month to 2-digit format and day to 2-digit format
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  //pagination
  const [currentPage, setCurrentPage] = useState(1); // To manage current page
  const [rowsPerPage, setRowsPerPage] = useState(1000); // To manage rows per page

  // Calculate total pages
  const totalPages = Math.ceil(
    ticketData
      .filter(
        (item) =>
          (item.senderName &&
            item.senderName.toLowerCase().includes(shortValue.toLowerCase())) ||
          (item.firstName &&
            item.firstName.toLowerCase().includes(shortValue.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(shortValue.toLowerCase())) ||
          (item.mobileNumber &&
            item.mobileNumber
              .toLowerCase()
              .includes(shortValue.toLowerCase())) ||
          (item.senderMobile &&
            item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()))
      )
      .filter((data) =>
        filterdate ? extracxtDate(data.followUpDateTime) : data
      ).length / rowsPerPage
  );

  // Handle pagination
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // Get the current page data
  const currentData = ticketData
    .filter(
      (item) =>
        (item.senderName &&
          item.senderName.toLowerCase().includes(shortValue.toLowerCase())) ||
        (item.firstName &&
          item.firstName.toLowerCase().includes(shortValue.toLowerCase())) ||
        (item.email &&
          item.email.toLowerCase().includes(shortValue.toLowerCase())) ||
        (item.mobileNumber &&
          item.mobileNumber.toLowerCase().includes(shortValue.toLowerCase())) ||
        (item.senderMobile &&
          item.senderMobile.toLowerCase().includes(shortValue.toLowerCase()))
    )
    .filter((ticket) => {
      // If buttonFilterValue is an empty string, return all tickets
      if (buttonFilterValue === "") {
        return true;
      }
      // Otherwise, filter based on ticketStatus
      return (
        ticket.ticketstatus.toLowerCase() === buttonFilterValue.toLowerCase()
      );
    })
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const handleDragStart = (e, item, stage) => {
    setDraggedItem(item);
    setDragSource(stage);
    e.dataTransfer.effectAllowed = "move";
  };

  const [followCount, setFollowupCount] = useState(0);
  const [saleCount, setSaleCount] = useState(0);
  const [interestedCount, setInterestedCOunt] = useState(0);
  const [hangUpCount, setHangupCount] = useState(0);
  const [placeWithOtherCOunt, setPlaceWithOtherCount] = useState(0);
  const [notPickupCount, setNotPickupCount] = useState(0);
  const [wrongNumberCount, setWrongNumberCount] = useState(0);
  const [notInteresteCount, setNotIntrestedCount] = useState(0);
  const [users, setAllUsers] = useState([]);
  const [selectedCloser, setSelectedCloser] = useState();

  const changeUser = (e) => {
    setAssignedTo(e.target.value);
    setFollowupCount(0);
    setSaleCount(0);
    setInterestedCOunt(0);
    setNotIntrestedCount(0);
    setNotPickupCount(0);
    setPlaceWithOtherCount(0);
    setWrongNumberCount(0);
    setHangupCount(0);
  };

  useEffect(() => {
    fetchNoOfTickets();
    if (localStorage.getItem("roleName") === "SeniorSuperVisor") {
      fetchAllUsers();
    }
  }, [assignedTo]);

  const fetchAllUsers = async () => {
    const response = await axiosInstance.get("/user/getAllCloser");
    setAllUsers(response.data);
  };
  const fetchNoOfTickets = async () => {
    const response = await axiosInstance.get(
      `/third_party_api/ticket/getcountoftcikets/${assignedTo}`
    );
    const resutl = response.data;
    for (let i = 0; i < resutl.length; i++) {
      if (resutl[i].Follow) {
        setFollowupCount(resutl[i].Follow);
      } else if (resutl[i].Not_Interested) {
        setNotIntrestedCount(resutl[i].Not_Interested);
      } else if (resutl[i].Not_Pickup) {
        setNotPickupCount(resutl[i].Not_Pickup);
      } else if (resutl[i].Wrong_Number) {
        setWrongNumberCount(resutl[i].Wrong_Number);
      } else if (resutl[i].Place_with_other) {
        setPlaceWithOtherCount(resutl[i].Place_with_other);
      } else if (resutl[i].Interested) {
        setInterestedCOunt(resutl[i].Interested);
      } else if (resutl[i].Sale) {
        setSaleCount(resutl[i].Sale);
      } else if (resutl[i].hang_up) {
        setHangupCount(resutl[i].hang_up);
      }
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();

    if (dragSource !== targetStage) {
      // Move the item to the target stage
      const sourceData = {
        stage1: stage1Data,
        stage2: stage2Data,
        stage3: stage3Data,
      };

      setSatge1Data(
        sourceData.stage1.filter((ticket) => ticket !== draggedItem)
      );
      setSatge2Data(
        sourceData.stage2.filter((ticket) => ticket !== draggedItem)
      );
      setSatge3Data(
        sourceData.stage3.filter((ticket) => ticket !== draggedItem)
      );

      if (targetStage === "stage1") {
        setSatge1Data((prev) => [...prev, draggedItem]);
      } else if (targetStage === "stage2") {
        setSatge2Data((prev) => [...prev, draggedItem]);
      } else if (targetStage === "stage3") {
        setSatge3Data((prev) => [...prev, draggedItem]);
      }
      console.log(
        `Dropped Ticket ID: ${draggedItem.uniqueQueryId} to ${targetStage}`
      );
      handleShow(draggedItem.uniqueQueryId, targetStage);
      if (targetStage === "stage3") {
        setShowTransaction(true);
        setFormData((preData) => ({
          ...preData,
          ticketStatus: "Sale",
        }));
      }

      // Reset dragged item and source

      setDraggedItem(null);
      setDragSource(null);
    }
  };



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

  const formatLocalDateTime = (localDateTimeArray) => {
    // Destructure the input array into individual date components
    const [year, month, day, hours, minutes] = localDateTimeArray;

    // Define month names in a short form (JAN, FEB, etc.)
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour format to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Format minutes to always have two digits
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Construct the formatted date string
    const formattedDate = `${day}-${monthNames[month - 1]
      }-${year} ${formattedHours}:${formattedMinutes} ${period}`;

    return formattedDate;
  };

  function convertDateFormat(inputDate) {
    // Parse the input date string
    const date = new Date(inputDate);

    // Define an array for month abbreviations
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    // Get individual date components
    const day = date.getUTCDate(); // Get the day of the month
    const month = monthNames[date.getUTCMonth()]; // Get the abbreviated month
    const year = date.getUTCFullYear(); // Get the full year

    // Get the time components and format them
    let hours = date.getUTCHours(); // Get hours
    const minutes = date.getUTCMinutes().toString().padStart(2, "0"); // Get minutes and ensure two digits
    const ampm = hours >= 12 ? "pm" : "am"; // Determine AM/PM
    hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

    // Return the formatted date string
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }
  const stageSelection = (stage) => {
    setbuttonFilterValue("");
    setSelectedStage(stage);
  };

  const fetchProducts = async () => {
    const response = await axiosInstance.get("product/getAllProducts");
    setProductsList(response.data.dtoList);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  //templates email
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [text, setText] = useState("");
  const [serchValue, setserchValue] = useState("");
  const [productsIds, setProductIds] = useState([]);

  const handleInputChange = (e) => {
    setserchValue(e.target.value); // Update state with the input's value
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
        const response = await axiosInstance.post(`/email/sendsugetionmail`, {
          uploadTicket: {
            uniqueQueryId: selectTicketForInvoice,
          },
          ticket: {
            uniqueQueryId: selectTicketForInvoice,
          },
          text: text,
          temp: selectedTemplate,
          productsIds: productsIds,
          userId,
        });
        setUserReportReloader((prev) => prev + 1);
        toast.success("Email Sent");
      } catch (e) {
        toast.error("Some Error Occurs");
      }
    }
  };

  const [emailBody, setEmailBody] = useState("")

  const [copiedId, setCopiedId] = useState(null); // Track copied uniqueQueryId
  const [copiedType, setCopiedType] = useState(null); // Track if mobile or email is copied

  const handleCopy = (uniqueQueryId, text, type) => {
    setCopiedId(uniqueQueryId); // Set the copied ID
    setCopiedType(type); // Track whether it's a mobile number or email
    addCopyRecord(uniqueQueryId, text); // Log the copied record
  };
  function formatDate(dateArray) {
    if (dateArray) {
      const [year, month, day] = dateArray;
      const months = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];
      const formattedDay = String(day).padStart(2, "0");
      const formattedMonth = months[month - 1];
      return `${formattedDay}-${formattedMonth}-${year}`;
    }
  }

  // sale ifo method

  const [saleInfoModal, setsaleInfoModal] = useState(false);
  const [saleinfoItem, setSaleInfoItem] = useState([])

  const hnadleSaleInfo = (item) => {
    setSaleInfoItem(item)
    setsaleInfoModal(!saleInfoModal);
  };

  const handleClosesSale = () => {
    setsaleInfoModal(false); // Hides the modal
  };

  const handleCloseCompose = () => {
    setIsComposeOpen(false)
  }

  return (
    <>
      {localStorage.getItem("roleName") === "SeniorSuperVisor" && (
        <div className={`p-3 ${dark ? `bg-dark` : ``}`} style={{ textAlign: "start" }}>
          <label className={`m-3 fw-bold ${dark ? `bg-dark` : `text-dark`}`}>
            Select Closer to see their Negotiation tickets
          </label>
          <select
            value={assignedTo}
            onChange={changeUser}
            className="form-select w-25"
            aria-label="Default select example"
          >
            <option selected value="0">
              All negotiations
            </option>
            {users
              .filter((user) => user.roleId === 4)
              .map((user, index) => (
                <option value={user.userId}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className={`d-flex justify-content-end ${dark ? `bg-dark` : ``} `}>
        {localStorage.getItem("roleName") !== "SeniorSuperVisor" && (
          <div className={`d-flex justify-content-center ${dark ? `bg-dark` : ``} `}>
            <div className="form-check" style={{ marginLeft: "10px" }}>
              <input
                className={`form-check-input ${dark ? `text-white` : ``} `}
                type="checkbox"
                id="flexCheckDefault"
                checked={assignedTo === userId}
                onChange={() => setAssignedTo(userId)} // Call toggle method on change
              />
              <label className={`form-check-label ${dark ? `text-white` : ``} `} htmlFor="flexCheckDefault">
                Assigned to me
              </label>
            </div>
            <div className="form-check" style={{ marginLeft: "10px" }}>
              <input
                className="form-check-input"
                type="checkbox"
                id="flexCheckChecked"
                checked={assignedTo === 0} // Checked if 'list' is false
                onChange={() => setAssignedTo(0)} // Call toggle method on change
              />
              <label className={`form-check-label ${dark ? `text-white` : ``} `} htmlFor="flexCheckChecked">
                All negotiation tickets
              </label>
            </div>
          </div>
        )}
        <div className="w-25 d-flex justify-content-center">
          <div className={`form-check-label ${dark ? `text-white` : ``} `}>choose view</div>
          <div className={`form-check-label ${dark ? `text-white` : ``} `} style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              checked={list}
              onChange={toggleCheckbox} // Call toggle method on change
            />
            <label className={`form-check-label ${dark ? `text-white` : ``} `} htmlFor="flexCheckDefault">
              List
            </label>
          </div>
          <div className="form-check" style={{ marginLeft: "10px" }}>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckChecked"
              checked={!list} // Checked if 'list' is false
              onChange={toggleCheckbox} // Call toggle method on change
            />
            <label className={`form-check-label ${dark ? `text-white` : ``} `} htmlFor="flexCheckChecked">
              Card
            </label>
          </div>
        </div>
      </div>
      <div>
        {list && (
          <div style={{ width: "100%" }}>
            {/* Stages */}
            <section className={`followup-table-section py-3 ${dark ? `bg-dark` : ``} `}>
              <div
                className="pipeline-container"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {stages.map((stage, index) => (
                  <div
                    key={index}
                    onClick={() => stageSelection(stage.stage)} // Set selected stage
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                      width: `calc(100% / ${stages.length})`,
                      cursor: "pointer", // Add cursor pointer to indicate it's clickable
                      fontSize: "inherit", // Default to inherit if not selected
                      color: selectedStage === stage.stage ? "black	" : "white", // Change text color for selected stage
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: stage.color,
                        width: "100%", // Responsive width
                        maxWidth: "23rem", // Restrict the maximum width
                        height: "auto", // Allow height to adjust
                        minHeight: "100px", // Set minimum height
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        flexDirection: "column",
                        clipPath:
                          "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
                        margin: "10px auto", // Add margin for spacing
                        zIndex: 1,
                        boxShadow:
                          selectedStage === stage.stage
                            ? "0 0 10px 5px black"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize:
                            selectedStage === stage.stage ? "1.5rem" : "1rem", // Responsive font size
                          color:
                            selectedStage === stage.stage ? "black" : "white",
                          textAlign: "center", // Ensure text is centered
                        }}
                      >
                        Stage: {stage.stage}
                      </div>
                      <div style={{ padding: "5px", fontSize: "0.75rem" }}>
                        {stage.name}
                      </div>
                      {stage.stage < 4 && (
                        <div
                          style={{
                            padding: "5px",
                            fontSize: "0.75rem",
                            textAlign: "center",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            width: "90%", // Responsive width
                            maxWidth: "200px", // Limit max width
                          }}
                          className={`${dark ? `bg-dark text-white` : `text-dark`} `}
                        >
                          {stage.stage < 4 && "Number OF tickets :-"}
                          {stage.stage === 1 &&
                            notPickupCount +
                            notInteresteCount +
                            wrongNumberCount +
                            hangUpCount}
                          {stage.stage === 2 &&
                            followCount + interestedCount + placeWithOtherCOunt}
                          {stage.stage === 3 && saleCount}
                        </div>
                      )}
                    </div>

                    {index < stages.length - 1 && (
                      <div
                        style={{
                          width: "0",
                          height: "0",
                          borderTop: "50px solid transparent",
                          borderBottom: "50px solid transparent",
                          borderLeft: `25px solid ${stages[index + 1].color}`,
                          position: "absolute",
                          right: "-25px",
                          zIndex: 0,
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className={`filter-section ${dark ? `bg-dark` : ``} px-4 `}>
              <div className="row">
                <div className="col-md-5">
                  <div className="search-wrapper">
                    <input
                      type="text"
                      name="search-user"
                      id="searchUsers"
                      className={`form-control  ${dark ? `text-white bg-dark` : ``}`}
                      placeholder="Search Department or Name..."
                      value={shortValue}
                      onChange={handleShortDataValue}
                    />
                    <div className="search-icon">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                  </div>
                </div>
                {selectedStage === 2 && (
                  <div className="col-md-5">
                    <div className="search-wrapper d-flex justify-content-center align-items-center">
                      <input
                        type="date"
                        name="filterdate"
                        className={`form-control  ${dark ? `text-white bg-dark` : ``}`}
                        placeholder="Search Department or Name..."
                        value={filterdate}
                        onChange={(e) => setFilterDate(e.target.value)}
                      />
                      <div className="search-icon">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </div>
                      <i
                        className="fa-solid fa-filter-circle-xmark fa-xl ms-2 hover-scale"
                        onClick={() => setFilterDate(null)}
                      ></i>
                    </div>
                  </div>
                )}
              </div>
            </section>
            {/*Filters*/}

            {selectedStage < 4 && (
              <section className={`d-flex justify-content-center ${dark ? `bg-dark` : ``}`}>
                <div className=" w-50 d-flex justify-content-around p-3">
                  {selectedStage !== 3 && (
                    <button
                      className={`${buttonFilterValue === "" ? "bg-success" : "bg-primary"
                        }`}
                      onClick={() => setbuttonFilterValue("")}
                    >
                      All
                    </button>
                  )}
                  {selectedStage === 2 && (
                    <>
                      <button
                        className={`${buttonFilterValue === "Follow"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("Follow")}
                      >
                        Follow
                      </button>
                      {/* <button className={`${buttonFilterValue === "Call_Back" ? "bg-success" : "bg-primary"}`} onClick={() => setbuttonFilterValue("Call_Back")}>Call_Back</button> */}
                      <button
                        className={`${buttonFilterValue === "Interested"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("Interested")}
                      >
                        Interested
                      </button>
                      <button
                        className={`${buttonFilterValue === "Place_with_other"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("Place_with_other")}
                      >
                        Place With Others
                      </button>
                    </>
                  )}
                  {selectedStage === 1 && (
                    <>
                      {" "}
                      <button
                        className={`${buttonFilterValue === "Wrong_Number"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("Wrong_Number")}
                      >
                        Wrong_Number
                      </button>
                      <button
                        className={`${buttonFilterValue === "Not_Pickup"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("Not_Pickup")}
                      >
                        Not-pickup
                      </button>
                      <button
                        className={`${buttonFilterValue === "Not_Interested"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("Not_Interested")}
                      >
                        Not-Interested
                      </button>
                      <button
                        className={`${buttonFilterValue === "hang_up"
                          ? "bg-success"
                          : "bg-primary"
                          }`}
                        onClick={() => setbuttonFilterValue("hang_up")}
                      >
                        Hang_Up
                      </button>
                    </>
                  )}
                </div>
              </section>
            )}
            {/* Table */}
            {selectedStage < 4 && (
              <section className={`followup-table-section py-3 ${dark ? `bg-dark` : ``}`}>
                <div className="">
                  <div className="">
                    <div className={`followups-table table-responsive border rounded table-height ${dark ? `table-dark` : ``}`}>
                      <table className={`table table-hover ${dark ? `table-dark ` : ``}`}>
                        <thead className={`sticky-header ${dark ? `bg-secondary ` : ``}`}>
                          <tr>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">S.No.</th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0" style={{ width: "120px" }}>
                              Date/Time
                            </th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">Country</th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">Customer Name</th>
                            <th className={`whitespace-nowrap ${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0" >
                              Mob Number
                            </th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">Customer Email</th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">Status</th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">Requirement</th>
                            {selectedStage === 2 && (
                              <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">
                                Follow Date/Time
                              </th>
                            )}
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0" style={{ width: '200px' }}>Follow Comment</th>
                            <th className={`${dark ? `text-dark bg-secondary` : ``}`} tabIndex="0">Action</th>
                            {selectedStage === 3 && (
                              <th tabIndex="0">Sale Date</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {currentData
                            .filter((data) =>
                              filterdate
                                ? extracxtDate(data.followUpDateTime)
                                : data
                            )
                            .map((nego, index) => (
                              // ${localStorage.getItem("selectedNego") && localStorage.getItem("selectedNego").includes(nego.uniqueQueryId) ? "table-success" :  for selected row
                              <tr
                                key={index}
                                className={`${localStorage
                                  .getItem("selectedNego")
                                  ?.includes(nego.uniqueQueryId)
                                  ? "table-danger"
                                  : ""
                                  } ${rowcolor(nego.ticketstatus)}`}
                                style={{
                                  boxShadow:
                                    localStorage.getItem("selectedNego") &&
                                      localStorage
                                        .getItem("selectedNego")
                                        .includes(nego.uniqueQueryId)
                                      ? "0px 5px 15px 0px gray"
                                      : "",
                                  zIndex:
                                    localStorage.getItem("selectedNego") &&
                                      localStorage
                                        .getItem("selectedNego")
                                        .includes(nego.uniqueQueryId)
                                      ? 1
                                      : "auto",
                                  position:
                                    localStorage.getItem("selectedNego") &&
                                      localStorage
                                        .getItem("selectedNego")
                                        .includes(nego.uniqueQueryId)
                                      ? "relative"
                                      : "static",
                                }}
                                onClick={() =>
                                  handleSelecteRow(index, nego.uniqueQueryId)
                                }
                              >
                                <td>
                                  {rowsPerPage * (currentPage - 1) +
                                    (index + 1)}
                                  .
                                </td>
                                <td>
                                  <span className="text">
                                    {nego.senderName ? (
                                      <div className="d-flex flex-column">
                                        <span className="text">
                                          {convertDateFormat(nego.queryTime)}
                                        </span>
                                      </div>
                                    ) : (
                                      nego.uploadDate &&
                                      [
                                        nego.uploadDate[2],
                                        convertNumberToStringMonth(
                                          parseInt(nego.uploadDate[1])
                                        ),
                                        nego.uploadDate[0],
                                      ].join("-")
                                    )}
                                  </span>
                                </td>
                                <td>
                                  <img
                                    src={
                                      nego.senderCountryIso &&
                                      getFlagUrl(nego.senderCountryIso)
                                    }
                                    alt={`${nego.senderCountryIso} flag`}
                                    style={{ height: 14 }}
                                  />
                                  <span className="text">{nego.country}</span>
                                </td>
                                <td>
                                  <span className="text">
                                    {nego.senderName || nego.firstName}
                                  </span>
                                </td>
                                <td>
                                  {/* For Mobile Number */}
                                  <CopyToClipboard
                                    text={nego.mobileNumber}
                                    onCopy={() =>
                                      handleCopy(
                                        nego.uniqueQueryId,
                                        nego.mobileNumber,
                                        "mobile"
                                      )
                                    }
                                  >
                                    <button
                                      style={{
                                        backgroundColor:
                                          copiedId === nego.uniqueQueryId &&
                                            copiedType === "mobile"
                                            ? "green"
                                            : "black",
                                        color:
                                          copiedId === nego.uniqueQueryId &&
                                            copiedType === "mobile"
                                            ? "white"
                                            : "white",
                                      }}
                                    >
                                      {copiedId === nego.uniqueQueryId &&
                                        copiedType === "mobile"
                                        ? "Copied!"
                                        : "Copy"}
                                    </button>
                                  </CopyToClipboard>
                                  <span className="text">
                                    {" "}
                                    {maskMobileNumber(nego.mobileNumber)}
                                  </span>
                                </td>

                                <td>
                                  {/* For Email */}
                                  <CopyToClipboard
                                    text={nego.email}
                                    onCopy={() =>
                                      handleCopy(
                                        nego.uniqueQueryId,
                                        nego.email,
                                        "email"
                                      )
                                    }
                                  >
                                    <button
                                      style={{
                                        backgroundColor:
                                          copiedId === nego.uniqueQueryId &&
                                            copiedType === "email"
                                            ? "green"
                                            : "black",
                                        color:
                                          copiedId === nego.uniqueQueryId &&
                                            copiedType === "email"
                                            ? "white"
                                            : "white",
                                      }}
                                    >
                                      {copiedId === nego.uniqueQueryId &&
                                        copiedType === "email"
                                        ? "Copied!"
                                        : "Copy"}
                                    </button>
                                  </CopyToClipboard>
                                  <span className="text">
                                    {maskEmail(nego.email)}
                                  </span>
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <a
                                      className={`btn btn-info dropdown-toggle ${localStorage.getItem("roleName") ===
                                        "Closer" && selectedStage === 3
                                        ? "disabled"
                                        : ""
                                        }`}
                                      role="button"
                                      data-bs-toggle="dropdown"
                                      style={{
                                        backgroundColor: getColorByStatus(
                                          nego.ticketstatus
                                        ),
                                      }}
                                      onClick={() => {
                                        if (
                                          !(
                                            localStorage.getItem("roleName") ===
                                            "Closer" && selectedStage === 3
                                          )
                                        ) {
                                          handleShow(nego.uniqueQueryId);
                                        }
                                      }}
                                    >
                                      {nego.ticketstatus}
                                    </a>
                                  </div>
                                </td>

                                <td className="hover-cell">
                                  <span className="comment">
                                    {(nego.queryProductName &&
                                      nego.queryProductName.slice(0, 10)) ||
                                      (nego.productEnquiry &&
                                        nego.productEnquiry.slice(0, 10))}
                                  </span>
                                  <span className="message ">
                                    {nego.queryProductName ||
                                      nego.productEnquiry}
                                  </span>
                                </td>
                                {selectedStage === 2 && (
                                  <td>
                                    <span className="text">
                                      {nego.followUpDateTime
                                        ? formatLocalDateTime(
                                          nego.followUpDateTime
                                        )
                                        : ""}
                                    </span>
                                  </td>
                                )}
                                <td>{nego.comment}</td>
                                <td>
                                  <span className="actions-wrapper">
                                    {/* Info Button */}
                                    <Button
                                      onClick={() =>
                                        openTicketJourney(nego.uniqueQueryId)
                                      }
                                      data-bs-toggle="modal"
                                      data-bs-target="#followUpModal"
                                      className="btn-action call bg-danger"
                                      title="Get connect on call"
                                    >
                                      <i
                                        className="fa-solid fa-info"
                                        aria-label="Info"
                                      ></i>
                                    </Button>

                                    {/* Conditional Rendering based on selectedStage */}
                                    {selectedStage === 3 ? (
                                      <img
                                        data-bs-toggle="modal"
                                        data-bs-target="#staticBackdrop"
                                        onClick={() => hnadleSaleInfo(nego)}
                                        className="border bg-success rounded-circle p-2"
                                        src="https://cdn-icons-png.flaticon.com/128/1179/1179519.png"
                                        alt="Hidden"
                                        style={{ width: 34, height: 34 }}
                                      />
                                    ) : (
                                      <>
                                        {/* Phone Call Button */}
                                        <Button
                                          onClick={() =>
                                            handleClick(
                                              nego.senderMobile
                                                ? nego.senderMobile
                                                : nego.mobileNumber
                                            )
                                          }
                                          data-bs-toggle="modal"
                                          data-bs-target="#followUpModal"
                                          className="btn-action call"
                                          title="Get connected on call"
                                        >
                                          <i
                                            className="fa-solid fa-phone"
                                            aria-label="Phone"
                                          ></i>
                                        </Button>

                                        {/* Skype */}
                                        <a
                                          href={`skype:${nego.mobileNumber || senderMobile}?call`}
                                          data-bs-toggle="modal"
                                          data-bs-target="#followUpModal"
                                          className="btn-action skype-btn rounded-circle"
                                        >
                                          <i className="fa-brands fa-skype fa-xl text-white"></i>
                                        </a>

                                        {/* SMS Button */}
                                        <a
                                          href={`sms:${nego.senderMobile
                                            ? nego.senderMobile.split("-")[1]
                                            : nego.mobileNumber
                                            }?&body=${`Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}. If you're looking for a good deal, please type YES👍`}`}
                                          className="btn-action message"
                                          title="Get connected on message"
                                        >
                                          <i
                                            className="fa-solid fa-message"
                                            aria-label="Message"
                                          ></i>
                                        </a>

                                        {/* Email Button */}
                                        <Button
                                          onClick={() =>
                                            handleOn(
                                              nego.senderEmail ? nego.senderEmail : nego.email,
                                              `Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}. If you're looking for a good deal, please type YES👍`

                                            )
                                          }
                                          className="btn-action email"
                                          title="Get connect on email"
                                        >
                                          <i
                                            className="fa-solid fa-envelope"
                                            aria-label="Email"
                                          ></i>
                                        </Button>

                                        {/* WhatsApp Button */}
                                        <a
                                          href={`https://wa.me/${nego.senderMobile
                                            ? nego.senderMobile.split("-")[1]
                                            : nego.mobileNumber
                                            }?text=${`Hey ${nego.senderName}, I just received the inquiry from your ${nego.subject}. If you're looking for a good deal, please type YES👍`}`}
                                          target="_blank"
                                          className="btn-action whatsapp"
                                          title="Get connect on WhatsApp"
                                          rel="noopener noreferrer"
                                        >
                                          <i
                                            className="fa-brands fa-whatsapp"
                                            aria-label="WhatsApp"
                                          ></i>
                                        </a>

                                        {/* Quotation Button */}

                                        <Button
                                          onClick={() =>
                                            handleQuotation(nego)
                                          }
                                          className="rounded-circle"
                                          title="Get connect on"
                                        >
                                          <i
                                            className="fa-share-from-square"
                                            aria-label="Quotation"
                                          ></i>
                                        </Button>


                                        {/* Invoice Button */}
                                        <Button
                                          onClick={() => handleInvoice(nego)}
                                          className="rounded-circle"
                                          title="Get connect on"
                                        >
                                          <i
                                            className="fa-solid fa-file-invoice"
                                            aria-label="Invoice"
                                          ></i>
                                        </Button>
                                      </>
                                    )}
                                  </span>
                                </td>

                                {selectedStage === 3 && (
                                  <td className="text-nowrap">
                                    {formatDate(
                                      nego.lastActionDate && nego.lastActionDate
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex pagination-controls align-items-center">
                      <div className="pagination-controls">
                        <button
                          className="text-white"
                          style={{ backgroundColor: "#0ecdc6dd" }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>

                        <span>
                          {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                          )
                            .filter(
                              (page) =>
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 4 &&
                                  page <= currentPage + 4)
                            )
                            .reduce((acc, page, index, array) => {
                              // Add the page button
                              acc.push(
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`pagination-button text-white ${currentPage === page ? "active" : ""
                                    }`}
                                >
                                  {page}
                                </button>
                              );

                              // Add "..." if there is a gap to the next page in the filtered array
                              if (
                                index < array.length - 1 &&
                                array[index + 1] !== page + 1
                              ) {
                                acc.push(
                                  <span
                                    key={`ellipsis-${page}`}
                                    className="pagination-ellipsis"
                                  >
                                    .........
                                  </span>
                                );
                              }
                              return acc;
                            }, [])}
                        </span>

                        <button
                          className="text-white"
                          style={{ backgroundColor: "#0ecdc6dd" }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>

                      <div className="table-controls">
                        <label className="ml-2">Rows per page:</label>
                        <select
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                          style={{ backgroundColor: "#0ecdc6dd" }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={1000}>1000</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {selectedStage > 3 && <InvoiceInfo stage={selectedStage} />}
          </div>
        )}
        {!list && (
          <div className="p-3">
            <div className="row g-0">
              {["stage1", "stage2", "stage3"].map((stage, idx) => (
                <div className={`col-sm text-center `} key={stage}>
                  <div className="border">
                    <span className="fw-bold">{`Stage ${idx + 1}`}</span>
                    <div>{`consisting Status ${stage === "stage1"
                      ? "Not Connected, wrong mobile number and Not Pickup"
                      : stage === "stage2"
                        ? "Connected follow-ups and call backs"
                        : "only sale"
                      }`}</div>
                  </div>
                  <div
                    className="d-flex flex-wrap justify-content-around"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                  >
                    {(stage === "stage1"
                      ? stage1Data
                      : stage === "stage2"
                        ? stage2Data
                        : stage3Data
                    ).map((ticket) => (
                      <div
                        key={ticket.uniqueQueryId}
                        className="border text-sm m-2 tktcard"
                        style={{
                          width: "15rem",
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ticket, stage)}
                      >
                        <div className="m-1">
                          <div
                            className="text-black"
                            style={{ fontSize: "12px" }}
                          >
                            {ticket.comment || "comment not available"}
                          </div>
                          <div
                            className="text-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            {ticket.productEnquiry || "Enquiry not available"}
                          </div>
                        </div>
                        <div
                          className="text-primary p-1"
                          style={{ borderTop: "1px solid #D3D3D3" }}
                          onClick={() => handleShowUniqe(ticket.uniqueQueryId)}
                        >
                          {ticket.ticketstatus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <div className="api-error"> {error.message}</div>}
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
        <Modal.Header closeButton className="bg-primary text-white text-center">
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
                                    src={`https://rdvision.in/images/getProductImage/${product.productId}`}
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
            <div className="">
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
                  <div className="contact-info-row d-flex align-negos-center justify-content-between">
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
        <div className="position-fixed  vw-100 d-flex flex-coloumn justify-content-center align-item-center">
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
        className=""
        id="followUpModal"
        tabindex="-1"
        aria-labelledby="followUpModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <h1 className=" w-100 text-center" id="followUpModalLabel">
            <u> Raise Invoice</u>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div className="card shadow-sm">
              <div>
                <InvoiceBox ticket={negodata} />
              </div>
            </div>
          </div>
        </Modal.Body>
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
          <u> Send Quotation</u>
        </h1>
        <QuotationBox ticket={negoquotation} stage={selectedStage} />
      </Modal>

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
        <div className="">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClosee}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* sale info modal */}

      <Modal
        show={saleInfoModal}
        onHide={handleClosesSale}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <Modal.Header closeButton>
          <Modal.Title id="exampleModalLabel">Sale information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SaleProductInfo ticket={saleinfoItem} />   {/*saleinfo component */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosesSale}>
            Close
          </Button>
          {/* <Button variant="primary">Understood</Button> */}
        </Modal.Footer>
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

export default InNegotiation;
